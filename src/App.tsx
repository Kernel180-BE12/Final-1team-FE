import React from 'react';
import { BrowserRouter, Routes, Route, Navigate,} from 'react-router-dom';

import PublicLayout from './components/PublicLayout';
import DashboardLayout from './components/DashboardLayout';

import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AgentPage from './pages/AgentPage';
import SuggestionPage from './pages/SuggestionPage';
import MyTemplatePage from './pages/MyTemplatePage';
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
            <Route path="/my-templates" element={<MyTemplatePage />} />
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


// // 로그인 상태에 따라 Layout을 보여주거나 로그인 페이지로 보내는 컴포넌트
// const ProtectedLayout = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
//   if (!isLoggedIn) {
//     // 로그인이 안 되어있으면 로그인 페이지로 이동
//     return <Navigate to="/login" />;
//   }

//   // 로그인이 되어있으면 Layout을 보여주고, 자식 라우트(페이지)를 Outlet에 렌더링
//   return (
//     <Layout>
//       <Outlet />
//     </Layout>
//   );
// };

// export default function App() {
//   const isLoggedIn = true; // 실제 앱에서는 이 값이 동적으로 변해야 함

//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* 로그인 페이지 라우트 */}
//         <Route path="/login" element={<LoginPage />} />
        
//         {/* 회원가입 페이지 라우트 */}
//         <Route path="/signup" element={<SignupPage />} />

//         {/* 로그인해야만 접근 가능한 보호된 라우트들 */}
//         <Route element={<ProtectedLayout isLoggedIn={isLoggedIn} />}>
//           <Route path="/agent" element={<AgentPage />} />
//           <Route path="/suggestion" element={<SuggestionPage />} />
//           <Route path="/my-templates" element={<MyTemplatePage />} />
//           <Route path="/spaces" element={<SpacesPage />} />
//         </Route>
        
//         {/* 그 외 모든 경로는 로그인 상태에 따라 리다이렉트 */}
//         <Route path="*" element={<Navigate to={isLoggedIn ? "/agent" : "/login"} />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }