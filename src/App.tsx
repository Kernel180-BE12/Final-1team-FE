import React from 'react';
import { BrowserRouter, Routes, Route, Navigate,} from 'react-router-dom';

import PublicLayout from './components/PublicLayout';
import DashboardLayout from './components/DashboardLayout';

import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AgentPage from './pages/AgentPage';
import SuggestionPage from './pages/SuggestionPage';
import MyTemplatesPage from './pages/MyTemplatesPage';
// import SpacesPage from './pages/SpacesPage';
import ContactsPage from './pages/ContactsPage';

export default function App() {
  const isLoggedIn = true; // 실제 앱에서는 이 값이 동적으로 변해야 합니다.

  return (
    <BrowserRouter>
      <Routes>
        {/* 그룹 1: Public 구역 (로그인 전) */}
        <Route element={<PublicLayout />}>
          <Route path="/agent" element={<AgentPage />} />
          {/* 추가적으로 /about, /pricing 같은 페이지를 여기에 넣을 수 있습니다. */}
        </Route>

        {/* 그룹 2: Dashboard 구역 (로그인 후) */}
        {isLoggedIn && (
          <Route element={<DashboardLayout />}>
            {/* <Route path="/spaces" element={<SpacesPage />} /> */}
            <Route path="/my-templates" element={<MyTemplatesPage />} />
            <Route path="/suggestion" element={<SuggestionPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            {/* 추가적으로 /settings 같은 페이지를 여기에 넣을 수 있습니다. */}
          </Route>
        )}
        
        {/* 그룹 3: 레이아웃이 없는 독립된 페이지 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        {/* <Route path="/agent" element={<AgentPage />} /> AgentPage는 레이아웃 없음 */}


        {/* 길 잃은 사용자 처리 */}
        <Route 
          path="*" 
          element={<Navigate to={isLoggedIn ? "/spaces" : "/"} />} 
        />
      </Routes>
    </BrowserRouter>
  );
}
