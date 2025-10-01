import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  createTheme,
  ThemeProvider,
  CssBaseline,
  GlobalStyles,
} from '@mui/material';
import apiClient from '../api';
// ★ 1. 스낵바를 사용하기 위해 useAppStore를 import 합니다.
import useAppStore from '../store/useAppStore';

const interactiveTheme = createTheme({
    palette: {
        mode: 'light',
        primary: { main: '#1976d2' },
    },
    typography: {
        fontFamily: '"Jua", "Nunito", "Roboto", sans-serif',
        h4: { fontWeight: 700, color: '#4e342e' },
        h5: { fontWeight: 600, color: '#5d4037' },
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

interface ApiError {
  message: string;
}

const InvitedRegisterPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  // ★ 2. 스토어에서 showSnackbar 액션을 가져옵니다.
  const { showSnackbar } = useAppStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const invitedEmail = searchParams.get('email');
  const spaceId = searchParams.get('spaceId');

  useEffect(() => {
    if (invitedEmail) {
      setEmail(invitedEmail);
    }
  }, [invitedEmail]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
        setError('비밀번호가 일치하지 않습니다.');
        return;
    }
    setIsLoading(true);
    setError(null);

    try {
      await apiClient.post('/user/register', {
        email,
        password,
        name,
        username,
      });

      // ★★★★★ 수정된 최종 흐름 ★★★★★
      // 1. 더 명확한 의미의 성공 스낵바를 띄웁니다.
      showSnackbar({ message: '회원가입이 완료되었습니다! 로그인하여 새로 참여한 스페이스를 확인해보세요.', severity: 'success' });
      
      // 2. 로그인 페이지로 이동시킵니다.
      // 초대 정보를 쿼리 파라미터로 넘겨서, 로그인 후 초대 흐름을 이어갈 수 있도록 합니다.
      navigate(`/login?spaceId=${spaceId}&email=${email}`, { replace: true });

    } catch (err: unknown) {
      console.error("초대를 통한 회원가입 실패:", err);
      let errorMessage = '회원가입 중 오류가 발생했습니다.';
      
      if (apiClient.isAxiosError(err) && err.response?.data) {
          const errorData = err.response.data as ApiError;
          errorMessage = errorData.message || '회원가입 중 오류가 발생했습니다.';
      } else if (err instanceof Error) {
          errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={interactiveTheme}>
      <CssBaseline />
      <GlobalStyles styles={`
          @import url('https://fonts.googleapis.com/css2?family=Jua&family=Nunito:wght@700&display=swap' );
          body { 
            background-color: #f5f5fa;
          }
      `} />
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', p: 2 }}>
        <Paper
            elevation={8}
            sx={{
                width: '100%', maxWidth: '500px',
                background: 'rgba(255, 255, 255, 0.75)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '32px',
                p: { xs: 3, sm: 5 },
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                }
            }}
        >
          <Box component="form" onSubmit={handleRegister} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <Typography variant='h4' component="h1" align="center" sx={{ fontWeight: 'bold' }}>
                Jober
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'medium', mb: 2 }}>
                스페이스에 오신 것을 환영합니다!
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                초대를 수락하기 위해 회원가입을 완료해주세요.
              </Typography>

              <TextField fullWidth margin="dense" label="이름" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
              <TextField fullWidth margin="dense" label="아이디" value={username} onChange={(e) => setUsername(e.target.value)} />
              <TextField fullWidth margin="dense" label="이메일 주소" value={email} onChange={(e) => setEmail(e.target.value)} disabled={!!invitedEmail} />
              <TextField fullWidth margin="dense" label="비밀번호" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <TextField fullWidth margin="dense" label="비밀번호 확인" type="password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} />
              
              {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ mt: 2, py: 1.5 }}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} color="inherit"/> : '가입하고 스페이스 참여하기'}
              </Button>
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default InvitedRegisterPage;

