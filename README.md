# MediLink — 알약 AI 복약관리 서비스

![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-Vite-61DAFB?logo=react&logoColor=black)
![Oracle](https://img.shields.io/badge/Oracle-XE%2021c-F80000?logo=oracle&logoColor=white)
![Azure](https://img.shields.io/badge/Azure-AI%20Search-0078D4?logo=microsoftazure&logoColor=white)
![YOLOv8](https://img.shields.io/badge/YOLOv8-Object%20Detection-00FFFF)

> 2026.02 ~ 2026.04 | 5인 팀 프로젝트 | Microsoft Azure 협업


<br>

## 만들게 된 이유

약국에서 받아온 약 봉투를 열면 비슷하게 생긴 알약들이 가득합니다. 어떤 게 무슨 약인지, 같이 먹어도 되는지 전문 지식 없이는 알기가 어렵죠.

특히 여러 병원을 다니는 어르신들이나 영양제를 많이 챙겨 드시는 분들은 병용금기 위험에 노출되어 있지만, 이걸 한 번에 확인할 수 있는 서비스가 마땅히 없었습니다.

**알약 사진 한 장 찍으면 약을 식별하고, 지금 먹고 있는 약과 같이 먹어도 되는지까지 알려주는 서비스**를 만들어보자는 것이 시작이었습니다.

<br>

## "결정은 공식 데이터가, 보조는 AI가"

AI 서비스에서 가장 위험한 건 그럴듯하지만 틀린 정보를 자신있게 말하는 것입니다. 의약품 정보에서 이런 할루시네이션은 실제 안전사고로 이어질 수 있습니다.

그래서 병용금기 판단과 의약품 안전 경고는 **식약처 DUR 공식 데이터**만으로 처리하고, AI는 이미지 인식과 자연어 설명 생성 보조로만 쓰도록 명확히 나눴습니다. 근거가 없으면 아예 생성하지 않는 로직도 넣었고요.

<br>

## 담당 역할

5인 팀에서 PM을 맡으면서 기획부터 데이터, 백엔드, 프론트엔드, AI 모델까지 전반적으로 주도했습니다.

**기획 & 설계**
- 전체 서비스 기획 및 DB 설계 (v5 → v7), MVP 액션플랜 수립
- 피그마로 웹/앱 UI 디자인 전체 설계

**데이터 파이프라인**
- 식약처 공공데이터 9종 API 수집 및 정규화 → OracleDB 56만건 적재
- DUR 병용금기 130,310건 기반 경고 엔진 설계 및 구현

**AI / 백엔드**
- ResNet 기반 알약 분류 모델 구현 및 증강 실험 (PC1~5)
- 허가정보 section_type 기준 청킹 → Azure AI Search 벡터 인덱싱 266,306건
- FastAPI 엔드포인트 8개 구현 (약 검색 / 퍼지 검색 / 병용금기 체크 / RAG 질의응답)
- Azure VM 3대 멀티 리전 운영, 3.4TB 이미지 데이터 처리 파이프라인 구축
- 근거 없는 답변 생성을 막는 시스템 프롬프트(Guardrail) 설계

**프론트엔드**
- React + Vite 기반 웹 서비스 구현 (랜딩 / 홈 / 약 검색 / 병용금기 체크 등 전 페이지)

<br>

## 서비스 흐름

```
알약 사진 촬영
    ↓
YOLOv8 객체 탐지 → 알약 위치 감지
    ↓
Azure OCR → 각인 문자 추출
    ↓
OracleDB 조회 → AI 점수 0.8 + OCR 매칭 점수 0.2로 후보 재정렬
    ↓
RAG + GPT-4o-mini → 효능 / 주의사항 / 병용금기 자연어 설명 생성
                     (근거 청크 없으면 생성 안 함)
```

<br>

## 기술 스택

| 분야 | 사용 기술 |
|---|---|
| AI/ML | YOLOv8, ResNet, Azure OCR (Document Intelligence) |
| RAG | Azure AI Search, Azure OpenAI GPT-4o-mini |
| Backend | FastAPI, Python, OracleDB |
| Frontend | React + Vite, Tailwind CSS |
| Infra | Azure VM × 3, Azure Blob Storage |
| Data | 식약처 공공데이터 API 9종, AI Hub 알약 이미지 데이터셋 |

<br>

## 모델 실험

ResNet 기반 알약 분류 모델에 5가지 데이터 증강 전략을 PC별로 다르게 적용해 비교했습니다.

| 실험 | 증강 방식 | Accuracy |
|---|---|---|
| Baseline | 없음 | 1.00 (과적합) |
| PC1 | 약한 회전 + 밝기 변화 | 1.00 |
| PC2 | 색상 / 명도 변화 | 0.93 |
| PC3 | 원근 / 아핀 변환 | 0.85 |
| **PC4** | **노이즈 추가** | **0.94 ← 최종 선택** |
| PC5 | 회전 + 플립 | 0.93 |

알약은 외형과 각인이 핵심 특징이라 형태를 크게 바꾸는 Geometry 증강은 오히려 성능을 떨어뜨렸고, 실제 촬영 환경(카메라 노이즈, 조명 변화)을 모사한 Noise 증강이 가장 안정적이었습니다.

confusion matrix와 상세 결과는 [`experiments/results/`](./experiments/results/) 에 있습니다.

<br>

## 어려웠던 점

**Azure VM IP 차단 문제**
Korea Central 리전 VM이 네트워크상 `Country: US / Microsoft Corporation`으로 인식되어 AI Hub 데이터 다운로드가 막혔습니다. 학원 노트북을 프록시 서버로 활용해 우회했고, 이후 일부 VM을 East US 2로 스냅샷 이전했습니다.

**병용금기 데이터 41만건 처리**
병용금기 JSON 파일이 412,500건이라 메모리 이슈가 발생했습니다. 30,000건씩 분할해 Parquet로 저장 후 합산하는 방식으로 해결했습니다.

**의약품 허가정보 XML 파싱**
허가정보 데이터에 XML이 포함된 컬럼이 있어 단순 CSV 처리가 불가능했습니다. XML을 clean text로 파싱한 뒤 효능 / 용법 / 주의사항 / 금기 4개 컬럼으로 분리했습니다.

<br>

## 실행

```bash
pip install -r requirements.txt
cp .env.example .env  # Azure, DB 키 설정

# DB 적재
python scripts/db_load/load_parquet_to_oracle.py

# RAG 청크 생성
python scripts/db_load/load_rag_chunk.py

# Azure AI Search 인덱싱
python scripts/search/index_rag_chunks.py

# API 서버
uvicorn src.api.main:app --reload
```

```bash
# 프론트엔드
cd frontend && npm install && npm run dev
```

<br>

## 프로젝트 구조

```
medilink-portfolio/
├── src/
│   ├── api/main.py          # FastAPI 엔드포인트 8개
│   ├── db/query_drug.py     # Oracle DB 쿼리 (4-way JOIN)
│   ├── rag/explain.py       # Azure AI Search + GPT-4o-mini
│   ├── ocr/ocr_engine.py    # Azure OCR + 각인 정규화
│   ├── inference/predictor.py
│   └── pipeline/run_pipeline.py
├── scripts/
│   ├── db_load/             # parquet → Oracle 적재, RAG 청크 생성
│   ├── search/              # Azure AI Search 인덱싱
│   └── data/                # YOLO 포맷 변환, 압축 해제
├── frontend/                # React + Vite
├── experiments/results/     # confusion matrix, classification report
├── docs/                    # 기술 문서
└── meeting-notes/           # 날짜별 회의록
```

<br>

## 관련 문서

- [프로젝트 개요 및 배경](./docs/01_overview.md)
- [시스템 아키텍처](./docs/02_system_architecture.md)
- [데이터 파이프라인](./docs/03_data_pipeline.md)
- [RAG 엔진 설계](./docs/04_rag_engine.md)
- [병용금기 경고 엔진](./docs/05_dur_warning.md)
- [모델 실험 결과](./docs/06_model_experiments.md)
- [회고 & 트러블슈팅](./docs/07_retrospective.md)

<br>


## 팀 원본 레포

이 레포는 개인 포트폴리오 정리본입니다. 팀 전체 코드는 아래 원본 레포에서 확인할 수 있습니다.

→ [todn0320/pill-ai_merge](https://github.com/todn0320/pill-ai_merge)

<br>

> 본 서비스는 의료기기가 아니며, 식약처 공공데이터 기반의 일반 정보 제공 서비스입니다. 최종 복약 판단은 의사·약사와 상담하세요.
