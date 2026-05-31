# 04. RAG 엔진 설계 (Azure AI Search + GPT-4o-mini)

## 설계 개요

식약처 공식 데이터만을 근거로 사용하는 **팩트 체크 기반 RAG 시스템**입니다. AI가 자체 지식으로 답변하는 것을 완전히 차단하고, 검색된 데이터 청크만을 기반으로 답변을 생성합니다.

---

## 컴포넌트 구성

### 1. Azure AI Search — 지식 저장소
- **인덱스명**: `pill-rag-index`
- **인덱싱 건수**: 266,306건
- **청킹 기준**: `section_type` 기반 분리 (효능, 용법, 주의사항, DUR 경고 등)
- **검색 방식**: 키워드 검색 + 벡터 검색 하이브리드

#### 벡터 검색 동작 방식
사용자가 "타이레놀이랑 같이 먹으면 안 되는 약 있어?"라고 질문하면, AI Search가 즉시 DUR 병용금기 데이터를 뒤져 관련 텍스트 청크를 찾아옵니다.

### 2. Azure OpenAI (GPT-4o-mini) — 팩트 기반 요약기
ChatGPT처럼 자체 학습된 지식으로 답변하는 것이 아니라, Azure AI Search에서 찾아온 식약처 데이터만을 예쁘게 요약해서 전달하는 역할만 수행합니다.

### 3. 할루시네이션 방지 — 시스템 프롬프트 (Guardrail)

```
[시스템 역할 지정]
당신은 의사나 약사가 아니며, 사용자의 증상을 진단하거나 약을 처방할 권한이 없습니다.
당신은 오직 제공된 '식약처 의약품 및 DUR 정보' 문서만을 기반으로 사실을 안내하는
'의약품 정보 어시스턴트'입니다.

[답변 규칙]
- 제공된 문서에서 답을 찾을 수 없다면, 절대 지어내지 말고
  "해당 정보는 제공된 식약처 데이터에서 찾을 수 없습니다. 전문의나 약사와 상담해 주세요."라고 답변
- 특정 증상에 대해 약을 처방(진단)하는 표현 절대 금지
- 항상 객관적 사실만 전달
```

**근거 없으면 생성 보류**: 검색된 RAG 청크가 없는 경우 GPT-4o-mini에 아예 생성 요청을 하지 않는 로직을 구현했습니다.

---

## RAG 청크 구조

```json
{
  "item_seq": "200607006",
  "item_name": "타이레놀 ER 650mg",
  "section_type": "efficacy",
  "chunk_text": "두통, 치통, 근육통, 관절통, 생리통에 효과가 있습니다...",
  "source": "drug_permit_detail"
}
```

section_type 종류: `efficacy` (효능), `usage` (용법), `warning` (주의사항), `contraindication` (금기), `adverse` (부작용), `dur_warning` (DUR 경고)

---

## API 엔드포인트

```
GET /drug/ask?question=임산부가+먹어도+돼&item_name=타이레놀
```

응답 예시:
```json
{
  "item_name": "타이레놀 ER 650mg",
  "question": "임산부가 먹어도 돼",
  "rag_text": "제공된 식약처 정보에 따르면, 아세트아미노펜 성분은 임신 중...",
  "source_chunks": ["dur_ingredient_임부금기_clean", "drug_permit_detail"],
  "confidence": "high"
}
```

---

## 퍼지 검색 (Fuzzy Matching)

오타 교정 및 유사 약품명 검색을 위해 Azure AI Search 내장 퍼지 검색 기능을 활용했습니다.

```
GET /drug/suggest?name=타이래놀
→ "타이레놀 ER 650mg", "타이레놀 500mg 정", "타이레놀 어린이 시럽" 반환
```

쿼리에 물결표(`~`)를 붙이는 방식으로 유사도 검색을 적용하며, Oracle DB의 직접 검색으로 찾지 못한 케이스를 Azure AI Search가 보완합니다.
