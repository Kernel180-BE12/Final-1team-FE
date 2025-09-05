// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//     createTheme,
//     ThemeProvider,
//     CssBaseline,
//     Box,
//     Typography,
//     TextField,
//     Button,
//     Divider,
//     Stack,
//     IconButton,
//     InputAdornment,
//     Paper,
//     GlobalStyles,
// } from '@mui/material';
// import Visibility from '@mui/icons-material/Visibility';
// import VisibilityOff from '@mui/icons-material/VisibilityOff';
// import useAuthStore from '../store/useAuthStore'; // 경로는 실제 프로젝트에 맞게 조정해주세요.
// import PasswordResetModal from '../components/modals/PasswordResetModal'; // 경로는 실제 프로젝트에 맞게 조정해주세요.
// import axios from 'axios';

// const interactiveTheme = createTheme({
//     palette: {
//         mode: 'light',
//         primary: { main: '#1976d2' },
//     },
//     typography: {
//         fontFamily: '"Jua", "Nunito", "Roboto", sans-serif',
//         h4: { fontWeight: 700, color: '#4e342e' },
//         body2: { color: '#795548' },
//     },
//     components: {
//         MuiButton: {
//             styleOverrides: {
//                 root: {
//                     borderRadius: '999px',
//                     textTransform: 'none',
//                     fontWeight: 'bold',
//                     boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
//                     transition: 'all 0.2s ease-in-out',
//                 },
//             },
//         },
//     },
// });


// const LoginPage = () => {
//     const navigate = useNavigate();
//     const { login } = useAuthStore();

//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [usernameError, setUsernameError] = useState('');
//     const [passwordError, setPasswordError] = useState('');

//     const [isModalOpen, setModalOpen] = useState(false);
//     const [showPassword, setShowPassword] = useState(false);

//     const handleClickShowPassword = () => setShowPassword((show) => !show);
//     const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
//     event.preventDefault();
//     };

//     const handleLogin = async () => {
//     // 유효성 검사
//     let isValid = true;
//     if (!username) {
//         setUsernameError('아이디를 입력해주세요.');
//         isValid = false;
//     } else {
//         setUsernameError('');
//     }

//     if (!password) {
//         setPasswordError('비밀번호를 입력해주세요.');
//         isValid = false;
//     } else if (password.length < 8) {
//         setPasswordError('비밀번호는 8자 이상이어야 합니다.');
//         isValid = false;
//     } else {
//         setPasswordError('');
//     }

//     if (!isValid) return;

//     try {
//         // API 요청 시  username을 전송
//         const response = await axios.post('/api/user/login', { 
//         username: username,
//         password: password,
//     });

//         if (response.status === 200) {
//         console.log('로그인 성공! 서버 응답:', response.data);
//         login();
//         navigate('/agent');
//         }
//     } catch (error) {
//         // 에러 메시지
//         if (axios.isAxiosError(error) && error.response?.status === 401) {
//         setPasswordError('아이디 또는 비밀번호가 일치하지 않습니다.');
//         } else {
//         console.error('로그인 중 알 수 없는 오류 발생:', error);
//         setPasswordError('로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
//         }
//     }
//     };
    
//     const handleOpenModal = () => setModalOpen(true);
//     const handleCloseModal = () => setModalOpen(false);
//     const handleSignupClick = () => navigate('/register');

//   // 3D 인터랙티브 효과
//     const [cardStyle, setCardStyle] = useState({});
//     const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
//         const { clientX, clientY, currentTarget } = e;
//         const { left, top, width, height } = currentTarget.getBoundingClientRect();
//         const rotateX = -((clientY - top) / height - 0.5) * 20;
//         const rotateY = ((clientX - left) / width - 0.5) * 20;
//         setCardStyle({
//             transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`,
//             transition: 'transform 0.1s ease-out'
//         });
//     };
//     const handleMouseLeave = () => {
//         setCardStyle({
//             transform: 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)',
//             transition: 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)'
//         });
//     };

