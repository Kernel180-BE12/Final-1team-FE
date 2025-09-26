import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import PublicLayout from './components/layouts/PublicLayout';
import DashboardLayout from './components/layouts/DashboardLayout';
import PrivateRoute from './components/layouts/PrivateRoute';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AgentPage from './pages/AgentPage';
import SuggestionPage from './pages/SuggestionPage';
import MyTemplatesPage from './pages/MyTemplatesPage';
import ContactsPage from './pages/ContactsPage';
import SpacesPage from './pages/SpacesPage';
import PasswordResetPage from './pages/PasswordResetPage';
import MyInfoPage from './pages/MyInfoPage';

import useAppStore from './store/useAppStore';
import GlobalSnackbar from './components/common/GlobalSnackbar';


const RootRedirector = () => {
  const { currentSpace, spaces } = useAppStore();

  if (currentSpace) {
    return <Navigate to={`/spaces/${currentSpace.spaceId}/suggestion`} replace />;
  }
  if (spaces.length > 0) {
    return <Navigate to={`/spaces/${spaces[0].spaceId}/suggestion`} replace />;
  }
  return <Navigate to="/spaces/management" replace />;
};

// 루트 경로('/')를 처리할 핸들러 컴포넌트
// 이 컴포넌트가 로그인/비로그인 상태에 따라 올바른 경로로 안내합니다.
const RootHandler = () => {
  const { isLoggedIn } = useAppStore();

  // 로그인 상태이면, 기존 로직을 따라 알맞은 스페이스로 보냅니다.
  if (isLoggedIn) {
    return <RootRedirector />;
  }
  
  // 비로그인 상태이면, agent 페이지로 보냅니다.
  return <Navigate to="/agent" replace />;
};


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootHandler />} />

        {/* 그룹 1: Public 구역 (로그인 전) */}
        <Route element={<PublicLayout />}>
          <Route path="/agent" element={<AgentPage />} />
        </Route>
        
        {/* 그룹 2: Private 구역 (로그인 후) */}
        <Route element={<PrivateRoute />}>
          {/* 스페이스 관리 페이지를 위한 라우트 (DashboardLayout 사용) */}
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
        
        {/* 그룹 3: 독립된 페이지 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reset-password" element={<PasswordResetPage />} />

        {/* 길 잃은 사용자 처리 */}
        <Route path="*" element={<Navigate to="/agent" />} />
      </Routes>
      <GlobalSnackbar />
    </BrowserRouter>
  );
}
