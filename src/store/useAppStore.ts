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
interface ApiTemplate {
  templateId: number;
  title: string;
  parameterizedTemplate: string;
}

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
  id: number;
  name: string;
  phoneNumber: string;
  email: string;
  tag?: string;
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
  createSpace: (payload: { spaceName: string; ownerName: string }) => Promise<Space>; // 스페이스 생성 액션
  fetchTemplates: () => Promise<void>;
  saveTemplate: (payload: TemplatePayload) => Promise<void>;
  fetchContacts: () => Promise<void>;
  addContacts: (payload: AddContactsPayload) => Promise<void>;
  updateContact: (payload: UpdateContactPayload) => Promise<void>;
  deleteContact: (contactId: number) => Promise<void>;
}

type AppState = MyState & MyActions;

// --- Zustand 스토어 생성 ---
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
        isSpacesInitialized: false,
      });
    }
  },
  setCurrentSpace: (space) => {
    if (get().currentSpace?.spaceId !== space?.spaceId) {
      set({ 
        currentSpace: space,
        templates: [],
        contacts: [],
      });
    }
  },
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
  createSpace: async (payload) => {
    const response = await apiClient.post<Space>('/spaces', payload);
    // 생성 성공 후, 스페이스 목록을 다시 불러와 화면을 갱신합니다.
    await get().fetchSpaces();
    // 생성된 스페이스 객체를 반환하여 즉시 다른 동작을 할 수 있도록 합니다.
    return response.data;
  },
  fetchTemplates: async () => {
    const currentSpaceId = get().currentSpace?.spaceId;
    if (!currentSpaceId) {
      set({ templates: [] }); 
      return;
    }
    set({ isLoadingTemplates: true });
    try {
      const response = await apiClient.get<ApiTemplate[]>(`/template/list?spaceId=${currentSpaceId}`);
      const templatesWithRealId = response.data.map((t) => ({
        id: t.templateId,
        title: t.title,
        parameterizedTemplate: t.parameterizedTemplate
      }));
      set({ templates: templatesWithRealId });
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
      // TODO: 연락처 API도 ID를 포함하여 응답을 주도록 백엔드에 요청해야 합니다.
      const response = await apiClient.get<{ contacts: { name: string; phoneNum: string; email: string; }[] }>(`/space/contact/${currentSpaceId}`);
      const fetchedContacts = response.data.contacts.map((c, index) => ({
        id: index,
        name: c.name,
        phoneNumber: c.phoneNum,
        email: c.email,
      }));
      set({ contacts: fetchedContacts });
    } catch {
      set({ contacts: [] }); 
    } finally {
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

const useAppStore = create<AppState>()(
  persist(
    (set, get, api) => ({
      ...stateCreator(set, get, api),
      ...actionsCreator(set, get),
    }),
    { name: 'app-storage' }
  )
);

export default useAppStore;

