import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // [추가] 개발 서버 설정을 추가합니다.
  server: {
    proxy: {
      // '/api'로 시작하는 모든 요청을 아래 target 주소로 전달합니다.
      '/api': {
        target: 'http://15.164.102.187:8080', // 백엔드 서버 주소
        changeOrigin: true, // 주소의 도메인을 바꿔주는 옵션
        rewrite: (path) => path.replace(/^\/api/, ''), // '/api' 부분을 지우고 요청
      },
    },
  },
})