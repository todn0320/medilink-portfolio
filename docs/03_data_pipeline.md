# 03. 데이터 파이프라인

## 수집한 공공데이터 (9종)

| 데이터명 | 출처 | 건수 | 용도 |
|---|---|---|---|
| 의약품 제품 허가목록 | 식약처 | 44,076 | 기본 마스터 테이블 |
| 의약품 제품 허가정보 | 식약처 | 44,073 | 효능·용법·주의사항 텍스트 |
| 의약품 제품 주성분 | 식약처 | 128,000+ | 성분 상세 정보 |
| e약은요 (의약품 개요정보) | 식약처 | 4,709 | 일반인 친화적 설명 |
| 의약품 낱알식별정보 | 식약처 | 25,326 | 모양·색상·각인 (이미지 매칭용) |
| DUR 품목정보 (병용금기 등) | 식약처 | 130,310 | 병용금기 경고 엔진 |
| DUR 성분정보 | 식약처 | 3,817 | 성분 기반 경고 |
| 건강기능식품 정보 | 식약처/식품안전처 | - | 영양제 정보 |
| AI Hub 알약 이미지 데이터 | AI Hub | 2,467,942장 (학습) | YOLOv8/ResNet 모델 학습 |

### API 수집 전략

공공데이터포털 일일 트래픽 제한(10,000건/일)과 1페이지당 최대 500건 제한을 파악한 후, Python `requests` 라이브러리로 페이지네이션 처리하여 전체 데이터를 수집했습니다. 관리부서 직접 문의 시 일괄 제공 불가 답변을 받아 API 수집 방식으로 확정했습니다.

---

## DUR 경고 유형 분류 (warning_type enum)

| 코드 | 유형 |
|---|---|
| 0 | 병용금기 |
| 1 | 특정연령대금기 |
| 2 | 임부금기 |
| 3 | 노인주의 |
| 4 | 용량주의 |
| 5 | 투여기간주의 |
| 6 | 효능군중복 |
| 7 | 분할주의 (서방정분할주의 포함) |
| 99 | 기타/미분류 |

---

## 전처리 파이프라인

### 5단계 처리 흐름

```
① 원본 JSON 수령
    ↓
② DataFrame 로딩 (pd.json_normalize)
    ↓
③ 스키마 정규화 (snake_case 컬럼명 통일, 날짜 YYYY-MM-DD 통일)
    ↓
④ 정제 & 매핑 (결측값 처리, "None" 문자열 → null, warning_type 매핑)
    ↓
⑤ QA & Freeze → Parquet 저장
```

### 팀별 역할 분담 (PC1~5)

| 역할 | 담당 내용 |
|---|---|
| PC1 (다현) | 프로젝트 관리(PM), 전체 파이프라인 설계, Oracle DB 적재 스크립트 |
| PC2 (태영) | DUR 품목 데이터 정제 (clean_by_type) |
| PC3 (민욱) | DUR 성분 데이터 로딩 |
| PC4 (형우) | DUR 성분 데이터 정제 |
| PC5 (종성) | DUR 품목 데이터 로딩 (병용금기 41만건 분할 처리) |

> **병용금기 데이터 처리 특이사항**: 병용금기 데이터가 412,500건으로 매우 많아 30,000건씩 분할하여 Parquet으로 저장했습니다.

---

## 정제 기준 (표준화 규칙)

### 컬럼명 통일
전처리 과정에서 UPPER_CASE, camelCase, lower_case가 혼재하는 문제를 해결하기 위해 모든 컬럼명을 `snake_case 소문자`로 통일했습니다.

```
ITEM_SEQ → item_seq
ITEM_NAME → item_name
ENTP_NAME → entp_name
```

### 날짜 형식 통일
원본 데이터에 3가지 날짜 형식이 혼재하여 모두 `YYYY-MM-DD`로 통일했습니다.

```
"2020-09-24T00:00:00.000Z" → "2020-09-24"
"20190909"                 → "2019-09-09"
"1955-04-12"               → 유지
```

### "None" 문자열 처리
API 응답에서 null 값이 Python 문자열 `"None"`으로 저장된 케이스를 실제 `null`로 변환했습니다.

---

## Oracle DB 적재 (56만건)

`load_parquet_to_oracle.py` 스크립트로 정제된 Parquet 파일 8종을 Oracle XE 21c에 일괄 적재했습니다. `oracledb` 라이브러리와 `executemany` 배치 삽입을 사용하여 성능을 최적화했습니다.

### 적재 순서 (의존성 고려)
1. REF_DRUG_PERMIT_LIST (마스터)
2. REF_DRUG_PERMIT_DETAIL
3. REF_DRUG_INGREDIENT
4. REF_DRUG_OVERVIEW
5. REFERENCE_INGREDIENT
6. REF_DUR_ITEM_WARNING
7. REF_DUR_INGREDIENT_WARNING
8. PILL_IMAGE_FEATURE
9. RAG_CHUNK (마지막 — 위 테이블 참조)

### 검색 성능을 위한 인덱스
```sql
CREATE INDEX idx_pill_print_front ON pill_image_feature(print_front);
CREATE INDEX idx_pill_shape       ON pill_image_feature(drug_shape);
CREATE INDEX idx_pill_color1      ON pill_image_feature(color_class1);
CREATE INDEX idx_dur_item_seq     ON ref_dur_item_warning(item_seq);
CREATE INDEX idx_rag_item_seq     ON rag_chunk(item_seq);
CREATE INDEX idx_rag_section_type ON rag_chunk(section_type);
```

---

## 이미지 데이터 처리 (3.4TB)

AI Hub 단일경구약제 5,000종 데이터셋을 처리했습니다.

| 항목 | 수량 |
|---|---|
| Training 이미지 | 2,467,942장 |
| Training 라벨링 JSON | 2,451,927개 |
| Validation 이미지 | 162,056장 |
| 서버 디스크 | 3.65TB (Azure pillv2 VM) |

### YOLO 포맷 변환
AI Hub 라벨링 형식(COCO JSON `[x, y, w, h]`)을 YOLO 형식(`[cx, cy, w, h]` 정규화)으로 변환했습니다. 약 코드(K-000059 등)를 class_id로 자동 매핑하며, 중단 시 재실행해도 이어서 처리되도록 구현했습니다.
