import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

/** 로그인 페이지: 우리 서비스의 첫 관문입니다. */
const LoginPage = () => {
  return <div>로그인 페이지</div>;
};

/** AI 에이전트 페이지: 사용자가 AI에게 첫 요청을 보내는 곳입니다. */
const AgentPage = () => {
  return <div>AI 에이전트에게 요청하는 첫 페이지</div>;
};

/** 제안 페이지: AI가 템플릿을 '추천'하거나 '생성'하는 핵심 작업 공간입니다. */
const SuggestionPage = () => {
  return <div>AI가 템플릿을 추천/생성하는 페이지</div>;
};

/** 내 템플릿 페이지: 저장된 모든 템플릿을 모아보는 보관함입니다. */
const MyTemplatesPage = () => {
  return <div>내 템플릿 보관함 페이지</div>;
};

export default function App() {
  const isLoggedIn = true;

  return (
    <Router>
      <Routes>
        {isLoggedIn ? (
          <>
            <Route path="/agent" element={<AgentPage />} />
            <Route path="/suggestion" element={<SuggestionPage />} />
            <Route path="/my-templates" element={<MyTemplatesPage />} />
            <Route path="*" element={<Navigate to="/agent" />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}