import { useState } from 'react';
import { Box, Typography, Tab, Tabs,  } from '@mui/material';
import AllSpacesContent from './components/AllSpacesContent';
import MembersContent from './components/MembersContent';
import PermissionManagementContent from './components/PermissionManagementContent';
import CreateSpaceModal from '../../components/modals/CreateSpaceModal';

const SpacesPage = () => {
  // 1. SubSidebar 관련 상태(isSubSidebarOpen, selectedMenuKey)를 탭 상태로 변경합니다.
  const [currentTab, setCurrentTab] = useState('all-spaces');
  const [isModalOpen, setModalOpen] = useState(false);

  // 2. 탭 변경을 처리하는 핸들러 함수를 추가합니다.
  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  };

  const getHeaderTitle = () => {
    // 2. 각 탭에 맞는 헤더 타이틀을 반환합니다.
    switch (currentTab) {
      case 'all-spaces':
        return '전체 스페이스';
      case 'members':
        return '구성원';
      case 'permissions':
        return '권한 관리';
      default:
        return '';
    }
  };

  return (
    <>
      <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            {getHeaderTitle()}
          </Typography>
        </Box>

        {/* 3. Tabs 컴포넌트를 새로운 구조에 맞게 수정합니다. */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={currentTab} onChange={handleTabChange} aria-label="스페이스 관리 탭">
            <Tab label="전체 스페이스" value="all-spaces" />
            <Tab label="구성원" value="members" />
            <Tab label="권한 관리" value="permissions" />
          </Tabs>
        </Box>

        {/* 4. 탭 값에 따라 3가지 다른 콘텐츠를 보여줍니다. */}
        <Box sx={{ pt: 3, flexGrow: 1 }}>
          {currentTab === 'all-spaces' && (
            <AllSpacesContent onAddSpace={() => setModalOpen(true)} />
          )}
          {currentTab === 'members' && <MembersContent />}
          {currentTab === 'permissions' && <PermissionManagementContent />}
        </Box>
      </Box>

      <CreateSpaceModal open={isModalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default SpacesPage;