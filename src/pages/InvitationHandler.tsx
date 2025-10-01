import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import apiClient from '../api';
import useAppStore from '../store/useAppStore';

interface ApiError {
  message: string;
}

const InvitationHandler = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { fetchSpaces, showSnackbar, setCurrentSpace, user } = useAppStore();
  const [statusMessage, setStatusMessage] = useState('초대를 확인하는 중입니다...');

  useEffect(() => {
    const handleInvitation = async () => {
      const spaceId = searchParams.get('spaceId');
      const email = searchParams.get('email');

      if (!spaceId || !email || !user) {
        showSnackbar({ message: '초대 정보가 올바르지 않거나 로그인 상태가 아닙니다.', severity: 'error' });
        navigate('/login', { replace: true });
        return;
      }

      try {
        // 1. 초대 수락 API 호출
        await apiClient.get(`/space-members/${spaceId}/accept`, {
          params: { email },
        });

        setStatusMessage('스페이스 정보를 동기화하는 중입니다...');
        
        // ★★★★★ 수정된 부분: 똑똑한 재시도 로직 ★★★★★
        let newSpace = null;
        let attempts = 0;
        const maxAttempts = 5; // 최대 5번 재시도 (총 5초 대기)

        // 스페이스 목록에 내가 참여한 스페이스가 잡힐 때까지 재시도합니다.
        while (!newSpace && attempts < maxAttempts) {
          console.log(`[InvitationHandler] 스페이스 목록 조회 시도 #${attempts + 1}`);
          await fetchSpaces();
          newSpace = useAppStore.getState().spaces.find(s => s.spaceId === Number(spaceId));
          
          if (!newSpace) {
            attempts++;
            // 1초 대기 후 다시 시도합니다.
            await new Promise(resolve => setTimeout(resolve, 1000)); 
          }
        }
        // ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★

        if (newSpace) {
            setCurrentSpace(newSpace);
            showSnackbar({ message: `${newSpace.spaceName} 스페이스에 오신 것을 환영합니다!`, severity: 'success' });
            navigate(`/spaces/${spaceId}/templates`, { replace: true });
        } else {
            // 재시도해도 실패한 경우
            console.error(`[InvitationHandler] ${maxAttempts}번 시도 후에도 spaceId: ${spaceId}를 찾지 못했습니다. /spaces/management로 이동합니다.`);
            showSnackbar({ message: '스페이스에 참여했지만, 목록을 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.', severity: 'warning' });
            navigate('/spaces/management', { replace: true });
        }

      } catch (error: unknown) {
        console.error('초대 수락 실패:', error);
        
        let errorMessage = '초대 수락에 실패했습니다.';
        if (apiClient.isAxiosError(error) && error.response?.data) {
            const errorData = error.response.data as ApiError;
            errorMessage = errorData.message || errorMessage;
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }

        showSnackbar({ message: errorMessage, severity: 'error' });
        navigate('/login', { replace: true });
      }
    };

    handleInvitation();
  }, [fetchSpaces, navigate, searchParams, setCurrentSpace, showSnackbar, user]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: 'grey.100' }}>
      <CircularProgress />
      <Typography sx={{ mt: 2 }} color="text.secondary">{statusMessage}</Typography>
    </Box>
  );
};

export default InvitationHandler;

