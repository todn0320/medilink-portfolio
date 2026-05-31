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

/* ════════════════
   비커 SVG
════════════════ */
function Beaker({ color1, color2, pillColor, pillShape, animate }) {
  return (
    <svg width="160" height="200" viewBox="0 0 160 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`bg-${color1}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color1} stopOpacity="0.7" />
          <stop offset="100%" stopColor={color2} stopOpacity="0.9" />
        </linearGradient>
        <clipPath id={`beaker-clip-${color1}`}>
          <path d="M28 56 L28 152 Q28 172 48 172 L112 172 Q132 172 132 152 L132 56 Z" />
        </clipPath>
      </defs>
      <path d="M28 56 L28 152 Q28 172 48 172 L112 172 Q132 172 132 152 L132 56 Z" fill={`url(#bg-${color1})`} />
      <path d="M40 130 Q80 118 120 130 L120 172 Q100 172 80 172 Q60 172 40 172 Z" fill={color2} opacity="0.35" />
      <path d="M28 56 L28 152 Q28 172 48 172 L112 172 Q132 172 132 152 L132 56" stroke="white" strokeWidth="2.5" strokeOpacity="0.6" fill="none" strokeLinecap="round" />
      <rect x="20" y="44" width="120" height="16" rx="8" fill="white" fillOpacity="0.4" />
      <rect x="20" y="44" width="120" height="16" rx="8" stroke="white" strokeWidth="1.5" strokeOpacity="0.5" fill="none" />
      <rect x="40" y="28" width="80" height="20" rx="4" fill="white" fillOpacity="0.25" />
      <ellipse cx="52" cy="80" rx="6" ry="18" fill="white" opacity="0.2" transform="rotate(-15 52 80)" />
      {pillShape === "capsule" ? (
        <g transform="translate(52, 52)" style={{ animation: animate ? "ck-pill-float 2.8s ease-in-out infinite" : "none" }}>
          <rect x="0" y="0" width="56" height="24" rx="12" fill="white" opacity="0.95" />
          <rect x="0" y="0" width="28" height="24" rx="12" fill={pillColor} opacity="0.9" />
          <ellipse cx="14" cy="12" rx="10" ry="10" fill={pillColor} opacity="0.9" />
        </g>
      ) : (
        <g transform="translate(55, 52)" style={{ animation: animate ? "ck-pill-float 3.2s ease-in-out infinite 0.4s" : "none" }}>
          <ellipse cx="25" cy="12" rx="22" ry="12" fill="white" opacity="0.95" />
          <ellipse cx="14" cy="12" rx="12" ry="12" fill={pillColor} opacity="0.85" />
          <ellipse cx="14" cy="12" rx="6" ry="6" fill="white" opacity="0.3" />
        </g>
      )}
    </svg>
  );
}

/* ════════════════
   경고 비커
════════════════ */
function WarningBeaker() {
  return (
    <svg width="160" height="200" viewBox="0 0 160 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="warn-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fcd34d" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.85" />
        </linearGradient>
      </defs>
      <path d="M28 56 L28 152 Q28 172 48 172 L112 172 Q132 172 132 152 L132 56 Z" fill="url(#warn-bg)" />
      <circle cx="55" cy="120" r="8" fill="#fbbf24" opacity="0.4" style={{ animation: "ck-bubble 2s ease-in-out infinite" }} />
      <circle cx="85" cy="105" r="5" fill="#fbbf24" opacity="0.35" style={{ animation: "ck-bubble 2.4s ease-in-out infinite 0.6s" }} />
      <circle cx="105" cy="125" r="6" fill="#fbbf24" opacity="0.3" style={{ animation: "ck-bubble 1.8s ease-in-out infinite 1.2s" }} />
      <path d="M40 135 Q80 122 120 135 L120 172 Q80 172 40 172 Z" fill="#f59e0b" opacity="0.3" />
      <path d="M28 56 L28 152 Q28 172 48 172 L112 172 Q132 172 132 152 L132 56" stroke="white" strokeWidth="2.5" strokeOpacity="0.55" fill="none" strokeLinecap="round" />
      <rect x="20" y="44" width="120" height="16" rx="8" fill="white" fillOpacity="0.35" />
      <rect x="20" y="44" width="120" height="16" rx="8" stroke="white" strokeWidth="1.5" strokeOpacity="0.4" fill="none" />
      <rect x="40" y="28" width="80" height="20" rx="4" fill="white" fillOpacity="0.2" />
      <g style={{ animation: "ck-warn-pulse 1.6s ease-in-out infinite" }}>
        <polygon points="80,64 104,104 56,104" fill="#fbbf24" opacity="0.9" />
        <polygon points="80,64 104,104 56,104" fill="none" stroke="white" strokeWidth="2" strokeOpacity="0.7" />
        <text x="80" y="100" textAnchor="middle" fill="white" fontSize="22" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif">!</text>
      </g>
    </svg>
  );
}

