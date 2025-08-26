import React from 'react';
import { AppBar, Box, Toolbar, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

// 사이드바에 표시될 메뉴 아이템 목록
const menuItems = [
    { text: 'AI 에이전트', path: '/agent' },
    { text: '내 템플릿', path: '/my-templates' },
    { text: '로그인', path: '/login' },
];

type LayoutProps = {
    children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box> 
      {/* 상단 내비게이터바를 이용하기 위한 AppBar */}
      <AppBar 
        position="fixed" // 화면 상단에 고정
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1, // 다른 요소들 위에 보이도록 zIndex 설정
          backgroundColor: '#ffffff', // 배경색을 하얗게
          borderBottom: '1px solid #e0e0e0', // 하단 경계선 추가
          boxShadow: 'none', // 그림자 제거
        }}
      >
        <Toolbar>
          {/* 로고나 앱 타이틀을 위한 공간 */}
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, color: '#000000' }}>
            Jober
          </Typography>
          
          {/* 메뉴 아이템들을 가로로 배치 */}
          <Box>
            {menuItems.map((item) => (
              <Button
                key={item.text}
                component={Link} // react-router-dom의 Link로 동작
                to={item.path}
                sx={{ color: '#000000' }} // 버튼 텍스트 색상
              >
                {item.text}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>

      {/* 오른쪽 메인 콘텐츠 영역 */}
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        {/* AppBar의 높이만큼 공간을 띄워주기 위한 Toolbar */}
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;