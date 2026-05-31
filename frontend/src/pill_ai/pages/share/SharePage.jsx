import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

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

const NAV_MAIN = [
  { icon: "🏠", label: "홈",        path: "/app/home"   },
  { icon: "🔍", label: "약 검색",   path: "/app/search" },
  { icon: "🤍", label: "내 약함",   path: "/app/cabinet"},
  { icon: "⏱",  label: "병용 확인", path: "/app/check"  },
];
const NAV_MANAGE = [
  { icon: "🔔", label: "알림",        path: "/app/notifications", badge: 2    },
  { icon: "🔗", label: "의료진 공유", path: "/app/share",         badge: null },
  { icon: "⚙️", label: "설정",        path: "/app/setting",       badge: null },
];

function Sidebar({ activePath }) {
  const navigate = useNavigate();
  return (
    <aside style={{ width: 210, flexShrink: 0, background: "#fff", borderRight: "1px solid #e9e7f5", display: "flex", flexDirection: "column", padding: "24px 14px 20px", height: "100vh", position: "sticky", top: 0 }}>
      <div
        onClick={() => navigate("/app/home")}
        onMouseEnter={e => e.currentTarget.style.opacity = ".75"}
        onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 28, cursor: "none", transition: "opacity .2s" }}
      >
        <div style={{ width: 34, height: 34, background: "linear-gradient(135deg,#a78bfa,#f9a8d4)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, boxShadow: "0 4px 12px rgba(167,139,250,.4)" }}>💊</div>
        <span style={{ fontSize: 16, fontWeight: 800, color: "#1a1433", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>MediPocket</span>
      </div>

      <div style={{ fontSize: 11, fontWeight: 600, color: "#b0a8c8", letterSpacing: "0.06em", textTransform: "uppercase", padding: "0 8px", marginBottom: 6 }}>메인</div>
      <nav style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
        {NAV_MAIN.map(item => {
          const isActive = activePath === item.path;
          return (
            <button key={item.path} onClick={() => navigate(item.path)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 10, border: "none", background: isActive ? "#ede9fe" : "transparent", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: isActive ? 700 : 500, color: isActive ? "#7c3aed" : "#6b7280", cursor: "none", textAlign: "left", width: "100%", transition: "all .15s" }}>
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
            <button key={item.label} onClick={() => item.path && navigate(item.path)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 10, border: "none", background: isActive ? "#ede9fe" : "transparent", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: isActive ? 700 : 500, color: isActive ? "#7c3aed" : "#6b7280", cursor: "none", textAlign: "left", width: "100%", transition: "all .15s" }}>
              <span style={{ fontSize: 15, width: 20, textAlign: "center" }}>{item.icon}</span>
              <span>{item.label}</span>
              {item.badge && <span style={{ marginLeft: "auto", background: "#ef4444", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 50, padding: "1px 7px" }}>{item.badge}</span>}
            </button>
          );
        })}
      </nav>

      <div style={{ flex: 1 }} />
      <div
        onClick={() => navigate("/app/setting")}
        onMouseEnter={e => e.currentTarget.style.opacity = ".75"}
        onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 8px", borderTop: "1px solid #e9e7f5", marginTop: 12, cursor: "none", transition: "opacity .2s" }}
      >
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#a78bfa,#7c3aed)", color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>메디</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1433", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>메디포</div>
          <div style={{ fontSize: 11, color: "#9ca3af" }}>개발자</div>
        </div>
      </div>
    </aside>
  );
}

function QRCode() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="8" width="40" height="40" rx="4" fill="none" stroke="#7c3aed" strokeWidth="3"/>
      <rect x="16" y="16" width="24" height="24" rx="2" fill="#7c3aed"/>
      <rect x="72" y="8" width="40" height="40" rx="4" fill="none" stroke="#7c3aed" strokeWidth="3"/>
      <rect x="80" y="16" width="24" height="24" rx="2" fill="#7c3aed"/>
      <rect x="8" y="72" width="40" height="40" rx="4" fill="none" stroke="#7c3aed" strokeWidth="3"/>
      <rect x="16" y="80" width="24" height="24" rx="2" fill="#7c3aed"/>
      {[[56,8],[56,20],[56,32],[56,44],[8,56],[20,56],[32,56],[44,56],[56,56],[68,56],[80,56],[92,56],[104,56],[68,68],[80,80],[92,68],[104,80],[68,92],[80,92],[92,104],[104,92],[56,68],[56,80],[56,92],[56,104]].map(([x,y],i) => (
        <rect key={i} x={x} y={y} width="8" height="8" rx="1" fill={i % 3 === 0 ? "#7c3aed" : "#a78bfa"}/>
      ))}
    </svg>
  );
}

