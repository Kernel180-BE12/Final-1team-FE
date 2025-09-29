// import axios from 'axios';
// import type { AxiosInstance, AxiosError } from 'axios';
// import useAppStore from '../store/useAppStore';

// let isLoggingOut = false;

// interface ApiClient extends AxiosInstance {
//   isAxiosError(payload: unknown): payload is AxiosError;
// }

// const baseURL = import.meta.env.DEV ? '/api' : 'https://api.jober-1team.com';

// const apiClient = axios.create({
//   baseURL: baseURL,
//   withCredentials: true, // 세션-쿠키 방식 인증을 위한 필수 옵션
// } ) as ApiClient;

// apiClient.isAxiosError = axios.isAxiosError;


// // 응답 인터셉터(Response Interceptor) 추가
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error: AxiosError) => {
//     // 💡 1. 에러 응답이 없는 경우 (네트워크 오류 등)를 먼저 처리합니다.
//     if (!error.response) {
//       // [선택] 사용자에게 네트워크 오류를 알릴 수 있습니다.
//       alert('네트워크 연결 상태를 확인해주세요.');
//       console.error('Network Error:', error);
//       return Promise.reject(error);
//     }

//     // 💡 2. 에러 상태 코드에 따라 분기 처리합니다.
//     const status = error.response.status;
//     const url = error.config?.url;
//     const { logout } = useAppStore.getState();

//     const isAuthRequest = 
//       url?.endsWith('/user/login') || 
//       url?.endsWith('/user/id/check') || 
//       url?.endsWith('/user/email/check');

//     if (isAuthRequest) {
//       return Promise.reject(error);
//     }

//     switch (status) {
//       case 401:
//       case 403: {
//         const isLoginAttempt = error.config?.url?.endsWith('/user/login');
//         // 💡 2. 만약 '로그인 API'에서 발생한 에러라면,
//         //    이것은 '로그인 실패'이므로, 인터셉터는 아무것도 하지 않고
//         //    에러를 원래 호출했던 LoginPage로 그대로 돌려보내줍니다.
//         if (isLoginAttempt) {
//           break; // switch 문을 빠져나가 맨 아래의 Promise.reject(error)를 실행
//         }


        

//        // 💡 3. '로그인 API'가 아닌 다른 모든 API에서 발생한 401/403 에러는
//         //    '세션 만료'로 간주하고, 기존의 강제 로그아웃 로직을 실행합니다.
//         if (isLoggingOut) {
//           return new Promise(() => {});
//       }

//       isLoggingOut = true;
      
//       logout();
//       alert('세션이 만료되었거나 접근 권한이 없습니다. 다시 로그인해주세요.');
      
//       // 5. 페이지 이동 후, 다시 로그아웃을 시도할 수 있도록 플래그를 초기화합니다.
//         setTimeout(() => {
//           isLoggingOut = false;
//         }, 1500); // (조금 더 넉넉하게 1.5초)
        
//         return new Promise(() => {});
//       }
      
//       default: {
//         alert('서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
//         break;
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default apiClient;


import axios from 'axios';
import type { AxiosInstance, AxiosError } from 'axios';
import useAppStore from '../store/useAppStore';

let isLoggingOut = false;

interface ApiClient extends AxiosInstance {
  isAxiosError(payload: unknown): payload is AxiosError;
}

const baseURL = import.meta.env.DEV ? '/api' : 'https://api.jober-1team.com';

const apiClient = axios.create({
  baseURL: baseURL,
  withCredentials: true, // 세션-쿠키 방식 인증을 위한 필수 옵션
} ) as ApiClient;

apiClient.isAxiosError = axios.isAxiosError;


// 응답 인터셉터(Response Interceptor) 추가
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (!error.response) {
      alert('네트워크 연결 상태를 확인해주세요.');
      console.error('Network Error:', error);
      return Promise.reject(error);
    }

    const status = error.response.status;
    const url = error.config?.url;
    // 서버가 응답으로 보낸 에러 메시지를 추출합니다.
    const message = (error.response.data as { message?: string })?.message;
    const { logout } = useAppStore.getState();

    // 로그인, 아이디/이메일 중복 확인 등 인증 관련 요청은 인터셉터가 처리하지 않습니다.
    const isAuthRequest = 
      url?.endsWith('/user/login') || 
      url?.endsWith('/user/id/check') || 
      url?.endsWith('/user/email/check');

    if (isAuthRequest) {
      return Promise.reject(error);
    }

    switch (status) {
      // ★ 1. 401 (인증 실패) 에러 처리: 세션 만료로 간주하고 로그아웃시킵니다.
      case 401: {
        if (isLoggingOut) {
          return new Promise(() => {});
        }
        isLoggingOut = true;
      
        logout();
        alert(message || '세션이 만료되었습니다. 다시 로그인해주세요.');
      
        setTimeout(() => {
          isLoggingOut = false;
        }, 1500);
        
        return new Promise(() => {});
      }
      
      // ★ 2. 403 (권한 없음) 에러 처리: 로그아웃시키지 않고, 안내 메시지만 보여줍니다.
      case 403: {
        alert(message || '이 작업에 대한 권한이 없습니다.');
        break; // switch 문을 빠져나가 에러를 전파합니다.
      }
      
      default: {
        // 다른 모든 에러에 대해서도 서버 메시지가 있다면 보여줍니다.
        alert(message || '서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
        break;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