/* ════════════════
   결과 카드
════════════════ */
function ResultCard({ result }) {
  if (!result) return null;
  const cfg = {
    warning: { bg: "#fffbeb", border: "rgba(251,191,36,0.4)", icon: "⚠️", iconBg: "rgba(251,191,36,0.2)", titleColor: "#92400e" },
    danger:  { bg: "#fef2f2", border: "rgba(239,68,68,0.3)",  icon: "🚫", iconBg: "rgba(239,68,68,0.15)", titleColor: "#991b1b" },
    safe:    { bg: "#f0fdf4", border: "rgba(16,185,129,0.3)", icon: "✅", iconBg: "rgba(16,185,129,0.15)", titleColor: "#065f46" },
  }[result.type];

  return (
    <div style={{
      background: cfg.bg, border: `0.8px solid ${cfg.border}`,
      borderRadius: 16, padding: "28px 32px",
      display: "flex", gap: 20,
      animation: "ck-fadeup 0.4s ease both",
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 12, background: cfg.iconBg,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 20, flexShrink: 0, marginTop: 4,
      }}>{cfg.icon}</div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, color: cfg.titleColor, marginBottom: 6 }}>{result.title}</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#1a1433", marginBottom: 8 }}>{result.pair}</div>
        <div style={{ fontSize: 15, color: "#6b5f8a", lineHeight: 1.7, marginBottom: 10 }}>{result.desc}</div>
        <div style={{ fontSize: 13, color: "#9ca3af" }}>📋 {result.source}</div>
      </div>
    </div>
  );
}

