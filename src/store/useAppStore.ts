import { create } from 'zustand';
import type { StateCreator } from 'zustand'; 
import { persist } from 'zustand/middleware';
import apiClient from '../api';
import { getColorForId } from '../utils/colorUtils';


export interface Space {
  spaceId: number;
  spaceName: string;
  authority: 'ADMIN' | 'MEMBER';
  color?: string;
}

interface User {
  userId: number;
  username: string;
}

export interface Template {
  id: number; //key prop 등을 위해 임의로 추가
  title: string;
  parameterizedTemplate: string;
}

export interface TemplatePayload {
  spaceId: number;
  title: string;
  description: string;
  type: string;
  template: string;
  structuredTemplate: string;
  editableVariables: string;
  hasImage: boolean;
}

interface MyState {
  isLoggedIn: boolean;
  user: User | null;
  spaces: Space[];
  currentSpace: Space | null;
  isLoading: boolean;
  sortedSpaces: Space[];
  templates: Template[];
  isLoadingTemplates: boolean;
}

interface MyActions {
  login: (userInfo: User) => void;
  logout: () => Promise<void>;
  setCurrentSpace: (space: Space | null) => void;
  fetchSpaces: () => Promise<void>;
  fetchTemplates: () => Promise<void>;
  saveTemplate: (payload: TemplatePayload) => Promise<void>;
}

type AppState = MyState & MyActions;

const appStateCreator: StateCreator<AppState, [], [], AppState> = 
    (set, get) => ({
      // --- 초기 상태 ---
      isLoggedIn: false,
      user: null,
      spaces: [],
      sortedSpaces: [],
      currentSpace: null,
      isLoading: false,
      templates: [],
      isLoadingTemplates: false,

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

      // --- 스페이스 관련 액션 ---
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

      // --- 템플릿 관련 액션 ---
      fetchTemplates: async () => {
        const currentSpaceId = get().currentSpace?.spaceId;
        if (!currentSpaceId) {
          console.warn("템플릿을 불러올 스페이스가 선택되지 않았습니다.");
          set({ templates: [] }); // 스페이스가 없으면 템플릿 목록을 비웁니다.
          return;
        }

        set({ isLoadingTemplates: true });
        try {
          // GET /template/{spaceId} API를 사용합니다. (이게 더 명세에 맞아 보입니다)
          const response = await apiClient.get<Omit<Template, 'id'>[]>(`/template/list?spaceId=${currentSpaceId}`);
          
          // API 응답 데이터에 프론트엔드에서 사용할 고유 id를 추가합니다.
          const templatesWithId = response.data.map((t, index) => ({
            ...t,
            id: index, // 임시 ID. 백엔드가 templateId를 주면 그것으로 교체해야 합니다.
          }));

          set({ templates: templatesWithId });
        } catch (error) {
          console.error('템플릿 목록을 불러오는 데 실패했습니다:', error);
          set({ templates: [] }); // 에러 발생 시 목록을 비웁니다.
        } finally {
          set({ isLoadingTemplates: false });
        }
      },

      saveTemplate: async (payload: TemplatePayload) => {
        // 이 함수는 성공 시 아무것도 반환하지 않고, 실패 시 에러를 던집니다.
        // UI에서는 이 함수를 try-catch로 감싸서 사용해야 합니다.
        await apiClient.post('/template/save', payload);
        
        // 저장이 성공하면, 템플릿 목록을 새로고침하여 변경사항을 즉시 반영합니다.
        get().fetchTemplates();
      },

    });

  const useAppStore = create<AppState>()(
    persist(
      appStateCreator,
      { name: 'app-storage' }
  )
);

export default useAppStore;
