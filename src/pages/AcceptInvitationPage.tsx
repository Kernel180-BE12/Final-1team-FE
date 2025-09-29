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
        // Swagger 명세에 따라 API를 호출합니다.
        await apiClient.get(`/space-members/${spaceId}/accept`, {
          params: { email },
        });
        
        setStatus('success');
        setAcceptedSpaceId(Number(spaceId));
        
        // 초대가 수락되었으므로, 최신 스페이스 목록을 다시 불러옵니다.
        await fetchSpaces();

      } catch (error) { // [수정] (error: any) 대신 (error) 사용
        console.error('초대 수락 실패:', error);

        // [수정] error가 AxiosError인지 확인하여 안전하게 처리
        if (axios.isAxiosError(error)) {
          // Axios 에러인 경우, 서버에서 보낸 에러 메시지를 사용
          const errorData = error.response?.data as { message?: string };
          setErrorMessage(errorData?.message || '초대 수락 처리 중 오류가 발생했습니다.');
        } else {
          // Axios 에러가 아닌 경우 (네트워크 오류 등), 일반적인 메시지 표시
          setErrorMessage('알 수 없는 오류가 발생했습니다. 네트워크 연결을 확인해주세요.');
        }
        setStatus('error');
      }
    };

    acceptInvite();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]); // searchParams가 변경될 때 한 번만 실행

  const handleGoToSpace = () => {
    if (acceptedSpaceId) {
      // Zustand 스토어의 currentSpace를 방금 수락한 스페이스로 설정합니다. (선택적)
      const newSpace = useAppStore.getState().spaces.find(s => s.spaceId === acceptedSpaceId);
      if (newSpace) {
        setCurrentSpace(newSpace);
      }
      navigate(`/spaces/${acceptedSpaceId}/templates`); // 해당 스페이스의 템플릿 페이지로 이동
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
