import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

/*
  MediPocket — Service Page
  섹션1: APP INTRO      (TxtBlockRevealOn + VisBlockRevealL)
  섹션2: 복약관리 앱     (TxtBlockRevealOn + AppScreens)
  섹션3: DUR 안전        (TxtBlockRevealOn + DurVisual)
  섹션4: WHY MEDIPOCKET  (WhyLeftRevealOn + WhyRightRevealL)

  모션: 랜딩페이지와 동일
  - 풀페이지 휠/터치/키보드 스크롤
  - 커스텀 커서 + 커서링
  - mesh-bg 떠다니는 블롭
  - TiltCard (카드 3D 기울기)
  - 섹션 도트 네비게이션
  - hover lift / light-spot
*/

const SECTIONS = ["intro", "app", "dur", "why"];

export default function ServicePage() {
  const navigate = useNavigate();

  const [current, setCurrent]         = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [cursor, setCursor]           = useState({ x: -200, y: -200 });
  const [lightPos, setLightPos]       = useState({ x: -200, y: -200 });
  const ringPos    = useRef({ x: -200, y: -200 });
  const [ring, setRing]               = useState({ x: -200, y: -200 });
  const rafRef     = useRef(null);
  const wheelTimer = useRef(null);
  const touchY     = useRef(0);

  /* ── 커서 ── */
  useEffect(() => {
    const onMove = (e) => {
      setCursor({ x: e.clientX, y: e.clientY });
      setLightPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  /* ── 커서링 부드럽게 ── */
  useEffect(() => {
    const animate = () => {
      ringPos.current.x += (cursor.x - ringPos.current.x) * 0.14;
      ringPos.current.y += (cursor.y - ringPos.current.y) * 0.14;
      setRing({ x: ringPos.current.x, y: ringPos.current.y });
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [cursor]);

  /* ── 페이지 이동 ── */
  const goTo = useCallback((idx) => {
    if (idx < 0 || idx >= SECTIONS.length) return;
    setCurrent(idx);
  }, []);

  /* ── 휠 ── */
  useEffect(() => {
    const onWheel = (e) => {
      e.preventDefault();
      if (isScrolling) return;
      setIsScrolling(true);
      goTo(current + (e.deltaY > 0 ? 1 : -1));
      clearTimeout(wheelTimer.current);
      wheelTimer.current = setTimeout(() => setIsScrolling(false), 950);
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [current, isScrolling, goTo]);

  /* ── 터치 ── */
  useEffect(() => {
    const onStart = (e) => { touchY.current = e.touches[0].clientY; };
    const onEnd   = (e) => {
      if (isScrolling) return;
      const d = touchY.current - e.changedTouches[0].clientY;
      if (Math.abs(d) < 50) return;
      setIsScrolling(true);
      goTo(current + (d > 0 ? 1 : -1));
      setTimeout(() => setIsScrolling(false), 950);
    };
    window.addEventListener("touchstart", onStart);
    window.addEventListener("touchend",   onEnd);
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
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

  return (
    <>
      <style>{CSS}</style>

      {/* 커서 */}
      <div className="sp-cursor"       style={{ left: cursor.x,   top: cursor.y   }} />
      <div className="sp-cursor-ring"  style={{ left: ring.x,     top: ring.y     }} />
      <div className="sp-light-follow" style={{ left: lightPos.x, top: lightPos.y }} />

      {/* Mesh BG */}
      <div className="sp-mesh-bg"><div className="sp-blob3" /></div>

      {/* ── NAV ── */}
      <nav className="sp-nav">
        {/* 로고 → 랜딩페이지 */}
        <div
          className="sp-nav-logo"
          onClick={() => navigate("/")}
          style={{ cursor: "none" }}
        >
          <div className="sp-logo-pill">💊</div>
          MediPocket
        </div>

        {/* 섹션 이동 링크 */}
        <div className="sp-nav-links">
          <button onClick={() => goTo(0)}>앱 소개</button>
          <button onClick={() => goTo(1)}>복약관리</button>
          <button onClick={() => goTo(2)}>안전검사</button>
          <button onClick={() => goTo(3)}>왜 메디포켓?</button>
        </div>

        {/* 우측 액션 버튼 */}
        <div className="sp-nav-actions">
          {/* 로그인 → 로그인 페이지 */}
          <button
            className="sp-btn-ghost"
            onClick={() => navigate("/login")}
          >
            로그인
          </button>
          {/* 무료로 시작 → 홈 */}
          <button
            className="sp-btn-pri"
            onClick={() => navigate("/app/home")}
          >
            무료로 시작
          </button>
        </div>
      </nav>

      {/* 섹션 도트 */}
      <div className="sp-fp-dots">
        {SECTIONS.map((_, i) => (
          <div
            key={i}
            className={`sp-fp-dot${current === i ? " active" : ""}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>

      {/* 풀페이지 컨테이너 */}
      <div
        className="sp-fp-container"
        style={{ transform: `translateY(-${current * 100}vh)` }}
      >

        {/* ══════════════════════════════════════
            섹션1 — APP INTRO
            배경: #fafbff  |  좌:텍스트  우:폰모크업
        ══════════════════════════════════════ */}
        <section className="sp-fp-section sp-sec-intro">
          {/* mesh blob */}
          <div className="sp-sec-mesh">
            <div className="sp-blob-tl" /><div className="sp-blob-br" />
          </div>

          {/* 좌 — TxtBlockRevealOn */}
          <div className="sp-sec-left sp-anim-in">
            <div className="sp-sec-label">
              <div className="sp-label-bar" />
              <span>APP INTRO</span>
            </div>
            <div className="sp-sec-heading">
              <div className="sp-heading-plain">내 손안의</div>
              <div className="sp-heading-grad">스마트 복약 관리</div>
            </div>
            <div className="sp-sec-desc">
              <p>MediPocket은 처방약부터 건강기능식품까지,</p>
              <p>복용하는 모든 약을 한 화면에서 안전하게 관리합니다.</p>
              <p>AI가 실시간으로 위험 조합을 감지하고 알려드려요.</p>
            </div>
            <div className="sp-sec-chips">
              <div className="sp-chip sp-chip-purple sp-chip-1">💊 복약 스케줄</div>
              <div className="sp-chip sp-chip-purple sp-chip-2">! 병용금기 경고</div>
              <div className="sp-chip sp-chip-purple sp-chip-3">📋 의료진 공유</div>
              <div className="sp-chip sp-chip-purple sp-chip-4">🔍 약 정보 검색</div>
            </div>
          </div>

          {/* 우 — VisBlockRevealL */}
          <div className="sp-sec-right sp-anim-in-delay">
            <div className="sp-vis-block">
              <div className="sp-phone-glow" />

              <div className="sp-phone-mockup">
                <div className="sp-phone-screen">
                  <div className="sp-ps-notch" />
                  <div className="sp-ps-screen-title">👋 안녕하세요, 김민지님</div>

                  <div className="sp-ps-card">
                    <div className="sp-ps-card-sub">오늘의 복약 달성률</div>
                    <div className="sp-ps-card-val">50% 완료 🎯</div>
                    <div className="sp-ps-prog">
                      <div className="sp-ps-prog-fill" style={{ width: "50%" }} />
                    </div>
                  </div>

                  <div className="sp-ps-card sp-ps-card-2">
                    <div className="sp-ps-card-sub">복용 중인 약</div>
                    <div className="sp-ps-pills-row">
                      <div className="sp-ps-pill sp-pill-purple">타이레놀</div>
                      <div className="sp-ps-pill sp-pill-green">오메가3</div>
                      <div className="sp-ps-pill sp-pill-pink">칼슘제</div>
                    </div>
                  </div>

                  <div className="sp-ps-alert">
                    ! 병용 주의 1건 확인하기 →
                  </div>
                </div>
              </div>

              <div className="sp-badge-float-top">
                <div className="sp-badge-title">✅ 오늘 복약 완료</div>
                <div className="sp-badge-sub">타이레놀 · 오메가3</div>
              </div>
              <div className="sp-badge-float-bottom">
                <div className="sp-badge-title">🔔 저녁 8시 복약 알림</div>
                <div className="sp-badge-sub">칼슘제 · 비타민D</div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            섹션2 — 앱 화면 (AppScreens)
            배경: #f4f6ff  |  좌:텍스트  우:3개 앱스크린
        ══════════════════════════════════════ */}
        <section className="sp-fp-section sp-sec-app">
          <div className="sp-sec-left sp-anim-in">
            <div className="sp-sec-label">
              <div className="sp-label-bar" />
              <span>APP SCREENS</span>
            </div>
            <div className="sp-sec-heading">
              <div className="sp-heading-plain">복약 관리의</div>
              <div className="sp-heading-grad">모든 것, 한 앱에</div>
            </div>
            <div className="sp-sec-desc">
              <p>스케줄 관리부터 병용금기 경고까지,</p>
              <p>복약에 필요한 모든 기능을 담았습니다.</p>
            </div>
          </div>

          <div className="sp-sec-right sp-anim-in-delay">
            <div className="sp-app-screens">
              <TiltCard className="sp-app-screen sp-app-tall">
                <div className="sp-as-bar sp-bar-purple" />
                <div className="sp-as-body">
                  <div className="sp-as-item">
                    <div className="sp-as-item-title">💊 오늘의 복약</div>
                    <div className="sp-as-item-sub">달성률 50%</div>
                    <div className="sp-as-tag sp-tag-purple">3개 복약 중</div>
                  </div>
                  <div className="sp-as-item">
                    <div className="sp-as-item-title">! 경고 1건</div>
                    <div className="sp-as-item-sub">병용금기 확인 필요</div>
                    <div className="sp-as-tag sp-tag-red">즉시 확인</div>
                  </div>
                  <div className="sp-as-item">
                    <div className="sp-as-item-title">🔔 다음 알림</div>
                    <div className="sp-as-item-sub">저녁 8시</div>
                    <div className="sp-as-tag sp-tag-green">설정됨</div>
                  </div>
                </div>
              </TiltCard>

              <TiltCard className="sp-app-screen sp-app-mid">
                <div className="sp-as-bar sp-bar-pink" />
                <div className="sp-as-body">
                  <div className="sp-as-item">
                    <div className="sp-as-item-title">🔍 약 검색</div>
                    <div className="sp-as-item-sub">타이레놀 500mg</div>
                  </div>
                  <div className="sp-as-item">
                    <div className="sp-as-item-title">📋 상세 정보</div>
                    <div className="sp-as-item-sub">효능 · 용법 · 주의사항</div>
                  </div>
                  <div className="sp-as-item">
                    <div className="sp-as-item-title">🤖 AI 설명</div>
                    <div className="sp-as-item-sub">쉬운 말로 설명</div>
                  </div>
                </div>
              </TiltCard>

              <TiltCard className="sp-app-screen sp-app-short">
                <div className="sp-as-bar sp-bar-green" />
                <div className="sp-as-body">
                  <div className="sp-as-item">
                    <div className="sp-as-item-title">📅 스케줄</div>
                    <div className="sp-as-item-sub">아침 · 점심 · 저녁</div>
                  </div>
                  <div className="sp-as-item">
                    <div className="sp-as-item-title">📊 이력</div>
                    <div className="sp-as-item-sub">주간 달성률</div>
                  </div>
                </div>
              </TiltCard>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            섹션3 — DUR 안전 (DurVisual)
            배경: #fafbff  |  좌:텍스트  우:DUR카드
        ══════════════════════════════════════ */}
        <section className="sp-fp-section sp-sec-dur">
          <div className="sp-sec-left sp-anim-in">
            <div className="sp-sec-label">
              <div className="sp-label-bar" />
              <span>DUR SAFETY</span>
            </div>
            <div className="sp-sec-heading">
              <div className="sp-heading-plain">위험한 조합,</div>
              <div className="sp-heading-grad">AI가 먼저 알려요</div>
            </div>
            <div className="sp-sec-desc">
              <p>식약처 공인 DUR 공공데이터를 기반으로</p>
              <p>130,000건 이상의 병용금기 정보를 실시간으로 검사합니다.</p>
              <p>약을 등록하는 순간, 즉시 경고가 울립니다.</p>
            </div>
            <div className="sp-chips sp-chips-row">
              <div className="sp-chip sp-chip-red">⛔ 병용금기</div>
              <div className="sp-chip sp-chip-yellow">! 주의 조합</div>
              <div className="sp-chip sp-chip-green2">✅ 복용 가능</div>
            </div>
            <div className="sp-evidence-box">
              <span className="sp-ev-icon">💡</span>
              <p>
                <strong>근거카드</strong>를 통해 "왜 위험한지" 출처와 함께 설명합니다.<br />
                의사·약사에게 바로 공유할 수 있어요.
              </p>
            </div>
          </div>

          <div className="sp-sec-right sp-anim-in-delay">
            <div className="sp-dur-visual">
              <TiltCard className="sp-dur-card">
                <div className="sp-dur-header">
                  <span className="sp-dur-header-title">! &nbsp;병용금기 검사 결과</span>
                  <span className="sp-dur-badge sp-dur-badge-red">주의 필요</span>
                </div>
                <div className="sp-dur-pair">
                  <span className="sp-dur-drug">칼슘제</span>
                  <span className="sp-dur-arrow">4시간 간격 필요</span>
                  <span className="sp-dur-drug">레보티록신</span>
                </div>
                <div className="sp-dur-pair">
                  <span className="sp-dur-drug">아스피린</span>
                  <span className="sp-dur-arrow">출혈 위험</span>
                  <span className="sp-dur-drug">와파린</span>
                </div>
                <div className="sp-dur-footer sp-dur-footer-red">
                  📌&nbsp;&nbsp;DUR 공공데이터 기반 · 1등급 금기
                </div>
              </TiltCard>

              <TiltCard className="sp-dur-card sp-dur-card-ok">
                <div className="sp-dur-header">
                  <span className="sp-dur-header-title">✅&nbsp;&nbsp;복용 가능한 조합</span>
                  <span className="sp-dur-badge sp-dur-badge-green">안전</span>
                </div>
                <div className="sp-dur-pair">
                  <span className="sp-dur-drug">오메가3</span>
                  <span className="sp-dur-arrow">상호작용 없음</span>
                  <span className="sp-dur-drug">타이레놀</span>
                </div>
                <div className="sp-dur-footer sp-dur-footer-green">
                  ✓&nbsp;&nbsp;동시 복용 가능
                </div>
              </TiltCard>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            섹션4 — WHY MEDIPOCKET
        ══════════════════════════════════════ */}
        <section className="sp-fp-section sp-sec-why">

          <div className="sp-why-left-block sp-anim-in">
            <div className="wl-label">
              <div className="wl-label-bar" />
              <span className="wl-label-txt">WHY MEDIPOCKET</span>
            </div>

            <div className="wl-title">
              <div className="wl-title-plain">MediPocket을</div>
              <div className="wl-title-grad">사용해야 하는 이유</div>
            </div>

            <div className="wl-desc">
              <p className="wl-desc-1">단순한 복약 알림 앱이 아닙니다.</p>
              <p className="wl-desc-2">공식 데이터 기반의 안전 관리 플랫폼입니다.</p>
            </div>

            <div className="wl-stats">
              <div className="wl-stat-frame wl-stat-1">
                <div className="wl-stat-n">44K+</div>
                <div className="wl-stat-l">등록 의약품</div>
              </div>
              <div className="wl-stat-frame wl-stat-2">
                <div className="wl-stat-n">130K+</div>
                <div className="wl-stat-l">DUR 경고 데이터</div>
              </div>
              <div className="wl-stat-frame wl-stat-3">
                <div className="wl-stat-n">266K+</div>
                <div className="wl-stat-l">AI 학습 데이터</div>
              </div>
            </div>
          </div>

          <div className="sp-why-right-block sp-anim-in-delay">
            <div className="wr-card wr-c1">
              <div className="wr-bar" style={{ background: "linear-gradient(90deg,#a78bfa,#818cf8)" }} />
              <div className="wr-num">01</div>
              <div className="wr-icon">🛡</div>
              <div className="wr-title">공식 데이터로 안전하게</div>
              <p className="wr-desc">식약처 DUR 공공데이터와 의약품 허가 정보를<br />기반으로 검증된 경고만 제공합니다.<br />근거 없는 알림은 없어요.</p>
            </div>

            <div className="wr-card wr-c2">
              <div className="wr-bar" style={{ background: "linear-gradient(90deg,#f9a8d4,#a78bfa)" }} />
              <div className="wr-num">02</div>
              <div className="wr-icon">🤖</div>
              <div className="wr-title">AI가 쉽게 설명</div>
              <p className="wr-desc">어려운 의학 용어를 AI가 쉬운 말로 풀어줍니다.<br />RAG 기술로 정확한 근거를 찾아 설명해드려요.</p>
            </div>

            <div className="wr-card wr-c3">
              <div className="wr-bar" style={{ background: "linear-gradient(90deg,#6ee7b7,#2563eb)" }} />
              <div className="wr-num">03</div>
              <div className="wr-icon">📸</div>
              <div className="wr-title">사진 한 장으로 등록</div>
              <p className="wr-desc">알약 사진을 찍으면 AI가 약을 인식하고<br />자동으로 등록합니다.<br />각인 문자까지 읽어드려요.</p>
            </div>

            <div className="wr-card wr-c4">
              <div className="wr-bar" style={{ background: "linear-gradient(90deg,#fcd34d,#f9a8d4)" }} />
              <div className="wr-num">04</div>
              <div className="wr-icon">🔒</div>
              <div className="wr-title">내 정보는 내가 관리</div>
              <p className="wr-desc">민감한 건강 정보는 별도 동의로 보호합니다.<br />의료진 공유도 내가 선택한 항목만 공개해요.</p>
            </div>

            <div className="wr-card wr-c5">
              <div className="wr-bar" style={{ background: "linear-gradient(90deg,#818cf8,#6ee7b7)" }} />
              <div className="wr-num">05</div>
              <div className="wr-icon">👨‍⚕️</div>
              <div className="wr-title">의료진과 즉시 공유</div>
              <p className="wr-desc">QR코드 하나로 복약 목록을 의사·약사와 공유합니다.<br />만료 시간 설정으로 안전하게 관리해요.</p>
            </div>

            <div className="wr-card wr-c6">
              <div className="wr-bar" style={{ background: "linear-gradient(90deg,#f9a8d4,#fcd34d)" }} />
              <div className="wr-num">06</div>
              <div className="wr-icon">🆓</div>
              <div className="wr-title">완전 무료</div>
              <p className="wr-desc">핵심 기능 모두 무료입니다. 복잡한 설정 없이<br />3분이면 시작할 수 있어요.</p>
            </div>
          </div>
        </section>

      </div>{/* /sp-fp-container */}
    </>
  );
}

/* ── TiltCard ── */
function TiltCard({ className, children, style }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current; if (!el) return;
    const r  = el.getBoundingClientRect();
    const cx = (e.clientX - r.left) / r.width  - 0.5;
    const cy = (e.clientY - r.top)  / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${cx * 12}deg) rotateX(${-cy * 8}deg) scale(1.02)`;
    el.style.boxShadow = `${-cx * 12}px ${cy * 12}px 28px rgba(120,80,200,0.16)`;
    const spot = el.querySelector(".sp-light-spot");
    if (spot) {
      spot.style.left = (e.clientX - r.left) + "px";
      spot.style.top  = (e.clientY - r.top)  + "px";
    }
  };
  const onLeave = () => {
    const el = ref.current;
    if (el) { el.style.transform = ""; el.style.boxShadow = ""; }
  };
  return (
    <div ref={ref} className={className} style={style} onMouseMove={onMove} onMouseLeave={onLeave}>
      <div className="sp-light-spot" />
      {children}
    </div>
  );
}

/* ════════════════════════════════════════════
   CSS
════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Noto+Sans+KR:wght@400;500;700&display=swap');

*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
:root{
  --sp-bg1:#fafbff; --sp-bg2:#f4f6ff;
  --sp-a1:#a78bfa;  --sp-a2:#f9a8d4; --sp-a3:#6ee7b7;
  --sp-pill:#7c3aed; --sp-pill-l:#ede9fe;
  --sp-text:#1a1433; --sp-sub:#6b7280;
  --sp-border:rgba(167,139,250,0.18);
  --sp-sh:0 4px 20px rgba(120,80,200,0.08);
  --sp-sh-lg:0 16px 48px rgba(120,80,200,0.14);
  --sp-font:'Plus Jakarta Sans','Noto Sans KR',sans-serif;
}
html,body{width:100%;height:100%;overflow:hidden;cursor:none;}
body{font-family:var(--sp-font);background:var(--sp-bg1);color:var(--sp-text);}
@media(prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;transition-duration:.01ms!important;}}

/* ── CURSOR ── */
.sp-cursor{width:10px;height:10px;border-radius:50%;background:var(--sp-a1);position:fixed;z-index:9999;pointer-events:none;transform:translate(-50%,-50%);mix-blend-mode:multiply;}
.sp-cursor-ring{width:32px;height:32px;border-radius:50%;border:1px solid var(--sp-a1);position:fixed;z-index:9998;pointer-events:none;transform:translate(-50%,-50%);opacity:0.4;}
.sp-light-follow{width:360px;height:360px;border-radius:50%;background:radial-gradient(circle,rgba(167,139,250,.09),transparent 65%);position:fixed;z-index:1;pointer-events:none;transform:translate(-50%,-50%);transition:left .18s,top .18s;}

/* ── MESH BG ── */
.sp-mesh-bg{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden;}
.sp-mesh-bg::before{content:'';position:absolute;width:800px;height:800px;top:-180px;left:-180px;background:radial-gradient(circle,rgba(167,139,250,.28) 0%,transparent 65%);animation:spDrift1 13s ease-in-out infinite alternate;}
.sp-mesh-bg::after{content:'';position:absolute;width:600px;height:600px;bottom:-120px;right:-100px;background:radial-gradient(circle,rgba(249,168,212,.28) 0%,transparent 65%);animation:spDrift2 16s ease-in-out infinite alternate;}
.sp-blob3{position:absolute;width:480px;height:480px;top:40%;left:50%;transform:translate(-50%,-50%);background:radial-gradient(circle,rgba(110,231,183,.2) 0%,transparent 65%);animation:spDrift3 19s ease-in-out infinite alternate;}
@keyframes spDrift1{from{transform:translate(0,0)}to{transform:translate(70px,55px)}}
@keyframes spDrift2{from{transform:translate(0,0)}to{transform:translate(-55px,38px)}}
@keyframes spDrift3{from{transform:translate(-50%,-50%)}to{transform:translate(-42%,-42%)}}

/* ── NAV ── */
.sp-nav{position:fixed;top:0;left:0;right:0;z-index:200;padding:0 80px;height:64px;display:flex;justify-content:space-between;align-items:center;background:rgba(240,238,255,.92);backdrop-filter:blur(20px);border-bottom:1px solid var(--sp-border);}
.sp-nav-logo{display:flex;align-items:center;gap:10px;font-size:18px;font-weight:800;cursor:none;transition:opacity .2s;}
.sp-nav-logo:hover{opacity:0.75;}
.sp-logo-pill{width:34px;height:34px;background:linear-gradient(135deg,var(--sp-a1),var(--sp-a2));border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:17px;box-shadow:0 4px 12px rgba(167,139,250,.38);animation:spLogoPulse 3s ease-in-out infinite;}
@keyframes spLogoPulse{0%,100%{box-shadow:0 4px 12px rgba(167,139,250,.38)}50%{box-shadow:0 4px 20px rgba(167,139,250,.62)}}
.sp-nav-links{display:flex;gap:4px;}
.sp-nav-links button{padding:8px 18px;border-radius:50px;border:none;background:transparent;font-family:var(--sp-font);font-size:14px;font-weight:600;color:var(--sp-sub);cursor:none;transition:all .2s;}
.sp-nav-links button:hover{background:var(--sp-pill-l);color:var(--sp-pill);}
.sp-nav-actions{display:flex;gap:12px;align-items:center;}
.sp-btn-ghost{padding:9px 20px;border-radius:50px;background:transparent;border:1.5px solid rgba(124,58,237,.28);color:var(--sp-pill);font-size:14px;font-weight:600;cursor:none;transition:all .2s;font-family:var(--sp-font);}
.sp-btn-ghost:hover{background:var(--sp-pill-l);}
.sp-btn-pri{padding:9px 20px;border-radius:50px;background:linear-gradient(135deg,var(--sp-a1),#818cf8);border:none;color:#fff;font-size:14px;font-weight:600;cursor:none;box-shadow:0 4px 14px rgba(167,139,250,.42);transition:all .2s;font-family:var(--sp-font);}
.sp-btn-pri:hover{transform:translateY(-1px);box-shadow:0 6px 18px rgba(167,139,250,.55);}
.sp-btn-pri:active{transform:scale(.97);}

/* ── DOTS ── */
.sp-fp-dots{position:fixed;right:28px;top:50%;transform:translateY(-50%);z-index:300;display:flex;flex-direction:column;gap:12px;}
.sp-fp-dot{width:8px;height:8px;border-radius:50%;background:rgba(124,58,237,.25);cursor:pointer;transition:all .3s;border:1.5px solid rgba(124,58,237,.3);}
.sp-fp-dot.active{background:var(--sp-pill);transform:scale(1.4);border-color:var(--sp-pill);}
.sp-fp-dot:hover{background:rgba(124,58,237,.5);transform:scale(1.2);}

/* ── FULL PAGE ── */
.sp-fp-container{position:fixed;top:0;left:0;width:100%;height:100%;z-index:2;transition:transform .9s cubic-bezier(.77,0,.175,1);}
.sp-fp-section{width:100%;height:100vh;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;}

/* ── 공통 섹션 레이아웃 ── */
.sp-sec-intro{background:var(--sp-bg1);gap:80px;padding:64px 80px 0;}
.sp-sec-app  {background:var(--sp-bg2);gap:80px;padding:64px 80px 0;}
.sp-sec-dur  {background:var(--sp-bg1);gap:80px;padding:64px 80px 0;}

.sp-sec-mesh{position:absolute;inset:0;pointer-events:none;}
.sp-blob-tl{position:absolute;width:500px;height:500px;top:-150px;left:-150px;background:radial-gradient(circle,rgba(167,139,250,.12) 0%,transparent 65%);}
.sp-blob-br{position:absolute;width:400px;height:400px;bottom:-100px;right:-80px;background:radial-gradient(circle,rgba(249,168,212,.12) 0%,transparent 65%);}

/* 좌/우 블록 */
.sp-sec-left{flex:0 0 520px;display:flex;flex-direction:column;gap:0;position:relative;z-index:3;}
.sp-sec-right{flex:1;display:flex;align-items:center;justify-content:center;position:relative;z-index:3;}

/* 진입 애니메이션 */
.sp-anim-in{animation:spFadeUp .8s ease both;}
.sp-anim-in-delay{animation:spFadeUp .8s .15s ease both;}
@keyframes spFadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}

/* ── 공통 텍스트 블록 ── */
.sp-sec-label{display:flex;align-items:center;gap:10px;margin-bottom:18px;}
.sp-label-bar{width:28px;height:3px;background:var(--sp-a1);border-radius:2px;flex-shrink:0;}
.sp-sec-label span{color:var(--sp-pill);font-size:13px;font-weight:700;letter-spacing:3px;text-transform:uppercase;opacity:.75;}

.sp-sec-heading{margin-bottom:20px;}
.sp-heading-plain{font-size:clamp(32px,3vw,60px);font-weight:800;letter-spacing:.08em;color:var(--sp-text);line-height:1.2;}
.sp-heading-grad{font-size:clamp(32px,3vw,60px);font-weight:800;letter-spacing:.08em;line-height:1.2;background:linear-gradient(135deg,var(--sp-a1),var(--sp-a2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}

.sp-sec-desc{margin-bottom:28px;}
.sp-sec-desc p{font-size:clamp(14px,1.2vw,22px);color:var(--sp-sub);line-height:1.85;font-weight:400;}

/* ── 칩 ── */
.sp-sec-chips{position:relative;height:123px;margin-top:28px;width:100%;}
.sp-chip{position:absolute;display:flex;align-items:center;justify-content:center;height:54px;border-radius:75px;font-size:clamp(14px,1.1vw,20px);font-weight:600;border:2px solid;transition:transform .2s,box-shadow .2s;white-space:nowrap;}
.sp-chip:hover{transform:translateY(-2px);box-shadow:0 6px 16px rgba(120,80,200,.15);}
.sp-chip-purple{background:#ffffffe6;border-color:rgba(167,139,250,.3);color:var(--sp-pill);}
.sp-chip-1{left:0;width:25.45%;top:0;}
.sp-chip-2{left:27.57%;width:27.99%;top:0;}
.sp-chip-3{left:0;width:25.45%;top:69px;}
.sp-chip-4{left:27.57%;width:26.22%;top:69px;}
.sp-chips-row{display:flex;flex-wrap:nowrap;gap:10px;margin-top:24px;}
.sp-chips-row .sp-chip{position:static;height:54px;padding:0 20px;}
.sp-chip-red{background:#fff5f5;border-color:rgba(239,68,68,.25);color:#ef4444;}
.sp-chip-yellow{background:#fffbeb;border-color:rgba(217,119,6,.25);color:#d97706;}
.sp-chip-green2{background:#f0fdf4;border-color:rgba(5,150,105,.2);color:#059669;}

/* 근거카드 박스 */
.sp-evidence-box{display:flex;gap:14px;align-items:flex-start;background:rgba(167,139,250,.07);border:1px solid rgba(167,139,250,.15);border-radius:16px;padding:18px 20px;margin-top:24px;}
.sp-ev-icon{font-size:22px;flex-shrink:0;}
.sp-evidence-box p{font-size:clamp(13px,1vw,18px);color:var(--sp-sub);line-height:1.75;}
.sp-evidence-box strong{color:var(--sp-sub);font-weight:700;}

/* ── 공통 카드 ── */
.sp-light-spot{position:absolute;width:150px;height:150px;border-radius:50%;background:radial-gradient(circle,rgba(167,139,250,.13),transparent 70%);pointer-events:none;opacity:0;transition:opacity .3s;transform:translate(-50%,-50%);z-index:0;}
.sp-dur-card:hover .sp-light-spot,.sp-app-screen:hover .sp-light-spot{opacity:1;}

/* ═════════════════
   섹션1 — 폰 목업
════════════════ */
.sp-vis-block{position:relative;width:711px;height:468px;}
.sp-phone-glow{position:absolute;width:450px;height:450px;top:calc(50% - 225px);left:calc(50% - 225px);background:radial-gradient(50% 50% at 50% 50%,rgba(167,139,250,.22) 0%,transparent 65%);border-radius:225px;pointer-events:none;}
.sp-phone-mockup{position:absolute;top:calc(50% - 237px);left:calc(50% - 195px);width:390px;height:468px;background:linear-gradient(145deg,#1a1433,#2d1b69);border:1px solid rgba(255,255,255,.07);border-radius:60px;box-shadow:0 60px 120px rgba(100,60,200,.38);display:flex;overflow:hidden;animation:spPhoneFloat 5s ease-in-out infinite;}
@keyframes spPhoneFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
.sp-phone-screen{background:#f4f6ff;border-radius:45px;flex:1;margin:19px 4.98%;display:flex;flex-direction:column;overflow:hidden;}
.sp-ps-notch{background:rgba(0,0,0,.08);border-radius:4.5px;height:7.5px;margin:30px 35.09% 0;flex-shrink:0;}
.sp-ps-screen-title{color:#1a1433;font-size:13.5px;font-weight:700;margin:24px 0 0 6.82%;flex-shrink:0;}
.sp-ps-card{background:#ffffffeb;border:1px solid rgba(167,139,250,.12);border-radius:21px;box-shadow:0 3px 12px rgba(100,60,200,.06);margin:24px 6.82% 0;padding:0;display:flex;flex-direction:column;flex-shrink:0;overflow:hidden;}
.sp-ps-card-2{margin-top:13.5px;gap:13.5px;}
.sp-ps-card-sub{color:#6b7280;font-size:10px;font-weight:500;margin:15px 0 0 6.74%;}
.sp-ps-card-val{color:#7c3aed;font-size:14px;font-weight:700;margin:7px 0 0 6.74%;}
.sp-ps-prog{background:#e8e8ff;border-radius:3px;height:6px;margin:12px 6.74% 15px;}
.sp-ps-prog-fill{height:6px;border-radius:3px;background:linear-gradient(90deg,#a78bfa,#f9a8d4);}
.sp-ps-pills-row{position:relative;height:29px;margin:0 6.74% 15px;flex-shrink:0;}
.sp-ps-pill{position:absolute;border-radius:30px;height:29px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:600;}
.sp-pill-purple{background:#a78bfa;color:#fff;left:0;width:29.16%;}
.sp-pill-green{background:#6ee7b7;color:#065f46;left:32.01%;width:27.47%;}
.sp-pill-pink{background:#f9a8d4;color:#831843;left:62.33%;width:24.44%;}
.sp-ps-alert{margin-top:15px!important;background:linear-gradient(135deg,#fef3c7,#fde68a);border-radius:15px;margin:0 6.82% 13.5px;padding:14px;font-size:11px;font-weight:500;color:#92400e;flex-shrink:0;}

/* 플로팅 배지 */
.sp-badge-float-top{background:rgba(255,255,255,.95);border:1px solid rgba(167,139,250,.18);border-radius:21px;box-shadow:0 24px 72px rgba(120,80,200,.11);height:90px;width:189px;position:absolute;left:calc(50% + 186px);top:calc(50% - 188px);}
.sp-badge-float-bottom{background:rgba(255,255,255,.95);border:1px solid rgba(167,139,250,.18);border-radius:21px;box-shadow:0 24px 72px rgba(120,80,200,.11);height:90px;width:221px;position:absolute;left:calc(50% - 409px);top:calc(50% + 65px);}
.sp-badge-title{color:#1a1433;font-size:13px;font-weight:600;position:absolute;top:calc(50% - 18px);left:50%;transform:translateX(-50%);white-space:nowrap;}
.sp-badge-sub{color:#6b7280;font-size:12px;font-weight:400;position:absolute;top:49px;left:13%;width:62%;}

/* ═══════════════
   섹션2 — 앱스크린
═══════════════ */
.sp-app-screens{position:relative;width:620px;height:480px;}
.sp-app-screen{position:absolute;background:#fff;border:1px solid rgba(167,139,250,.12);border-radius:24px;box-shadow:0 16px 52px rgba(100,60,200,.12);display:flex;flex-direction:column;overflow:hidden;bottom:0;transition:box-shadow .3s;}
.sp-app-screen>*:not(.sp-light-spot){position:relative;z-index:1;}
.sp-app-tall{left:0;width:32%;}
.sp-app-mid{left:35%;width:30%;}
.sp-app-short{left:68%;width:30%;}
.sp-as-bar{height:48px;flex-shrink:0;position:relative;}
.sp-bar-purple{background:linear-gradient(135deg,#a78bfa,#818cf8);}
.sp-bar-pink{background:linear-gradient(135deg,#f9a8d4,#a78bfa);}
.sp-bar-green{background:linear-gradient(135deg,#6ee7b7,#2563eb);}
.sp-as-body{display:flex;flex-direction:column;gap:10px;padding:14px 12px;}
.sp-as-item{background:#f4f6ff;border-radius:12px;padding:10px 12px;}
.sp-as-item-title{font-size:13px;font-weight:700;color:var(--sp-text);margin-bottom:3px;}
.sp-as-item-sub{font-size:12px;color:var(--sp-sub);}
.sp-as-tag{display:inline-block;margin-top:6px;padding:2px 10px;border-radius:20px;font-size:11px;font-weight:700;}
.sp-tag-purple{background:#ede9fe;color:var(--sp-pill);}
.sp-tag-red{background:#fee2e2;color:#ef4444;}
.sp-tag-green{background:#d1fae5;color:#059669;}

/* ══════════════
   섹션3 — DUR
═════════════ */
.sp-dur-visual{display:flex;flex-direction:column;gap:22px;width:480px;}
.sp-dur-card{background:#fff;border:1px solid rgba(200,210,255,.3);border-radius:22px;box-shadow:0 20px 60px rgba(120,80,200,.11);padding:28px 32px;position:relative;overflow:hidden;transition:box-shadow .3s;}
.sp-dur-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;}
.sp-dur-header-title{font-size:clamp(14px,1.2vw,20px);font-weight:700;color:var(--sp-text);}
.sp-dur-badge{padding:6px 16px;border-radius:50px;font-size:clamp(12px,1vw,18px);font-weight:700;}
.sp-dur-badge-red{background:#fee2e2;color:#ef4444;}
.sp-dur-badge-green{background:#d1fae5;color:#059669;}
.sp-dur-pair{display:flex;justify-content:space-between;align-items:center;padding:14px 0;border-bottom:1px solid rgba(200,210,255,.2);}
.sp-dur-pair:last-of-type{border-bottom:none;}
.sp-dur-drug{font-size:clamp(13px,1.1vw,18px);font-weight:700;color:var(--sp-text);}
.sp-dur-arrow{font-size:clamp(12px,1vw,17px);color:var(--sp-sub);}
.sp-dur-footer{font-size:clamp(12px,.95vw,17px);font-weight:500;margin-top:14px;}
.sp-dur-footer-red{color:#ef4444;}
.sp-dur-footer-green{color:#059669;}

/* ══════════════════════════════
   섹션4 — WHY
══════════════════════════════ */
.sp-sec-why{gap:0;padding:64px 40px 0;justify-content:center;gap:clamp(16px,3vw,60px);}

.sp-why-left-block{position:relative;width:589px;height:452px;flex-shrink:0;z-index:3;scale:clamp(0.5,calc((100vw - 640px) / 1600),0.72);transform-origin:right center;}

.wl-label{position:absolute;top:calc(50% - 226px);left:0;width:100%;height:21px;}
.wl-label-bar{position:absolute;top:calc(50% - 1px);left:0;width:6.24%;height:3px;background:#a78bfa;border-radius:1.3px;}
.wl-label-txt{position:absolute;top:calc(50% - 10px);left:8.46%;color:#7c3aed;font-size:14.3px;font-weight:700;letter-spacing:3.25px;}

.wl-title{position:absolute;top:calc(50% - 179px);left:0;width:100%;height:160px;}
.wl-title-plain{position:absolute;top:calc(50% - 88px);left:0;width:79.75%;color:#1a1433;font-size:clamp(40px,3.5vw,67.6px);font-weight:800;line-height:1.18;}
.wl-title-grad{position:absolute;top:71px;left:0;width:89.55%;font-size:clamp(40px,3.5vw,67.6px);font-weight:800;line-height:1.18;background:linear-gradient(135deg,#a78bfa,#f9a8d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}

.wl-desc{position:absolute;top:calc(50% + 3px);left:0;width:100%;height:70px;}
.wl-desc-1{position:absolute;top:calc(50% - 35px);left:0;width:43.21%;color:#6b7280;font-size:19.5px;font-weight:400;line-height:35.1px;}
.wl-desc-2{position:absolute;top:50%;left:0;width:59.25%;color:#6b7280;font-size:19.5px;font-weight:400;line-height:35.1px;}

.wl-stats{position:absolute;top:calc(50% + 120px);left:0;width:100%;height:106px;}
.wl-stat-frame{position:absolute;top:0;height:106px;display:flex;flex-direction:column;gap:14.6px;}
.wl-stat-1{left:0;width:22.59%;}
.wl-stat-2{left:33.28%;width:28.01%;}
.wl-stat-3{left:71.99%;width:28.01%;}
.wl-stat-n{color:#7c3aed;font-size:clamp(32px,2.7vw,52px);font-weight:800;flex:1;max-height:66px;line-height:1;}
.wl-stat-l{color:#6b7280;font-size:16.9px;font-weight:500;flex:1;max-height:21px;}

.sp-why-right-block{position:relative;width:896px;height:761px;z-index:3;scale:clamp(0.42,calc((100vw - 640px) / 1600),0.65);transform-origin:left center;}

.wr-card{position:absolute;background:#fff;border:0.53px solid rgba(167,139,250,.1);border-radius:12.8px;box-shadow:0 3.2px 16px rgba(120,80,200,.07);overflow:hidden;transition:transform .28s cubic-bezier(.34,1.56,.64,1),box-shadow .28s;}
.wr-card:hover{transform:translateY(-5px) scale(1.015);box-shadow:0 12px 32px rgba(120,80,200,.14);}

.wr-c1{top:0;left:0;width:46.56%;height:246px;}
.wr-c2{top:0;left:50.58%;width:46.79%;height:246px;}
.wr-c3{top:257px;left:0;width:46.56%;height:247px;}
.wr-c4{top:257px;left:50.58%;width:46.90%;height:247px;}
.wr-c5{top:515px;left:0;width:46.56%;height:246px;}
.wr-c6{top:515px;left:50.58%;width:47.01%;height:246px;}

.wr-bar{position:absolute;top:1px;left:0;width:99.74%;height:5px;}
.wr-num{position:absolute;top:calc(50% - 107px);right:8%;font-size:31.2px;font-weight:800;color:rgba(167,139,250,.08);}
.wr-icon{position:absolute;top:calc(50% - 90px);left:8.21%;font-size:37.4px;line-height:1;}
.wr-title{position:absolute;top:calc(50% - 36px);left:8.31%;width:67%;color:#1a1433;font-size:clamp(14px,1.25vw,22px);font-weight:700;line-height:normal;}
.wr-desc{position:absolute;top:calc(50% + 11px);left:6.95%;width:85.72%;color:#6b7280;font-size:clamp(11px,0.94vw,17px);font-weight:400;line-height:26px;margin:0;}

.wr-c2 .wr-icon{top:calc(50% - 77px);}
.wr-c2 .wr-title{top:calc(50% - 23px);width:42.29%;}
.wr-c2 .wr-desc{top:calc(50% + 24px);}
.wr-c3 .wr-icon{top:calc(50% - 88px);}
.wr-c3 .wr-title{top:calc(50% - 35px);width:55.86%;}
.wr-c4 .wr-icon{top:calc(50% - 76px);left:7.14%;}
.wr-c4 .wr-title{top:calc(50% - 22px);left:7.14%;width:55.86%;}
.wr-c4 .wr-desc{top:calc(50% + 24px);left:7.14%;}
.wr-c5 .wr-icon{top:calc(50% - 76px);left:5.76%;}
.wr-c5 .wr-title{top:calc(50% - 23px);left:5.76%;width:54.51%;}
.wr-c5 .wr-desc{top:calc(50% + 25px);left:5.76%;width:92.57%;}
.wr-c6 .wr-icon{top:calc(50% - 75px);left:6.89%;}
.wr-c6 .wr-title{top:calc(50% - 22px);left:6.89%;width:27.37%;}
.wr-c6 .wr-desc{top:calc(50% + 24px);left:6.89%;}
`;