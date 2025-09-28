import { create } from 'zustand';
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
  tag: string;
}

export interface NewContactPayload {
  name: string;
  phoneNumber: string;
  email: string;
  tag: string;
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
  isLoadingContacts: boolean;
  isSpacesInitialized: boolean;
  contacts: Contact[];
  allTags: string[]; 
  selectedTags: string[];
  filteredContacts: Contact[];
  selectedContactIds: number[];
  apiError: string | null;
  snackbar: {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  } | null;
}

interface MyActions {
  login: (userInfo: User) => void;
  logout: () => Promise<void>;
  setCurrentSpace: (space: Space | null) => void;
  fetchSpaces: () => Promise<void>;
  fetchTemplates: () => Promise<void>;
  saveTemplate: (payload: TemplatePayload) => Promise<void>;
  fetchContacts: () => Promise<void>;
  addContacts: (payload: { contacts: NewContactPayload[] }) => Promise<void>;
  updateContact: (contactToUpdate: Contact) => Promise<void>;
  deleteContact: (id: number) => Promise<void>;
  deleteSelectedContacts: () => Promise<void>;
  toggleTagFilter: (tag: string) => void;
  clearTagFilter: () => void;
  toggleContactSelection: (id: number) => void;
  toggleAllContactsSelection: () => void;
  setApiError: (error: string | null) => void;
  deleteAccount: () => Promise<void>; 
  showSnackbar: (payload: { message: string; severity: 'success' | 'error' | 'info' | 'warning' }) => void;
  hideSnackbar: () => void;
}

type AppState = MyState & MyActions;

// --- Zustand 스토어 생성 ---
const stateCreator = (): MyState => ({
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
  allTags: [],
  selectedTags: [],
  filteredContacts: [],
  selectedContactIds: [],
  apiError: null,
  snackbar: null,
});

