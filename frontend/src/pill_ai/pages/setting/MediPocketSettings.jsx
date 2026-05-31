import { useState } from "react";
import { useNavigate } from "react-router-dom";

/* ── 토글 ── */
function Toggle({ on, onChange }) {
  return (
    <div
      onClick={() => onChange && onChange(!on)}
      style={{
        width: 44, height: 24, borderRadius: 12,
        background: on ? "#7c3aed" : "#e9e7f5",
        display: "flex", alignItems: "center", padding: "0 3px",
        cursor: "none", transition: "background 0.2s", flexShrink: 0,
        justifyContent: on ? "flex-end" : "flex-start",
      }}
    >
      <div style={{
        width: 18, height: 18, borderRadius: 9, background: "#fff",
        boxShadow: "0 1px 4px rgba(0,0,0,0.2)", transition: "all 0.2s",
      }} />
    </div>
  );
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
  { icon: "🔗", label: "의료진 공유", path: "/app/share",         badge: null },
  { icon: "⚙️", label: "설정",        path: "/app/setting",       badge: null },
];

/* ── 사이드바 ── */
function Sidebar({ activePath }) {
  const navigate = useNavigate();
  return (
    <aside style={{
      width: 210, flexShrink: 0, background: "#fff",
      borderRight: "1px solid #e9e7f5", display: "flex",
      flexDirection: "column", padding: "24px 14px 20px",
      height: "100vh", position: "sticky", top: 0,
    }}>
      <div
        onClick={() => navigate("/app/home")}
        onMouseEnter={e => e.currentTarget.style.opacity = ".75"}
        onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 28, cursor: "none", transition: "opacity .2s" }}
      >
        <div style={{
          width: 34, height: 34, background: "linear-gradient(135deg,#a78bfa,#f9a8d4)",
          borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 17, boxShadow: "0 4px 12px rgba(167,139,250,.4)",
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
                <span style={{ marginLeft: "auto", background: "#ef4444", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 50, padding: "1px 7px" }}>{item.badge}</span>
              )}
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

function Card({ children, style }) {
  return (
    <div style={{ background: "#fff", border: "0.8px solid #e9e7f5", borderRadius: 16, padding: "22px 24px 24px", ...style }}>
      {children}
    </div>
  );
}

function CardHeader({ label }) {
  return (
    <div style={{ borderBottom: "0.8px solid #e9e7f5", paddingBottom: 10, marginBottom: 4 }}>
      <span style={{ fontSize: 13, fontWeight: 700, color: "#6b5f8a", letterSpacing: "0.5px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{label}</span>
    </div>
  );
}

function SettingsRow({ label, sub, right, noBorder }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: noBorder ? "none" : "0.8px solid #e9e7f5", gap: 12 }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 500, color: "#1a1433", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>{sub}</div>}
      </div>
      <div style={{ flexShrink: 0 }}>{right}</div>
    </div>
  );
}

