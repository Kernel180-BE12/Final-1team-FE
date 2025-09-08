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
