import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const SECTIONS = ["hero", "features", "how", "cta"];

/* ── QR SVG (4페이지) ── */
const QRIcon = () => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 84, height: 84 }}>
    <rect x="4" y="4" width="24" height="24" rx="3" fill="#1a1433"/>
    <rect x="8" y="8" width="16" height="16" rx="2" fill="white"/>
    <rect x="11" y="11" width="10" height="10" rx="1.5" fill="#1a1433"/>
    <rect x="52" y="4" width="24" height="24" rx="3" fill="#1a1433"/>
    <rect x="56" y="8" width="16" height="16" rx="2" fill="white"/>
    <rect x="59" y="11" width="10" height="10" rx="1.5" fill="#1a1433"/>
    <rect x="4" y="52" width="24" height="24" rx="3" fill="#1a1433"/>
    <rect x="8" y="56" width="16" height="16" rx="2" fill="white"/>
    <rect x="11" y="59" width="10" height="10" rx="1.5" fill="#1a1433"/>
    {[
      [32,4],[38,4],[44,4],[32,10],[44,10],[32,16],[38,16],[44,16],[32,22],[38,22],
      [4,32],[10,32],[16,32],[22,32],[32,32],[38,32],[44,32],[50,32],[56,32],[62,32],[68,32],
      [4,38],[16,38],[22,38],[38,38],[50,38],[62,38],
      [4,44],[10,44],[22,44],[32,44],[44,44],[56,44],[68,44],
      [32,56],[38,56],[44,56],[50,56],[62,56],[68,56],
      [32,62],[50,62],[56,62],[68,62],
      [38,68],[44,68],[56,68],[62,68],
    ].map(([x, y], i) => (
      <rect key={i} x={x} y={y} width="4" height="4" rx="1" fill={i % 2 === 0 ? "#7c3aed" : "#a78bfa"} />
    ))}
  </svg>
);

