import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

/* ── 시연용 계정 ── */
const DEMO_EMAIL = "team02_01@soldeskms.onmicrosoft.com";
const DEMO_PW    = "Racu2163";

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
export default function LoginPage() {
  const navigate = useNavigate();
  const { cursor, ring } = useCursor();

  const [id,      setId     ] = useState("");
  const [pw,      setPw     ] = useState("");
  const [showPw,  setShowPw ] = useState(false);
  const [saveId,  setSaveId ] = useState(false);
  const [idF,     setIdF    ] = useState(false);
  const [pwF,     setPwF    ] = useState(false);
  const [error,   setError  ] = useState("");
  const [loading, setLoading] = useState(false);

  /* ── 시연 계정 자동 입력 ── */
  const fillDemo = () => {
    setId(DEMO_EMAIL);
    setPw(DEMO_PW);
    setError("");
  };

  /* ── 로그인 처리 ── */
  const handleLogin = () => {
    setError("");
    if (!id.trim() || !pw.trim()) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      if (id.trim() === DEMO_EMAIL && pw === DEMO_PW) {
        navigate("/app/home");
      } else {
        setError("이메일 또는 비밀번호가 올바르지 않습니다.");
        setLoading(false);
      }
    }, 600);
  };

  /* ── Enter 키 로그인 ── */
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
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
        <div className="au-card au-login-card">

          {/* 카드 상단 로고 → 랜딩 이동 */}
          <div
            className="au-card-logo"
            onClick={() => navigate("/")}
            style={{ cursor: "none" }}
          >
            <div className="au-card-logo-icon">💊</div>
            <span className="au-card-logo-text">MediPocket</span>
          </div>

          <div className="au-card-title">로그인</div>
          <div className="au-card-sub">안전한 복약 관리를 위해 로그인하세요.</div>

          {/* ── 시연 계정 자동 입력 버튼 ── */}
          <button className="au-btn-demo" onClick={fillDemo}>
            🧪 시연 계정으로 빠른 입력
          </button>

          {/* 이메일 */}
          <div className="au-field">
            <div className="au-lbl">이메일</div>
            <div className={`au-inp-wrap${idF ? " focus" : ""}`}>
              <input
                type="text"
                placeholder="이메일을 입력하세요"
                value={id}
                onChange={e => { setId(e.target.value); setError(""); }}
                onFocus={() => setIdF(true)}
                onBlur={() => setIdF(false)}
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
                placeholder="비밀번호를 입력하세요"
                value={pw}
                onChange={e => { setPw(e.target.value); setError(""); }}
                onFocus={() => setPwF(true)}
                onBlur={() => setPwF(false)}
                onKeyDown={handleKeyDown}
              />
              <button className="au-eye" onClick={() => setShowPw(!showPw)} tabIndex={-1}>
                {showPw ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="au-error">⚠️ {error}</div>
          )}

          {/* 아이디 저장 + 비밀번호 찾기 */}
          <div className="au-opt-row">
            <div className="au-chk-row" onClick={() => setSaveId(!saveId)}>
              <Chk checked={saveId} onChange={() => setSaveId(!saveId)} />
              <span className="au-chk-lbl">아이디 저장</span>
            </div>
            <button className="au-link">비밀번호 찾기</button>
          </div>

          {/* 로그인 버튼 */}
          <button
            className={`au-btn-main${loading ? " loading" : ""}`}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>

          {/* 회원가입 안내 */}
          <div className="au-foot">
            <span className="au-foot-txt">아직 회원이 아니신가요?</span>
            <button
              className="au-foot-link"
              onClick={() => navigate("/signup")}
            >
              회원가입
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
.au-nav{position:fixed;top:0;left:0;right:0;z-index:200;height:64px;padding:0 80px;display:flex;align-items:center;background:rgba(240,238,255,.94);backdrop-filter:blur(18px);border-bottom:1px solid rgba(167,139,250,.2);}
.au-nav-logo{display:flex;align-items:center;gap:9px;transition:opacity .2s;}
.au-nav-logo:hover{opacity:0.75;}
.au-logo-pill{width:34px;height:34px;background:linear-gradient(135deg,var(--a1),var(--a2));border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:17px;box-shadow:0 4px 12px rgba(167,139,250,.4);animation:auPulse 3s ease-in-out infinite;}
@keyframes auPulse{0%,100%{box-shadow:0 4px 12px rgba(167,139,250,.4)}50%{box-shadow:0 4px 20px rgba(167,139,250,.62)}}
.au-logo-text{font-size:17px;font-weight:800;color:var(--txt);}

