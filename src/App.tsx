import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// 레이아웃 컴포넌트들
import PublicLayout from './components/layouts/PublicLayout';
import DashboardLayout from './components/layouts/DashboardLayout';
import PrivateRoute from './components/layouts/PrivateRoute';

// 페이지 컴포넌트들
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AgentPage from './pages/AgentPage';
import SuggestionPage from './pages/SuggestionPage';
import MyTemplatesPage from './pages/MyTemplatesPage';
import ContactsPage from './pages/ContactsPage';
import SpacesPage from './pages/SpacesPage';
import PasswordResetPage from './pages/PasswordResetPage';
import MyInfoPage from './pages/MyInfoPage';
import InvitationHandler from './pages/InvitationHandler';
import InvitedRegisterPage from './pages/InvitedRegisterPage';

// 전역 상태 및 컴포넌트
import GlobalSnackbar from './components/common/GlobalSnackbar';


/**
 * 루트 경로('/')를 처리하는 컴포넌트입니다.
 * 이제 로그인 상태와 관계없이 항상 기본 홈페이지('/agent')로 안내합니다.
 */
const RootHandler = () => {
  return <Navigate to="/agent" replace />;
};


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ★ 루트 경로('/')는 이제 항상 /agent로 이동합니다. */}
        <Route path="/" element={<RootHandler />} />

        {/* 그룹 1: 공개(Public) 경로 그룹 - 로그인이 필요 없음 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reset-password" element={<PasswordResetPage />} />
        <Route path="/invite-member" element={<InvitationHandler />} />
        <Route path="/invited-register" element={<InvitedRegisterPage />} />
        <Route path="/space-member-register" element={<InvitedRegisterPage />} />
        
        <Route element={<PublicLayout />}>
          <Route path="/agent" element={<AgentPage />} />
        </Route>
        
        {/* 그룹 2: 비공개(Private) 경로 그룹 - 로그인이 필요함 */}
        <Route element={<PrivateRoute />}>
          {/* 스마트 리디렉션 로직을 모두 제거하여 구조를 단순화했습니다. */}
          {/* 로그인 성공 후에는 LoginPage에서 '/spaces/management' 등으로 직접 이동시켜야 합니다. */}

          <Route path="/spaces" element={<DashboardLayout />}>
            <Route path="management" element={<SpacesPage />} />
            <Route index element={<Navigate to="management" replace />} />
          </Route>

          <Route path="/spaces/:spaceId" element={<DashboardLayout />}>
            <Route path="templates" element={<MyTemplatesPage />} />
            <Route path="suggestion" element={<SuggestionPage />} />
            <Route path="contacts" element={<ContactsPage />} />
            <Route path="my-info" element={<MyInfoPage />} />
            <Route index element={<Navigate to="suggestion" replace />} />
          </Route>
        </Route>       
        
        <Route path="*" element={<Navigate to="/agent" />} />
      </Routes>
      <GlobalSnackbar />
    </BrowserRouter>
  );
}

