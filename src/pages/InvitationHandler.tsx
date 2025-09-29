import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import apiClient from '../api';
import useAppStore from '../store/useAppStore';

// ★ 1. API 에러 응답의 타입을 명확하게 정의합니다.
interface ApiError {
  message: string;
}

const InvitationHandler = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { fetchSpaces, showSnackbar, setCurrentSpace } = useAppStore();

  useEffect(() => {
    const handleInvitation = async () => {
      const spaceId = searchParams.get('spaceId');
      const email = searchParams.get('email');

      if (!spaceId || !email) {
        showSnackbar({ message: '초대 정보가 올바르지 않습니다.', severity: 'error' });
        navigate('/login', { replace: true });
        return;
      }

      try {
        await apiClient.get(`/space-members/${spaceId}/accept`, {
          params: { email },
        });

        await fetchSpaces();
        
        const newSpace = useAppStore.getState().spaces.find(s => s.spaceId === Number(spaceId));

        if (newSpace) {
            setCurrentSpace(newSpace);
            showSnackbar({ message: `${newSpace.spaceName} 스페이스에 오신 것을 환영합니다!`, severity: 'success' });
            navigate(`/spaces/${spaceId}/templates`, { replace: true });
        } else {
            showSnackbar({ message: '스페이스에 참여했지만, 정보를 불러오는 데 실패했습니다.', severity: 'warning' });
            navigate('/spaces/management', { replace: true });
        }

      } catch (error: unknown) {
        console.error('초대 수락 실패:', error);
        
        let errorMessage = '초대 수락에 실패했습니다.';
        
        // ★ 2. isAxiosError로 확인 후, data 타입을 ApiError로 단언(as)해줍니다.
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

  }, [fetchSpaces, navigate, searchParams, setCurrentSpace, showSnackbar]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: 'grey.100' }}>
      <CircularProgress />
      <Typography sx={{ mt: 2 }} color="text.secondary">초대를 확인하는 중입니다...</Typography>
    </Box>
  );
};

export default InvitationHandler;

