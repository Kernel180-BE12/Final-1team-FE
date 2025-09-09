import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, TextField, Button, CircularProgress, Stack, createTheme, ThemeProvider, CssBaseline, GlobalStyles } from '@mui/material';
import apiClient from '../api';

const interactiveTheme = createTheme({
    palette: {
        mode: 'light',
        primary: { main: '#1976d2' },
    },
    typography: {
        fontFamily: '"Jua", "Nunito", "Roboto", sans-serif',
        h5: { fontWeight: 'bold', color: '#4e342e' },
        body2: { color: '#795548' },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '999px',
                    textTransform: 'none',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    transition: 'all 0.2s ease-in-out',
                },
            },
        },
    },
});

const PasswordResetPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'validating' | 'valid' | 'invalid'>('validating');
  const [userEmail, setUserEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('invalid');
      return;
    }
    
    apiClient.get(`/user/validate-token?token=${token}`)
      .then((response) => {
        setUserEmail(response.data.email);
        setStatus('valid');
      })
      .catch(() => {
        setStatus('invalid');
      });

  }, [token]);

  const validatePassword = () => {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/;
    if (!newPassword) {
      setPasswordError('새 비밀번호를 입력해주세요.');
      return false;
    }
    if (!passwordRegex.test(newPassword)) {
      setPasswordError('8~16자의 영문, 숫자, 특수문자 조합이어야 합니다.');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const validateConfirmPassword = () => {
    if (!confirmPassword) {
      setConfirmPasswordError('비밀번호를 다시 한번 입력해주세요.');
      return false;
    }
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError('비밀번호가 일치하지 않습니다.');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  const handleSubmit = async () => {
    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();

    if (isPasswordValid && isConfirmPasswordValid) {
      setApiError('');
      try {
        await apiClient.post('/user/reset-password', { token, newPassword });
        alert('비밀번호가 성공적으로 변경되었습니다!');
        navigate('/login');
      } catch (error) {
        if (apiClient.isAxiosError(error) && error.response) {
            const data = error.response.data;
            if (typeof data === 'object' && data !== null && 'message' in data && typeof (data as { message: unknown }).message === 'string') {
                setApiError((data as { message: string }).message);
            } else {
                setApiError('오류가 발생했습니다. 다시 시도해주세요.');
            }
        } else {
            setApiError('알 수 없는 오류가 발생했습니다.');
        }
      }
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'validating':
        return <CircularProgress />;
      case 'invalid':
        return <Typography color="error">만료되었거나 유효하지 않은 링크입니다.</Typography>;
      case 'valid':
        return (
          <Stack spacing={2.5} sx={{ width: '100%' }}>
            <TextField
              label="이메일"
              value={userEmail}
              fullWidth
              disabled
              variant="filled"
            />
            <TextField
              label="새 비밀번호"
              type="password"
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              error={!!passwordError}
              helperText={passwordError || '8~16자의 영문, 숫자, 특수문자 조합이어야 합니다.'}
              onBlur={validatePassword}
            />
            <TextField
              label="새 비밀번호 확인"
              type="password"
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={!!confirmPasswordError}
              helperText={confirmPasswordError}
              onBlur={validateConfirmPassword}
            />
            {apiError && <Typography color="error" variant="caption">{apiError}</Typography>}
            <Button variant="contained" fullWidth onClick={handleSubmit} size="large" sx={{ mt: 1, py: 1.5 }}>
              변경 완료
            </Button>
          </Stack>
        );
    }
  };

  return (
    <ThemeProvider theme={interactiveTheme}>
      <CssBaseline />
      <GlobalStyles styles={`
          @import url('https://fonts.googleapis.com/css2?family=Jua&family=Nunito:wght@700&display=swap');
          @keyframes animated-gradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
          body { background: linear-gradient(-45deg, #e0eafc, #cfdef3, #e7eaf6, #a7bfe8); background-size: 400% 400%; animation: animated-gradient 15s ease infinite; }
      `} />
      <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '100vh'
          }}
      >
        <Paper 
          elevation={8}
          sx={{ 
              p: 4, width: '100%', maxWidth: '420px', textAlign: 'center', 
              borderRadius: '32px',
              background: 'rgba(255, 255, 255, 0.75)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
              '&:hover': {
                  transform: 'translateY(-10px)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
              }
          }}
        >
          <Typography 
            variant="h5" 
            sx={{ fontWeight: 'bold', mb: 4, cursor: 'pointer' }}
            onClick={() => navigate('/agent')}
          >
            AI 템플릿 생성기
          </Typography>
          {renderContent()}
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default PasswordResetPage;

