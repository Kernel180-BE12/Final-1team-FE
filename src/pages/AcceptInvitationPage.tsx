import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import apiClient from '../api';
import useAppStore from '../store/useAppStore';
import axios from 'axios';

const AcceptInvitationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { fetchSpaces, setCurrentSpace } = useAppStore();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [acceptedSpaceId, setAcceptedSpaceId] = useState<number | null>(null);

  useEffect(() => {
    const acceptInvite = async () => {
      const spaceId = searchParams.get('spaceId');
      const email = searchParams.get('email');

      if (!spaceId || !email) {
        setErrorMessage('초대 정보가 올바르지 않습니다. (spaceId 또는 email 누락)');
        setStatus('error');
        return;
      }

      try {
        await apiClient.get(`/space-members/${spaceId}/accept`, {
          params: { email },
        });
        
        setStatus('success');
        setAcceptedSpaceId(Number(spaceId));
        
        await fetchSpaces();

      } catch (error) {
        console.error('초대 수락 실패:', error);

        if (axios.isAxiosError(error)) {
          const errorData = error.response?.data as { message?: string };
          setErrorMessage(errorData?.message || '초대 수락 처리 중 오류가 발생했습니다.');
        } else {
          setErrorMessage('알 수 없는 오류가 발생했습니다. 네트워크 연결을 확인해주세요.');
        }
        setStatus('error');
      }
    };

    acceptInvite();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleGoToSpace = () => {
    if (acceptedSpaceId) {
      const newSpace = useAppStore.getState().spaces.find(s => s.spaceId === acceptedSpaceId);
      if (newSpace) {
        setCurrentSpace(newSpace);
      }
      navigate(`/spaces/${acceptedSpaceId}/templates`);
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <>
            <CircularProgress sx={{ mb: 3 }} />
            <Typography variant="h6">스페이스 초대를 수락하는 중입니다...</Typography>
            <Typography color="text.secondary">잠시만 기다려주세요.</Typography>
          </>
        );
      case 'success':
        return (
          <>
            <CheckCircleOutlineIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h5" fontWeight="bold">초대를 수락했습니다!</Typography>
            <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
              이제 스페이스의 멤버가 되셨습니다.
            </Typography>
            <Button variant="contained" size="large" onClick={handleGoToSpace}>
              스페이스로 이동하기
            </Button>
          </>
        );
      case 'error':
        return (
          <>
            <ErrorOutlineIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h5" fontWeight="bold">오류 발생</Typography>
            <Alert severity="error" sx={{ mt: 2, textAlign: 'left' }}>
              {errorMessage}
            </Alert>
            <Button variant="outlined" size="large" onClick={() => navigate('/login')} sx={{mt: 3}}>
              로그인 페이지로 이동
            </Button>
          </>
        );
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: 'grey.100' }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 4,
          textAlign: 'center',
          maxWidth: '480px',
          width: '100%',
          mx: 2
        }}
      >
        {renderContent()}
      </Paper>
    </Box>
  );
};

export default AcceptInvitationPage;
