import { AppBar, Box, Button, Toolbar, Typography, createTheme, ThemeProvider, CssBaseline, GlobalStyles } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAppStore'; 


const interactiveTheme = createTheme({
    palette: {
        mode: 'light',
        primary: { main: '#1976d2' },
    },
    typography: {
        fontFamily: '"Jua", "Nunito", "Roboto", sans-serif',
        h6: { fontWeight: 'bold' },
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
/**
 * @description 로그인을 하지 않은 사용자를 위한 공용 레이아웃입니다.
 * @returns {React.ReactElement} PublicLayout 컴포넌트
 */
const PublicLayout = () => {
  const { isLoggedIn, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = (() => {
    logout();
    alert('로그아웃 되었습니다.');
    navigate('/agent');
  })

  return (
    <ThemeProvider theme={interactiveTheme}>
        <CssBaseline />
        <GlobalStyles styles={`
            @import url('https://fonts.googleapis.com/css2?family=Jua&family=Nunito:wght@700&display=swap' );
            @keyframes animated-gradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
            body { 
                background: linear-gradient(-45deg, #e0eafc, #cfdef3, #e7eaf6, #a7bfe8); 
                background-size: 400% 400%; 
                animation: animated-gradient 15s ease infinite;
            }
        `} />
        {/* ★ 2. 전체 레이아웃을 화면 높이에 꽉 채우고, 내부에서 스크롤이 발생하지 않도록 설정합니다. */}
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', minHeight: '100vh'}}>
        <AppBar
            position="fixed"
            sx={{
                background: 'rgba(255, 255, 255, 0.75)',
                backdropFilter: 'blur(10px)',
                color: '#4e342e',
                boxShadow: 'none',
                borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
            }}
        >
            <Toolbar>
            <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1, cursor: 'pointer' }}
                onClick={() => navigate('/')}
            >
                AI 템플릿 만들기
            </Typography>
            {isLoggedIn ? (
            <>
                <Button color="inherit" onClick={() => navigate('/spaces')}>내 스페이스</Button>
                <Button color="inherit" onClick={handleLogout}>
                로그아웃
                </Button>
            </>
            ) : (
            <Button variant="contained" onClick={() => navigate('/login')} sx={{ ml: 2 }}>
                로그인
            </Button>
            )}
            </Toolbar>
        </AppBar>
        {/* ★ 3. 메인 콘텐츠 영역이 남은 공간을 모두 차지하도록 하고, 내부에서 스크롤이 발생할 수 있도록 준비합니다. */}
        <Box component="main" sx={{ 
          flexGrow: 1, 
          pt: '88px', // AppBar 높이만큼 패딩 조정
          pb: '24px',
          px: { xs: 2, sm: 3, md: 4 },
          // ★ 4. 이 Box가 flex 컨테이너 역할을 하여 자식 요소(SuggestionPage)가 높이를 100% 차지할 수 있게 합니다.
          display: 'flex',
          flexDirection: 'column',
            //   overflow: 'hidden'
            minHeight: 0,
        }}>
            {/* ★ 5. Outlet이 남은 공간을 모두 차지하도록 설정합니다. */}
            <Box sx={{ flex: 1, minHeight: 0 }}>
                <Outlet />
            </Box>
        </Box>
        </Box>
    </ThemeProvider>
  );
};

export default PublicLayout;
