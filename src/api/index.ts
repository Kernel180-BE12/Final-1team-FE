import axios from 'axios';
import type { AxiosInstance, AxiosError } from 'axios';
import useAppStore from '../store/useAppStore';

interface ApiClient extends AxiosInstance {
  isAxiosError(payload: unknown): payload is AxiosError;
}

// const baseURL = import.meta.env.DEV ? '/api' : 'https://api.jober-1team.com';
const baseURL = '/api';

const apiClient = axios.create({
  baseURL: baseURL,
  withCredentials: true, // 세션-쿠키 방식 인증을 위한 필수 옵션
} ) as ApiClient;

apiClient.isAxiosError = axios.isAxiosError;

// 응답 인터셉터(Response Interceptor) 추가
apiClient.interceptors.response.use(
  // (1) 성공적인 응답(2xx 상태 코드)은 그대로 통과시킵니다.
  (response) => {
    return response;
  },
  // (2) 에러가 발생한 응답을 여기서 가로챕니다.
  (error: AxiosError) => {
    // 💡 3. 만약 에러 응답의 상태 코드가 401(Unauthorized)이라면,
    if (error.response && error.response.status === 401) {
      
      // 💡 4. 현재 로그인 상태인지 확인합니다.
      // (로그인 페이지에서 발생한 401 에러는 무시하기 위함)
      const { isLoggedIn, logout } = useAppStore.getState();

      if (isLoggedIn) {
        // 💡 5. 강제로 로그아웃 처리를 실행합니다.
        // 이 logout 함수는 스토어의 상태를 초기화하고,
        // 필요하다면 로그아웃 API도 호출할 것입니다.
        logout();
        
        // [선택 사항] 사용자에게 세션 만료를 알리는 메시지를 띄울 수 있습니다.
        alert('세션이 만료되었습니다. 다시 로그인해주세요.');
      }
    }

    // 💡 6. 처리된 에러를 다시 반환하여, 각 API를 호출한 쪽에서도
    // 추가적인 에러 처리를 할 수 있도록 합니다.
    return Promise.reject(error);
  }
);

export default apiClient;