import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

/* ── 커스텀 커서 ── */
function useCursor() {
  const [cursor, setCursor] = useState({ x: -200, y: -200 });
  const [ring,   setRing  ] = useState({ x: -200, y: -200 });
  const ringPos = useRef({ x: -200, y: -200 });
  const raf = useRef(null);
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

/* ── 데이터 ── */
const SCHEDULE = [
  { time:"08:00", label:"아침",    icon:"🌅", pill:"타이레놀정 500mg",               dose:"1정",   pillColor:"#f97316", done:true  },
  { time:"12:30", label:"점심",    icon:"🌞", pill:"아스피린프로텍트정 100mg",        dose:"1정",   pillColor:"#3b82f6", done:true  },
  { time:"18:00", label:"저녁",    icon:"🌙", pill:"오메가3파워업 rTG사쿠온캡슐 1g", dose:"1캡슐", pillColor:"#1a1433", done:false },
  { time:"21:00", label:"취침 전", icon:"🌙", pill:"달솔한판코네솔정",               dose:"1정",   pillColor:"#a78bfa", done:false },
];
const WEEK_DATA = [
  { day:"월", date:"6/5",  checks:[true,true,true]    },
  { day:"화", date:"6/6",  checks:[true,true,true]    },
  { day:"수", date:"6/7",  checks:[true,true,true]    },
  { day:"목", date:"6/8",  checks:[true,true,true]    },
  { day:"금", date:"6/9",  checks:[true,false,false]  },
  { day:"토", date:"6/10", checks:[false,false,false] },
  { day:"일", date:"6/11", checks:[false,false,false], today:true },
];

const NAV_MAIN = [
  { icon:"🏠", label:"홈",        path:"/app/home"   },
  { icon:"🔍", label:"약 검색",   path:"/app/search" },
  { icon:"🤍", label:"내 약함",   path:"/app/cabinet"},
  { icon:"⏱",  label:"병용 확인", path:"/app/check"  },
];
const NAV_MANAGE = [
  { icon:"🔔", label:"알림",        path:"/app/notifications", badge:2    },
  { icon:"🔗", label:"의료진 공유", path:null,                 badge:null },
  { icon:"⚙️", label:"설정",        path:"/app/setting",       badge:null },
];

/* ════════════════════════════════
   사이드바
════════════════════════════════ */
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
      {/* 로고 */}
      <div
        onClick={() => navigate("/")}
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

      {/* 메인 */}
      <div style={{ fontSize: 11, fontWeight: 600, color: "#b0a8c8", letterSpacing: "0.06em", textTransform: "uppercase", padding: "0 8px", marginBottom: 6 }}>메인</div>
      <nav style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
        {NAV_MAIN.map(item => {
          const isActive = activePath === item.path;
          return (
            <button key={item.path} onClick={() => navigate(item.path)} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "9px 10px", borderRadius: 10, border: "none",
              background: isActive ? "#ede9fe" : "transparent",
              fontFamily: "'Plus Jakarta Sans', 'Noto Sans KR', sans-serif",
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

      {/* 관리 */}
      <div style={{ fontSize: 11, fontWeight: 600, color: "#b0a8c8", letterSpacing: "0.06em", textTransform: "uppercase", padding: "0 8px", marginBottom: 6 }}>관리</div>
      <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {NAV_MANAGE.map(item => {
          const isActive = activePath === item.path;
          return (
            <button key={item.label} onClick={() => item.path && navigate(item.path)} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "9px 10px", borderRadius: 10, border: "none",
              background: isActive ? "#ede9fe" : "transparent",
              fontFamily: "'Plus Jakarta Sans', 'Noto Sans KR', sans-serif",
              fontSize: 13, fontWeight: isActive ? 700 : 500,
              color: isActive ? "#7c3aed" : "#6b7280",
              cursor: "none", textAlign: "left", width: "100%", transition: "all .15s",
            }}>
              <span style={{ fontSize: 15, width: 20, textAlign: "center" }}>{item.icon}</span>
              <span>{item.label}</span>
              {item.badge && (
                <span style={{
                  marginLeft: "auto",
                  background: "#ef4444",
                  color: "#fff", fontSize: 10, fontWeight: 700,
                  borderRadius: 50, padding: "1px 7px",
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

/* ════════════════════════════════
   메인 페이지
════════════════════════════════ */
export default function HomePage() {
  const navigate = useNavigate();
  const { cursor, ring } = useCursor();
  const [statusTab, setStatusTab] = useState("주간");

  const today = new Date();
  const dateStr = `${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,"0")}.${String(today.getDate()).padStart(2,"0")}`;

  return (
    <>
      <style>{CSS}</style>
      <div className="hp-cursor"      style={{ left: cursor.x, top: cursor.y }} />
      <div className="hp-cursor-ring" style={{ left: ring.x,   top: ring.y   }} />

      <div className="hp-root">
        <div className="hp-body">
          <Sidebar activePath="/app/home" />

          <main className="hp-main">

            {/* 인사말 + 날짜 + 알림 */}
            <div className="hp-top-bar">
              <div className="hp-greeting-wrap">
                <span className="hp-greeting-text">안녕하세요, 김민지님 👋</span>
                <span className="hp-greeting-sub">오늘도 건강한 하루 되세요!</span>
              </div>
              <div className="hp-top-right">
                <div className="hp-date-chip">
                  <span>📅</span>
                  <span>{dateStr}</span>
                </div>
                <button className="hp-bell-btn" onClick={() => navigate("/app/notifications")}>
                  🔔
                  <span className="hp-bell-badge">2</span>
                </button>
              </div>
            </div>

            {/* 스탯 카드 */}
            <div className="hp-stat-row">
              {[
                { icon:"🎯", iconBg:"#ede9fe", val:"92%", valC:"#7c3aed", lbl:"복약 달성률",   sub:"목표 4/5회 복용 완료" },
                { icon:"⚠️", iconBg:"#fef2f2", val:"2건", valC:"#ef4444", lbl:"병용 금기 경고", sub:"확인 필요" },
                { icon:"💊", iconBg:"#fff7ed", val:"5개", valC:"#f97316", lbl:"복용 중인 약",  sub:"전체 목록 보기" },
                { icon:"📅", iconBg:"#ede9fe", val:"7일", valC:"#7c3aed", lbl:"연속 복약",     sub:"최고 기록 갱신 중!" },
              ].map((s, i) => (
                <div key={i} className="hp-stat-card">
                  <div className="hp-stat-icon-wrap" style={{ background: s.iconBg }}>
                    <span style={{ fontSize: 22 }}>{s.icon}</span>
                  </div>
                  <div className="hp-stat-info">
                    <div className="hp-stat-val" style={{ color: s.valC }}>{s.val}</div>
                    <div className="hp-stat-lbl">{s.lbl}</div>
                    <div className="hp-stat-sub">{s.sub}</div>
                  </div>
                  <span className="hp-stat-arr">›</span>
                </div>
              ))}
            </div>

            {/* 콘텐츠 */}
            <div className="hp-content-row">

              {/* 중앙 */}
              <div className="hp-center-col">

                {/* 복약 일정 */}
                <div className="hp-card hp-schedule-card">
                  <div className="hp-card-header">
                    <span style={{ fontSize:18 }}>🗓️</span>
                    <span className="hp-card-title">오늘 복약 일정</span>
                    <div style={{ flex:1 }} />
                    <button className="hp-card-link">
                      <span style={{ fontSize:14 }}>🗓️</span>
                      복용 일정 관리하기 →
                    </button>
                  </div>
                  <div className="hp-schedule-list">
                    {SCHEDULE.map((s, i) => (
                      <div key={i} className={`hp-sch-row${s.done ? " done" : ""}`}>
                        <div className="hp-sch-time-col">
                          <div className="hp-sch-time-icon">{s.icon}</div>
                          <div>
                            <div className="hp-sch-time">{s.time}</div>
                            <div className="hp-sch-period">{s.label}</div>
                          </div>
                        </div>
                        <div className="hp-sch-divider" />
                        <div className="hp-sch-pill-icon" style={{ background: s.pillColor }}>💊</div>
                        <div className="hp-sch-info">
                          <div className="hp-sch-pill-name">{s.pill}</div>
                          <div className="hp-sch-dose">{s.dose}</div>
                        </div>
                        <div className={`hp-sch-badge${s.done ? " done" : " todo"}`}>
                          {s.done ? "복용완료" : "복용예정"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 알림 카드 */}
                <div className="hp-card hp-alert-card">
                  <div className="hp-card-header">
                    <span style={{ fontSize:18 }}>🔔</span>
                    <span className="hp-card-title">알림</span>
                    <div style={{ flex:1 }} />
                    <button className="hp-card-link" onClick={() => navigate("/app/notifications")}>
                      전체 보기
                    </button>
                  </div>
                  <div className="hp-alert-list">
                    <div className="hp-alert-row">
                      <div className="hp-alert-dot" style={{ background:"#fee2e2" }}>⚠️</div>
                      <div className="hp-alert-info">
                        <div className="hp-alert-title" style={{ color:"#ef4444" }}>상호작용 주의</div>
                        <div className="hp-alert-desc">아스피린프로텍트정과 타이레놀정 복용 시 위장 장애에 주의</div>
                      </div>
                      <button className="hp-alert-action" onClick={() => navigate("/app/notifications")}>확인하기</button>
                    </div>
                    <div className="hp-alert-row">
                      <div className="hp-alert-dot" style={{ background:"#fef3c7" }}>📅</div>
                      <div className="hp-alert-info">
                        <div className="hp-alert-title" style={{ color:"#f59e0b" }}>다음 진료일</div>
                        <div className="hp-alert-desc">6월 15일 (토) 14:00 · 서울내과의원</div>
                      </div>
                      <button className="hp-alert-action">일정 추가</button>
                    </div>
                  </div>
                </div>

              </div>

              {/* 우측 패널 */}
              <div className="hp-right-col">

                {/* 복약 현황 */}
                <div className="hp-card hp-status-card">
                  <div className="hp-card-header">
                    <span className="hp-status-dot">●</span>
                    <span className="hp-card-title">복약 현황</span>
                    <div className="hp-status-tabs">
                      {["주간","월간","요약"].map(t => (
                        <button
                          key={t}
                          className={`hp-status-tab${statusTab === t ? " active" : ""}`}
                          onClick={() => setStatusTab(t)}
                        >{t}</button>
                      ))}
                    </div>
                  </div>
                  <div className="hp-week-grid">
                    {WEEK_DATA.map((w, i) => (
                      <div key={i} className={`hp-week-col${w.today ? " today" : ""}`}>
                        <div className="hp-week-day">{w.day}</div>
                        <div className="hp-week-date">{w.date}</div>
                        {w.checks.map((c, j) => (
                          <div key={j} className={`hp-week-check${c ? " done" : w.today && !c ? " x" : ""}`}>
                            {c ? "✓" : w.today && !c ? "✗" : "○"}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                  <div className="hp-achieve-row">
                    <div>
                      <div className="hp-achieve-label">이번 주 복약율</div>
                      <div className="hp-achieve-compare">지난주보다 +10% 🙂 꾸준히 잘하고 있어요!</div>
                    </div>
                    <div className="hp-achieve-val">80%</div>
                  </div>
                  <div className="hp-achieve-sub">4/5회</div>
                  <div className="hp-prog-bar">
                    {/* ✅ style 제거 → CSS 애니메이션으로 0%→80% 차오름 */}
                    <div className="hp-prog-fill" />
                  </div>
                </div>

                {/* 빠른 실행 */}
                <div className="hp-card hp-quick-card">
                  <div className="hp-card-header">
                    <span style={{ fontSize:16 }}>🔺</span>
                    <span className="hp-card-title">빠른 실행</span>
                  </div>
                  <div className="hp-quick-grid">
                    {[
                      { icon:"🔍", label:"약 검색",    path:"/app/search"  },
                      { icon:"➕", label:"약 추가",     path:"/app/cabinet" },
                      { icon:"🔗", label:"의료진 공유", path:null           },
                    ].map((q, i) => (
                      <button
                        key={i}
                        className="hp-quick-btn"
                        onClick={() => q.path && navigate(q.path)}
                      >
                        <span className="hp-quick-icon">{q.icon}</span>
                        <span className="hp-quick-label">{q.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

/* ════════════════════════════════
   CSS
════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
:root{
  --p:#7c3aed;--pl:#ede9fe;--a1:#a78bfa;--a2:#f9a8d4;
  --txt:#1a1433;--sub:#6b5f8a;--gray:#9ca3af;--bd:#e9e7f5;
  --bg:#f0effa;
  --fn:'Plus Jakarta Sans',sans-serif;
  --sh:0 1px 4px rgba(120,80,200,0.08);
}
html,body{width:100%;height:100%;cursor:none;font-family:var(--fn);background:var(--bg);overflow:hidden;}

.hp-cursor{width:10px;height:10px;border-radius:50%;background:var(--a1);position:fixed;z-index:9999;pointer-events:none;transform:translate(-50%,-50%);mix-blend-mode:multiply;}
.hp-cursor-ring{width:32px;height:32px;border-radius:50%;border:1px solid var(--a1);position:fixed;z-index:9998;pointer-events:none;transform:translate(-50%,-50%);opacity:.4;}

.hp-root{display:flex;flex-direction:column;width:100%;height:100vh;overflow:hidden;}
.hp-body{display:flex;flex:1;overflow:hidden;}
.hp-main{flex:1;padding:24px 24px 32px;display:flex;flex-direction:column;gap:16px;min-width:0;overflow-y:auto;}

/* 인사말 바 */
.hp-top-bar{display:flex;align-items:center;justify-content:space-between;gap:12px;}
.hp-greeting-wrap{display:flex;align-items:center;gap:12px;}
.hp-greeting-text{font-size:22px;font-weight:800;color:var(--txt);}
.hp-greeting-sub{font-size:15px;color:var(--sub);}
.hp-top-right{display:flex;align-items:center;gap:10px;flex-shrink:0;}
.hp-date-chip{display:flex;align-items:center;gap:6px;font-size:13px;font-weight:600;color:var(--sub);background:#fff;padding:7px 14px;border-radius:20px;border:0.8px solid var(--bd);white-space:nowrap;}
.hp-bell-btn{position:relative;width:38px;height:38px;border-radius:50%;background:#fff;border:0.8px solid var(--bd);cursor:none;font-size:17px;display:flex;align-items:center;justify-content:center;transition:background .2s;}
.hp-bell-btn:hover{background:var(--pl);}
.hp-bell-badge{position:absolute;top:-2px;right:-2px;width:18px;height:18px;border-radius:50%;background:#ef4444;color:#fff;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;}

/* 스탯 */
.hp-stat-row{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;}
.hp-stat-card{background:#fff;border:0.8px solid var(--bd);border-radius:16px;box-shadow:var(--sh);padding:18px 16px;display:flex;align-items:center;gap:12px;cursor:none;transition:transform .2s;position:relative;}
.hp-stat-card:hover{transform:translateY(-2px);box-shadow:0 4px 16px rgba(120,80,200,.12);}
.hp-stat-icon-wrap{width:52px;height:52px;border-radius:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.hp-stat-val{font-size:22px;font-weight:800;line-height:1.1;}
.hp-stat-lbl{font-size:11px;color:var(--sub);margin-top:4px;}
.hp-stat-sub{font-size:10px;color:var(--gray);margin-top:2px;}
.hp-stat-arr{position:absolute;right:14px;top:50%;transform:translateY(-50%);color:var(--gray);font-size:16px;}

/* 콘텐츠 */
.hp-content-row{display:grid;grid-template-columns:1fr 320px;gap:14px;flex:1;min-height:0;}
.hp-center-col{display:flex;flex-direction:column;gap:14px;overflow-y:auto;}
.hp-right-col{display:flex;flex-direction:column;gap:14px;overflow-y:auto;}

/* 공통 카드 */
.hp-card{background:#fff;border:0.8px solid var(--bd);border-radius:16px;box-shadow:var(--sh);padding:20px 22px;}
.hp-card-header{display:flex;align-items:center;gap:8px;margin-bottom:16px;}
.hp-card-title{font-size:17px;font-weight:700;color:var(--txt);}
.hp-card-link{background:transparent;border:none;font-family:var(--fn);font-size:12px;font-weight:600;color:var(--p);cursor:none;display:flex;align-items:center;gap:4px;transition:opacity .2s;}
.hp-card-link:hover{opacity:.7;}

/* 복약 일정 */
.hp-schedule-list{display:flex;flex-direction:column;gap:0;}
.hp-sch-row{display:flex;align-items:center;gap:14px;padding:14px 0;border-bottom:0.8px solid var(--bd);transition:opacity .2s;}
.hp-sch-row:last-child{border-bottom:none;}
.hp-sch-row.done{opacity:.6;}
.hp-sch-time-col{display:flex;align-items:center;gap:8px;width:80px;flex-shrink:0;}
.hp-sch-time-icon{font-size:18px;width:24px;text-align:center;}
.hp-sch-time{font-size:13px;font-weight:700;color:var(--txt);}
.hp-sch-period{font-size:10px;color:var(--gray);margin-top:1px;}
.hp-sch-divider{width:1px;height:32px;background:var(--bd);flex-shrink:0;}
.hp-sch-pill-icon{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;}
.hp-sch-info{flex:1;min-width:0;}
.hp-sch-pill-name{font-size:13px;font-weight:600;color:var(--txt);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.hp-sch-dose{font-size:11px;color:var(--gray);margin-top:2px;}
.hp-sch-badge{padding:5px 12px;border-radius:20px;font-size:11px;font-weight:700;flex-shrink:0;}
.hp-sch-badge.done{background:#d1fae5;color:#059669;}
.hp-sch-badge.todo{background:#f3f4f6;color:#9ca3af;}

/* 알림 */
.hp-alert-list{display:flex;flex-direction:column;gap:0;}
.hp-alert-row{display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:0.8px solid var(--bd);}
.hp-alert-row:last-child{border-bottom:none;}
.hp-alert-dot{width:32px;height:32px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;}
.hp-alert-info{flex:1;min-width:0;}
.hp-alert-title{font-size:12px;font-weight:700;margin-bottom:3px;}
.hp-alert-desc{font-size:11px;color:var(--sub);line-height:1.5;}
.hp-alert-action{background:transparent;border:none;font-family:var(--fn);font-size:11px;font-weight:600;color:var(--p);cursor:none;white-space:nowrap;flex-shrink:0;transition:opacity .2s;}
.hp-alert-action:hover{opacity:.7;}

/* 복약 현황 */
.hp-status-dot{color:var(--p);font-size:14px;}
.hp-status-tabs{display:flex;gap:3px;margin-left:auto;}
.hp-status-tab{padding:4px 10px;border-radius:16px;font-size:11px;font-weight:600;color:var(--gray);background:transparent;border:none;cursor:none;font-family:var(--fn);transition:all .2s;}
.hp-status-tab.active{background:var(--pl);color:var(--p);}
.hp-status-tab:hover:not(.active){background:#f9f8ff;}
.hp-week-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-bottom:16px;}
.hp-week-col{display:flex;flex-direction:column;align-items:center;gap:4px;}
.hp-week-col.today .hp-week-day,.hp-week-col.today .hp-week-date{color:var(--p);font-weight:700;}
.hp-week-day{font-size:10px;color:var(--gray);font-weight:600;}
.hp-week-date{font-size:9px;color:var(--gray);}
.hp-week-check{width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;background:#f3f4f6;color:var(--gray);}
.hp-week-check.done{background:#d1fae5;color:#059669;}
.hp-week-check.x{background:#fee2e2;color:#ef4444;}
.hp-achieve-row{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:4px;}
.hp-achieve-label{font-size:12px;font-weight:600;color:var(--sub);margin-bottom:4px;}
.hp-achieve-compare{font-size:10px;color:var(--p);}
.hp-achieve-val{font-size:28px;font-weight:800;color:var(--txt);}
.hp-achieve-sub{font-size:10px;color:var(--gray);margin-bottom:6px;}

/* ✅ 프로그레스 바 — 화면 진입 시 0% → 80% 차오르는 애니메이션 */
.hp-prog-bar{height:6px;background:#e9e7f5;border-radius:3px;overflow:hidden;}
.hp-prog-fill{
  height:100%;
  background:linear-gradient(90deg,var(--a1),var(--p));
  border-radius:3px;
  animation:hpBarFill 1.4s cubic-bezier(.4,0,.2,1) 0.3s both;
}
@keyframes hpBarFill{
  from{width:0%}
  to{width:80%}
}

/* 빠른 실행 */
.hp-quick-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;}
.hp-quick-btn{background:#f9f8ff;border:0.8px solid var(--bd);border-radius:12px;height:80px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;cursor:none;transition:all .2s;font-family:var(--fn);}
.hp-quick-btn:hover{background:var(--pl);border-color:var(--a1);transform:translateY(-2px);}
.hp-quick-icon{font-size:22px;}
.hp-quick-label{font-size:10px;font-weight:600;color:var(--sub);}
`;