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
    const onMove = e => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
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
        <span style={{ fontSize: 16, fontWeight: 800, color: "#1a1433", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>MediPocket</span>
      </div>

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

/* ── OTC 라벨 ── */
const getOtcLabel = (code) => {
  if (!code) return "의약품";
  if (code.includes("전문") || code === "01") return "전문의약품";
  if (code.includes("일반") || code === "02") return "일반의약품";
  return code;
};

/* ════════════════
   메인
════════════════ */
export default function CabinetPage() {
  const navigate   = useNavigate();
  const { cursor, ring } = useCursor();

  /* localStorage에서 약 목록 로드 */
  const [drugs,       setDrugs      ] = useState([]);
  const [selectedDrug,setSelectedDrug] = useState(null);
  const [detail,      setDetail     ] = useState(null); // 백엔드 상세 정보
  const [detailLoading, setDetailLoading] = useState(false);

  /* 마운트 시 localStorage 읽기 */
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cabinet") || "[]");
    setDrugs(saved);
    if (saved.length > 0) setSelectedDrug(saved[0]);
  }, []);

  /* 약 선택 시 백엔드에서 상세 정보 조회 */
  useEffect(() => {
    if (!selectedDrug) { setDetail(null); return; }
    setDetailLoading(true);
    fetch(`${API_BASE}/drug/info/${selectedDrug.ITEM_SEQ}`)
      .then(r => r.json())
      .then(data => setDetail(data))
      .catch(() => setDetail(null))
      .finally(() => setDetailLoading(false));
  }, [selectedDrug]);

  /* 개별 삭제 */
  const handleDelete = (itemSeq, e) => {
    e.stopPropagation();
    const next = drugs.filter(d => d.ITEM_SEQ !== itemSeq);
    setDrugs(next);
    localStorage.setItem("cabinet", JSON.stringify(next));
    if (selectedDrug?.ITEM_SEQ === itemSeq) setSelectedDrug(next[0] || null);
  };

  /* 전체 삭제 */
  const handleDeleteAll = () => {
    setDrugs([]);
    setSelectedDrug(null);
    setDetail(null);
    localStorage.setItem("cabinet", JSON.stringify([]));
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="mp-cursor"      style={{ left: cursor.x, top: cursor.y }} />
      <div className="mp-cursor-ring" style={{ left: ring.x,   top: ring.y   }} />

      <div className="mp-root">
        <Sidebar activePath="/app/cabinet" />

        {/* 메인 */}
        <main className="mp-main">

          {/* 헤더 */}
          <div className="mp-header">
            <div className="mp-header-left">
              <span style={{ fontSize: 26 }}>🧡</span>
              <div>
                <div className="mp-header-title">내 약함</div>
                <div className="mp-header-sub">내가 담은 약을 한눈에 확인하고 관리해보세요.</div>
              </div>
            </div>
            <div className="mp-header-right">
              <span className="mp-count-txt">총 {drugs.length}개</span>
              {drugs.length > 0 && (
                <button className="mp-btn-delete-all" onClick={handleDeleteAll}>전체 삭제</button>
              )}
            </div>
          </div>

          {/* 주의 배너 */}
          <div className="mp-notice">
            <span style={{ fontSize: 20, flexShrink: 0 }}>🛡</span>
            <div>
              <div className="mp-notice-title">복용 전 확인하세요</div>
              <div className="mp-notice-sub">담은 약은 저장된 목록입니다. 복용 전 약사 또는 의사와 상담하세요.</div>
            </div>
          </div>

          {/* 약 목록 */}
          <div className="mp-list">
            {drugs.length === 0 && (
              <div className="mp-empty">
                <div style={{ fontSize: 48, marginBottom: 14 }}>💊</div>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>약함이 비어있어요</div>
                <div style={{ fontSize: 13, color: "#9ca3af", marginBottom: 20 }}>약 검색에서 약을 추가해보세요!</div>
                <button
                  onClick={() => navigate("/app/search")}
                  style={{
                    padding: "12px 28px", borderRadius: 50,
                    background: "linear-gradient(135deg,#7c3aed,#a78bfa)",
                    border: "none", color: "#fff",
                    fontSize: 14, fontWeight: 700, cursor: "none",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    boxShadow: "0 4px 14px rgba(124,58,237,.35)",
                  }}
                >
                  🔍 약 검색하러 가기
                </button>
              </div>
            )}

            {drugs.map(drug => (
              <div
                key={drug.ITEM_SEQ}
                className={`mp-item${selectedDrug?.ITEM_SEQ === drug.ITEM_SEQ ? " selected" : ""}`}
                onClick={() => setSelectedDrug(drug)}
              >
                <div className="mp-item-icon-wrap">
                  <span style={{ fontSize: 20 }}>💊</span>
                </div>
                <div className="mp-item-body">
                  <div className="mp-item-name">{drug.ITEM_NAME}</div>
                  <div className="mp-item-company">{drug.ENTP_NAME}</div>
                  <div className="mp-item-tags">
                    <span className="mp-tag mp-tag-purple">{getOtcLabel(drug.ETC_OTC_CODE)}</span>
                    {drug.addedAt && (
                      <span className="mp-tag mp-tag-gray">
                        {new Date(drug.addedAt).toLocaleDateString("ko-KR")} 추가
                      </span>
                    )}
                  </div>
                </div>
                <button
                  className="mp-item-del"
                  onClick={e => handleDelete(drug.ITEM_SEQ, e)}
                >✕</button>
              </div>
            ))}
          </div>

          {/* 하단 버튼 */}
          {drugs.length > 0 && (
            <div className="mp-bottom">
              <button
                className="mp-btn-schedule"
                onClick={() => navigate("/app/check")}
              >
                🧪&nbsp;&nbsp;병용 확인하러 가기 →
              </button>
            </div>
          )}
        </main>

        {/* 오른쪽 상세 패널 */}
        <aside className="mp-detail">
          {!selectedDrug ? (
            <div className="mp-detail-empty">약을 선택하면<br />상세 정보가 표시됩니다.</div>
          ) : detailLoading ? (
            <div className="mp-detail-empty">불러오는 중...</div>
          ) : (
            <>
              <div className="mp-detail-back">← 약 상세 정보</div>

              <div className="mp-detail-drug-header">
                <div className="mp-detail-drug-icon">💊</div>
                <div>
                  <div className="mp-detail-drug-name">{selectedDrug.ITEM_NAME}</div>
                  <div className="mp-detail-drug-company">{selectedDrug.ENTP_NAME}</div>
                  <div className="mp-detail-tags">
                    <span className="mp-tag mp-tag-purple">{getOtcLabel(selectedDrug.ETC_OTC_CODE)}</span>
                  </div>
                </div>
              </div>

              {detail?.EFCY_QESITM && (
                <div className="mp-detail-section">
                  <div className="mp-detail-section-title">효능·효과</div>
                  <div className="mp-detail-section-content">
                    {detail.EFCY_QESITM.slice(0, 200)}{detail.EFCY_QESITM.length > 200 ? "..." : ""}
                  </div>
                </div>
              )}

              {detail?.USE_METHOD_QESITM && (
                <div className="mp-detail-section">
                  <div className="mp-detail-section-title">복용법</div>
                  <div className="mp-detail-section-content">
                    {detail.USE_METHOD_QESITM.slice(0, 200)}{detail.USE_METHOD_QESITM.length > 200 ? "..." : ""}
                  </div>
                </div>
              )}

              {detail?.ATPN_QESITM && (
                <div className="mp-detail-section">
                  <div className="mp-detail-section-title">주의사항</div>
                  <div className="mp-detail-section-content">
                    {detail.ATPN_QESITM.slice(0, 200)}{detail.ATPN_QESITM.length > 200 ? "..." : ""}
                  </div>
                </div>
              )}

              <div className="mp-detail-section">
                <div className="mp-detail-section-title">근거 출처</div>
                <div className="mp-detail-section-content" style={{ color: "#6366f1", fontSize: 11 }}>
                  📄 식약처 DUR 품목 정보 · e약은요 · 확신도 High
                </div>
              </div>

              <button
                className="mp-detail-back-btn"
                onClick={() => navigate("/app/search")}
              >
                🔍 약 검색하러 가기
              </button>
            </>
          )}
        </aside>
      </div>
    </>
  );
}

