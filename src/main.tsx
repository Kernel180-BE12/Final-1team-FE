// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import App from './App.tsx'

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )


// msw 를 위한 코드 수정
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// MSW를 비동기적으로 import하고 실행하는 함수
async function enableMocking() {
  if (!import.meta.env.DEV) {
    return;
  }

  const { worker } = await import('./mocks/browser');
  return worker.start();
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});