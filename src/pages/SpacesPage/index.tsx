import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Tab, Tabs, CircularProgress } from '@mui/material';
import AllSpacesContent from './components/AllSpacesContent';
import MembersContent from './components/MembersContent';
import PermissionManagementContent from './components/PermissionManagementContent';
import CreateSpaceModal from '../../components/modals/CreateSpaceModal';
import apiClient from '../../api';

// API 응답 데이터의 타입을 정의하고 외부에서 쓸 수 있도록 export
export interface Space {
  spaceId: number;
  spaceName: string;
  authority: 'ADMIN' | 'MEMBER';
}

const SpacesPage = () => {
  const [currentTab, setCurrentTab] = useState('all-spaces');
  const [isModalOpen, setModalOpen] = useState(false);
  
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  };

  // 스페이스 목록을 API로 가져오는 함수
  const fetchSpaces = useCallback(async () => {
    setIsLoading(true); // API 호출 직전에 true로 설정
    setError(null);
    try {
      const response = await apiClient.get<Space[]>('/spaces/list');
      setSpaces(response.data || []);
    } catch (err) {
      setError('스페이스 목록을 불러오는 데 실패했습니다.');
      console.error(err);
    } finally {
      setIsLoading(false); // API 호출이 성공하든 실패하든 끝나면 false로 설정
    }
  }, []); // 의존성 배열이 비어있으므로, 이 함수는 처음 한 번만 생성

  // 컴포넌트가 처음 보일 때, 그리고 '전체 스페이스' 탭이 활성화될 때 데이터를 가져옵니다.
  useEffect(() => {
    if (currentTab === 'all-spaces') {
        fetchSpaces();
    }
  }, [currentTab, fetchSpaces]); // currentTab 또는 fetchSpaces 함수가 변경될 때 실행됩니다.

  const getHeaderTitle = () => {
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
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
              </Box>
            ) : 
            error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              <AllSpacesContent 
                spaces={spaces} 
                onAddSpace={() => setModalOpen(true)}
                onDataChange={fetchSpaces}
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
        onSpaceCreated={fetchSpaces} // 'onSpaceCreated' prop으로 fetchSpaces 함수를 전달
      />
    </>
  );
};

export default SpacesPage;