const actionsCreator: (
  set: (partial: Partial<AppState> | ((state: AppState) => Partial<AppState>)) => void,
  get: () => AppState
) => MyActions = (set, get) => ({
  login: (userInfo) => set({ isLoggedIn: true, user: userInfo }),
  logout: async () => {
    try {
      await apiClient.post('/user/logout');
    } catch (error) {
      console.error('로그아웃 API 호출 실패:', error);
    } finally {
      set(stateCreator()); // 모든 상태를 초기 상태로 리셋
    }
  },

  setCurrentSpace: (space) => {
    if (get().currentSpace?.spaceId !== space?.spaceId) {
      set({ 
        currentSpace: space,
        templates: [],
        contacts: [],
        allTags: [],
        selectedTags: [],
        filteredContacts: [],
        selectedContactIds: [],
      });
    }
  },

  fetchSpaces: async () => {
    if (!get().isLoggedIn) return;
    set({ isLoading: true, apiError: null });
    try {
      const response = await apiClient.get<Omit<Space, 'color'>[]>('/spaces/list');
      const spacesWithColor = (response.data || []).map(space => ({
        ...space,
        color: getColorForId(space.spaceId),
      }));
      const sorted = [...spacesWithColor].sort((a, b) => a.spaceName.localeCompare(b.spaceName));
      
      const persistedCurrentSpace = get().currentSpace;
      let newCurrentSpace = get().currentSpace;
      if (!persistedCurrentSpace && sorted.length > 0) {
        newCurrentSpace = sorted[0];
      } else if (persistedCurrentSpace) {
        const isPersistedSpaceStillValid = sorted.some(s => s.spaceId === persistedCurrentSpace.spaceId);
        if (!isPersistedSpaceStillValid && sorted.length > 0) {
          newCurrentSpace = sorted[0];
        }
      }
      
      set({ spaces: spacesWithColor, sortedSpaces: sorted, currentSpace: newCurrentSpace });
    } catch (error) {
      console.error('스페이스 목록을 불러오는 데 실패했습니다:', error);
      set({ apiError: '데이터를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.' });
    } finally {
      set({ isLoading: false, isSpacesInitialized: true });
    }
  },

  fetchTemplates: async () => {
    const currentSpaceId = get().currentSpace?.spaceId;
    if (!currentSpaceId) return set({ templates: [] });
    
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
    await get().fetchContacts();
  },

  fetchContacts: async () => {
    const currentSpaceId = get().currentSpace?.spaceId;
    if (!currentSpaceId) return set({ contacts: [], filteredContacts: [], allTags: [] });
    
    set({ isLoadingContacts: true });
    try {
      const response = await apiClient.get<{ contacts: Contact[] }>(`/space/contact/${currentSpaceId}`);
      const fetchedContacts = response.data.contacts || [];
      const allTags = [...new Set(fetchedContacts.map(c => c.tag).filter(Boolean))].sort();
      
      const currentSelectedTags = get().selectedTags;
      const filtered = currentSelectedTags.length === 0
        ? fetchedContacts
        : fetchedContacts.filter(c => currentSelectedTags.includes(c.tag));
      
      set({ contacts: fetchedContacts, allTags, filteredContacts: filtered, selectedContactIds: [] });
    } catch (error) {
      console.error("연락처 목록 조회 실패:", error);
      set({ contacts: [], filteredContacts: [], allTags: [] });
    } finally {
      set({ isLoadingContacts: false });
    }
  },

  addContacts: async (payload) => {
    try {
      const currentSpaceId = get().currentSpace?.spaceId;
      if (!currentSpaceId) throw new Error("스페이스가 선택되지 않았습니다.");
      await apiClient.post('/space/contact', { spaceId: currentSpaceId, contacts: payload.contacts });
      await get().fetchContacts();
      get().showSnackbar({ message: '연락처가 성공적으로 추가되었습니다.', severity: 'success' });
    } catch (error) {
      console.error("연락처 추가 실패:", error);
      get().showSnackbar({ message: '연락처 추가에 실패했습니다.', severity: 'error' });
      throw error;
    }
  },

  updateContact: async (contactToUpdate) => {
    try {
      const currentSpaceId = get().currentSpace?.spaceId;
      if (!currentSpaceId) throw new Error("스페이스가 선택되지 않았습니다.");
      await apiClient.put('/space/contact', { spaceId: currentSpaceId, ...contactToUpdate });
      await get().fetchContacts();
      get().showSnackbar({ message: '연락처가 성공적으로 수정되었습니다.', severity: 'success' });
    } catch (error) {
      console.error("연락처 수정 실패:", error);
      get().showSnackbar({ message: '연락처 수정에 실패했습니다.', severity: 'error' });
      throw error;
    }
  },

  deleteContact: async (id) => { 
    try {
      const currentSpaceId = get().currentSpace?.spaceId;
      if (!currentSpaceId) throw new Error("스페이스가 선택되지 않았습니다.");
      await apiClient.delete('/space/contact', { data: { spaceId: currentSpaceId, id } });
      await get().fetchContacts();
      get().showSnackbar({ message: '연락처를 삭제했습니다.', severity: 'success' });
    } catch (error) {
      console.error("연락처 삭제 실패:", error);
      get().showSnackbar({ message: '연락처 삭제에 실패했습니다.', severity: 'error' });
      throw error;
    }
  },
  
  deleteSelectedContacts: async () => {
    try {
      const { currentSpace, selectedContactIds } = get();
      if (!currentSpace || selectedContactIds.length === 0) return;
      await apiClient.delete('/space/contact', { data: { spaceId: currentSpace.spaceId, ids: selectedContactIds } });
      set({ selectedContactIds: [] });
      await get().fetchContacts();
      get().showSnackbar({ message: '선택한 연락처를 삭제했습니다.', severity: 'success' });
    } catch (error) {
      console.error("일괄 삭제 실패:", error);
      get().showSnackbar({ message: '일괄 삭제에 실패했습니다.', severity: 'error' });
      throw error;
    }
  },

  deleteAccount: async () => {
    await apiClient.delete('/user/delete');
    await get().logout();
  },

  toggleTagFilter: (tag) => {
    const currentSelected = get().selectedTags;
    const newSelected = currentSelected.includes(tag)
      ? currentSelected.filter(t => t !== tag)
      : [...currentSelected, tag];
    const allContacts = get().contacts;
    const filtered = newSelected.length > 0 ? allContacts.filter(c => newSelected.includes(c.tag)) : allContacts;
    set({ selectedTags: newSelected, filteredContacts: filtered, selectedContactIds: [] });
  },

  clearTagFilter: () => {
    set({ selectedTags: [], filteredContacts: get().contacts, selectedContactIds: [] });
  },

  toggleContactSelection: (id) => {
    const selectedIds = get().selectedContactIds;
    const newSelectedIds = selectedIds.includes(id) ? selectedIds.filter(selectedId => selectedId !== id) : [...selectedIds, id];
    set({ selectedContactIds: newSelectedIds });
  },
  
  toggleAllContactsSelection: () => {
    const allVisibleIds = get().filteredContacts.map(c => c.id);
    const selectedIds = get().selectedContactIds;
    if (selectedIds.length === allVisibleIds.length) {
      set({ selectedContactIds: [] });
    } else {
      set({ selectedContactIds: allVisibleIds });
    }
  },

  setApiError: (error) => set({ apiError: error }),
  showSnackbar: (payload) => set({ snackbar: { ...payload, open: true } }),
  hideSnackbar: () => set({ snackbar: null }),
});

const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...stateCreator(),
      ...actionsCreator(set, get),
    }),
    { 
      name: 'app-storage',
      // persist a subset of the state
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        user: state.user,
        currentSpace: state.currentSpace,
      }),
    }
  )
);

export default useAppStore;