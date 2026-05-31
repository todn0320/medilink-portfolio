import { Route, Routes } from "react-router-dom";
import "./App.css";
import LandingPage from "./pill_ai/pages/landing/LandingPage.jsx";
import ServicePage from "./pill_ai/pages/service/ServicePage.jsx";
import LoginPage from "./pill_ai/pages/login/login.jsx";
import SignupPage from "./pill_ai/pages/signup/SignupPage.jsx";
import HomePage from "./pill_ai/pages/home/HomePage.jsx";
import SearchPage from "./pill_ai/pages/search/SearchPage.jsx";
import CabinetPage from "./pill_ai/pages/cabinet/Cabinet.jsx";
import Setting from "./pill_ai/pages/setting/MediPocketSettings.jsx";
import CheckPage from "./pill_ai/pages/check/CheckPage.jsx";
import NotificationsPage from "./pill_ai/pages/notification/NotificationPage.jsx";
import SharePage from "./pill_ai/pages/share/SharePage.jsx";

function App() {
  return (
    <Routes>
      {/* ── 독립 페이지 (사이드바 없음) ── */}
      <Route path="/"        element={<LandingPage />} />
      <Route path="/service" element={<ServicePage />} />
      <Route path="/login"   element={<LoginPage />} />
      <Route path="/signup"  element={<SignupPage />} />

      {/* ── 앱 내부 페이지 (각 페이지가 자체 사이드바 보유) ── */}
      <Route path="/app/home"          element={<HomePage />} />
      <Route path="/app/search"        element={<SearchPage />} />
      <Route path="/app/cabinet"       element={<CabinetPage />} />
      <Route path="/app/setting"       element={<Setting />} />
      <Route path="/app/check"         element={<CheckPage />} />
      <Route path="/app/notifications" element={<NotificationsPage />} />
      <Route path="/app/share"         element={<SharePage />} />
    </Routes>
  );
}

export default App;