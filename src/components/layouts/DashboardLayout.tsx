import React, { useState, useEffect, useMemo } from 'react';
import { Outlet, useNavigate, useLocation, useParams } from 'react-router-dom';
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Toolbar, AppBar, Typography, Avatar, Menu, MenuItem, IconButton,
  ThemeProvider, createTheme, Divider, CssBaseline
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import HomeIcon from '@mui/icons-material/Home';
import ContactsIcon from '@mui/icons-material/Contacts';
import ArticleIcon from '@mui/icons-material/Article';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import useAppStore from '../../store/useAppStore';

// 애니메이션 정의
const fadeInAnimation = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

// 사이드바 너비 상수
const mainSidebarWidth = 80;

// 메뉴 아이템 정의 (두 번째 파일 기준: 상대 경로 사용)
const mainMenuItems = [
  { text: 'AI', path: 'suggestion', icon: <AutoAwesomeIcon /> },
  { text: '내 템플릿', path: 'templates', icon: <ArticleIcon /> },
  { text: '연락처', path: 'contacts', icon: <ContactsIcon /> },
  { text: '스페이스', path: 'management', icon: <HomeIcon /> },
];

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { spaceId } = useParams<{ spaceId: string }>();

  // Zustand 스토어에서 필요한 모든 상태와 액션을 가져옵니다. (두 번째 파일 기준)
  const {
    logout,
    user,
    currentSpace,
    spaces,
    isLoggedIn,
    fetchSpaces, // fetchSpaces 추가 (첫 번째 파일에서 가져옴)
    setCurrentSpace,
  } = useAppStore();

  const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null);

  // 로그인 시 스페이스 목록을 불러옵니다. (첫 번째 파일의 로직)
  useEffect(() => {
    if (isLoggedIn) {
      fetchSpaces();
    }
  }, [isLoggedIn, fetchSpaces]);

  // URL의 spaceId와 스토어의 currentSpace를 동기화합니다. (두 번째 파일의 핵심 로직)
  useEffect(() => {
    if (spaceId && spaces.length > 0) {
      if (currentSpace?.spaceId !== Number(spaceId)) {
        const targetSpace = spaces.find(s => s.spaceId === Number(spaceId));
        if (targetSpace) {
          console.log(`URL 변경 감지: currentSpace를 ${targetSpace.spaceName}(으)로 변경합니다.`);
          setCurrentSpace(targetSpace);
        }
      }
    }
  }, [spaceId, spaces, currentSpace, setCurrentSpace]);

  // 메뉴 핸들러 (두 번째 파일 기준)
  const handleProfileMenuClick = (event: React.MouseEvent<HTMLElement>) => setProfileMenuAnchor(event.currentTarget);
  const handleProfileMenuClose = () => setProfileMenuAnchor(null);
  const handleGoToMyInfo = () => {
    handleProfileMenuClose();
    const targetSpaceId = spaceId || currentSpace?.spaceId;
    if (targetSpaceId) {
      navigate(`/spaces/${targetSpaceId}/my-info`);
    }
  };
  const handleLogout = () => {
    handleProfileMenuClose();
    logout();
  };

  // 동적 테마 생성 (두 번째 파일 기준)
  const dynamicTheme = useMemo(() => {
    const primaryColor = currentSpace?.color || '#90a4ae';
    return createTheme({
      palette: {
        primary: { main: primaryColor },
        action: {
          selected: alpha(primaryColor, 0.12),
          hover: alpha(primaryColor, 0.08),
        },
      },
      typography: {
        fontFamily: '"Jua", "Nunito", "Roboto", sans-serif',
      },
    });
  }, [currentSpace]);

  return (
      <ThemeProvider theme={dynamicTheme}>
        <CssBaseline />
        <style>{fadeInAnimation}</style>
        {/* 전체 레이아웃 Box (첫 번째 파일 기준: overflow 처리) */}
        <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
          {/* AppBar (상단 바) */}
          <AppBar
              position="fixed"
              sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.8),
                backdropFilter: 'blur(12px)',
                color: '#333',
                boxShadow: 'none',
                borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                transition: 'background-color 0.5s ease',
              }}
          >
            <Toolbar>
              <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold', cursor: 'pointer', minWidth: mainSidebarWidth, textAlign: 'center' }} onClick={() => navigate('/agent')}>
                AI 템플릿 만들기
              </Typography>
              <Box sx={{ flexGrow: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {currentSpace ? currentSpace.spaceName : '스페이스 관리'}
              </Typography>
              <Box sx={{ flexGrow: 1 }} />
              <Typography variant="subtitle1" sx={{ mr: 1.5 }}>{user?.username}님</Typography>
              <IconButton onClick={handleProfileMenuClick} size="small">
                <Avatar sx={{ bgcolor: 'background.paper', color: 'primary.main' }}>{user?.username ? user.username.charAt(0).toUpperCase() : 'U'}</Avatar>
              </IconButton>
            </Toolbar>
          </AppBar>

          {/* 프로필 메뉴 */}
          <Menu anchorEl={profileMenuAnchor} open={Boolean(profileMenuAnchor)} onClose={handleProfileMenuClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
            <MenuItem onClick={handleGoToMyInfo} disabled={!(spaceId || currentSpace?.spaceId)}><ListItemIcon><AccountCircleIcon fontSize="small" /></ListItemIcon>내 정보</MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}><ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>로그아웃</MenuItem>
          </Menu>

          {/* Drawer (사이드바) */}
          <Drawer variant="permanent" sx={{ width: mainSidebarWidth, flexShrink: 0, [`& .MuiDrawer-paper`]: { width: mainSidebarWidth, boxSizing: 'border-box' } }}>
            <Toolbar />
            <Box sx={{ overflow: 'auto' }}>
              <List>
                {/* 메뉴 렌더링 (두 번째 파일 기준: 동적 경로) */}
                {mainMenuItems.map((item) => {
                  let fullPath: string;
                  let isActive: boolean;

                  if (item.path === 'management') {
                    fullPath = '/spaces/management';
                    isActive = location.pathname === fullPath;
                  } else {
                    const targetSpaceId = spaceId || currentSpace?.spaceId;
                    if (!targetSpaceId) {
                      fullPath = '#'; // 스페이스가 없으면 비활성화
                    } else {
                      fullPath = `/spaces/${targetSpaceId}/${item.path}`;
                    }
                    isActive = location.pathname === fullPath;
                  }

                  return (
                      <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            onClick={() => fullPath !== '#' && navigate(fullPath)}
                            disabled={fullPath === '#'}
                            sx={{ flexDirection: 'column', justifyContent: 'center', height: 72, px: 1, backgroundColor: isActive ? 'action.selected' : 'transparent', '&:hover': { backgroundColor: isActive ? 'action.selected' : 'action.hover' } }}
                        >
                          <ListItemIcon sx={{ minWidth: 'auto', color: isActive ? 'primary.main' : 'inherit' }}>{item.icon}</ListItemIcon>
                          <ListItemText primary={item.text} primaryTypographyProps={{ variant: 'caption', sx: { mt: 0.5, fontWeight: isActive ? 'bold' : 'regular', color: isActive ? 'primary.main' : 'inherit' } }} />
                        </ListItemButton>
                      </ListItem>
                  );
                })}
              </List>
            </Box>
          </Drawer>

          {/* 메인 콘텐츠 영역 (첫 번째 파일 기준: Flexbox 스크롤 처리) */}
          <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: 3,
                backgroundColor: '#f9fafb',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                overflowY: 'hidden' // 부모에서 스크롤 숨김
              }}
          >
            <Toolbar />
            {/* Outlet을 감싸는 Box가 남은 공간을 모두 채움 */}
            <Box
                key={currentSpace?.spaceId || 'no-space'} // 스페이스 변경 시 리렌더링 및 애니메이션 트리거
                sx={{
                  animation: 'fadeIn 0.5s ease-out',
                  flex: 1, // 남은 세로 공간을 모두 차지
                  minHeight: 0, // flex 자식 높이 계산에 필요
                  display: 'flex',
                  flexDirection: 'column',
                  // 실제 스크롤은 이 Box의 자식 컴포넌트에서 발생하게 됩니다.
                }}
            >
              <Outlet />
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
  );
};

export default DashboardLayout;