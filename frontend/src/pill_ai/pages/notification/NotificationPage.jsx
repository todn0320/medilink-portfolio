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

const NOTIFICATIONS = [
  { id: 1, type: "warning", icon: "⚠️", iconBg: "#fee2e2", title: "상호작용 주의", desc: "아스피린프로텍트정과 타이레놀정 복용 시 위장 장애에 주의하세요.", time: "방금 전", read: false },
  { id: 2, type: "warning", icon: "⚠️", iconBg: "#fee2e2", title: "병용금기 경고", desc: "와파린과 아스피린 병용은 출혈 위험이 있습니다. 의사와 상담하세요.", time: "1시간 전", read: false },
  { id: 3, type: "schedule", icon: "💊", iconBg: "#ede9fe", title: "복약 알림", desc: "저녁 8시 복약 시간입니다. 칼슘제 · 비타민D를 복용해주세요.", time: "오늘 20:00", read: true },
  { id: 4, type: "schedule", icon: "📅", iconBg: "#fef3c7", title: "다음 진료일", desc: "6월 15일 (토) 14:00 · 서울내과의원 진료 예정입니다.", time: "어제", read: true },
  { id: 5, type: "info", icon: "ℹ️", iconBg: "#dbeafe", title: "복약 완료", desc: "오늘 아침 복약 (타이레놀, 오메가3) 이 완료됐어요. 잘 하셨어요!", time: "오늘 08:10", read: true },
];

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { cursor, ring } = useCursor();
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const deleteNotif = (id) => setNotifications(prev => prev.filter(n => n.id !== id));

  return (
    <>
      <style>{CSS}</style>
      <div className="np-cursor"      style={{ left: cursor.x, top: cursor.y }} />
      <div className="np-cursor-ring" style={{ left: ring.x,   top: ring.y   }} />

      <div style={{ display: "flex", height: "100vh", background: "#f0effa", fontFamily: "'Plus Jakarta Sans',sans-serif", overflow: "hidden" }}>
        <Sidebar activePath="/app/notifications" />

        <main style={{ flex: 1, padding: "32px 36px", overflowY: "auto" }}>
          {/* 헤더 */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 26 }}>🔔</span>
              <div>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#1a1433" }}>
                  알림
                  {unreadCount > 0 && (
                    <span style={{ marginLeft: 10, background: "#ef4444", color: "#fff", fontSize: 13, fontWeight: 700, borderRadius: 50, padding: "2px 10px" }}>{unreadCount}</span>
                  )}
                </div>
                <div style={{ fontSize: 14, color: "#6b5f8a", marginTop: 3 }}>복약 알림 및 경고를 확인하세요.</div>
              </div>
            </div>
            {unreadCount > 0 && (
              <button onClick={markAllRead} style={{ padding: "8px 18px", background: "#ede9fe", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600, color: "#7c3aed", cursor: "none", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                모두 읽음
              </button>
            )}
          </div>

          {/* 알림 목록 */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {notifications.length === 0 && (
              <div style={{ textAlign: "center", padding: "60px 0", color: "#9ca3af" }}>
                <div style={{ fontSize: 48, marginBottom: 14 }}>🔔</div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>알림이 없어요</div>
              </div>
            )}
            {notifications.map(n => (
              <div
                key={n.id}
                onClick={() => markRead(n.id)}
                style={{
                  background: n.read ? "#fff" : "#faf9ff",
                  border: `0.8px solid ${n.read ? "#e9e7f5" : "#c4b5fd"}`,
                  borderRadius: 14, padding: "18px 20px",
                  display: "flex", alignItems: "flex-start", gap: 14,
                  cursor: "none", transition: "all .2s",
                  boxShadow: n.read ? "none" : "0 2px 8px rgba(124,58,237,.08)",
                }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 12, background: n.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{n.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1433" }}>{n.title}</div>
                    {!n.read && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#7c3aed", flexShrink: 0 }} />}
                  </div>
                  <div style={{ fontSize: 13, color: "#6b5f8a", lineHeight: 1.6 }}>{n.desc}</div>
                  <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 6 }}>{n.time}</div>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); deleteNotif(n.id); }}
                  style={{ width: 26, height: 26, background: "#f3f4f6", border: "none", borderRadius: 8, color: "#9ca3af", fontSize: 11, cursor: "none", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all .15s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#fee2e2"; e.currentTarget.style.color = "#ef4444"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#f3f4f6"; e.currentTarget.style.color = "#9ca3af"; }}
                >✕</button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
html,body{width:100%;height:100%;cursor:none;font-family:'Plus Jakarta Sans',sans-serif;background:#f0effa;overflow:hidden;}
.np-cursor{width:10px;height:10px;border-radius:50%;background:#a78bfa;position:fixed;z-index:9999;pointer-events:none;transform:translate(-50%,-50%);mix-blend-mode:multiply;}
.np-cursor-ring{width:32px;height:32px;border-radius:50%;border:1px solid #a78bfa;position:fixed;z-index:9998;pointer-events:none;transform:translate(-50%,-50%);opacity:.4;}
::-webkit-scrollbar{width:4px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:rgba(167,139,250,.3);border-radius:2px;}
`;