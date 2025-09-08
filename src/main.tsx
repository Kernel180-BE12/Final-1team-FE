// msw 를 위한 코드 수정
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import axios from 'axios';

// MSW를 비동기적으로 import하고 실행하는 함수
async function enableMocking() {
  // .env 파일의 VITE_API_MOCKING 변수가 'enabled'일 때만 MSW를 활성화합니다.
  if (import.meta.env.VITE_API_MOCKING !== 'enabled') {
    return;
  }
  
  const { worker } = await import('./mocks/browser');

  // onUnhandledRequest: 'bypass' 옵션을 주면
  // MSW가 처리하지 않는 요청(예: 실제 백엔드 일부 API)은 그대로 통과시킵니다.
  return worker.start({
    onUnhandledRequest: 'bypass',
  });
}

// enableMocking 함수를 실행하고, 완료되면 React 앱을 렌더링합니다.
enableMocking().then(() => {
  // React 앱이 렌더링되기 직전에 axios 전역 설정을 추가합니다.
  // 앞으로 모든 axios 요청에 쿠키가 자동으로 포함됩니다.
  axios.defaults.withCredentials = true;

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});