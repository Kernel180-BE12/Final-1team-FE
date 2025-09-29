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
// import AcceptInvitationPage from './pages/AcceptInvitationPage';
import InvitationHandler from './pages/InvitationHandler';

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


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 그룹 1: 공개(Public) 경로 그룹 */}
        {/* 이 그룹은 로그인이 필요 없는 모든 페이지를 포함합니다. */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reset-password" element={<PasswordResetPage />} />
        <Route path="/invite-member" element={<InvitationHandler />} />
        
        {/* PublicLayout을 사용하는 Agent 페이지 */}
        {/* 사용자가 처음 만나는 홈 화면 역할을 합니다. */}
        <Route element={<PublicLayout />}>
          <Route path="/agent" element={<AgentPage />} />
        </Route>
        
        {/* 그룹 2: 비공개(Private) 경로 그룹 */}
        {/* 이 그룹의 모든 페이지는 로그인이 필요합니다. */}
        <Route element={<PrivateRoute />}>
          {/* 로그인 후 루트 경로('/')로 오면 알맞은 스페이스로 보내줍니다. */}
          <Route path="/" element={<RootRedirector />} />

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
        
        {/* 길 잃은 사용자 처리: 위에서 일치하는 경로가 하나도 없을 때만 동작합니다. */}
        <Route path="*" element={<Navigate to="/agent" />} />
      </Routes>
      <GlobalSnackbar />
    </BrowserRouter>
  );
}

