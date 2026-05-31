import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

/* ── 커스텀 커서 훅 ── */
function useCursor() {
  const [cursor, setCursor] = useState({ x: -200, y: -200 });
  const [ring,   setRing  ] = useState({ x: -200, y: -200 });
  const ringPos = useRef({ x: -200, y: -200 });
  const raf     = useRef(null);

  useEffect(() => {
    const onMove = (e) => setCursor({ x: e.clientX, y: e.clientY });
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

/* ── 체크박스 ── */
function Chk({ checked, onChange }) {
  return (
    <div className={`au-chk${checked ? " on" : ""}`} onClick={onChange}>
      {checked && <span className="au-chk-mark">✓</span>}
    </div>
  );
}

/* ── 메인 컴포넌트 ── */
export default function SignupPage() {
  const navigate = useNavigate();
  const { cursor, ring } = useCursor();

  const [email,   setEmail  ] = useState("");
  const [pw,      setPw     ] = useState("");
  const [pw2,     setPw2    ] = useState("");
  const [showPw,  setShowPw ] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [agree1,  setAgree1 ] = useState(false);
  const [agree2,  setAgree2 ] = useState(false);
  const [emF,     setEmF    ] = useState(false);
  const [pwF,     setPwF    ] = useState(false);
  const [pw2F,    setPw2F   ] = useState(false);
  const [submitted, setSubmitted] = useState(false); // 제출 시도 여부

  /* ── 비밀번호 유효성 ── */
  // 비밀번호 확인 필드에 입력이 있거나 제출 시도했을 때만 에러 표시
  const showPw2Err = (pw2.length > 0 || submitted) && pw !== pw2;
  const canSubmit  = email && pw && pw === pw2 && agree1 && agree2;

  /* ── 회원가입 제출 ── */
  const handleSubmit = () => {
    setSubmitted(true);
    if (!canSubmit) return;
    // TODO: 실제 회원가입 API 연결
    alert("회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.");
    navigate("/login");
  };

  /* ── Enter 키 ── */
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="au-cursor"      style={{ left: cursor.x, top: cursor.y }} />
      <div className="au-cursor-ring" style={{ left: ring.x,   top: ring.y   }} />

      <div className="au-bg-blob" />
      <div className="au-deco au-d1">💊</div>
      <div className="au-deco au-d2">⏰</div>
      <div className="au-deco au-d3">⭐</div>
      <div className="au-deco au-d4">💜</div>

      {/* ── NAV: 로고만 ── */}
      <nav className="au-nav">
        <div
          className="au-nav-logo"
          onClick={() => navigate("/")}
          style={{ cursor: "none" }}
        >
          <div className="au-logo-pill">💊</div>
          <span className="au-logo-text">MediPocket</span>
        </div>
      </nav>

      {/* ── 카드 ── */}
      <div className="au-page-wrap">
        <div className="au-card au-signup-card">

          {/* 카드 상단 로고 → 랜딩 이동 */}
          <div
            className="au-card-logo"
            onClick={() => navigate("/")}
            style={{ cursor: "none" }}
          >
            <div className="au-card-logo-icon">💊</div>
            <span className="au-card-logo-text">MediPocket</span>
          </div>

          <div className="au-su-title">MediPocket 시작하기</div>
          <div className="au-su-sub">3초만에 가입하고 내 약 관리를 스마트하게 시작하세요.</div>

          {/* 이메일 */}
          <div className="au-field">
            <div className="au-lbl">이메일</div>
            <div className={`au-inp-wrap${emF ? " focus" : ""}`}>
              <input
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onFocus={() => setEmF(true)}
                onBlur={() => setEmF(false)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>

          {/* 비밀번호 */}
          <div className="au-field">
            <div className="au-lbl">비밀번호</div>
            <div className={`au-inp-wrap${pwF ? " focus" : ""}`}>
              <input
                type={showPw ? "text" : "password"}
                placeholder="영문, 숫자, 특수문자 포함 8자 이상"
                value={pw}
                onChange={e => setPw(e.target.value)}
                onFocus={() => setPwF(true)}
                onBlur={() => setPwF(false)}
                onKeyDown={handleKeyDown}
              />
              <button className="au-eye" onClick={() => setShowPw(!showPw)} tabIndex={-1}>
                {showPw ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          {/* 비밀번호 확인 */}
          <div className="au-field">
            <div className="au-lbl">비밀번호 확인</div>
            <div className={`au-inp-wrap${pw2F ? " focus" : ""}${showPw2Err ? " err" : ""}`}>
              <input
                type={showPw2 ? "text" : "password"}
                placeholder="비밀번호를 한 번 더 입력하세요"
                value={pw2}
                onChange={e => setPw2(e.target.value)}
                onFocus={() => setPw2F(true)}
                onBlur={() => setPw2F(false)}
                onKeyDown={handleKeyDown}
              />
              <button className="au-eye" onClick={() => setShowPw2(!showPw2)} tabIndex={-1}>
                {showPw2 ? "🙈" : "👁"}
              </button>
            </div>
            {/* 비밀번호 불일치 경고 */}
            {showPw2Err && (
              <div className="au-err-msg">⚠️ 비밀번호가 일치하지 않습니다.</div>
            )}
            {/* 비밀번호 일치 확인 */}
            {pw2.length > 0 && !showPw2Err && (
              <div className="au-ok-msg">✓ 비밀번호가 일치합니다.</div>
            )}
          </div>

          {/* 약관 동의 */}
          <div className="au-agree">
            <div className="au-chk-row" onClick={() => setAgree1(!agree1)}>
              <Chk checked={agree1} onChange={() => setAgree1(!agree1)} />
              <span className="au-chk-lbl">[필수] 이용약관 동의</span>
            </div>
            <div className="au-chk-row" onClick={() => setAgree2(!agree2)}>
              <Chk checked={agree2} onChange={() => setAgree2(!agree2)} />
              <span className="au-chk-lbl">[필수] 개인정보 수집 및 이용 동의</span>
            </div>
            {/* 제출 시도했는데 약관 미동의 시 경고 */}
            {submitted && (!agree1 || !agree2) && (
              <div className="au-err-msg">⚠️ 필수 약관에 모두 동의해주세요.</div>
            )}
          </div>

          {/* 회원가입 버튼 */}
          <button
            className="au-btn-main"
            onClick={handleSubmit}
            style={{ opacity: canSubmit ? 1 : 0.45 }}
          >
            회원가입 완료
          </button>

          {/* 로그인으로 이동 */}
          <div className="au-foot">
            <span className="au-foot-txt">이미 계정이 있으신가요?</span>
            {/* ✅ navigate("/login") 으로 연결 */}
            <button
              className="au-foot-link"
              onClick={() => navigate("/login")}
            >
              로그인
            </button>
          </div>

        </div>
      </div>
    </>
  );
}

/* ════════════════════════════════════════════
   CSS
════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
:root{
  --p:#7c3aed;--pl:#ede9fe;--a1:#a78bfa;--a2:#f9a8d4;
  --txt:#1a1433;--sub:#6b7280;--bg:#eeeeff;
  --fn:'Plus Jakarta Sans',sans-serif;
}
html,body{width:100%;min-height:100vh;cursor:none;font-family:var(--fn);background:var(--bg);}

/* ── 커서 ── */
.au-cursor{width:10px;height:10px;border-radius:50%;background:var(--a1);position:fixed;z-index:9999;pointer-events:none;transform:translate(-50%,-50%);mix-blend-mode:multiply;}
.au-cursor-ring{width:32px;height:32px;border-radius:50%;border:1px solid var(--a1);position:fixed;z-index:9998;pointer-events:none;transform:translate(-50%,-50%);opacity:.4;}

/* ── 배경 블롭 ── */
.au-bg-blob{position:fixed;inset:0;pointer-events:none;z-index:0;}
.au-bg-blob::before{content:'';position:absolute;width:600px;height:600px;top:-160px;left:-160px;background:radial-gradient(circle,rgba(167,139,250,.22),transparent 65%);animation:auD1 13s ease-in-out infinite alternate;}
.au-bg-blob::after{content:'';position:absolute;width:500px;height:500px;bottom:-100px;right:-80px;background:radial-gradient(circle,rgba(249,168,212,.22),transparent 65%);animation:auD2 16s ease-in-out infinite alternate;}
@keyframes auD1{to{transform:translate(60px,50px)}}
@keyframes auD2{to{transform:translate(-50px,35px)}}

/* ── 장식 이모지 ── */
.au-deco{position:fixed;font-size:36px;opacity:.13;pointer-events:none;z-index:1;animation:auDc 7s ease-in-out infinite alternate;}
.au-d1{top:18%;left:5%;animation-delay:0s;}
.au-d2{top:15%;right:4%;animation-delay:1.8s;}
.au-d3{bottom:22%;left:4%;animation-delay:3.2s;}
.au-d4{bottom:20%;right:5%;animation-delay:4.6s;}
@keyframes auDc{from{transform:translateY(0) rotate(-6deg)}to{transform:translateY(-14px) rotate(6deg)}}

/* ── NAV: 로고만 ── */
.au-nav{
  position:fixed;top:0;left:0;right:0;z-index:200;
  height:64px;padding:0 80px;
  display:flex;align-items:center;
  background:rgba(240,238,255,.94);
  backdrop-filter:blur(18px);
  border-bottom:1px solid rgba(167,139,250,.2);
}
.au-nav-logo{display:flex;align-items:center;gap:9px;transition:opacity .2s;}
.au-nav-logo:hover{opacity:0.75;}
.au-logo-pill{width:34px;height:34px;background:linear-gradient(135deg,var(--a1),var(--a2));border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:17px;box-shadow:0 4px 12px rgba(167,139,250,.4);animation:auPulse 3s ease-in-out infinite;}
@keyframes auPulse{0%,100%{box-shadow:0 4px 12px rgba(167,139,250,.4)}50%{box-shadow:0 4px 20px rgba(167,139,250,.62)}}
.au-logo-text{font-size:17px;font-weight:800;color:var(--txt);}

/* ── 카드 레이아웃 ── */
.au-page-wrap{position:relative;z-index:10;min-height:calc(100vh - 64px);margin-top:64px;display:flex;align-items:center;justify-content:center;padding:24px 16px 44px;}
.au-card{background:rgba(255,255,255,.96);border:1px solid rgba(255,255,255,.8);border-radius:24px;box-shadow:0 24px 64px rgba(100,60,200,.14);animation:auUp .45s ease both;}
@keyframes auUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
.au-signup-card{width:420px;padding:32px 36px 28px;}

/* ── 카드 로고 ── */
.au-card-logo{display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:18px;transition:opacity .2s;}
.au-card-logo:hover{opacity:0.75;}
.au-card-logo-icon{width:40px;height:40px;background:linear-gradient(135deg,#f97316,var(--a2));border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px;box-shadow:0 6px 18px rgba(249,115,22,.28);}
.au-card-logo-text{font-size:19px;font-weight:800;color:var(--txt);}

/* ── 카드 헤더 텍스트 ── */
.au-su-title{font-size:19px;font-weight:800;color:var(--txt);margin-bottom:5px;text-align:center;}
.au-su-sub{font-size:12px;color:var(--sub);margin-bottom:20px;line-height:1.6;text-align:center;}

/* ── 입력 필드 ── */
.au-field{display:flex;flex-direction:column;gap:5px;margin-bottom:12px;}
.au-lbl{font-size:12px;font-weight:600;color:var(--txt);}
.au-inp-wrap{display:flex;align-items:center;background:#f8f7ff;border:1.5px solid rgba(167,139,250,.22);border-radius:11px;overflow:hidden;transition:border-color .2s,box-shadow .2s;}
.au-inp-wrap.focus{border-color:var(--a1);box-shadow:0 0 0 3px rgba(167,139,250,.13);}
.au-inp-wrap.err{border-color:#ef4444;box-shadow:0 0 0 3px rgba(239,68,68,.1);}
.au-inp-wrap input{flex:1;border:none;background:transparent;font-family:var(--fn);font-size:13px;color:var(--txt);outline:none;padding:11px 13px;cursor:text;}
.au-inp-wrap input::placeholder{color:#a0aec0;}
.au-eye{background:transparent;border:none;cursor:none;padding:0 11px;font-size:15px;color:#b8a8d8;transition:color .2s;line-height:1;}
.au-eye:hover{color:var(--p);}

/* ── 에러 / 성공 메시지 ── */
.au-err-msg{font-size:11px;color:#ef4444;margin-top:4px;font-weight:500;}
.au-ok-msg{font-size:11px;color:#059669;margin-top:4px;font-weight:500;}

/* ── 약관 동의 ── */
.au-agree{display:flex;flex-direction:column;gap:7px;margin:9px 0 12px;}
.au-chk-row{display:flex;align-items:center;gap:6px;cursor:none;user-select:none;}
.au-chk{width:16px;height:16px;border:1.5px solid #ccc;border-radius:4px;display:flex;align-items:center;justify-content:center;transition:all .2s;flex-shrink:0;}
.au-chk.on{background:var(--p);border-color:var(--p);}
.au-chk-mark{color:#fff;font-size:9px;font-weight:700;}
.au-chk-lbl{font-size:12px;color:var(--sub);}

/* ── 회원가입 버튼 ── */
.au-btn-main{width:100%;padding:13px;border-radius:50px;background:linear-gradient(135deg,var(--p),#818cf8);border:none;color:#fff;font-size:14px;font-weight:700;cursor:none;font-family:var(--fn);box-shadow:0 6px 22px rgba(124,58,237,.35);transition:transform .2s,box-shadow .2s,opacity .2s;margin-bottom:16px;}
.au-btn-main:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(124,58,237,.48);}
.au-btn-main:active{transform:scale(.97);}

/* ── 하단 로그인 ── */
.au-foot{display:flex;justify-content:center;align-items:center;gap:5px;}
.au-foot-txt{font-size:12px;color:var(--sub);}
.au-foot-link{background:transparent;border:none;font-family:var(--fn);font-size:12px;font-weight:700;color:var(--p);cursor:none;}
.au-foot-link:hover{text-decoration:underline;}

/* ── 구분선 ── */
.au-div-row{display:flex;align-items:center;gap:8px;}
.au-div-line{flex:1;height:1px;background:rgba(167,139,250,.2);}
.au-div-txt{font-size:11px;color:#b8a8d8;font-weight:500;white-space:nowrap;}
`;