/* ── 카드 레이아웃 ── */
.au-page-wrap{position:relative;z-index:10;min-height:calc(100vh - 64px);margin-top:64px;display:flex;align-items:center;justify-content:center;padding:24px 16px 44px;}
.au-card{background:rgba(255,255,255,.96);border:1px solid rgba(255,255,255,.8);border-radius:24px;box-shadow:0 24px 64px rgba(100,60,200,.14);animation:auUp .45s ease both;}
@keyframes auUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
.au-login-card{width:460px;padding:40px 46px 36px;}

/* ── 카드 로고 ── */
.au-card-logo{display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:22px;transition:opacity .2s;}
.au-card-logo:hover{opacity:0.75;}
.au-card-logo-icon{width:46px;height:46px;background:linear-gradient(135deg,#f97316,var(--a2));border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:22px;box-shadow:0 6px 18px rgba(249,115,22,.28);}
.au-card-logo-text{font-size:21px;font-weight:800;color:var(--txt);}

/* ── 카드 헤더 텍스트 ── */
.au-card-title{font-size:30px;font-weight:800;color:var(--txt);text-align:center;letter-spacing:.05em;margin-bottom:5px;}
.au-card-sub{font-size:13px;color:var(--sub);text-align:center;margin-bottom:18px;line-height:1.6;}

/* ── 시연 계정 버튼 ── */
.au-btn-demo{
  width:100%;padding:11px;border-radius:50px;
  background:#f3f0ff;
  border:1.5px dashed rgba(124,58,237,.35);
  color:var(--p);font-size:13px;font-weight:600;
  cursor:none;font-family:var(--fn);
  margin-bottom:16px;
  transition:background .2s,transform .15s;
  display:flex;align-items:center;justify-content:center;gap:6px;
}
.au-btn-demo:hover{background:var(--pl);transform:translateY(-1px);}
.au-btn-demo:active{transform:scale(.97);}

/* ── 입력 필드 ── */
.au-field{display:flex;flex-direction:column;gap:5px;margin-bottom:12px;}
.au-lbl{font-size:12px;font-weight:600;color:var(--txt);}
.au-inp-wrap{display:flex;align-items:center;background:#f8f7ff;border:1.5px solid rgba(167,139,250,.22);border-radius:11px;overflow:hidden;transition:border-color .2s,box-shadow .2s;}
.au-inp-wrap.focus{border-color:var(--a1);box-shadow:0 0 0 3px rgba(167,139,250,.13);}
.au-inp-wrap input{flex:1;border:none;background:transparent;font-family:var(--fn);font-size:13px;color:var(--txt);outline:none;padding:11px 13px;cursor:text;}
.au-inp-wrap input::placeholder{color:#a0aec0;}
.au-eye{background:transparent;border:none;cursor:none;padding:0 11px;font-size:15px;color:#b8a8d8;transition:color .2s;line-height:1;}
.au-eye:hover{color:var(--p);}

/* ── 에러 메시지 ── */
.au-error{background:#fef2f2;border:1px solid #fee2e2;border-radius:10px;padding:10px 14px;font-size:12px;font-weight:500;color:#ef4444;margin-bottom:10px;animation:auUp .25s ease both;}

/* ── 옵션 행 ── */
.au-opt-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:13px;}
.au-chk-row{display:flex;align-items:center;gap:6px;cursor:none;user-select:none;}
.au-chk{width:16px;height:16px;border:1.5px solid #ccc;border-radius:4px;display:flex;align-items:center;justify-content:center;transition:all .2s;flex-shrink:0;}
.au-chk.on{background:var(--p);border-color:var(--p);}
.au-chk-mark{color:#fff;font-size:9px;font-weight:700;}
.au-chk-lbl{font-size:12px;color:var(--sub);}
.au-link{background:transparent;border:none;font-family:var(--fn);font-size:12px;font-weight:600;color:var(--p);cursor:none;}
.au-link:hover{text-decoration:underline;}

/* ── 로그인 버튼 ── */
.au-btn-main{width:100%;padding:13px;border-radius:50px;background:linear-gradient(135deg,var(--p),#818cf8);border:none;color:#fff;font-size:14px;font-weight:700;cursor:none;font-family:var(--fn);box-shadow:0 6px 22px rgba(124,58,237,.35);transition:transform .2s,box-shadow .2s,opacity .2s;margin-bottom:20px;}
.au-btn-main:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(124,58,237,.48);}
.au-btn-main:active{transform:scale(.97);}
.au-btn-main.loading{opacity:.7;}
.au-btn-main:disabled{cursor:none;}

/* ── 하단 회원가입 ── */
.au-foot{display:flex;justify-content:center;align-items:center;gap:5px;}
.au-foot-txt{font-size:12px;color:var(--sub);}
.au-foot-link{background:transparent;border:none;font-family:var(--fn);font-size:12px;font-weight:700;color:var(--p);cursor:none;}
.au-foot-link:hover{text-decoration:underline;}
`;