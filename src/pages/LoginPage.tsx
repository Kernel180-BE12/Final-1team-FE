import React, { useState } from 'react';
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
import PasswordResetModal from '../components/PasswordResetModal';
import { useNavigate } from 'react-router';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

/**
 * @description 로그인 페이지 컴포넌트
 * @returns {React.ReactElement} LoginPage 컴포넌트
 */
const LoginPage = () => {
    // --- 상태(State) 관리 ---
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isModalOpen, setModalOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    // --- 함수(Handlers) ---
    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);
    const handleSignupClick = () => navigate('/signup');
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleLogin = () => {
        let isValid = true;
        if (!email) {
            setEmailError('이메일 또는 휴대전화를 입력해주세요.');
            isValid = false;
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const phoneRegex = /^010-?([0-9]{4})-?([0-9]{4})$/;

            if (!emailRegex.test(email) && !phoneRegex.test(email)) {
                setEmailError('올바르지 않은 이메일 / 전화번호 형식입니다.');
                isValid = false;
            } else {
                setEmailError('');
            }
        }

        if (!password) {
            setPasswordError('비밀번호를 입력해주세요.');
            isValid = false;
        }   else if (password.length < 8) {
            setPasswordError('비밀번호는 8자 이상이어야 합니다.');
            isValid = false;
        }   else {
            setPasswordError('');
        }

        if (isValid) {
            console.log('로그인 시도:', { email, password });
            alert('로그인 성공! (임시)');
        }

    };

    return (
        <>
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alianItem: 'center',
                minHeight: '100vh',
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
                {/* 로고 */}
                <Typography variant='h4' component="h1" align="center" sx={{ fontWeight: 'bold', mb: 2 }} >
                    JOBER
                </Typography>

                {/* 이메일/휴대전화 입력란 */}
                <TextField
                    fullWidth
                    label="이메일 / 휴대전화"
                    variant="outlined"
                    sx={{ backgroundColor: 'white' }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={!!emailError}
                    helperText={emailError}
                />

                {/* 비밀번호 입력란 */}
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

                {/* 로그인 버튼 */}
                <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{ mt: 1, py: 1.5 }}
                    onClick={handleLogin}
                >
                    로그인
                </Button>

                { /* 구분선 */}
                <Divider sx={{ my: 2 }}>또는</Divider>

                { /* 소셜 로그인 버튼 영역 */ }
                <Stack direction="row" spacing={2} justifyContent="center">
                <IconButton
                    sx={{
                    width: 56,
                    height: 56,
                    backgroundColor: '#FEE500',
                    '&:hover': { backgroundColor: '#f0d900' },
                    }}
                >
                    {/* 여기에 카카오 로고 아이콘 넣어야 함 */}
                    K
                </IconButton>
                <IconButton
                    sx={{
                    width: 56,
                    height: 56,
                    border: '1px solid #e0e0e0',
                    '&:hover': { backgroundColor: '#f5f5f5' },
                    }}
                >
                    {/* 여기에 구글 로고 아이콘 넣어야 함 */}
                    G
                </IconButton>
                <IconButton
                    sx={{
                    width: 56,
                    height: 56,
                    backgroundColor: '#03C75A',
                    color: 'white',
                    '&:hover': { backgroundColor: '#02b350' },
                    }}
                >
                    {/* 여기에 네이버 로고 아이콘 넣어야 함 */}
                    N
                </IconButton>
                </Stack>

                { /* 회원가입 및 비밀번호 재설정 버튼 영역 */}
                <Stack direction="column" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
                    <Button variant="outlined" sx={{ flex: 1 }} onClick={handleSignupClick}>회원가입</Button>
                    <Button variant="outlined" sx={{ flex: 1 }} onClick={handleOpenModal}>비밀번호 재설정</Button>
                </Stack>
            </Box>
        </Box>

        {/* 모달 컴포넌트를 렌더링 */}
        <PasswordResetModal open={isModalOpen} onClose={handleCloseModal} />
        </>
    );
};

export default LoginPage;
