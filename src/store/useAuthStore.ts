import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

interface User {
  userId: number;
  username: string;
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  login: (userInfo: User) => void;
  logout: () => Promise<void>;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,

      // login 함수: 로그인 성공 시 호출되며, 사용자 정보와 로그인 상태를 업데이트합니다.
      login: (userInfo: User) => set({ isLoggedIn: true, user: userInfo }),


      logout: async () => {
        try {
          // 서버에 로그아웃 API를 호출하여 서버 측 세션을 만료시킵니다.
          await axios.post('/api/user/logout');
        } catch (error) {
          // 로그아웃 API 호출에 실패하더라도, 클라이언트 측의 상태는 초기화하는 것이
          // 사용자 경험에 더 좋습니다.
          console.error('로그아웃 API 호출 실패:', error);
        } finally {
          // API 호출 성공/실패 여부와 관계없이 클라이언트의 상태를 초기화합니다.
          set({ isLoggedIn: false, user: null });
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;

// 경로: src/store/useAuthStore.ts
// 아래 코드로 파일 전체를 교체해주세요.

// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';
// import axios from 'axios';

// interface User {
//   userId: number;
//   username: string;
// }

// // ★ 1. AuthState 인터페이스에 accessToken을 추가합니다.
// interface AuthState {
//   isLoggedIn: boolean;
//   user: User | null;
//   accessToken: string | null; // Access Token을 저장할 공간
//   login: (userInfo: User, token: string) => void; // login 함수가 토큰도 받도록 수정
//   logout: () => Promise<void>;
// }

// const useAuthStore = create<AuthState>()(
//   persist(
//     (set) => ({
//       isLoggedIn: false,
//       user: null,
//       accessToken: null, // ★ 2. accessToken의 초기값을 null로 설정합니다.

//       // ★ 3. login 함수가 userInfo와 token을 모두 받아서 상태를 업데이트하도록 수정합니다.
//       login: (userInfo: User, token: string) => set({ 
//         isLoggedIn: true, 
//         user: userInfo,
//         accessToken: token 
//       }),

//       logout: async () => {
//         try {
//           // 서버에 로그아웃 API를 호출합니다.
//           // 참고: 로그아웃 시에도 Authorization 헤더가 필요할 수 있습니다.
//           // apiClient를 사용하면 자동으로 토큰이 포함됩니다.
//           await axios.post('/api/user/logout');
//         } catch (error) {
//           console.error('로그아웃 API 호출 실패:', error);
//         } finally {
//           // ★ 4. 로그아웃 시 accessToken을 포함한 모든 인증 정보를 초기화합니다.
//           set({ isLoggedIn: false, user: null, accessToken: null });
//         }
//       },
//     }),
//     {
//       name: 'auth-storage',
//     }
//   )
// );

// export default useAuthStore;
