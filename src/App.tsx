import { BrowserRouter, Routes, Route, Navigate,} from 'react-router-dom';

import PublicLayout from './components/PublicLayout';
import DashboardLayout from './components/DashboardLayout';
import PrivateRoute from './components/layout/PrivateRoute';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AgentPage from './pages/AgentPage';
import SuggestionPage from './pages/SuggestionPage';
import MyTemplatesPage from './pages/MyTemplatesPage';
import ContactsPage from './pages/ContactsPage';
import SpacesPage from './pages/SpacesPage'
import PasswordResetPage from './pages/PasswordResetPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 그룹 1: Public 구역 (로그인 전) */}
        <Route element={<PublicLayout />}>
          <Route path="/agent" element={<AgentPage />} />
          
        </Route>

        {/* 그룹 2: Dashboard 구역 (로그인 후) */}
        <Route element={<PrivateRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/my-templates" element={<MyTemplatesPage />} />
            <Route path="/suggestion" element={<SuggestionPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/spaces" element={<SpacesPage />} />
          </Route>
        </Route>
        
        
        {/* 그룹 3: 레이아웃이 없는 독립된 페이지 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reset-password" element={<PasswordResetPage />} />

        {/* 길 잃은 사용자 처리 */}
        <Route 
          path="*" 
          element={<Navigate to="/agent" />}
        />
      </Routes>
    </BrowserRouter>
  );
}
