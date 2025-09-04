import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Stack,
  IconButton,
  InputAdornment,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import useAuthStore from '../store/useAuthStore';
import PasswordResetModal from '../components/modals/PasswordResetModal';
import axios from 'axios';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [isModalOpen, setModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleLogin = async () => {
    // 유효성 검사
    let isValid = true;
    if (!username) {
      setUsernameError('아이디를 입력해주세요.');
      isValid = false;
    } else {
      setUsernameError('');
    }

    if (!password) {
      setPasswordError('비밀번호를 입력해주세요.');
      isValid = false;
    } else if (password.length < 8) {
        setPasswordError('비밀번호는 8자 이상이어야 합니다.');
        isValid = false;
    } else {
      setPasswordError('');
    }

    if (!isValid) {
      return;
    }

    try {
      // API 요청 시  username을 전송
      const response = await axios.post('/api/user/login', {
        username: username,
        password: password,
      });

      if (response.status === 200) {
        console.log('로그인 성공! 서버 응답:', response.data);
        login();
        navigate('/agent');
      }
    } catch (error) {
      // 에러 메시지
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setPasswordError('아이디 또는 비밀번호가 일치하지 않습니다.');
      } else {
        console.error('로그인 중 알 수 없는 오류 발생:', error);
        setPasswordError('로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    }
  };
  
  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);
  const handleSignupClick = () => navigate('/register');

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        //   backgroundColor: '#f4f6f8',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: '400px',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Typography variant="h4" component="h1" align="center" sx={{ fontWeight: 'bold', mb: 2 }}>
            AI 템플릿 만들기
          </Typography>

          <TextField
            fullWidth
            label="아이디"
            variant="outlined"
            sx={{ backgroundColor: 'white' }}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={!!usernameError}
            helperText={usernameError}
          />
          <TextField
            fullWidth
            label="비밀번호"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            sx={{ backgroundColor: 'white' }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!passwordError}
            helperText={passwordError}
            slotProps={{
                input: {
                endAdornment: (
                    <InputAdornment position="end">
                    <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                    >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                    </InputAdornment>
                ),
                },
            }}
            />

          <Button
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 1, py: 1.5 }}
            onClick={handleLogin}
          >
            로그인
          </Button>
            {/* 소셜 로그인 부분 */}
            {/* <Divider sx={{ my: 2 }}>또는</Divider> */}
            {/* <Typography align="center" color="text.secondary" sx={{ mb: 1 }}>
                소셜 계정으로 로그인
            </Typography> */}
            {/* <Stack direction="row" spacing={2} justifyContent="center">
                <IconButton sx={{ width: 56, height: 56, backgroundColor: '#FEE500', '&:hover': { backgroundColor: '#f0d900' } }}>K</IconButton>
                <IconButton sx={{ width: 56, height: 56, border: '1px solid #e0e0e0', '&:hover': { backgroundColor: '#f5f5f5' } }}>G</IconButton>
                <IconButton sx={{ width: 56, height: 56, backgroundColor: '#03C75A', color: 'white', '&:hover': { backgroundColor: '#02b350' } }}>N</IconButton>
            </Stack> */}

          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
            <Button size="small" onClick={handleSignupClick}>회원가입</Button>
            <Divider orientation="vertical" flexItem />
            <Button size="small" onClick={handleOpenModal}>비밀번호 재설정</Button>
          </Stack>
        </Box>
      </Box>

      <PasswordResetModal open={isModalOpen} onClose={handleCloseModal} />
    </>
  );
};

export default LoginPage;
