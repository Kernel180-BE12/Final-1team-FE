import React, { useState, useEffect } from 'react';
import { Box, Typography, Tab, Tabs, CircularProgress } from '@mui/material';
import AllSpacesContent from './components/AllSpacesContent';
import MembersContent from './components/MembersContent';
import PermissionManagementContent from './components/PermissionManagementContent';
import CreateSpaceModal from '../../components/modals/CreateSpaceModal';
import useAppStore from '../../store/useAppStore';

const SpacesPage = () => {
  const { spaces, fetchSpaces, isLoading: isStoreLoading } = useAppStore();

  const [currentTab, setCurrentTab] = useState('all-spaces');
  const [isModalOpen, setModalOpen] = useState(false);

  const [isPageLoading, setIsPageLoading] = useState(false);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  };

  // ★ 스페이스 생성 후, 스토어의 fetchSpaces를 호출하여 목록을 새로고침합니다.
  const handleSpaceCreated = async () => {
    setModalOpen(false);
    setIsPageLoading(true); // 페이지 로딩 시작
    await fetchSpaces(); 
    setIsPageLoading(false); // 페이지 로딩 종료
  };

  // ★ AllSpacesContent에서 데이터 변경이 일어났을 때 호출될 함수
  const handleDataChange = async () => {
    setIsPageLoading(true);
    await fetchSpaces();
    setIsPageLoading(false);
  };

  // 페이지가 처음 로드될 때 스페이스 목록을 가져옵니다.
  // (DashboardLayout에서도 호출하지만, 여기서도 호출하여 데이터 일관성을 보장할 수 있습니다)
  useEffect(() => {
    fetchSpaces();
  }, [fetchSpaces]);

  const getHeaderTitle = () => {
    switch (currentTab) {
      case 'all-spaces': return '전체 스페이스';
      case 'members': return '구성원';
      case 'permissions': return '권한 관리';
      default: return '';
    }
  };

  // ★ 최종 로딩 상태는 스토어의 로딩 상태 또는 페이지의 로딩 상태 중 하나라도 true일 때로 결정합니다.
  const isLoading = isStoreLoading || isPageLoading;

  return (
    <>
      <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{getHeaderTitle()}</Typography>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={currentTab} onChange={handleTabChange} aria-label="스페이스 관리 탭">
            <Tab label="전체 스페이스" value="all-spaces" />
            <Tab label="구성원" value="members" />
            <Tab label="권한 관리" value="permissions" />
          </Tabs>
        </Box>

        <Box sx={{ pt: 3, flexGrow: 1 }}>
          {currentTab === 'all-spaces' && (
            isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
            ) : (
              // ★ 7. 스토어에서 가져온 spaces와 새로고침 함수를 props로 전달합니다.
              <AllSpacesContent 
                spaces={spaces} 
                onAddSpace={() => setModalOpen(true)}
                onDataChange={handleDataChange}
              />
            )
          )}
          {currentTab === 'members' && <MembersContent />}
          {currentTab === 'permissions' && <PermissionManagementContent />}
        </Box>
      </Box>

      <CreateSpaceModal 
        open={isModalOpen} 
        onClose={() => setModalOpen(false)} 
        onSpaceCreated={handleSpaceCreated}
      />
    </>
  );
};

export default SpacesPage;