/* ════════════════
   CSS
════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
:root{
  --p:#7c3aed;--pl:#ede9fe;--a1:#a78bfa;--a2:#f9a8d4;
  --txt:#1a1433;--sub:#6b7280;--sub2:#6b5f8a;
  --bg:#f4f3ff;--border:#e9e7f5;
  --fn:'Plus Jakarta Sans',sans-serif;--detail-w:300px;
}
html,body{width:100%;height:100%;cursor:none;font-family:var(--fn);background:var(--bg);overflow:hidden;}

.mp-cursor{width:10px;height:10px;border-radius:50%;background:var(--a1);position:fixed;z-index:9999;pointer-events:none;transform:translate(-50%,-50%);mix-blend-mode:multiply;}
.mp-cursor-ring{width:32px;height:32px;border-radius:50%;border:1px solid var(--a1);position:fixed;z-index:9998;pointer-events:none;transform:translate(-50%,-50%);opacity:.4;}

.mp-root{display:flex;height:100vh;overflow:hidden;}
.mp-main{flex:1;overflow-y:auto;padding:36px 32px 40px;min-width:0;}

/* 헤더 */
.mp-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;}
.mp-header-left{display:flex;align-items:center;gap:14px;}
.mp-header-title{font-size:24px;font-weight:800;color:var(--txt);line-height:1.2;}
.mp-header-sub{font-size:14px;color:var(--sub2);margin-top:3px;}
.mp-header-right{display:flex;align-items:center;gap:14px;}
.mp-count-txt{font-size:14px;color:var(--sub);font-weight:500;}
.mp-btn-delete-all{padding:8px 18px;background:var(--p);color:#fff;border:none;border-radius:10px;font-family:var(--fn);font-size:14px;font-weight:700;cursor:none;transition:all .18s;}
.mp-btn-delete-all:hover{background:#6d28d9;transform:translateY(-1px);}

/* 배너 */
.mp-notice{background:#eff6ff;border:0.8px solid #bfdbfe;border-radius:12px;padding:16px 20px;display:flex;align-items:center;gap:14px;margin-bottom:16px;}
.mp-notice-title{font-size:15px;font-weight:700;color:#1d4ed8;margin-bottom:4px;}
.mp-notice-sub{font-size:12px;color:#1e40af;}

/* 목록 */
.mp-list{display:flex;flex-direction:column;gap:10px;margin-bottom:28px;}
.mp-empty{text-align:center;padding:60px 0;font-size:14px;color:var(--sub);}

.mp-item{background:#fff;border:0.8px solid var(--border);border-radius:14px;padding:0 20px;height:90px;display:flex;align-items:center;gap:16px;cursor:none;transition:all .18s;position:relative;animation:mp-fadeIn .3s ease both;}
@keyframes mp-fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
.mp-item:hover{border-color:var(--a1);box-shadow:0 4px 16px rgba(124,58,237,.1);}
.mp-item.selected{border-color:var(--p);box-shadow:0 0 0 2px rgba(124,58,237,.15);background:#faf9ff;}

.mp-item-icon-wrap{width:44px;height:44px;background:#f5f3ff;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.mp-item-body{flex:1;min-width:0;}
.mp-item-name{font-size:14px;font-weight:700;color:var(--txt);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:3px;}
.mp-item-company{font-size:11px;color:#9ca3af;margin-bottom:6px;}
.mp-item-tags{display:flex;gap:6px;flex-wrap:wrap;}

.mp-tag{font-size:10px;font-weight:700;padding:3px 10px;border-radius:20px;white-space:nowrap;}
.mp-tag-purple{background:#ede9fe;color:#7c3aed;border:1px solid #7c3aed;}
.mp-tag-gray{background:#f3f4f6;color:#6b7280;border:1px solid #d1d5db;}

.mp-item-del{width:28px;height:28px;background:#f3f4f6;border:none;border-radius:8px;color:#9ca3af;font-size:12px;cursor:none;transition:all .18s;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-left:8px;}
.mp-item-del:hover{background:#fee2e2;color:#ef4444;}

/* 하단 버튼 */
.mp-bottom{position:sticky;bottom:0;}
.mp-btn-schedule{width:100%;padding:18px;background:linear-gradient(135deg,var(--p),#818cf8);color:#fff;border:none;border-radius:14px;font-family:var(--fn);font-size:17px;font-weight:700;cursor:none;box-shadow:0 6px 22px rgba(124,58,237,.35);transition:transform .2s,box-shadow .2s;}
.mp-btn-schedule:hover{transform:translateY(-2px);box-shadow:0 10px 30px rgba(124,58,237,.45);}

/* 상세 패널 */
.mp-detail{width:var(--detail-w);flex-shrink:0;background:#fff;border-left:1px solid var(--border);overflow-y:auto;padding:20px 18px 28px;position:sticky;top:0;height:100vh;}
.mp-detail-back{font-size:12px;color:var(--sub2);margin-bottom:18px;cursor:none;}
.mp-detail-empty{display:flex;align-items:center;justify-content:center;height:200px;font-size:13px;color:var(--sub);text-align:center;line-height:1.8;}
.mp-detail-drug-header{display:flex;align-items:flex-start;gap:12px;margin-bottom:20px;}
.mp-detail-drug-icon{width:44px;height:44px;background:linear-gradient(135deg,#f0eeff,#ede9fe);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;}
.mp-detail-drug-name{font-size:15px;font-weight:800;color:var(--txt);margin-bottom:3px;line-height:1.3;}
.mp-detail-drug-company{font-size:11px;color:#9ca3af;margin-bottom:7px;}
.mp-detail-tags{display:flex;gap:5px;flex-wrap:wrap;}
.mp-detail-section{margin-bottom:16px;padding-bottom:14px;border-bottom:0.8px solid var(--border);}
.mp-detail-section:last-of-type{border-bottom:none;}
.mp-detail-section-title{font-size:11px;font-weight:700;color:var(--sub2);margin-bottom:7px;}
.mp-detail-section-content{font-size:12px;color:var(--txt);line-height:1.7;}
.mp-detail-back-btn{width:100%;padding:12px;background:#f5f3ff;border:none;border-radius:10px;font-family:var(--fn);font-size:13px;font-weight:700;color:var(--p);cursor:none;transition:background .18s;margin-top:4px;}
.mp-detail-back-btn:hover{background:var(--pl);}

::-webkit-scrollbar{width:4px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:rgba(167,139,250,.3);border-radius:2px;}
::-webkit-scrollbar-thumb:hover{background:rgba(124,58,237,.4);}
`;