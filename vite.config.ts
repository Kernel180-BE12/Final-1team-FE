// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
//
// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // 1. path 모듈을 가져옵니다.

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react( )],
    // 2. 아래 resolve 객체를 추가합니다.
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
})
