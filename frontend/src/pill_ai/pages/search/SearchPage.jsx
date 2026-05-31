import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://20.81.233.125:8000";

/* ── 커스텀 커서 ── */
function useCursor() {
  const [cursor, setCursor] = useState({ x: -200, y: -200 });
  const [ring,   setRing  ] = useState({ x: -200, y: -200 });
  const ringPos = useRef({ x: -200, y: -200 });
  const raf     = useRef(null);
  useEffect(() => {
    const fn = e => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);
  useEffect(() => {
    const tick = () => {
      ringPos.current.x += (cursor.x - ringPos.current.x) * 0.14;
      ringPos.current.y += (cursor.y - ringPos.current.y) * 0.14;
      setRing({ x: ringPos.current.x, y: ringPos.current.y });
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [cursor]);
  return { cursor, ring };
}

/* ── 사이드바 데이터 ── */
const NAV_MAIN = [
  { icon: "🏠", label: "홈",        path: "/app/home"   },
  { icon: "🔍", label: "약 검색",   path: "/app/search" },
  { icon: "🤍", label: "내 약함",   path: "/app/cabinet"},
  { icon: "⏱",  label: "병용 확인", path: "/app/check"  },
];
const NAV_MANAGE = [
  { icon: "🔔", label: "알림",        path: "/app/notifications", badge: 2    },
  { icon: "🔗", label: "의료진 공유", path: null,                 badge: null },
  { icon: "⚙️", label: "설정",        path: "/app/setting",       badge: null },
];

/* ════════════════
   사이드바
════════════════ */
function Sidebar({ activePath }) {
  const navigate = useNavigate();
  return (
    <aside style={{
      width: 210, flexShrink: 0,
      background: "#fff", borderRight: "1px solid #e9e7f5",
      display: "flex", flexDirection: "column",
      padding: "24px 14px 20px",
      height: "100vh", position: "sticky", top: 0,
    }}>
      {/* 로고 → 홈 */}
      <div
        onClick={() => navigate("/app/home")}
        onMouseEnter={e => e.currentTarget.style.opacity = ".75"}
        onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 28, cursor: "none", transition: "opacity .2s" }}
      >
        <div style={{
          width: 34, height: 34,
          background: "linear-gradient(135deg,#a78bfa,#f9a8d4)",
          borderRadius: 10, display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 17,
          boxShadow: "0 4px 12px rgba(167,139,250,.4)",
        }}>💊</div>
        <span style={{ fontSize: 16, fontWeight: 800, color: "#1a1433", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          MediPocket
        </span>
      </div>

      {/* 메인 메뉴 */}
      <div style={{ fontSize: 11, fontWeight: 600, color: "#b0a8c8", letterSpacing: "0.06em", textTransform: "uppercase", padding: "0 8px", marginBottom: 6 }}>메인</div>
      <nav style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
        {NAV_MAIN.map(item => {
          const isActive = activePath === item.path;
          return (
            <button key={item.path} onClick={() => navigate(item.path)} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "9px 10px", borderRadius: 10, border: "none",
              background: isActive ? "#ede9fe" : "transparent",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 13, fontWeight: isActive ? 700 : 500,
              color: isActive ? "#7c3aed" : "#6b7280",
              cursor: "none", textAlign: "left", width: "100%", transition: "all .15s",
            }}>
              <span style={{ fontSize: 15, width: 20, textAlign: "center" }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* 관리 메뉴 */}
      <div style={{ fontSize: 11, fontWeight: 600, color: "#b0a8c8", letterSpacing: "0.06em", textTransform: "uppercase", padding: "0 8px", marginBottom: 6 }}>관리</div>
      <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {NAV_MANAGE.map(item => {
          const isActive = activePath === item.path;
          return (
            <button key={item.label} onClick={() => item.path && navigate(item.path)} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "9px 10px", borderRadius: 10, border: "none",
              background: isActive ? "#ede9fe" : "transparent",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 13, fontWeight: isActive ? 700 : 500,
              color: isActive ? "#7c3aed" : "#6b7280",
              cursor: "none", textAlign: "left", width: "100%", transition: "all .15s",
            }}>
              <span style={{ fontSize: 15, width: 20, textAlign: "center" }}>{item.icon}</span>
              <span>{item.label}</span>
              {item.badge && (
                <span style={{
                  marginLeft: "auto", background: "#ef4444", color: "#fff",
                  fontSize: 10, fontWeight: 700, borderRadius: 50, padding: "1px 7px",
                }}>{item.badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      <div style={{ flex: 1 }} />

      {/* 하단 프로필 → 설정 */}
      <div
        onClick={() => navigate("/app/setting")}
        onMouseEnter={e => e.currentTarget.style.opacity = ".75"}
        onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "10px 8px", borderTop: "1px solid #e9e7f5",
          marginTop: 12, cursor: "none", transition: "opacity .2s",
        }}
      >
        <div style={{
          width: 34, height: 34, borderRadius: "50%",
          background: "linear-gradient(135deg,#a78bfa,#7c3aed)",
          color: "#fff", fontSize: 11, fontWeight: 700,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>메디</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1433", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>메디포</div>
          <div style={{ fontSize: 11, color: "#9ca3af" }}>개발자</div>
        </div>
      </div>
    </aside>
  );
}

/* ════════════════
   토스트
════════════════ */
function Toast({ message, visible }) {
  return (
    <div style={{
      position: "fixed", bottom: 32, left: "50%", transform: "translateX(-50%)",
      background: "#1a1433", color: "#fff",
      padding: "12px 24px", borderRadius: 50,
      fontSize: 13, fontWeight: 600,
      boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
      zIndex: 9999, pointerEvents: "none",
      opacity: visible ? 1 : 0,
      transition: "opacity 0.3s ease",
      whiteSpace: "nowrap",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      {message}
    </div>
  );
}

/* ════════════════
   유틸
════════════════ */
const getOtcLabel = (code) => {
  if (!code) return "";
  if (code.includes("전문") || code === "01") return "전문의약품";
  if (code.includes("일반") || code === "02") return "일반의약품";
  return code;
};

const FILTERS = ["전체", "일반의약품", "전문의약품", "건강기능식품", "성분 검색"];

/* ════════════════
   메인
════════════════ */
export default function SearchPage() {
  const navigate = useNavigate();
  const { cursor, ring } = useCursor();

  /* ── state 선언 (순서 중요!) ── */
  const [searchName,    setSearchName   ] = useState("");
  const [results,       setResults      ] = useState([]);
  const [selected,      setSelected     ] = useState(null);
  const [loading,       setLoading      ] = useState(false);
  const [aiQuestion,    setAiQuestion   ] = useState("");
  const [aiAnswer,      setAiAnswer     ] = useState("");
  const [aiLoading,     setAiLoading    ] = useState(false);
  const [filter,        setFilter       ] = useState("전체");
  const [suggestions,   setSuggestions  ] = useState([]);
  const [noResult,      setNoResult     ] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [toastMsg,      setToastMsg     ] = useState("");
  const [toastVisible,  setToastVisible ] = useState(false);
  const toastTimer = useRef(null);

  /* ── 필터 적용 (state 선언 후에 위치) ── */
  const filteredResults = results.filter(item => {
    if (filter === "전체") return true;
    if (filter === "일반의약품") return item.ETC_OTC_CODE?.includes("일반");
    if (filter === "전문의약품") return item.ETC_OTC_CODE?.includes("전문");
    if (filter === "건강기능식품") return item.ETC_OTC_CODE?.includes("건강");
    if (filter === "성분 검색") return true;
    return true;
  });

  /* 토스트 표시 */
  const showToast = (msg) => {
    setToastMsg(msg);
    setToastVisible(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastVisible(false), 2500);
  };

  /* ── 약 검색 ── */
  const handleSearch = async (nameOverride = null) => {
    const query = nameOverride || searchName;
    if (!query.trim()) return;
    setLoading(true);
    setSelected(null);
    setAiAnswer("");
    setSuggestions([]);
    setNoResult(false);
    setResults([]);
    setFilter("전체"); // 검색 시 필터 초기화
    try {
      const res  = await fetch(`${API_BASE}/drug/search?name=${encodeURIComponent(query)}&limit=50`);
      const data = await res.json();
      if (data.results?.length > 0) {
        setResults(data.results);
      } else {
        setNoResult(true);
        const sugRes  = await fetch(`${API_BASE}/drug/suggest?name=${encodeURIComponent(query)}&top=5`);
        const sugData = await sugRes.json();
        if (sugData.has_suggestions) setSuggestions(sugData.suggestions);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  /* ── 퍼지 추천 클릭 ── */
  const handleSuggestionClick = (name) => {
    setSearchName(name);
    setSuggestions([]);
    setNoResult(false);
    handleSearch(name);
  };

  /* ── 약 상세 조회 ── */
  const handleSelect = async (item) => {
    try {
      const res  = await fetch(`${API_BASE}/drug/info/${item.ITEM_SEQ}`);
      const data = await res.json();
      setSelected(data);
      setAiAnswer("");
      setAiQuestion("");
    } catch {
      setSelected(item);
    }
  };

  /* ── AI 질문 ── */
  const handleAiAsk = async () => {
    if (!aiQuestion.trim() || !selected) return;
    setAiLoading(true);
    try {
      const res  = await fetch(
        `${API_BASE}/drug/ask?question=${encodeURIComponent(aiQuestion)}&item_seq=${selected.ITEM_SEQ}&item_name=${encodeURIComponent(selected.ITEM_NAME)}`
      );
      const data = await res.json();
      setAiAnswer(data.answer || "답변을 가져오지 못했습니다.");
    } catch {
      setAiAnswer("오류가 발생했습니다.");
    } finally {
      setAiLoading(false);
    }
  };

  /* ── 내 약함에 추가 ── */
  const handleAddToCabinet = () => {
    if (!selected) return;
    const existing  = JSON.parse(localStorage.getItem("cabinet") || "[]");
    const alreadyIn = existing.some(d => d.ITEM_SEQ === selected.ITEM_SEQ);
    if (alreadyIn) {
      showToast("이미 내 약함에 있는 약이에요 💊");
      return;
    }
    const newItem = {
      ITEM_SEQ:     selected.ITEM_SEQ,
      ITEM_NAME:    selected.ITEM_NAME,
      ENTP_NAME:    selected.ENTP_NAME,
      ETC_OTC_CODE: selected.ETC_OTC_CODE,
      addedAt:      new Date().toISOString(),
    };
    localStorage.setItem("cabinet", JSON.stringify([...existing, newItem]));
    showToast(`✅ "${selected.ITEM_NAME}" 이 내 약함에 추가됐어요!`);
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="sp-cursor"      style={{ left: cursor.x, top: cursor.y }} />
      <div className="sp-cursor-ring" style={{ left: ring.x,   top: ring.y   }} />
      <Toast message={toastMsg} visible={toastVisible} />

      <div className="sp-root">
        <Sidebar activePath="/app/search" />

        <div className="sp-body">

          {/* 검색 헤더 */}
          <div className="sp-search-header">
            <div className="sp-search-card">
              <div className="sp-search-title">
                <span>💊</span>
                <span>약 · 건강기능식품 검색</span>
              </div>

              <div className="sp-bar-wrap">
                <span className="sp-bar-icon">🔍</span>
                <input
                  className="sp-bar-input"
                  type="text"
                  value={searchName}
                  onChange={e => setSearchName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSearch()}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  placeholder="제품명, 성분명으로 검색..."
                  style={{ boxShadow: searchFocused ? "0 0 0 2px rgba(124,58,237,0.22)" : "none" }}
                />
                <button className="sp-bar-btn" onClick={() => handleSearch()}>검색</button>
              </div>

              {/* 필터 */}
              <div className="sp-filters">
                {FILTERS.map(f => (
                  <button
                    key={f}
                    className={`sp-chip${filter === f ? " active" : ""}`}
                    onClick={() => setFilter(f)}
                  >{f}</button>
                ))}
              </div>

              <div className="sp-hint">
                <span>💡</span>
                <span>검색 후 필터로 의약품 종류를 구분할 수 있어요</span>
              </div>
            </div>
          </div>

          {/* 결과 + 상세 */}
          <div className="sp-content">

            {/* 왼쪽 결과 목록 */}
            <div className="sp-list">
              <div className="sp-list-count">
                {loading
                  ? "검색 중..."
                  : filteredResults.length > 0
                  ? `검색 결과 ${filteredResults.length}건`
                  : noResult
                  ? "검색 결과가 없습니다"
                  : results.length > 0
                  ? `필터 결과 없음`
                  : "검색어를 입력하세요"}
              </div>

              {/* 퍼지 추천 */}
              {noResult && (
                <div className="sp-no-result">
                  <div style={{ fontSize: 36, marginBottom: 10 }}>🔍</div>
                  <div className="sp-no-text">
                    "<strong>{searchName}</strong>" 검색 결과가 없어요
                  </div>
                  {suggestions.length > 0 && (
                    <>
                      <div className="sp-suggest-label">혹시 이 약을 찾으셨나요?</div>
                      {suggestions.map((s, i) => (
                        <div
                          key={i}
                          className="sp-suggest-row"
                          onClick={() => handleSuggestionClick(s.item_name)}
                        >
                          <span>🔍</span>
                          <span className="sp-suggest-name">{s.item_name}</span>
                          <span>›</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}

              {/* 검색 결과 — filteredResults 사용 */}
              {filteredResults.map(item => (
                <div
                  key={item.ITEM_SEQ}
                  className={`sp-result-row${selected?.ITEM_SEQ === item.ITEM_SEQ ? " selected" : ""}`}
                  onClick={() => handleSelect(item)}
                >
                  <div className="sp-result-icon">💊</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="sp-result-name">{item.ITEM_NAME}</div>
                    <div className="sp-result-company">{item.ENTP_NAME}</div>
                  </div>
                  <span className={`sp-tag ${item.ETC_OTC_CODE?.includes("일반") ? "otc" : "rx"}`}>
                    {getOtcLabel(item.ETC_OTC_CODE)}
                  </span>
                </div>
              ))}
            </div>

            {/* 오른쪽 상세 패널 */}
            <div className="sp-detail">
              {!selected ? (
                <div className="sp-detail-empty">
                  <div style={{ fontSize: 48, marginBottom: 14 }}>💊</div>
                  <p>약을 선택하면<br />상세 정보가 표시됩니다</p>
                </div>
              ) : (
                <>
                  {/* 약 기본 정보 */}
                  <div className="sp-drug-top">
                    <div className="sp-drug-icon">💊</div>
                    <div style={{ flex: 1 }}>
                      <div className="sp-drug-name">{selected.ITEM_NAME}</div>
                      <div className="sp-drug-company">{selected.ENTP_NAME}</div>
                      <span className={`sp-tag ${selected.ETC_OTC_CODE?.includes("일반") ? "otc" : "rx"}`}>
                        {getOtcLabel(selected.ETC_OTC_CODE)}
                      </span>
                    </div>
                  </div>

                  {/* 효능·효과 */}
                  {selected.EFCY_QESITM && (
                    <div className="sp-section">
                      <div className="sp-section-ttl"><div className="sp-dot" />효능·효과</div>
                      <p className="sp-section-txt">
                        {selected.EFCY_QESITM.slice(0, 300)}
                        {selected.EFCY_QESITM.length > 300 ? "..." : ""}
                      </p>
                    </div>
                  )}

                  {/* 주의사항 */}
                  {selected.ATPN_QESITM && (
                    <div className="sp-section">
                      <div className="sp-section-ttl"><div className="sp-dot" />주의사항</div>
                      <div className="sp-warn-box">
                        <span>⚠️</span>
                        <span>
                          {selected.ATPN_QESITM.slice(0, 200)}
                          {selected.ATPN_QESITM.length > 200 ? "..." : ""}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* 근거 출처 */}
                  <div className="sp-evidence">
                    <span>📄</span>
                    <div>
                      <div className="sp-ev-title">근거 출처 (Evidence Card)</div>
                      <div className="sp-ev-sub">식약처 DUR 품목 정보 · e약은요 · 확신도 High</div>
                    </div>
                  </div>

                  {/* AI 복약 분석 */}
                  <div className="sp-section">
                    <div className="sp-section-ttl"><div className="sp-dot" />AI 복약 분석</div>
                    <div className="sp-ai-row">
                      <input
                        className="sp-ai-input"
                        type="text"
                        value={aiQuestion}
                        onChange={e => setAiQuestion(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleAiAsk()}
                        placeholder="예: 임산부가 먹어도 돼? / 부작용이 뭐야?"
                      />
                      <button className="sp-ai-btn" onClick={handleAiAsk} disabled={aiLoading}>
                        {aiLoading ? "..." : "분석"}
                      </button>
                    </div>
                    {aiLoading && (
                      <div className="sp-ai-loading">분석 중...</div>
                    )}
                    {aiAnswer && !aiLoading && (
                      <div className="sp-ai-answer">
                        <div className="sp-ai-label">🤖 AI 답변</div>
                        <p>{aiAnswer}</p>
                      </div>
                    )}
                  </div>

                  {/* 액션 버튼 */}
                  <div className="sp-actions">
                    <button className="sp-btn-add" onClick={handleAddToCabinet}>
                      + 내 약함에 추가
                    </button>
                    <button className="sp-btn-check" onClick={() => navigate("/app/check")}>
                      병용 확인
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ════════════════
   CSS
════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
*,*::before,*::after { margin:0; padding:0; box-sizing:border-box; }
:root {
  --p:#7c3aed; --pl:#ede9fe; --a1:#a78bfa; --a2:#f9a8d4;
  --txt:#1a1433; --sub:#6b5f8a; --gray:#9ca3af; --bd:#e9e7f5;
  --bg:#f0effa; --fn:'Plus Jakarta Sans',sans-serif;
}
html,body { width:100%; height:100%; cursor:none; font-family:var(--fn); background:var(--bg); overflow:hidden; }

.sp-cursor { width:10px; height:10px; border-radius:50%; background:var(--a1); position:fixed; z-index:9999; pointer-events:none; transform:translate(-50%,-50%); mix-blend-mode:multiply; }
.sp-cursor-ring { width:32px; height:32px; border-radius:50%; border:1px solid var(--a1); position:fixed; z-index:9998; pointer-events:none; transform:translate(-50%,-50%); opacity:.4; }

.sp-root { display:flex; width:100%; height:100vh; overflow:hidden; }
.sp-body { flex:1; display:flex; flex-direction:column; overflow:hidden; min-width:0; }

.sp-search-header { padding:20px 22px 0; flex-shrink:0; }
.sp-search-card { background:#fff; border:1px solid var(--bd); border-radius:16px; padding:18px 20px; box-shadow:0 1px 4px rgba(120,80,200,.07); }
.sp-search-title { display:flex; align-items:center; gap:10px; font-size:17px; font-weight:700; color:var(--txt); margin-bottom:12px; }

.sp-bar-wrap { position:relative; margin-bottom:10px; }
.sp-bar-icon { position:absolute; left:13px; top:50%; transform:translateY(-50%); font-size:15px; }
.sp-bar-input { width:100%; height:42px; border-radius:11px; border:none; background:#f9f8ff; padding:0 76px 0 40px; font-size:13px; color:var(--txt); outline:none; box-sizing:border-box; font-family:var(--fn); transition:box-shadow .2s; }
.sp-bar-btn { position:absolute; right:4px; top:4px; height:34px; width:58px; border-radius:9px; background:var(--p); border:none; color:#fff; font-weight:600; font-size:13px; cursor:none; font-family:var(--fn); transition:transform .15s; }
.sp-bar-btn:hover { transform:scale(1.03); }

.sp-filters { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:8px; }
.sp-chip { padding:5px 13px; border-radius:50px; border:1px solid var(--bd); background:transparent; color:var(--gray); font-size:12px; font-weight:500; cursor:none; font-family:var(--fn); transition:all .15s; }
.sp-chip.active { background:#eef2ff; color:var(--p); font-weight:600; border-color:transparent; }

.sp-hint { display:flex; align-items:center; gap:6px; font-size:11px; color:var(--gray); }

.sp-content { display:flex; flex:1; overflow:hidden; padding:14px 22px 22px; gap:14px; }

.sp-list { width:320px; flex-shrink:0; overflow-y:auto; display:flex; flex-direction:column; gap:6px; }
.sp-list-count { font-size:12px; font-weight:600; color:var(--gray); margin-bottom:4px; flex-shrink:0; }

.sp-no-result { background:#fff; border:1px solid var(--bd); border-radius:14px; padding:24px 20px; text-align:center; }
.sp-no-text { font-size:13px; color:var(--sub); margin-bottom:14px; line-height:1.6; }
.sp-suggest-label { font-size:11px; font-weight:600; color:var(--gray); margin-bottom:8px; }
.sp-suggest-row { display:flex; align-items:center; gap:8px; padding:10px 12px; background:#f9f8ff; border-radius:10px; cursor:none; transition:background .15s; margin-bottom:4px; }
.sp-suggest-row:hover { background:var(--pl); }
.sp-suggest-name { flex:1; font-size:12px; font-weight:600; color:var(--txt); text-align:left; }

.sp-result-row { display:flex; align-items:center; gap:10px; background:#fff; border:1px solid var(--bd); border-radius:13px; padding:13px 14px; cursor:none; transition:all .2s; }
.sp-result-row:hover { border-color:#a78bfa; transform:translateY(-1px); box-shadow:0 4px 12px rgba(120,80,200,.1); }
.sp-result-row.selected { border-color:var(--p); box-shadow:0 0 0 3px rgba(124,58,237,.12); }
.sp-result-icon { width:34px; height:34px; border-radius:9px; background:var(--pl); display:flex; align-items:center; justify-content:center; font-size:17px; flex-shrink:0; }
.sp-result-name { font-size:13px; font-weight:600; color:var(--txt); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.sp-result-company { font-size:11px; color:var(--gray); margin-top:2px; }

.sp-tag { font-size:10px; font-weight:600; padding:2px 8px; border-radius:4px; flex-shrink:0; }
.sp-tag.otc { background:#f0fdf4; color:#16a34a; }
.sp-tag.rx  { background:#fef2f2; color:#ef4444; }

.sp-detail { flex:1; background:#fff; border:1px solid var(--bd); border-radius:16px; overflow-y:auto; padding:22px; }
.sp-detail-empty { height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; color:var(--gray); text-align:center; line-height:1.7; font-size:13px; }

.sp-drug-top { display:flex; gap:14px; align-items:flex-start; padding-bottom:18px; border-bottom:1px solid var(--bd); margin-bottom:18px; }
.sp-drug-icon { width:50px; height:50px; border-radius:13px; background:var(--pl); display:flex; align-items:center; justify-content:center; font-size:25px; flex-shrink:0; }
.sp-drug-name { font-size:15px; font-weight:700; color:var(--txt); margin-bottom:4px; }
.sp-drug-company { font-size:12px; color:var(--gray); margin-bottom:8px; }

.sp-section { margin-bottom:16px; }
.sp-section-ttl { display:flex; align-items:center; gap:8px; font-size:12px; font-weight:700; color:var(--txt); margin-bottom:8px; }
.sp-dot { width:8px; height:8px; border-radius:50%; background:var(--p); flex-shrink:0; }
.sp-section-txt { font-size:13px; color:#4b5563; line-height:1.75; margin-left:16px; }
.sp-warn-box { display:flex; gap:8px; align-items:flex-start; background:#fef2f2; border:1px solid #fee2e2; border-radius:10px; padding:12px 14px; font-size:12px; color:#ef4444; line-height:1.65; }

.sp-evidence { display:flex; gap:10px; align-items:flex-start; background:rgba(238,242,255,.5); border:1px solid #e0e7ff; border-radius:12px; padding:12px 14px; margin-bottom:16px; }
.sp-ev-title { font-size:11px; font-weight:700; color:#312e81; margin-bottom:3px; }
.sp-ev-sub { font-size:10px; color:#6366f1; }

.sp-ai-row { display:flex; gap:6px; margin-bottom:8px; }
.sp-ai-input { flex:1; height:40px; border-radius:10px; border:1px solid var(--bd); background:#f9f8ff; padding:0 12px; font-size:12px; color:var(--txt); outline:none; font-family:var(--fn); transition:border-color .2s; }
.sp-ai-input:focus { border-color:var(--a1); box-shadow:0 0 0 2px rgba(167,139,250,.15); }
.sp-ai-btn { height:40px; padding:0 16px; border-radius:10px; background:var(--p); border:none; color:#fff; font-size:12px; font-weight:600; cursor:none; font-family:var(--fn); flex-shrink:0; transition:opacity .2s; }
.sp-ai-btn:disabled { opacity:.6; }
.sp-ai-loading { font-size:12px; color:var(--a1); margin-bottom:6px; }
.sp-ai-answer { background:#faf5ff; border:1px solid #e9d5ff; border-radius:10px; padding:12px 14px; font-size:12px; color:#4b5563; line-height:1.7; }
.sp-ai-label { font-size:11px; font-weight:700; color:var(--p); margin-bottom:6px; }

.sp-actions { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:4px; }
.sp-btn-add { padding:12px; border-radius:12px; background:var(--p); border:none; color:#fff; font-weight:700; font-size:13px; cursor:none; font-family:var(--fn); box-shadow:0 4px 12px rgba(124,58,237,.3); transition:transform .15s, box-shadow .15s; }
.sp-btn-add:hover { transform:translateY(-1px); box-shadow:0 6px 18px rgba(124,58,237,.4); }
.sp-btn-check { padding:12px; border-radius:12px; background:#f9f8ff; border:1px solid var(--bd); color:var(--sub); font-weight:700; font-size:13px; cursor:none; font-family:var(--fn); transition:background .15s; }
.sp-btn-check:hover { background:var(--pl); color:var(--p); }

::-webkit-scrollbar { width:4px; }
::-webkit-scrollbar-track { background:transparent; }
::-webkit-scrollbar-thumb { background:rgba(167,139,250,.3); border-radius:2px; }
::-webkit-scrollbar-thumb:hover { background:rgba(124,58,237,.4); }
`;