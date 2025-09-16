// // 경로: src/store/useAppStore.ts (useAuthStore.ts에서 이름 변경)

// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';
// import apiClient from '../api';

// // ★ 1. Space 타입을 여기서도 정의합니다. (전역적으로 사용될 타입)
// export interface Space {
//   spaceId: number;
//   spaceName: string;
//   authority: 'ADMIN' | 'MEMBER';
// }

// interface User {
//   userId: number;
//   username: string;
// }

// // ★ 2. 스토어의 상태(State)에 currentSpace와 spaces를 추가합니다.
// interface AppState {
//   // 기존 인증 관련 상태
//   isLoggedIn: boolean;
//   user: User | null;
//   login: (userInfo: User) => void;
//   logout: () => Promise<void>;

//   // ★ 새로운 스페이스 관련 상태
//   spaces: Space[];
//   currentSpace: Space | null;
//   setSpaces: (spaces: Space[]) => void;
//   setCurrentSpace: (space: Space | null) => void;
//   fetchSpaces: () => Promise<void>; // ★ 스페이스 목록을 불러오는 액션 추가
// }

// const useAppStore = create<AppState>()(
//   persist(
//     (set, get) => ({ // ★ get을 추가하여 스토어의 다른 상태에 접근할 수 있게 합니다.
//       // --- 기존 상태 ---
//       isLoggedIn: false,
//       user: null,
//       login: (userInfo: User) => set({ isLoggedIn: true, user: userInfo }),
//       logout: async () => {
//         try {
//           await apiClient.post('/api/user/logout');
//         } catch (error) {
//           console.error('로그아웃 API 호출 실패:', error);
//         } finally {
//           // ★ 로그아웃 시 스페이스 정보도 함께 초기화합니다.
//           set({ isLoggedIn: false, user: null, spaces: [], currentSpace: null });
//         }
//       },

//       // --- ★ 새로운 스페이스 관련 상태 및 액션 ---
//       spaces: [],
//       currentSpace: null,
      
//       // 스페이스 목록 전체를 업데이트하는 액션
//       setSpaces: (spaces: Space[]) => set({ spaces }),

//       // 현재 선택된 스페이스를 업데이트하는 액션
//       setCurrentSpace: (space: Space | null) => set({ currentSpace: space }),

//       // 스페이스 목록을 API로 불러오는 비동기 액션
//       fetchSpaces: async () => {
//         // 로그인 상태가 아니면 API를 호출하지 않습니다.
//         if (!get().isLoggedIn) return;

//         try {
//           const response = await apiClient.get<Space[]>('/api/spaces/list');
//           const fetchedSpaces = response.data || [];
//           set({ spaces: fetchedSpaces });

//           // 목록을 불러온 후, 현재 선택된 스페이스를 설정합니다.
//           const current = get().currentSpace;
//           if (fetchedSpaces.length > 0) {
//             const previouslySelected = current ? fetchedSpaces.find(s => s.spaceId === current.spaceId) : null;
//             set({ currentSpace: previouslySelected || fetchedSpaces[0] });
//           } else {
//             set({ currentSpace: null });
//           }
//         } catch (error) {
//           console.error('스페이스 목록을 불러오는 데 실패했습니다:', error);
//           // 에러 발생 시 스페이스 관련 상태를 초기화합니다.
//           set({ spaces: [], currentSpace: null });
//         }
//       },
//     }),
//     {
//       name: 'app-storage',
//     }
//   )
// );

// export default useAppStore;




import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import apiClient from '../api';
import { getColorForId } from '../utils/colorUtils';

export interface Space {
  spaceId: number;
  spaceName: string;
  authority: 'ADMIN' | 'MEMBER';
  color?: string;  // ?는 선택적 속성
}

interface User {
  userId: number;
  username: string;
}

// ★ 1. AppState 인터페이스에 isLoading 상태를 추가합니다.
interface AppState {
  isLoggedIn: boolean;
  user: User | null;
  spaces: Space[];
  currentSpace: Space | null;
  isLoading: boolean;
  sortedSpaces: Space[];
  login: (userInfo: User) => void;
  logout: () => Promise<void>;
  setCurrentSpace: (space: Space | null) => void;
  fetchSpaces: () => Promise<void>;
}

const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // --- 초기 상태 ---
      isLoggedIn: false,
      user: null,
      spaces: [],
      sortedSpaces: [],
      currentSpace: null,
      isLoading: false,

      // --- 액션(함수)들 ---
      login: (userInfo: User) => set({ isLoggedIn: true, user: userInfo }),

      logout: async () => {
        try {
          await apiClient.post('/user/logout');
        } catch (error) {
          console.error('로그아웃 API 호출 실패:', error);
        } finally {
          set({ isLoggedIn: false, user: null, spaces: [], sortedSpaces: [], currentSpace: null, isLoading: false });
        }
      },

      // setSpaces: (spaces: Space[]) => set({ spaces }),
      setCurrentSpace: (space: Space | null) => set({ currentSpace: space }),

      fetchSpaces: async () => {
        if (!get().isLoggedIn) {
          return;
        }        
        // ★ 2. API 호출 직전에 isLoading을 true로 설정합니다.
        set({ isLoading: true });

        try {
          const response = await apiClient.get<Omit<Space, 'color'>[]>('/spaces/list');

          const spacesWithColor = (response.data || []).map(space => ({
            ...space,
            color: getColorForId(space.spaceId), // ★ 각 스페이스 ID에 맞는 색상 부여
          }));

          const sorted = [...spacesWithColor].sort((a, b) => a.spaceName.localeCompare(b.spaceName));

          set({ spaces: spacesWithColor, sortedSpaces: sorted });

          const current = get().currentSpace;
          if (sorted.length > 0) {
            const previouslySelected = current ? sorted.find(s => s.spaceId === current.spaceId) : null;
            set({ currentSpace: previouslySelected || sorted[0] });
          } else {
            set({ currentSpace: null });
          }
        } catch (error) {
          console.error('스페이스 목록을 불러오는 데 실패했습니다:', error);
          set({ spaces: [], sortedSpaces: [], currentSpace: null });
        } finally {
          // ★ 3. API 호출이 성공하든 실패하든, 끝나면 isLoading을 false로 설정합니다.
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'app-storage',
    }
  )
);

export default useAppStore;
