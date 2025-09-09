import { useState } from 'react';
import { 
    createTheme, 
    ThemeProvider, 
    CssBaseline, 
    Box, 
    Typography, 
    Button, 
    Stack, 
    Paper, 
    GlobalStyles, 
    Divider 
} from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { useNavigate } from 'react-router-dom';
import RegisterModal from '../components/modals/RegisterModal';

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

const RegisterPage = () => {
    const navigate = useNavigate();
    const [isModalOpen, setModalOpen] = useState(false);
    
    const handleLoginClick = () => navigate('/login');
    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);

    return (
        <ThemeProvider theme={interactiveTheme}>
            <CssBaseline />
            <GlobalStyles styles={`
                @import url('https://fonts.googleapis.com/css2?family=Jua&family=Nunito:wght@700&display=swap');
                @keyframes animated-gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                body {
                    background: linear-gradient(-45deg, #e0eafc, #cfdef3, #e7eaf6, #a7bfe8);
                    background-size: 400% 400%;
                    animation: animated-gradient 15s ease infinite;
                }
            `} />
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', textAlign: 'center' }}>
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
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <Typography variant='h4' component="h1" align="center" sx={{ fontWeight: 'bold' }} onClick={() => navigate('/agent')} >
                            AI 템플릿 만들기
                        </Typography>
                        
                        <Typography variant="h5" sx={{ fontWeight: 'medium' }}>
                            편하게 AI로 템플릿을 생성해보세요.
                        </Typography>

                        <Button
                            variant="contained" 
                            size="large" 
                            fullWidth
                            sx={{
                                mt: 2, py: 1.5,
                                backgroundColor: '#FEE500', color: '#191919',
                                '&:hover': { backgroundColor: '#f0d900', transform: 'scale(1.03) translateY(-2px)' },
                            }}
                        >
                            카카오로 시작하기
                        </Button>
                        
                        <Button
                            variant="outlined"
                            size="large"
                            fullWidth
                            onClick={handleOpenModal}
                            startIcon={<MailOutlineIcon />}
                            sx={{
                                py: 1.5,
                                '&:hover': { transform: 'scale(1.03) translateY(-2px)' },
                            }}
                        >
                            회원가입 하기
                        </Button>

                        <Divider sx={{ width: '100%', my: 1 }} />

                        <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ mt: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                                계정이 있으신가요?
                            </Typography>
                            <Button size="small" onClick={handleLoginClick} sx={{fontWeight: 'bold'}}>로그인</Button>
                        </Stack>

                        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, fontSize: '0.8rem' }}>
                            가입을 진행하시면 전자문서 서비스 이용약관 및 개인정보 수집 이용에 동의하는 것으로 간주합니다.
                        </Typography>
                    </Box>
                </Paper>
            </Box>
            
            <RegisterModal open={isModalOpen} onClose={handleCloseModal} />
        </ThemeProvider>
    );
};

export default RegisterPage;