function Checkbox({ checked }) {
  return (
    <div style={{ width: 18, height: 18, borderRadius: 4, flexShrink: 0, background: checked ? "#7c3aed" : "transparent", border: `1.6px solid ${checked ? "#7c3aed" : "#e9e7f5"}`, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
      {checked && <span style={{ color: "#fff", fontSize: 11, fontWeight: 700, lineHeight: 1 }}>✓</span>}
    </div>
  );
}

const SHARE_ITEMS = [
  { label: "약/건기식 목록 (전체)", key: "meds" },
  { label: "복용법 (용량·횟수·시간)", key: "dosage" },
  { label: "병용금기 경고 내역", key: "dur" },
  { label: "복용 메모", key: "memo" },
  { label: "실명 / 생년월일 (기본 비활성)", key: "personal" },
];

const HISTORY = [
  { id: "#1", date: "2024.06.10", period: "24시간", views: 1, status: "만료됨", statusColor: "#ef4444" },
  { id: "#2", date: "2024.06.05", period: "7일",    views: 3, status: "철회",   statusColor: "#ef4444" },
];

export default function SharePage() {
  const { cursor, ring } = useCursor();
  const [checks,    setChecks   ] = useState({ meds: true, dosage: true, dur: true, memo: false, personal: false });
  const [expire,    setExpire   ] = useState("24시간");
  const [copied,    setCopied   ] = useState(false);

  const toggle = key => setChecks(p => ({ ...p, [key]: !p[key] }));
  const handleCopy = () => { setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <>
      <style>{CSS}</style>
      <div className="sp-cursor"      style={{ left: cursor.x, top: cursor.y }} />
      <div className="sp-cursor-ring" style={{ left: ring.x,   top: ring.y   }} />

      <div style={{ display: "flex", height: "100vh", background: "#f4f3ff", fontFamily: "'Plus Jakarta Sans',sans-serif", overflow: "hidden" }}>
        <Sidebar activePath="/app/share" />

        <main style={{ flex: 1, padding: "32px 36px", display: "flex", flexDirection: "column", gap: 20, overflowY: "auto" }}>
          {/* 헤더 */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 4 }}>
            <span style={{ fontSize: 26 }}>🔗</span>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#1a1433" }}>의료진 공유</div>
              <div style={{ fontSize: 14, color: "#6b5f8a", marginTop: 3 }}>복약 목록을 의료진과 안전하게 공유하세요. 공유 범위와 유효기간을 직접 설정합니다.</div>
            </div>
          </div>

          {/* 2열 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 20, alignItems: "start" }}>

            {/* 좌측 */}
            <div style={{ background: "#fff", border: "0.8px solid #e9e7f5", borderRadius: 16, padding: "32px 32px 28px" }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#1a1433", marginBottom: 8 }}>📋 공유 항목 설정</div>
              <div style={{ fontSize: 13, color: "#6b5f8a", marginBottom: 24, lineHeight: 1.6 }}>공유할 정보를 직접 선택하세요. 체크하지 않은 항목은 의료진에게 보이지 않습니다.</div>

              <div style={{ fontSize: 12, fontWeight: 700, color: "#6b5f8a", marginBottom: 14 }}>포함할 항목</div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {SHARE_ITEMS.map(item => (
                  <div key={item.key} onClick={() => toggle(item.key)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderBottom: "0.8px solid #e9e7f5", cursor: "none" }}>
                    <Checkbox checked={checks[item.key]} />
                    <span style={{ fontSize: 13, color: "#1a1433", userSelect: "none" }}>{item.label}</span>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: 12, fontWeight: 700, color: "#6b5f8a", margin: "24px 0 14px" }}>링크 유효기간</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 24 }}>
                {["24시간", "7일", "직접 종료"].map(t => (
                  <button key={t} onClick={() => setExpire(t)} style={{ height: 36, borderRadius: 8, background: expire === t ? "#ede9fe" : "transparent", border: `0.8px solid ${expire === t ? "#7c3aed" : "#e9e7f5"}`, color: expire === t ? "#7c3aed" : "#6b5f8a", fontSize: 13, fontWeight: 600, cursor: "none", fontFamily: "'Plus Jakarta Sans',sans-serif", transition: "all .18s" }}>{t}</button>
                ))}
              </div>

              <button
                style={{ width: "100%", height: 48, borderRadius: 10, background: "linear-gradient(135deg,#7c3aed,#a78bfa)", border: "none", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "none", fontFamily: "'Plus Jakarta Sans',sans-serif", boxShadow: "0 6px 20px rgba(124,58,237,.35)", transition: "transform .2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
                onMouseLeave={e => e.currentTarget.style.transform = ""}
              >
                🔗 공유 링크 / QR 생성
              </button>
            </div>

            {/* 우측 */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ background: "#fff", border: "0.8px solid #e9e7f5", borderRadius: 16, padding: "22px 24px" }}>
                <div style={{ fontSize: 17, fontWeight: 700, color: "#1a1433", marginBottom: 16 }}>📱 공유 QR / 링크</div>
                <div style={{ background: "#f9f8ff", border: "0.8px dashed #e9e7f5", borderRadius: 12, padding: "22px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                  <QRCode />
                  <div style={{ width: "100%", background: "#f5f3ff", border: "0.8px solid rgba(167,139,250,.2)", borderRadius: 8, padding: "10px 14px" }}>
                    <span style={{ fontSize: 11, color: "#7c3aed", fontWeight: 400 }}>https://medipocket.app/share/tk_a8f2b3c9d1e4f5</span>
                  </div>
                  <div style={{ width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <button onClick={handleCopy} style={{ height: 36, borderRadius: 8, background: copied ? "#10b981" : "#7c3aed", border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "none", fontFamily: "'Plus Jakarta Sans',sans-serif", transition: "background .2s" }}>
                      {copied ? "✓ 복사됨" : "링크 복사"}
                    </button>
                    <button style={{ height: 36, borderRadius: 8, background: "transparent", border: "0.8px solid #e9e7f5", color: "#6b5f8a", fontSize: 13, fontWeight: 600, cursor: "none", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>철회</button>
                  </div>
                  <div style={{ fontSize: 11, color: "#9ca3af", textAlign: "center" }}>유효기간: 2024.06.12 09:00 까지 · 열람 0회</div>
                </div>
              </div>

              <div style={{ background: "#fff", border: "0.8px solid #e9e7f5", borderRadius: 16, padding: "22px 24px" }}>
                <div style={{ fontSize: 17, fontWeight: 700, color: "#1a1433", marginBottom: 16 }}>📜 공유 이력</div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {HISTORY.map((h, i) => (
                    <div key={h.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 0", borderBottom: i < HISTORY.length - 1 ? "0.8px solid #e9e7f5" : "none" }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1433", marginBottom: 4 }}>공유 링크 {h.id}</div>
                        <div style={{ fontSize: 11, color: "#9ca3af" }}>{h.date} · {h.period} · 열람 {h.views}회</div>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 600, color: h.statusColor, flexShrink: 0 }}>{h.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
html,body{width:100%;height:100%;cursor:none;font-family:'Plus Jakarta Sans',sans-serif;overflow:hidden;}
.sp-cursor{width:10px;height:10px;border-radius:50%;background:#a78bfa;position:fixed;z-index:9999;pointer-events:none;transform:translate(-50%,-50%);mix-blend-mode:multiply;}
.sp-cursor-ring{width:32px;height:32px;border-radius:50%;border:1px solid #a78bfa;position:fixed;z-index:9998;pointer-events:none;transform:translate(-50%,-50%);opacity:.4;}
::-webkit-scrollbar{width:4px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:rgba(167,139,250,.3);border-radius:2px;}
`;