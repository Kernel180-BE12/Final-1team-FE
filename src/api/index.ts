// import axios from 'axios';
// import type { AxiosInstance, AxiosError } from 'axios';

// // AxiosInstance 타입을 확장하여 isAxiosError를 포함하는 새로운 타입을 정의합니다.
// interface ApiClient extends AxiosInstance {
//   isAxiosError(payload: unknown): payload is AxiosError;
// }

// // API 클라이언트 인스턴스를 생성합니다.
// const apiClient = axios.create({
//   // vite.config.ts의 프록시 설정에 맞춰 baseURL을 '/api'로 지정합니다.
//   baseURL: '/api',
//   // 모든 요청에 쿠키를 포함시킵니다.
//   withCredentials: true,
// }) as ApiClient; // [수정] 타입 단언을 사용하여 TypeScript 오류를 해결합니다.

// // isAxiosError 타입 가드를 apiClient에서도 사용할 수 있도록 추가합니다.
// apiClient.isAxiosError = axios.isAxiosError;

// export default apiClient;


import axios from 'axios';
import type { AxiosInstance, AxiosError } from 'axios';

interface ApiClient extends AxiosInstance {
  isAxiosError(payload: unknown): payload is AxiosError;
}

// 1. Vite 환경 변수를 사용하여 API의 기본 URL을 설정합니다.
//    - 개발 환경에서는 '/api' (Vite 프록시 사용)
//    - 배포(운영) 환경에서는 실제 백엔드 API 주소
const baseURL = import.meta.env.DEV ? '/api' : 'https://api.jober-1team.com';

const apiClient = axios.create({
  baseURL: baseURL,
  withCredentials: true, // 세션-쿠키 방식 인증을 위한 필수 옵션
} ) as ApiClient;

apiClient.isAxiosError = axios.isAxiosError;

export default apiClient;