import React from 'react';
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';

/**
 * @description 로그인을 하지 않은 사용자를 위한 공용 레이아웃입니다. (예: 메인 홈페이지)
 * @returns {React.ReactElement} PublicLayout 컴포넌트
 */
const PublicLayout = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar
        position="static"
        sx={{
          backgroundColor: 'white',
          color: 'black',
          boxShadow: 'none',
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: 'bold', cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            AI 템플릿 만들기
          </Typography>
          <Button color="inherit" onClick={() => navigate('/login')}>
            로그인
          </Button>
          <Button variant="contained" onClick={() => navigate('/signup')} sx={{ ml: 2 }}>
            회원가입
          </Button>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1 }}>
        {/* 이 Outlet 부분에 /home, /about 같은 공개 페이지들이 렌더링됩니다. */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default PublicLayout;