export default function LandingPage() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [cursor, setCursor] = useState({ x: -100, y: -100 });
  const [cursorRing, setCursorRing] = useState({ x: -100, y: -100 });
  const [lightFollow, setLightFollow] = useState({ x: -100, y: -100 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const ringAnimRef = useRef(null);
  const ringPos = useRef({ x: -100, y: -100 });
  const wheelTimer = useRef(null);
  const touchStart = useRef(0);

  /* ── 부드러운 커서 링 ── */
  const animRing = useCallback(() => {
    ringPos.current.x += (cursor.x - ringPos.current.x) * 0.15;
    ringPos.current.y += (cursor.y - ringPos.current.y) * 0.15;
    setCursorRing({ x: ringPos.current.x, y: ringPos.current.y });
    ringAnimRef.current = requestAnimationFrame(animRing);
  }, [cursor]);

  useEffect(() => {
    ringAnimRef.current = requestAnimationFrame(animRing);
    return () => cancelAnimationFrame(ringAnimRef.current);
  }, [animRing]);

  /* ── 마우스 이벤트 ── */
  useEffect(() => {
    const onMove = (e) => {
      setCursor({ x: e.clientX, y: e.clientY });
      setLightFollow({ x: e.clientX, y: e.clientY });
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  /* ── 페이지 이동 ── */
  const goTo = useCallback((idx) => {
    if (idx < 0 || idx >= SECTIONS.length) return;
    setCurrent(idx);
  }, []);

  /* ── 휠 스크롤 ── */
  useEffect(() => {
    const onWheel = (e) => {
      e.preventDefault();
      if (isScrolling) return;
      setIsScrolling(true);
      if (e.deltaY > 0) goTo(current + 1);
      else goTo(current - 1);
      clearTimeout(wheelTimer.current);
      wheelTimer.current = setTimeout(() => setIsScrolling(false), 950);
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [current, isScrolling, goTo]);

  /* ── 터치 스크롤 ── */
  useEffect(() => {
    const onTouchStart = (e) => { touchStart.current = e.touches[0].clientY; };
    const onTouchEnd = (e) => {
      if (isScrolling) return;
      const diff = touchStart.current - e.changedTouches[0].clientY;
      if (Math.abs(diff) < 50) return;
      setIsScrolling(true);
      if (diff > 0) goTo(current + 1);
      else goTo(current - 1);
      setTimeout(() => setIsScrolling(false), 950);
    };
    window.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [current, isScrolling, goTo]);

  /* ── 키보드 ── */
  useEffect(() => {
    const onKey = (e) => {
      if (isScrolling) return;
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        setIsScrolling(true);
        goTo(current + 1);
        setTimeout(() => setIsScrolling(false), 950);
      }
      if (e.key === "ArrowUp" || e.key === "PageUp") {
        setIsScrolling(true);
        goTo(current - 1);
        setTimeout(() => setIsScrolling(false), 950);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, isScrolling, goTo]);

  /* ── 패럴랙스 ── */
  const cx = mousePos.x / (window.innerWidth || 1) - 0.5;
  const cy = mousePos.y / (window.innerHeight || 1) - 0.5;

  return (
    <>
      <style>{CSS}</style>

      {/* 커서 */}
      <div className="mp-cursor"       style={{ left: cursor.x,      top: cursor.y      }} />
      <div className="mp-cursor-ring"  style={{ left: cursorRing.x,  top: cursorRing.y  }} />
      <div className="mp-light-follow" style={{ left: lightFollow.x, top: lightFollow.y }} />

      {/* Mesh 배경 */}
      <div className="mp-mesh-bg">
        <div className="mp-blob3" />
      </div>

      {/* ── NAV ── */}
      <nav className="mp-nav">
        {/* 로고 → 랜딩(현재 페이지 = /) 로 이동 */}
        <div
          className="mp-nav-logo"
          onClick={() => goTo(0)}
          style={{ cursor: "none" }}
        >
          <div className="mp-logo-pill">💊</div>
          MediPocket
        </div>

        <div className="mp-nav-links">
          {/* ✅ /service 로 수정 */}
          <button onClick={() => navigate("/service")}>서비스소개</button>
          <button onClick={() => goTo(1)}>기능</button>
          <button onClick={() => goTo(2)}>사용법</button>
        </div>

        <div className="mp-nav-actions">
          {/* ✅ /login 으로 수정 */}
          <button className="mp-btn-nav-ghost" onClick={() => navigate("/login")}>
            로그인
          </button>
          <button className="mp-btn-nav-pri" onClick={() => navigate("/app/home")}>
            무료로 시작
          </button>
        </div>
      </nav>

      {/* 섹션 도트 */}
      <div className="mp-fp-dots">
        {SECTIONS.map((_, i) => (
          <div
            key={i}
            className={`mp-fp-dot${current === i ? " active" : ""}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>

      {/* 풀페이지 컨테이너 */}
      <div
        ref={containerRef}
        className="mp-fp-container"
        style={{ transform: `translateY(-${current * 100}vh)` }}
      >
        {/* ═══════════════════════════════
            1페이지 — HERO
        ═══════════════════════════════ */}
        <section className="mp-fp-section" id="mp-sec-hero">
          <div
            className="mp-parallax-layer"
            style={{ transform: `translate(${cx * -18}px,${cy * -12}px)` }}
          >
            <div className="mp-hero-blob mp-hero-blob-1" />
            <div className="mp-hero-blob mp-hero-blob-2" />
          </div>

          <div className="mp-hero-left">
            <div className="mp-hero-badge">
              <span className="mp-badge-dot" />
              AI 기반 복약 관리 서비스
            </div>
            <h1 className="mp-hero-title">
              내 약을,
              <br />
              <span className="mp-grad">더 안전하게</span>
              <br />
              더 스마트하게
            </h1>
            <p className="mp-hero-desc">
              MediPocket는 처방약·일반의약품·건강기능식품을 한눈에 관리하고,
              <br />
              병용금기와 복약 스케줄을 AI가 자동으로 알려드립니다.
            </p>
            <div className="mp-hero-cta">
              <button className="mp-btn-hero" onClick={() => navigate("/app/home")}>
                무료로 시작하기 →
              </button>
              {/* ✅ /service 로 수정 */}
              <button className="mp-btn-ghost-hero" onClick={() => navigate("/service")}>
                서비스 소개
              </button>
            </div>
          </div>

          <div className="mp-hero-right">
            <div className="mp-cards-scene">
              <TiltCard className="mp-g-card mp-card-main">
                <div className="mp-card-label">
                  오늘의 복약 현황
                  <span className="mp-card-date">2026.03.07</span>
                </div>
                <div className="mp-ring-area">
                  <svg width="64" height="64" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="26" fill="none" stroke="#ede9fe" strokeWidth="6" />
                    <circle
                      cx="32" cy="32" r="26" fill="none" stroke="#7c3aed" strokeWidth="6"
                      strokeDasharray="122 41" strokeLinecap="round" strokeDashoffset="20"
                      style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
                    />
                  </svg>
                  <div>
                    <div className="mp-ring-pct">75%</div>
                    <div className="mp-ring-lbl">완료</div>
                  </div>
                </div>
                {[
                  { dot: "#7c3aed", name: "타이레놀 500mg", time: "아침 08:00", done: true },
                  { dot: "#6ee7b7", name: "오메가3",        time: "점심 12:00", done: true },
                  { dot: "#f9a8d4", name: "레보티록신",     time: "저녁 19:00", done: false },
                ].map((p, i) => (
                  <div key={i} className="mp-pill-row">
                    <span className="mp-pdot" style={{ background: p.dot }} />
                    <span style={{ fontSize: 13 }}>{p.name}</span>
                    <span className="mp-pill-time">{p.time}</span>
                    {p.done && <span className="mp-pill-check">✓</span>}
                  </div>
                ))}
              </TiltCard>

              <TiltCard className="mp-g-card mp-card-warn">
                <div className="mp-warn-dot-row">
                  <span className="mp-warn-live-dot" />
                  <span className="mp-warn-title">병용주의</span>
                </div>
                <div className="mp-warn-body">
                  레보티록신 + 칼슘제<br />4시간 간격 복용 권장
                </div>
                <div className="mp-warn-src">DUR 근거카드 ↗</div>
              </TiltCard>

              <TiltCard className="mp-g-card mp-card-search">
                <div className="mp-search-bar">
                  <span className="mp-search-icon">🔍</span>
                  타이레놀
                </div>
                {[
                  { name: "타이레놀 500mg",    badge: "일반", color: "#ede9fe", tc: "#7c3aed" },
                  { name: "타이레놀 이알서방", badge: "일반", color: "#d1fae5", tc: "#059669" },
                ].map((r, i) => (
                  <div key={i} className="mp-search-result-item">
                    <span>{r.name}</span>
                    <span className="mp-search-badge" style={{ background: r.color, color: r.tc }}>
                      {r.badge}
                    </span>
                  </div>
                ))}
              </TiltCard>
            </div>
          </div>

          <div className="mp-scroll-hint">
            <span>스크롤</span>
            <span className="mp-scroll-arrow" />
          </div>
        </section>

        {/* ═══════════════════════════════
            2페이지 — FEATURES
        ═══════════════════════════════ */}
        <section className="mp-fp-section mp-sec-features" id="mp-sec-features">
          <div className="mp-sec-eyebrow">FEATURES</div>
          <h2 className="mp-sec-title" style={{ textAlign: "center" }}>
            신뢰할 수 있는 복약 안전 서비스
          </h2>
          <p className="mp-sec-sub">
            공식 의약품 데이터와 AI 기술을 결합한 정확하고 안전한 서비스입니다
          </p>

          <div className="mp-feat-grid">
            {[
              { icon: "💊", title: "스마트 약 등록",    desc: "약 이름 검색 또는 사진 촬영으로 복약 목록을 자동 등록합니다.",            tag: "이미지 인식", tagBg: "#ede9fe", tagC: "#7c3aed", iconBg: "#a78bfa1a" },
              { icon: "!",  title: "병용금기 알림",     desc: "식약처 DUR 공공데이터 기반으로 약물 상호작용을 실시간 경고합니다.",       tag: "안전 경고",  tagBg: "#fee2e2", tagC: "#ef4444", iconBg: "#ef44441a" },
              { icon: "🔔", title: "복약 알림",         desc: "아침·점심·저녁 복약 시간을 설정하면 정확한 시간에 알림을 드립니다.",      tag: "스케줄 관리",tagBg: "#d1fae5", tagC: "#059669", iconBg: "#6ee7b71a" },
              { icon: "🔍", title: "AI 약 정보 검색",   desc: "효능·용법·주의사항을 AI가 RAG 기술로 정확하게 설명해드립니다.",          tag: "RAG 기술",   tagBg: "#fce7f3", tagC: "#ec4899", iconBg: "#f9a8d41f" },
            ].map((f, i) => (
              <FeatCard key={i} {...f} />
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════
            3페이지 — HOW IT WORKS
        ═══════════════════════════════ */}
        <section className="mp-fp-section mp-sec-how" id="mp-sec-how">
          <div className="mp-how-left">
            <div className="mp-sec-eyebrow">HOW IT WORKS</div>
            <h2 className="mp-sec-title" style={{ textAlign: "left", fontSize: 46, letterSpacing: "0.1em" }}>
              내 손안의 복약 관리,<br />언제 어디서나
            </h2>
            <p className="mp-sec-sub" style={{ textAlign: "left", margin: "0 0 36px" }}>
              단 3분이면 내 약 목록을 완성하고 안전 확인까지
            </p>
            <div className="mp-steps-v">
              {[
                { n: 1, title: "약·영양제 등록",       desc: "이름 검색 또는 사진 촬영으로 내 복약 목록을 만들어요." },
                { n: 2, title: "병용금기 자동 확인",   desc: "DUR 공공데이터로 약물 상호작용을 즉시 경고해드려요." },
                { n: 3, title: "복약 알림 설정",       desc: "아침·점심·저녁 맞춤 알림으로 복약을 완성해요." },
              ].map((s) => (
                <div key={s.n} className="mp-step-v">
                  <div className="mp-step-v-num">{s.n}</div>
                  <div className="mp-step-v-text">
                    <h4>{s.title}</h4>
                    <p>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mp-how-right">
            <div className="mp-stats-box">
              <div className="mp-stat-row">
                {[
                  { n: "44K+",  l: "등록 의약품" },
                  { n: "130K+", l: "DUR 경고"   },
                  { n: "266K+", l: "AI 데이터"  },
                ].map((s, i) => (
                  <div key={i} className="mp-stat-item">
                    <div className="mp-stat-n">{s.n}</div>
                    <div className="mp-stat-l">{s.l}</div>
                  </div>
                ))}
              </div>
              <div className="mp-chart-label-row">주간 복약 달성률</div>
              <div className="mp-chart-bars">
                {[46, 72, 87, 61, 94, 78, 100].map((h, i) => (
                  <div key={i} className="mp-bar" style={{ height: `${h}%` }} />
                ))}
              </div>
              <div className="mp-chart-days">
                {["월","화","수","목","금","토","일"].map((d) => (
                  <div key={d} className="mp-chart-day">{d}</div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════
            4페이지 — CTA
        ═══════════════════════════════ */}
        <section className="mp-fp-section mp-sec-cta" id="mp-sec-cta">
          <div className="mp-cta-inner">
            <div className="mp-cta-top-bar" />
            <div className="mp-cta-title">지금 바로 시작하세요</div>
            <div className="mp-cta-qr-img"><QRIcon /></div>
            <div className="mp-cta-qr-label">앱으로 바로 시작하기</div>
            <div className="mp-cta-qr-desc1">QR코드를 스캔하면</div>
            <div className="mp-cta-qr-desc2">MediPocket 앱으로 연결됩니다.</div>
            <div className="mp-cta-btn-row">
              <button className="mp-btn-cta" onClick={() => navigate("/app/home")}>
                무료로 시작하기 →
              </button>
              <button className="mp-btn-cta-g" onClick={() => goTo(0)}>
                처음으로
              </button>
            </div>
          </div>

          <footer className="mp-fp-footer">
            <p>© 2026 MediPocket · 본 서비스는 참고용이며 의료 진단을 대체하지 않습니다.</p>
            <div className="mp-footer-link-wrap">
              <a href="#" className="mp-footer-link">개인정보처리방침</a>
              <a href="#" className="mp-footer-link">이용약관</a>
            </div>
          </footer>
        </section>
      </div>
    </>
  );
}

/* ── TiltCard ── */
function TiltCard({ className, children }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = (e.clientX - r.left) / r.width - 0.5;
    const cy = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${cx * 14}deg) rotateX(${-cy * 10}deg) scale(1.03)`;
    el.style.boxShadow = `${-cx * 14}px ${cy * 14}px 30px rgba(120,80,200,0.18)`;
    const spot = el.querySelector(".mp-light-spot");
    if (spot) { spot.style.left = e.clientX - r.left + "px"; spot.style.top = e.clientY - r.top + "px"; }
  };
  const onLeave = () => { const el = ref.current; if (el) { el.style.transform = ""; el.style.boxShadow = ""; } };
  return (
    <div ref={ref} className={className} onMouseMove={onMove} onMouseLeave={onLeave}>
      <div className="mp-light-spot" />
      {children}
    </div>
  );
}

/* ── FeatCard ── */
function FeatCard({ icon, title, desc, tag, tagBg, tagC, iconBg }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const spot = el.querySelector(".mp-light-spot");
    if (spot) { spot.style.left = e.clientX - r.left + "px"; spot.style.top = e.clientY - r.top + "px"; }
  };
  return (
    <div ref={ref} className="mp-feat-card" onMouseMove={onMove}>
      <div className="mp-light-spot" />
      <div className="mp-feat-icon" style={{ background: iconBg }}>
        <span style={{ fontSize: 24 }}>{icon}</span>
      </div>
      <h3>{title}</h3>
      <p>{desc}</p>
      <span className="mp-feat-tag" style={{ background: tagBg, color: tagC }}>{tag}</span>
    </div>
  );
}

/* ════════════════════════════════════════════════
   CSS
════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Noto+Sans+KR:wght@300;400;500;700&display=swap');
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
:root{
  --mp-bg:#f0eeff; --mp-a1:#a78bfa; --mp-a2:#f9a8d4; --mp-a3:#6ee7b7;
  --mp-pill:#7c3aed; --mp-pill-l:#ede9fe;
  --mp-text:#1a1433; --mp-sub:#6b5f8a;
  --mp-white:rgba(255,255,255,0.88); --mp-border:rgba(167,139,250,0.18);
  --mp-sh:0 4px 20px rgba(120,80,200,0.08); --mp-sh-lg:0 16px 48px rgba(120,80,200,0.14);
  --mp-font:'Plus Jakarta Sans','Noto Sans KR',sans-serif;
}
html,body{width:100%;height:100%;overflow:hidden;cursor:none;}
body{font-family:var(--mp-font);background:var(--mp-bg);color:var(--mp-text);}
@media(prefers-reduced-motion:reduce){*{animation-duration:0.01ms!important;transition-duration:0.01ms!important;}}

.mp-cursor{width:10px;height:10px;border-radius:50%;background:var(--mp-a1);position:fixed;z-index:9999;pointer-events:none;transform:translate(-50%,-50%);mix-blend-mode:multiply;}
.mp-cursor-ring{width:32px;height:32px;border-radius:50%;border:1px solid var(--mp-a1);position:fixed;z-index:9998;pointer-events:none;transform:translate(-50%,-50%);opacity:0.45;}
.mp-light-follow{width:400px;height:400px;border-radius:50%;background:radial-gradient(circle,rgba(167,139,250,0.10),transparent 65%);position:fixed;z-index:1;pointer-events:none;transform:translate(-50%,-50%);transition:left .2s ease,top .2s ease;}

.mp-mesh-bg{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden;}
.mp-mesh-bg::before{content:'';position:absolute;width:900px;height:900px;top:-200px;left:-200px;background:radial-gradient(circle,rgba(167,139,250,0.35) 0%,transparent 65%);animation:mpDrift1 12s ease-in-out infinite alternate;}
.mp-mesh-bg::after{content:'';position:absolute;width:700px;height:700px;bottom:-150px;right:-100px;background:radial-gradient(circle,rgba(249,168,212,0.35) 0%,transparent 65%);animation:mpDrift2 15s ease-in-out infinite alternate;}
.mp-blob3{position:absolute;width:500px;height:500px;top:40%;left:50%;transform:translate(-50%,-50%);background:radial-gradient(circle,rgba(110,231,183,0.25) 0%,transparent 65%);animation:mpDrift3 18s ease-in-out infinite alternate;}
@keyframes mpDrift1{from{transform:translate(0,0)}to{transform:translate(80px,60px)}}
@keyframes mpDrift2{from{transform:translate(0,0)}to{transform:translate(-60px,40px)}}
@keyframes mpDrift3{from{transform:translate(-50%,-50%)}to{transform:translate(-40%,-40%)}}

.mp-nav{position:fixed;top:0;left:0;right:0;z-index:200;padding:0 120px;height:64px;display:flex;justify-content:space-between;align-items:center;background:rgba(240,238,255,0.92);backdrop-filter:blur(20px);border-bottom:1px solid var(--mp-border);}
.mp-nav-logo{display:flex;align-items:center;gap:10px;font-family:var(--mp-font);font-size:18px;font-weight:800;cursor:none;transition:opacity .2s;}
.mp-nav-logo:hover{opacity:0.75;}
.mp-logo-pill{width:34px;height:34px;background:linear-gradient(135deg,var(--mp-a1),var(--mp-a2));border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:17px;box-shadow:0 4px 12px rgba(167,139,250,0.38);animation:mpLogoPulse 3s ease-in-out infinite;}
@keyframes mpLogoPulse{0%,100%{box-shadow:0 4px 12px rgba(167,139,250,0.38)}50%{box-shadow:0 4px 20px rgba(167,139,250,0.62)}}
.mp-nav-links{display:flex;gap:4px;}
.mp-nav-links button{padding:8px 20px;border-radius:50px;border:none;background:transparent;font-family:var(--mp-font);font-size:14px;font-weight:600;color:var(--mp-sub);cursor:none;transition:all .2s;}
.mp-nav-links button:hover{background:var(--mp-pill-l);color:var(--mp-pill);}
.mp-nav-actions{display:flex;gap:12px;align-items:center;}
.mp-btn-nav-ghost{padding:9px 22px;border-radius:50px;background:transparent;border:1.5px solid rgba(124,58,237,0.28);color:var(--mp-pill);font-size:14px;font-weight:600;cursor:none;transition:all .2s;font-family:var(--mp-font);}
.mp-btn-nav-ghost:hover{background:var(--mp-pill-l);}
.mp-btn-nav-pri{padding:9px 22px;border-radius:50px;background:linear-gradient(135deg,var(--mp-a1),#818cf8);border:none;color:#fff;font-size:14px;font-weight:600;cursor:none;box-shadow:0 4px 14px rgba(167,139,250,0.42);transition:all .2s;font-family:var(--mp-font);}
.mp-btn-nav-pri:hover{transform:translateY(-1px);box-shadow:0 6px 18px rgba(167,139,250,0.55);}
.mp-btn-nav-pri:active{transform:translateY(0) scale(0.97);}

.mp-fp-dots{position:fixed;right:28px;top:50%;transform:translateY(-50%);z-index:300;display:flex;flex-direction:column;gap:12px;}
.mp-fp-dot{width:8px;height:8px;border-radius:50%;background:rgba(124,58,237,0.25);cursor:pointer;transition:all .3s;border:1.5px solid rgba(124,58,237,0.3);}
.mp-fp-dot.active{background:var(--mp-pill);transform:scale(1.4);border-color:var(--mp-pill);}
.mp-fp-dot:hover{background:rgba(124,58,237,0.5);transform:scale(1.2);}

.mp-fp-container{position:fixed;top:0;left:0;width:100%;height:100%;z-index:2;transition:transform 0.9s cubic-bezier(0.77,0,0.175,1);}
.mp-fp-section{width:100%;height:100vh;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;}

#mp-sec-hero{display:flex;align-items:center;justify-content:center;padding:64px 120px 0;gap:0;max-width:1920px;margin:0 auto;width:100%;}
.mp-parallax-layer{position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:1;will-change:transform;transition:transform .1s linear;}
.mp-hero-blob{position:absolute;border-radius:50%;}
.mp-hero-blob-1{width:260px;height:260px;background:var(--mp-a1);opacity:0.08;top:12%;left:58%;}
.mp-hero-blob-2{width:180px;height:180px;background:var(--mp-a2);opacity:0.08;top:55%;right:7%;}

.mp-hero-left{flex:0 0 520px;padding-right:40px;position:relative;z-index:3;}
.mp-hero-badge{display:inline-flex;align-items:center;gap:8px;padding:7px 18px;border-radius:50px;background:rgba(255,255,255,0.85);border:1px solid var(--mp-border);font-size:13px;color:var(--mp-pill);font-weight:600;margin-bottom:28px;animation:mpFadeUp .8s ease both;}
.mp-badge-dot{width:7px;height:7px;border-radius:50%;background:var(--mp-a3);animation:mpBlink 2s ease-in-out infinite;}
@keyframes mpBlink{0%,100%{opacity:1}50%{opacity:0.3}}
.mp-hero-title{font-size:54px;font-weight:800;line-height:1.2;margin-bottom:20px;animation:mpFadeUp .8s .1s ease both;white-space:nowrap;color:var(--mp-text);letter-spacing:0.05em;}
.mp-grad{background:linear-gradient(135deg,var(--mp-a1),var(--mp-a2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.mp-hero-desc{font-size:16px;color:var(--mp-sub);line-height:1.85;margin-bottom:36px;font-weight:400;animation:mpFadeUp .8s .2s ease both;white-space:nowrap;}
.mp-hero-cta{display:flex;gap:14px;animation:mpFadeUp .8s .3s ease both;}
.mp-btn-hero{padding:14px 32px;border-radius:50px;background:linear-gradient(135deg,var(--mp-a1),#818cf8);border:none;color:#fff;font-size:15px;font-weight:700;cursor:none;box-shadow:0 6px 22px rgba(167,139,250,0.45);transition:all .25s;font-family:var(--mp-font);}
.mp-btn-hero:hover{transform:translateY(-2px);box-shadow:0 10px 30px rgba(167,139,250,0.6);}
.mp-btn-hero:active{transform:translateY(0) scale(0.97);}
.mp-btn-ghost-hero{padding:14px 28px;border-radius:50px;background:rgba(255,255,255,0.85);border:1px solid var(--mp-border);color:var(--mp-text);font-size:15px;font-weight:600;cursor:none;transition:all .25s;font-family:var(--mp-font);}
.mp-btn-ghost-hero:hover{background:#fff;transform:translateY(-1px);}
.mp-btn-ghost-hero:active{transform:translateY(0) scale(0.97);}

.mp-hero-right{flex:1;display:flex;align-items:center;justify-content:center;animation:mpFadeUp .8s .2s ease both;position:relative;z-index:3;}
.mp-cards-scene{width:500px;height:480px;position:relative;}
.mp-g-card{position:absolute;background:rgba(255,255,255,0.94);border:1px solid rgba(200,210,255,0.4);border-radius:22px;box-shadow:0 8px 32px rgba(80,100,200,0.10);padding:24px 26px;will-change:transform;transition:box-shadow .3s,transform .3s;overflow:hidden;}
.mp-g-card::before{content:'';position:absolute;inset:0;border-radius:22px;background:linear-gradient(135deg,rgba(255,255,255,0.55),rgba(255,255,255,0));pointer-events:none;z-index:0;}
.mp-g-card>*:not(.mp-light-spot){position:relative;z-index:1;}
.mp-light-spot{position:absolute;width:160px;height:160px;border-radius:50%;background:radial-gradient(circle,rgba(167,139,250,0.14),transparent 70%);pointer-events:none;opacity:0;transition:opacity .3s;transform:translate(-50%,-50%);z-index:0;}
.mp-g-card:hover .mp-light-spot{opacity:1;}
.mp-g-card:hover{box-shadow:0 24px 56px rgba(37,99,235,0.18);}

.mp-card-main{width:300px;top:50%;left:50%;transform:translate(-50%,-50%);z-index:1;animation:mpFloatM 5s ease-in-out infinite;box-shadow:0 16px 48px rgba(80,100,220,0.14);}
@keyframes mpFloatM{0%,100%{transform:translate(-50%,-50%) translateY(0)}50%{transform:translate(-50%,-50%) translateY(-14px)}}
.mp-card-warn{width:200px;top:3%;right:0;z-index:3;animation:mpFloatW 6s 0.8s ease-in-out infinite;transform:rotate(3deg);}
@keyframes mpFloatW{0%,100%{transform:rotate(3deg) translateY(0)}50%{transform:rotate(3deg) translateY(-12px)}}
.mp-card-search{width:210px;bottom:1%;left:0;z-index:3;animation:mpFloatS 5.5s 1.5s ease-in-out infinite;transform:rotate(-2deg);}
@keyframes mpFloatS{0%,100%{transform:rotate(-2deg) translateY(0)}50%{transform:rotate(-2deg) translateY(-12px)}}

.mp-card-label{font-size:13px;font-weight:700;margin-bottom:14px;color:var(--mp-text);display:flex;justify-content:space-between;align-items:center;}
.mp-card-date{font-size:12px;color:var(--mp-sub);font-weight:400;}
.mp-ring-area{display:flex;align-items:center;gap:14px;margin-bottom:16px;}
.mp-ring-pct{font-size:24px;font-weight:800;color:#2563eb;}
.mp-ring-lbl{font-size:12px;color:var(--mp-sub);margin-top:2px;}
.mp-pill-row{display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid rgba(200,210,255,0.2);font-size:13px;}
.mp-pill-row:last-of-type{border-bottom:none;}
.mp-pdot{width:9px;height:9px;border-radius:50%;flex-shrink:0;}
.mp-pill-time{margin-left:auto;font-size:11px;color:var(--mp-sub);}
.mp-pill-check{font-size:12px;margin-left:6px;color:#2563eb;}
.mp-warn-dot-row{display:flex;align-items:center;gap:6px;margin-bottom:8px;}
.mp-warn-live-dot{width:8px;height:8px;border-radius:50%;background:#ef4444;animation:mpBlink 1.5s ease-in-out infinite;}
.mp-warn-title{font-size:13px;font-weight:700;color:#ef4444;}
.mp-warn-body{font-size:12px;color:var(--mp-sub);line-height:1.6;margin-top:4px;}
.mp-warn-src{font-size:11px;color:#2563eb;font-weight:600;margin-top:8px;}
.mp-search-bar{display:flex;align-items:center;gap:7px;background:#f0f6ff;border-radius:8px;padding:9px 12px;font-size:12px;color:#94a3b8;margin-bottom:10px;}
.mp-search-icon{font-size:13px;}
.mp-search-result-item{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid rgba(200,210,255,0.2);font-size:12px;font-weight:500;}
.mp-search-result-item:last-child{border-bottom:none;}
.mp-search-badge{font-size:10px;font-weight:700;padding:2px 8px;border-radius:4px;}

.mp-scroll-hint{position:absolute;bottom:28px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:6px;color:var(--mp-sub);font-size:12px;font-weight:500;opacity:0.6;animation:mpFadeUp 1s 1s ease both;}
.mp-scroll-arrow{width:18px;height:18px;border-right:2px solid var(--mp-sub);border-bottom:2px solid var(--mp-sub);transform:rotate(45deg);animation:mpBounce 1.8s ease-in-out infinite;}
@keyframes mpBounce{0%,100%{transform:rotate(45deg) translateY(0)}50%{transform:rotate(45deg) translateY(5px)}}

.mp-sec-features{flex-direction:column;align-items:center;justify-content:center;padding:0 120px;background:rgba(255,255,255,0.22);}
.mp-sec-eyebrow{font-size:11px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:var(--mp-pill);margin-bottom:12px;opacity:0.7;}
.mp-sec-title{font-size:48px;font-weight:800;line-height:1.2;margin-bottom:10px;letter-spacing:0.1em;color:var(--mp-text);}
.mp-sec-sub{font-size:15px;color:var(--mp-sub);max-width:500px;margin:0 auto 44px;line-height:1.78;text-align:center;}
.mp-feat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;max-width:1200px;width:100%;}
.mp-feat-card{background:rgba(255,255,255,0.90);border:1.5px solid rgba(167,139,250,0.13);border-radius:20px;padding:32px 26px;box-shadow:var(--mp-sh);cursor:default;will-change:transform;position:relative;overflow:hidden;transition:transform .32s cubic-bezier(.34,1.56,.64,1),box-shadow .32s ease;}
.mp-feat-card:hover{transform:translateY(-8px) scale(1.02);box-shadow:0 20px 50px rgba(120,80,200,0.16);}
.mp-feat-card>*:not(.mp-light-spot){position:relative;z-index:1;}
.mp-feat-icon{width:54px;height:54px;border-radius:14px;display:flex;align-items:center;justify-content:center;margin-bottom:18px;}
.mp-feat-card h3{font-size:17px;font-weight:700;margin-bottom:9px;color:var(--mp-text);}
.mp-feat-card p{font-size:14px;color:var(--mp-sub);line-height:1.7;}
.mp-feat-tag{display:inline-block;margin-top:16px;padding:5px 14px;border-radius:50px;font-size:12px;font-weight:700;}

.mp-sec-how{gap:120px;padding:0 120px;align-items:center;}
.mp-how-left{flex:0 0 480px;}
.mp-steps-v{display:flex;flex-direction:column;gap:22px;}
.mp-step-v{display:flex;gap:20px;align-items:flex-start;}
.mp-step-v-num{width:46px;height:46px;border-radius:12px;background:linear-gradient(135deg,var(--mp-a1),#818cf8);color:#fff;display:flex;align-items:center;justify-content:center;font-size:17px;font-weight:800;flex-shrink:0;box-shadow:0 4px 12px rgba(167,139,250,0.35);transition:transform .25s,box-shadow .25s;}
.mp-step-v:hover .mp-step-v-num{transform:scale(1.1) rotate(-3deg);box-shadow:0 8px 22px rgba(167,139,250,0.45);}
.mp-step-v-text h4{font-size:16px;font-weight:700;margin-bottom:5px;}
.mp-step-v-text p{font-size:14px;color:var(--mp-sub);line-height:1.65;}
.mp-how-right{flex:1;max-width:540px;}
.mp-stats-box{background:rgba(255,255,255,0.92);border-radius:24px;padding:36px 40px;box-shadow:var(--mp-sh-lg);border:1px solid var(--mp-border);}
.mp-stat-row{display:flex;justify-content:space-between;margin-bottom:32px;}
.mp-stat-item{text-align:center;}
.mp-stat-n{font-size:32px;font-weight:800;color:var(--mp-pill);}
.mp-stat-l{font-size:12px;color:var(--mp-sub);margin-top:4px;font-weight:500;}
.mp-chart-label-row{font-size:13px;color:var(--mp-sub);margin-bottom:14px;font-weight:600;}
.mp-chart-bars{display:flex;gap:8px;align-items:flex-end;height:140px;}
.mp-bar{flex:1;border-radius:6px 6px 0 0;background:linear-gradient(180deg,var(--mp-a1),#818cf8);opacity:0.65;transition:opacity .3s,height .6s ease;}
.mp-bar:hover{opacity:1;}
.mp-chart-days{display:flex;gap:8px;margin-top:10px;}
.mp-chart-day{flex:1;text-align:center;font-size:12px;color:var(--mp-sub);}

.mp-sec-cta{flex-direction:column;gap:0;}
.mp-cta-inner{width:clamp(480px,34.9vw,670px);height:clamp(440px,57.1vh,617px);background:rgba(255,255,255,0.92);border:0.89px solid rgba(167,139,250,0.18);border-radius:30px;box-shadow:0 16px 48px rgba(120,80,200,0.14);position:relative;overflow:hidden;transition:transform .35s,box-shadow .35s;}
.mp-cta-inner:hover{transform:translateY(-4px);box-shadow:0 24px 64px rgba(120,80,200,0.22);}
.mp-cta-top-bar{position:absolute;top:0;left:0;width:100%;height:6px;background:linear-gradient(90deg,rgba(167,139,250,1) 0%,rgba(249,168,212,1) 50%,rgba(110,231,183,1) 100%);}
.mp-cta-title{position:absolute;top:8.8%;left:50%;transform:translateX(-50%);width:90%;text-align:center;font-size:clamp(28px,2.9vw,56px);font-weight:800;letter-spacing:0.1em;color:#1a1433;white-space:nowrap;font-family:var(--mp-font);}
.mp-cta-qr-img{position:absolute;top:50%;left:50%;transform:translate(-50%,-58%);width:clamp(140px,12.5vw,240px);height:clamp(140px,12.5vw,240px);display:flex;align-items:center;justify-content:center;}
.mp-cta-qr-img svg{width:100%;height:100%;}
.mp-cta-qr-label{position:absolute;top:59%;left:50%;transform:translateX(-50%);font-size:clamp(14px,1.25vw,24px);font-weight:700;color:#1a1433;white-space:nowrap;text-align:center;font-family:var(--mp-font);}
.mp-cta-qr-desc1{position:absolute;top:66.6%;left:50%;transform:translateX(-50%);font-size:clamp(12px,1.04vw,20px);font-weight:400;color:#6b5f8a;white-space:nowrap;text-align:center;font-family:var(--mp-font);}
.mp-cta-qr-desc2{position:absolute;top:71.3%;left:50%;transform:translateX(-50%);font-size:clamp(12px,1.04vw,20px);font-weight:400;color:#6b5f8a;white-space:nowrap;text-align:center;font-family:var(--mp-font);}
.mp-cta-btn-row{position:absolute;top:82.3%;left:50%;transform:translateX(-50%);display:flex;gap:14px;align-items:center;white-space:nowrap;}
.mp-btn-cta{width:clamp(160px,14vw,269px);height:clamp(40px,3.5vh,54px);border-radius:50px;background:linear-gradient(135deg,rgba(167,139,250,1),rgba(129,140,248,1));border:none;color:#fff;font-size:clamp(13px,1.25vw,24px);font-weight:700;cursor:none;box-shadow:0 6px 24px rgba(167,139,250,0.45);transition:all .25s;font-family:var(--mp-font);display:flex;align-items:center;justify-content:center;}
.mp-btn-cta:hover{transform:translateY(-2px);box-shadow:0 10px 32px rgba(167,139,250,0.6);}
.mp-btn-cta:active{transform:translateY(0) scale(0.97);}
.mp-btn-cta-g{width:clamp(100px,8.8vw,169px);height:clamp(40px,3.5vh,54px);border-radius:50px;background:transparent;border:0.89px solid rgba(124,58,237,0.28);color:#7c3aed;font-size:clamp(13px,1.25vw,24px);font-weight:600;cursor:none;transition:all .25s;font-family:var(--mp-font);display:flex;align-items:center;justify-content:center;}
.mp-btn-cta-g:hover{background:var(--mp-pill-l);transform:translateY(-1px);}
.mp-btn-cta-g:active{transform:translateY(0) scale(0.97);}

.mp-fp-footer{position:absolute;bottom:0;left:0;right:0;height:62px;padding:0 120px;display:flex;justify-content:center;align-items:center;font-size:14px;color:#6b5f8a;background:rgba(240,238,255,0.70);}
.mp-fp-footer p{position:absolute;left:50%;transform:translateX(-50%);font-size:14px;color:#6b5f8a;white-space:nowrap;}
.mp-footer-link-wrap{position:absolute;right:120px;display:flex;gap:18px;}
.mp-footer-link{color:#6b5f8a;text-decoration:none;font-size:14px;}
.mp-footer-link:hover{color:var(--mp-pill);}

@keyframes mpFadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
`;