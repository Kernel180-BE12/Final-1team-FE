import axios from 'axios';
import type { AxiosInstance, AxiosError } from 'axios';

// AxiosInstance 타입을 확장하여 isAxiosError를 포함하는 새로운 타입을 정의합니다.
interface ApiClient extends AxiosInstance {
  isAxiosError(payload: unknown): payload is AxiosError;
}

// API 클라이언트 인스턴스를 생성합니다.
const apiClient = axios.create({
  // vite.config.ts의 프록시 설정에 맞춰 baseURL을 '/api'로 지정합니다.
  baseURL: '/api',
  // 모든 요청에 쿠키를 포함시킵니다.
  withCredentials: true,
}) as ApiClient; // [수정] 타입 단언을 사용하여 TypeScript 오류를 해결합니다.

// isAxiosError 타입 가드를 apiClient에서도 사용할 수 있도록 추가합니다.
apiClient.isAxiosError = axios.isAxiosError;

export default apiClient;