/* ════════════════
   메인
════════════════ */
export default function CheckPage() {
  const { cursor, ring } = useCursor();
  const [drugA,   setDrugA  ] = useState("");
  const [drugB,   setDrugB  ] = useState("");
  const [result,  setResult ] = useState(null);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError  ] = useState("");

  /* ── 약 이름 → item_seq 조회 ── */
  const getItemSeq = async (name) => {
    const res  = await fetch(`${API_BASE}/drug/search?name=${encodeURIComponent(name)}&limit=1`);
    const data = await res.json();
    if (data.results?.length > 0) return data.results[0].ITEM_SEQ;
    return null;
  };

  /* ── 병용 확인 ── */
  const handleCheck = async () => {
    if (!drugA.trim() || !drugB.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    setChecked(false);

    try {
      /* 두 약의 item_seq 조회 */
      const [seqA, seqB] = await Promise.all([
        getItemSeq(drugA.trim()),
        getItemSeq(drugB.trim()),
      ]);

      if (!seqA) { setError(`"${drugA}" 를 찾을 수 없어요. 약 이름을 다시 확인해주세요.`); setLoading(false); return; }
      if (!seqB) { setError(`"${drugB}" 를 찾을 수 없어요. 약 이름을 다시 확인해주세요.`); setLoading(false); return; }

      /* 병용금기 체크 */
      const res  = await fetch(`${API_BASE}/drug/check?item_seq_a=${seqA}&item_seq_b=${seqB}`);
      const data = await res.json();

      if (data.is_prohibited && data.warnings?.length > 0) {
        const w = data.warnings[0];
        const grade = w.GRADE === "1" ? "danger" : "warning";
        setResult({
          type:   grade,
          title:  grade === "danger" ? "병용 금기" : "병용 주의",
          pair:   `${drugA} + ${drugB}`,
          desc:   w.PROHBT_CONTENT || "병용 시 주의가 필요합니다. 의사 또는 약사에게 문의하세요.",
          source: `DUR 품목정보 · ${w.TYPE_NAME || "병용금기"} · 확신도 High`,
        });
      } else {
        setResult({
          type:   "safe",
          title:  "병용 가능",
          pair:   `${drugA} + ${drugB}`,
          desc:   "현재 DUR 데이터에서 두 약물 간 주요 상호작용이 발견되지 않았습니다. 단, 개인차가 있으므로 필요시 약사 또는 의사에게 문의하세요.",
          source: "DUR 품목정보 · 확신도 Medium",
        });
      }
      setChecked(true);
    } catch (e) {
      setError("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="ck-cursor"      style={{ left: cursor.x, top: cursor.y }} />
      <div className="ck-cursor-ring" style={{ left: ring.x,   top: ring.y   }} />

      <div style={{
        display: "flex", height: "100vh",
        background: "#f0eeff",
        fontFamily: "'Plus Jakarta Sans',sans-serif",
        overflow: "hidden",
      }}>
        <Sidebar activePath="/app/check" />

        <main style={{
          flex: 1, padding: "32px 36px",
          display: "flex", flexDirection: "column",
          gap: 20, overflowY: "auto",
        }}>
          {/* 헤더 */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 4 }}>
            <span style={{ fontSize: 26 }}>🧪</span>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#1a1433" }}>병용 확인</div>
              <div style={{ fontSize: 14, color: "#6b5f8a", marginTop: 3 }}>두 가지 약을 입력하면 병용 가능 여부를 확인합니다.</div>
            </div>
          </div>

          {/* 인포바 */}
          <div style={{
            background: "#fdfbff", border: "0.8px solid rgba(167,139,250,.2)",
            borderRadius: 14, padding: "20px 28px",
            display: "flex", alignItems: "center", gap: 16,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: "rgba(167,139,250,.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, flexShrink: 0,
            }}>💡</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#1a1433", marginBottom: 4 }}>
                식약처 DUR 공공데이터 기반 실시간 병용 확인
              </div>
              <div style={{ fontSize: 13, color: "#9ca3af" }}>
                130,000건 이상의 DUR 경고 데이터로 즉시 확인합니다.
              </div>
            </div>
          </div>

          {/* 비커 씬 */}
          <div style={{
            background: "#fdfbff",
            border: "0.8px solid rgba(167,139,250,.15)",
            borderRadius: 14, padding: "40px 0 32px",
            display: "flex", flexDirection: "column",
            alignItems: "center", gap: 0, flex: 1, minHeight: 360,
          }}>
            <div style={{
              display: "flex", alignItems: "flex-end", gap: 0,
              justifyContent: "center", width: "100%", paddingBottom: 28,
            }}>
              {/* 비커 A */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                <Beaker color1="#c4b5fd" color2="#7c3aed" pillColor="#7c3aed" pillShape="capsule" animate={true} />
                <div style={{
                  background: "#f5f3ff", border: "0.8px solid #a78bfa",
                  borderRadius: 24, height: 42, width: 160,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <input
                    value={drugA}
                    onChange={e => { setDrugA(e.target.value); setChecked(false); setResult(null); setError(""); }}
                    onKeyDown={e => e.key === "Enter" && handleCheck()}
                    placeholder="첫 번째 약 이름"
                    style={{
                      border: "none", background: "transparent", textAlign: "center",
                      fontFamily: "'Plus Jakarta Sans',sans-serif",
                      fontSize: 14, fontWeight: 600, color: "#6b5f8a",
                      outline: "none", width: "100%", cursor: "text",
                    }}
                  />
                </div>
              </div>

              {/* + */}
              <div style={{ fontSize: 36, fontWeight: 300, color: "#6b5f8a", paddingBottom: 56, margin: "0 24px" }}>+</div>

              {/* 비커 B */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                <Beaker color1="#fda4af" color2="#f43f5e" pillColor="#f43f5e" pillShape="circle" animate={true} />
                <div style={{
                  background: "#f5f3ff", border: "0.8px solid #a78bfa",
                  borderRadius: 24, height: 42, width: 160,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <input
                    value={drugB}
                    onChange={e => { setDrugB(e.target.value); setChecked(false); setResult(null); setError(""); }}
                    onKeyDown={e => e.key === "Enter" && handleCheck()}
                    placeholder="두 번째 약 이름"
                    style={{
                      border: "none", background: "transparent", textAlign: "center",
                      fontFamily: "'Plus Jakarta Sans',sans-serif",
                      fontSize: 14, fontWeight: 600, color: "#6b5f8a",
                      outline: "none", width: "100%", cursor: "text",
                    }}
                  />
                </div>
              </div>

              {/* → */}
              <div style={{ fontSize: 36, fontWeight: 300, color: "#6b5f8a", paddingBottom: 56, margin: "0 24px" }}>→</div>

              {/* 결과 비커 + 버튼 */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                <WarningBeaker />
                <button
                  onClick={handleCheck}
                  disabled={loading}
                  style={{
                    height: 49, width: 175, borderRadius: 30,
                    background: (drugA && drugB && !loading)
                      ? "linear-gradient(135deg,#7c3aed,#a78bfa)"
                      : "#e5e7eb",
                    border: "none",
                    color: (drugA && drugB && !loading) ? "#fff" : "#9ca3af",
                    fontSize: 15, fontWeight: 700, cursor: "none",
                    fontFamily: "'Plus Jakarta Sans',sans-serif",
                    boxShadow: (drugA && drugB && !loading) ? "0 6px 22px rgba(124,58,237,.4)" : "none",
                    transition: "all .25s",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  }}
                >
                  {loading ? "확인 중..." : "🧪 병용 확인"}
                </button>
              </div>
            </div>
          </div>

          {/* 에러 */}
          {error && (
            <div style={{
              background: "#fef2f2", border: "1px solid #fee2e2",
              borderRadius: 12, padding: "14px 20px",
              fontSize: 14, color: "#ef4444", fontWeight: 500,
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* 결과 카드 */}
          {checked && result && <ResultCard result={result} />}
        </main>
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
html,body{width:100%;height:100%;cursor:none;font-family:'Plus Jakarta Sans',sans-serif;overflow:hidden;}

.ck-cursor{width:10px;height:10px;border-radius:50%;background:#a78bfa;position:fixed;z-index:9999;pointer-events:none;transform:translate(-50%,-50%);mix-blend-mode:multiply;}
.ck-cursor-ring{width:32px;height:32px;border-radius:50%;border:1px solid #a78bfa;position:fixed;z-index:9998;pointer-events:none;transform:translate(-50%,-50%);opacity:.4;}

@keyframes ck-pill-float{0%,100%{transform:translateY(0) rotate(-4deg)}50%{transform:translateY(-8px) rotate(4deg)}}
@keyframes ck-bubble{0%{transform:translateY(0);opacity:.4}100%{transform:translateY(-40px);opacity:0}}
@keyframes ck-warn-pulse{0%,100%{opacity:.9}50%{opacity:.55}}
@keyframes ck-fadeup{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}

::-webkit-scrollbar{width:4px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:rgba(167,139,250,.3);border-radius:2px;}
::-webkit-scrollbar-thumb:hover{background:rgba(124,58,237,.4);}
`;