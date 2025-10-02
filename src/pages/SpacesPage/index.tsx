import React, { useState, useEffect } from 'react';
import { Box, Tab, Tabs, CircularProgress } from '@mui/material';
import AllSpacesContent from './components/AllSpacesContent';
import MembersContent from './components/MembersContent';
import CreateSpaceModal from '../../components/modals/CreateSpaceModal';
import useAppStore from '../../store/useAppStore';
import PageLayout from '../../components/layouts/PageLayout'; // [추가] PageLayout import

const SpacesPage = () => {
  const { spaces, fetchSpaces, isLoading: isStoreLoading } = useAppStore();

  const [currentTab, setCurrentTab] = useState('all-spaces');
  const [isModalOpen, setModalOpen] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  };

  const handleSpaceCreated = async () => {
    setModalOpen(false);
    setIsPageLoading(true);
    await fetchSpaces(); 
    setIsPageLoading(false);
  };

  const handleDataChange = async () => {
    setIsPageLoading(true);
    await fetchSpaces();
    setIsPageLoading(false);
  };

  useEffect(() => {
    fetchSpaces();
  }, [fetchSpaces]);

  const getHeaderTitle = () => {
    switch (currentTab) {
      case 'all-spaces': return '전체 스페이스';
      case 'members': return '구성원';
      default: return '스페이스 관리'; // 기본값 설정
    }
  };

  const isLoading = isStoreLoading || isPageLoading;

  return (
    <>
      {/* [수정] 기존 레이아웃을 PageLayout으로 감쌉니다. */}
      <PageLayout title={getHeaderTitle()}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={currentTab} onChange={handleTabChange} aria-label="스페이스 관리 탭">
            <Tab label="전체 스페이스" value="all-spaces" />
            <Tab label="구성원" value="members" />
          </Tabs>
        </Box>

        <Box sx={{ pt: 3, flexGrow: 1 }}>
          {currentTab === 'all-spaces' && (
            isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
            ) : (
              <AllSpacesContent 
                spaces={spaces} 
                onAddSpace={() => setModalOpen(true)}
                onDataChange={handleDataChange}
              />
            )
          )}
          {currentTab === 'members' && <MembersContent />}
        </Box>
      </PageLayout>

      <CreateSpaceModal 
        open={isModalOpen} 
        onClose={() => setModalOpen(false)} 
        onSpaceCreated={handleSpaceCreated}
      />
    </>
  );
};

export default SpacesPage;
