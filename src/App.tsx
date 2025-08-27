import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import AgentPage from './pages/AgentPage';
import SuggestionPage from './pages/SuggestionPage';
import MyTemplatePage from './pages/MyTemplatePage';
import SignupPage from './pages/SignupPage';

import Layout from './components/Layout';

// 로그인 상태에 따라 Layout을 보여주거나 로그인 페이지로 보내는 컴포넌트
const ProtectedLayout = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  if (!isLoggedIn) {
    // 로그인이 안 되어있으면 로그인 페이지로 이동
    return <Navigate to="/login" />;
  }

  // 로그인이 되어있으면 Layout을 보여주고, 자식 라우트(페이지)를 Outlet에 렌더링
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default function App() {
  const isLoggedIn = true; // 실제 앱에서는 이 값이 동적으로 변해야 함

  return (
    <BrowserRouter>
      <Routes>
        {/* 로그인 페이지 라우트 */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* 회원가입 페이지 라우트 */}
        <Route path="/signup" element={<SignupPage />} />

        {/* 로그인해야만 접근 가능한 보호된 라우트들 */}
        <Route element={<ProtectedLayout isLoggedIn={isLoggedIn} />}>
          <Route path="/agent" element={<AgentPage />} />
          <Route path="/suggestion" element={<SuggestionPage />} />
          <Route path="/my-templates" element={<MyTemplatePage />} />
        </Route>
        
        {/* 그 외 모든 경로는 로그인 상태에 따라 리다이렉트 */}
        <Route 
          path="*" 
          element={<Navigate to={isLoggedIn ? "/agent" : "/login"} />} 
        />
      </Routes>
    </BrowserRouter>
  );
}