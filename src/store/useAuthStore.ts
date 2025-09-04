import { create } from 'zustand';

// 이 스토어(게시판)에 어떤 정보가 있는지 타입을 정의합니다.
interface AuthState {
  isLoggedIn: boolean; // 로그인 상태 (참/거짓)
  login: () => void;    // 로그인 상태로 바꾸는 함수
  logout: () => void;   // 로그아웃 상태로 바꾸는 함수
}

/**
 * @description 앱 전체의 로그인 상태를 관리하는 Zustand 스토어입니다.
 */
const useAuthStore = create<AuthState>((set) => ({
  // 초기 상태는 로그아웃된 상태(false)입니다.
  isLoggedIn: false,
  // login 함수를 호출하면, isLoggedIn을 true로 변경합니다.
  login: () => set({ isLoggedIn: true }),
  // logout 함수를 호출하면, isLoggedIn을 false로 변경합니다.
  logout: () => set({ isLoggedIn: false }),
}));

export default useAuthStore;