function SelectBadge({ label }) {
  return (
    <div style={{ border: "0.8px solid #e9e7f5", borderRadius: 8, padding: "5px 14px", fontSize: 12, color: "#1a1433", fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#fff" }}>{label}</div>
  );
}

function ProfileCard() {
  const [toggles, setToggles] = useState({ health: true, cloud: true, bio: false });
  const set = k => v => setToggles(p => ({ ...p, [k]: v }));
  return (
    <Card>
      <CardHeader label="프로필" />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f9f8ff", borderRadius: 12, padding: "14px 16px", margin: "12px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 50, height: 50, borderRadius: 25, background: "linear-gradient(135deg,#a78bfa,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, fontWeight: 700, flexShrink: 0 }}>메디</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1433" }}>메디포</div>
            <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>개발자</div>
          </div>
        </div>
        <button style={{ border: "0.8px solid #e9e7f5", borderRadius: 8, padding: "6px 16px", fontSize: 12, fontWeight: 600, color: "#6b5f8a", background: "#fff", cursor: "none", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>편집</button>
      </div>
      <SettingsRow label="건강정보 별도 동의" sub="개인정보보호법 제23조" right={<Toggle on={toggles.health} onChange={set("health")} />} />
      <SettingsRow label="클라우드 동기화" sub="기기 간 데이터 동기화" right={<Toggle on={toggles.cloud} onChange={set("cloud")} />} />
      <SettingsRow label="생체인증 로그인" sub="Face ID / 지문 인식" right={<Toggle on={toggles.bio} onChange={set("bio")} />} noBorder />
    </Card>
  );
}

function NotificationCard() {
  const [toggles, setToggles] = useState({ med: true, warn: true, remind: true, report: false });
  const set = k => v => setToggles(p => ({ ...p, [k]: v }));
  return (
    <Card>
      <CardHeader label="알림" />
      <SettingsRow label="복약 알림" sub="설정한 복약 시간에 푸시 알림" right={<Toggle on={toggles.med} onChange={set("med")} />} />
      <SettingsRow label="병용금기 경고" sub="위험한 약 조합 즉시 알림" right={<Toggle on={toggles.warn} onChange={set("warn")} />} />
      <SettingsRow label="진료일 리마인더" sub="진료 D-3, D-1 알림" right={<Toggle on={toggles.remind} onChange={set("remind")} />} />
      <SettingsRow label="주간 복약 리포트" sub="매주 월요일 오전 9시" right={<Toggle on={toggles.report} onChange={set("report")} />} />
      <SettingsRow label="알림 소리" right={<SelectBadge label="기본음" />} noBorder />
    </Card>
  );
}

function AppSettingsCard() {
  const [darkMode, setDarkMode] = useState(false);
  return (
    <Card>
      <CardHeader label="앱 설정" />
      <SettingsRow label="다크 모드" right={<Toggle on={darkMode} onChange={setDarkMode} />} />
      <SettingsRow label="언어" right={<SelectBadge label="한국어" />} />
      <SettingsRow label="글자 크기" right={<SelectBadge label="보통" />} />
      <SettingsRow label="접속 기록 보관" sub="개인정보보호법 기준 2년" noBorder />
    </Card>
  );
}

function SecurityCard() {
  const navigate = useNavigate();
  const [toggles, setToggles] = useState({ pin: false, logout: true });
  const set = k => v => setToggles(p => ({ ...p, [k]: v }));
  return (
    <Card>
      <CardHeader label="보안 · 계정" />
      <SettingsRow label="앱 잠금 (PIN)" sub="앱 진입 시 PIN 입력" right={<Toggle on={toggles.pin} onChange={set("pin")} />} />
      <SettingsRow label="자동 로그아웃" sub="30분 비활동 시" right={<Toggle on={toggles.logout} onChange={set("logout")} />} />
      <SettingsRow label="앱 버전" right={<span style={{ fontSize: 12, color: "#9ca3af" }}>v1.0.0</span>} />
      <SettingsRow label="개인정보 처리방침" right={<span style={{ fontSize: 12, color: "#7c3aed" }}>보기 ›</span>} noBorder />
      <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
        <button
          onClick={() => navigate("/login")}
          style={{ width: "100%", padding: "12px", background: "#fef2f2", border: "0.8px solid #fecaca", borderRadius: 10, fontSize: 13, fontWeight: 700, color: "#ef4444", cursor: "none", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >로그아웃</button>
        <button style={{ width: "100%", padding: "12px", background: "#fef2f2", border: "0.8px solid #fecaca", borderRadius: 10, fontSize: 13, fontWeight: 700, color: "#ef4444", cursor: "none", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>계정삭제</button>
      </div>
    </Card>
  );
}

export default function MediPocketSettings() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Noto+Sans+KR:wght@400;500;700;900&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
        html,body{width:100%;height:100%;cursor:none;font-family:'Plus Jakarta Sans','Noto Sans KR',sans-serif;background:#f4f3ff;overflow:hidden;}
        button{font-family:'Plus Jakarta Sans','Noto Sans KR',sans-serif;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:rgba(167,139,250,.3);border-radius:2px;}
      `}</style>

      <div style={{ display: "flex", height: "100vh", background: "#f4f3ff", overflow: "hidden" }}>
        <Sidebar activePath="/app/setting" />
        <main style={{ flex: 1, padding: "32px 40px 48px", overflowY: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
            <span style={{ fontSize: 24 }}>⚙️</span>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1a1433" }}>설정</h1>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <ProfileCard />
            <NotificationCard />
            <AppSettingsCard />
            <SecurityCard />
          </div>
        </main>
      </div>
    </>
  );
}