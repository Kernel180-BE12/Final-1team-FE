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
          set({ isLoggedIn: false, user: null, spaces: [], sortedSpaces: [], currentSpace: null, isLoading: false, });
        }
      },

      // setSpaces: (spaces: Space[]) => set({ spaces }),
      setCurrentSpace: (space: Space | null) => set({ currentSpace: space }),

      fetchSpaces: async () => {
        if (!get().isLoggedIn) {
          return;
        }        

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
