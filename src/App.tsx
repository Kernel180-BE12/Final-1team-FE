import { BrowserRouter, Routes, Route, Navigate,} from 'react-router-dom';

import PublicLayout from './components/layouts/PublicLayout';
import DashboardLayout from './components/layouts/DashboardLayout';
import PrivateRoute from './components/layouts/PrivateRoute';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AgentPage from './pages/AgentPage';
import SuggestionPage from './pages/SuggestionPage';
import MyTemplatesPage from './pages/MyTemplatesPage';
import ContactsPage from './pages/ContactsPage';
import SpacesPage from './pages/SpacesPage'
import PasswordResetPage from './pages/PasswordResetPage';
import MyInfoPage from './pages/MyInfoPage';

import useAppStore from './store/useAppStore';


const RootRedirector = () => {
  const { currentSpace, spaces } = useAppStore();

  // 1순위: 현재 선택된 스페이스가 있으면, 그 스페이스의 suggestion 페이지로 이동
  if (currentSpace) {
    return <Navigate to={`/spaces/${currentSpace.spaceId}/suggestion`} replace />;
  }
  // 2순위: 속한 스페이스 목록이 있으면, 그 중 첫 번째 스페이스의 suggestion 페이지로 이동
  if (spaces.length > 0) {
    return <Navigate to={`/spaces/${spaces[0].spaceId}/suggestion`} replace />;
  }
  // 3순위: 속한 스페이스가 아예 없으면, 스페이스 관리 페이지로 이동 (스페이스부터 만들도록 유도)
  return <Navigate to="/spaces/management" replace />;
};


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 그룹 1: Public 구역 (로그인 전) - 변경 없음 */}
        <Route element={<PublicLayout />}>
          <Route path="/agent" element={<AgentPage />} />
        </Route>

        <Route element={<PrivateRoute />}>
          {/* 스페이스 관리 페이지를 위한 라우트 (DashboardLayout 사용) */}
          {/* 이 경로는 URL에 spaceId가 없습니다. */}
          <Route path="/spaces" element={<DashboardLayout />}>
            <Route path="management" element={<SpacesPage />} />
            {/* /spaces 로 접근 시 management로 리디렉션 */}
            <Route index element={<Navigate to="management" replace />} />
          </Route>

          {/* 개별 스페이스 페이지를 위한 라우트 (DashboardLayout 사용) */}
          <Route path="/spaces/:spaceId" element={<DashboardLayout />}>
            <Route path="templates" element={<MyTemplatesPage />} />
            <Route path="suggestion" element={<SuggestionPage />} />
            <Route path="contacts" element={<ContactsPage />} />
            <Route path="my-info" element={<MyInfoPage />} />
            <Route index element={<Navigate to="suggestion" replace />} />
          </Route>

          {/* 루트 경로 ('/') 접속 시 리디렉션 */}
          <Route path="/" element={<RootRedirector />} />
        </Route>       
        
        {/* 그룹 3: 독립된 페이지 - 변경 없음 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reset-password" element={<PasswordResetPage />} />

        {/* 길 잃은 사용자 처리 - 변경 없음 */}
        <Route path="*" element={<Navigate to="/agent" />} />
      </Routes>
    </BrowserRouter>
  );
}
