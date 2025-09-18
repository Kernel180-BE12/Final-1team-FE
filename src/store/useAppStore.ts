import { create } from 'zustand';
import type { StateCreator } from 'zustand'; 
import { persist } from 'zustand/middleware';
import apiClient from '../api';
import { getColorForId } from '../utils/colorUtils';

// --- 기본 타입 정의 ---
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

// --- 템플릿 타입 정의 ---
export interface Template {
  id: number;
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

// --- 연락처 타입 정의 ---
export interface Contact {
  id: number; // API 응답에는 없지만, 프론트에서 key prop 등으로 사용하기 위해 필요.
  name: string;
  phoneNumber: string;
  email: string;
  tag?: string; // 태그는 선택적일 수 있음.
}

export interface UpdateContactPayload extends Omit<Contact, 'id'> {
  contactId: number;
}

export interface AddContactsPayload {
  contacts: Omit<Contact, 'id' | 'tag'>[];
}


// --- 상태(State)와 액션(Actions) 타입 분리 ---
interface MyState {
  isLoggedIn: boolean;
  user: User | null;
  spaces: Space[];
  currentSpace: Space | null;
  isLoading: boolean;
  sortedSpaces: Space[];
  templates: Template[];
  isLoadingTemplates: boolean;
  contacts: Contact[];
  isLoadingContacts: boolean;
  isSpacesInitialized: boolean;
}

interface MyActions {
  login: (userInfo: User) => void;
  logout: () => Promise<void>;
  setCurrentSpace: (space: Space | null) => void;
  fetchSpaces: () => Promise<void>;
  fetchTemplates: () => Promise<void>;
  saveTemplate: (payload: TemplatePayload) => Promise<void>;
  fetchContacts: () => Promise<void>;
  addContacts: (payload: AddContactsPayload) => Promise<void>;
  updateContact: (payload: UpdateContactPayload) => Promise<void>;
  deleteContact: (contactId: number) => Promise<void>;
}

type AppState = MyState & MyActions;

// --- Zustand 스토어 생성 ---
// 1. 상태(State)와 상태를 변경하는 순수 함수들만 포함하는 StateCreator를 먼저 정의합니다.
const stateCreator: StateCreator<AppState, [], [], MyState> = (_set) => ({
  isLoggedIn: false,
  user: null,
  spaces: [],
  sortedSpaces: [],
  currentSpace: null,
  isLoading: false,
  templates: [],
  isLoadingTemplates: false,
  contacts: [],
  isLoadingContacts: false,
  isSpacesInitialized: false,
});


// 2. 액션(Actions)을 정의하는 별도의 함수를 만듭니다.
const actionsCreator: (
  set: (partial: Partial<AppState>) => void,
  get: () => AppState
) => MyActions = (set, get) => ({
  login: (userInfo) => set({ isLoggedIn: true, user: userInfo }),
  logout: async () => {
    try {
      await apiClient.post('/user/logout');
    } catch (error) {
      console.error('로그아웃 API 호출 실패:', error);
    } finally {
      set({ 
        isLoggedIn: false, 
        user: null,
        spaces: [],
        sortedSpaces: [],
        templates: [],
        contacts: [],
      });
    }
  },
  setCurrentSpace: (space) => set({ currentSpace: space }),
  fetchSpaces: async () => {
    if (!get().isLoggedIn) return;
    set({ isLoading: true });
    const persistedCurrentSpace = get().currentSpace;
    try {
      const response = await apiClient.get<Omit<Space, 'color'>[]>('/spaces/list');
      const spacesWithColor = (response.data || []).map(space => ({
        ...space,
        color: getColorForId(space.spaceId),
      }));
      const sorted = [...spacesWithColor].sort((a, b) => a.spaceName.localeCompare(b.spaceName));
      let newCurrentSpace = null;
      if (sorted.length > 0) {
        const isPersistedSpaceStillValid = persistedCurrentSpace 
          ? sorted.some(s => s.spaceId === persistedCurrentSpace.spaceId) 
          : false;
        newCurrentSpace = isPersistedSpaceStillValid ? persistedCurrentSpace : sorted[0];
      }
      set({ spaces: spacesWithColor, sortedSpaces: sorted, currentSpace: newCurrentSpace });
    } catch (error) {
      console.error('스페이스 목록을 불러오는 데 실패했습니다:', error);
      set({ spaces: [], sortedSpaces: [], currentSpace: null });
    } finally {
      set({ isLoading: false });
      set({ isSpacesInitialized: true });
    }
  },
  fetchTemplates: async () => {
    const currentSpaceId = get().currentSpace?.spaceId;
    if (!currentSpaceId) {
      set({ templates: [] });
      return;
    }
    set({ isLoadingTemplates: true });
    try {
      const response = await apiClient.get<Omit<Template, 'id'>[]>(`/template/list?spaceId=${currentSpaceId}`);
      const templatesWithId = response.data.map((t, index) => ({ ...t, id: index }));
      set({ templates: templatesWithId });
    } catch (error) {
      console.error('템플릿 목록을 불러오는 데 실패했습니다:', error);
      set({ templates: [] });
    } finally {
      set({ isLoadingTemplates: false });
    }
  },
  saveTemplate: async (payload) => {
    await apiClient.post('/template/save', payload);
    get().fetchTemplates();
  },
  fetchContacts: async () => {
    const currentSpaceId = get().currentSpace?.spaceId;
    if (!currentSpaceId) {
      set({ contacts: [] });
      return;
    }
    set({ isLoadingContacts: true });
    try {
      const response = await apiClient.get<{ contacts: { name: string; phoneNum: string; email: string; }[] }>(`/space/contact/${currentSpaceId}`);
      const fetchedContacts = response.data.contacts.map((c, index) => ({
        id: index,
        name: c.name,
        phoneNumber: c.phoneNum,
        email: c.email,
      }));
      set({ contacts: fetchedContacts });
    } catch {
      // 전역 핸들러가 사용자에게 에러를 보여주므로, 여기서는 콘솔 로그는 선택사항입니다.
      // 가장 중요한 것은 '실패 시 상태를 초기화'하는 것입니다.
      set({ contacts: [] }); 
    } finally {
      // 성공하든, 실패하든 로딩 상태는 항상 해제합니다.
      set({ isLoadingContacts: false });
    }
  },
  addContacts: async (payload) => {
    const currentSpaceId = get().currentSpace?.spaceId;
    if (!currentSpaceId) throw new Error("스페이스가 선택되지 않았습니다.");
    await apiClient.post('/space/contact', {
      spaceId: currentSpaceId,
      contacts: payload.contacts.map(c => ({ ...c, phoneNum: c.phoneNumber })),
    });
    get().fetchContacts();
  },
  updateContact: async (payload) => {
    const currentSpaceId = get().currentSpace?.spaceId;
    if (!currentSpaceId) throw new Error("스페이스가 선택되지 않았습니다.");
    await apiClient.put('/space/contact', {
      spaceId: currentSpaceId,
      ...payload,
    });
    get().fetchContacts();
  },
  deleteContact: async (contactId) => {
    const currentSpaceId = get().currentSpace?.spaceId;
    if (!currentSpaceId) throw new Error("스페이스가 선택되지 않았습니다.");
    await apiClient.delete('/space/contact', {
      data: {
        spaceId: currentSpaceId,
        contactId: contactId,
      }
    });
    get().fetchContacts();
  },
});

// 3. 최종적으로 스토어를 생성할 때, 상태와 액션을 합칩니다.
const useAppStore = create<AppState>()(
  persist(
    (set, get, api) => ({
      // 'any' 타입을 사용하던 세 번째 인자를 제거하여 오류를 해결합니다.
      ...stateCreator(set, get, api),          // 상태 부분
      ...actionsCreator(set, get),          // 액션 부분
    }),
    { name: 'app-storage' }
  )
);

export default useAppStore;