//     return (
//     <ThemeProvider theme={interactiveTheme}>
//         <CssBaseline />
//         <GlobalStyles styles={`
//             @import url('https://fonts.googleapis.com/css2?family=Jua&family=Nunito:wght@700&display=swap');
//             @keyframes animated-gradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
//             body { background: linear-gradient(-45deg, #e0eafc, #cfdef3, #e7eaf6, #a7bfe8); background-size: 400% 400%; animation: animated-gradient 15s ease infinite; }
//         `} />
//         <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
//         <Paper
//             onMouseMove={handleMouseMove}
//             onMouseLeave={handleMouseLeave}
//             elevation={8}
//             sx={{
//                 width: '100%', maxWidth: '420px',
//                 background: 'rgba(255, 255, 255, 0.75)',
//                 backdropFilter: 'blur(10px)',
//                 border: '1px solid rgba(255, 255, 255, 0.2)',
//                 borderRadius: '32px',
//                 p: { xs: 3, sm: 5 },
//                 transformStyle: 'preserve-3d', willChange: 'transform',
//                 ...cardStyle
//             }}
//         >
//             <Stack spacing={2.5}>
//             <Typography variant="h4" component="h1" align="center" sx={{ fontWeight: 'bold' }}>
//                 AI 템플릿 만들기
//             </Typography>

//             <TextField
//                 fullWidth
//                 label="아이디"
//                 variant="outlined"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 error={!!usernameError}
//                 helperText={usernameError}
//             />
//             <TextField
//                 fullWidth
//                 label="비밀번호"
//                 type={showPassword ? 'text' : 'password'}
//                 variant="outlined"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 error={!!passwordError}
//                 helperText={passwordError}
//                 InputProps={{
//                     endAdornment: (
//                         <InputAdornment position="end">
//                         <IconButton
//                             aria-label="toggle password visibility"
//                             onClick={handleClickShowPassword}
//                             onMouseDown={handleMouseDownPassword}
//                             edge="end"
//                         >
//                             {showPassword ? <VisibilityOff /> : <Visibility />}
//                         </IconButton>
//                         </InputAdornment>
//                     ),
//                 }}
//             />

//             <Button
//                 fullWidth
//                 variant="contained"
//                 size="large"
//                 sx={{ mt: 1, py: 1.5 }}
//                 onClick={handleLogin}
//             >
//                 로그인
//             </Button>
//             {/* 소셜 로그인 부분 */}
//             {/* <Divider sx={{ my: 2 }}>또는</Divider> */}
//             {/* <Typography align="center" color="text.secondary" sx={{ mb: 1 }}>
//                 소셜 계정으로 로그인
//             </Typography> */}
//             {/* <Stack direction="row" spacing={2} justifyContent="center">
//                 <IconButton sx={{ width: 56, height: 56, backgroundColor: '#FEE500', '&:hover': { backgroundColor: '#f0d900' } }}>K</IconButton>
//                 <IconButton sx={{ width: 56, height: 56, border: '1px solid #e0e0e0', '&:hover': { backgroundColor: '#f5f5f5' } }}>G</IconButton>
//                 <IconButton sx={{ width: 56, height: 56, backgroundColor: '#03C75A', color: 'white', '&:hover': { backgroundColor: '#02b350' } }}>N</IconButton>
//             </Stack> */}

//             <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
//                 <Button size="small" onClick={handleSignupClick}>회원가입</Button>
//                 <Divider orientation="vertical" flexItem />
//                 <Button size="small" onClick={handleOpenModal}>비밀번호 재설정</Button>
//             </Stack>
//             </Stack>
//         </Paper>
//         </Box>

//         <PasswordResetModal open={isModalOpen} onClose={handleCloseModal} />
//     </ThemeProvider>
//     );
// };

// export default LoginPage;

