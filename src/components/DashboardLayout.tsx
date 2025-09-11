import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  AppBar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Button,
  Divider,
  IconButton,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import HomeIcon from '@mui/icons-material/Home';
import ContactsIcon from '@mui/icons-material/Contacts';
import ArticleIcon from '@mui/icons-material/Article';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import useAuthStore from '../store/useAuthStore';


const mainSidebarWidth = 80;

const mainMenuItems = [
  { text: 'AI', path: '/suggestion', icon: <AutoAwesomeIcon /> },
  { text: '연락처', path: '/contacts', icon: <ContactsIcon /> },
  { text: '내 템플릿', path: '/my-templates', icon: <ArticleIcon /> },
  { text: '스페이스', path: '/spaces', icon: <HomeIcon /> },
];

// 임시 스페이스 목록 데이터
const spaces = [
  { id: 1, name: '커널 아카데미' },
  { id: 2, name: '알고리즘 챌린지' },
  { id: 3, name: '프론트엔드 스터디' },
];

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuthStore(); // ★ 4. logout 함수와 user 정보를 가져옵니다.

  // --- 스페이스 메뉴 상태 관리 ---
  const [spaceMenuAnchor, setSpaceMenuAnchor] = useState<null | HTMLElement>(null);
  const isSpaceMenuOpen = Boolean(spaceMenuAnchor);
  const [currentSpaceName, setCurrentSpaceName] = useState('커널 아카데미'); // ★ 5. 현재 스페이스 이름을 기억할 state

  // --- 프로필 메뉴 상태 관리 ---
  const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null); // ★ 6. 프로필 메뉴용 state
  const isProfileMenuOpen = Boolean(profileMenuAnchor);

  // --- 스페이스 메뉴 핸들러 ---
  const handleSpaceMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setSpaceMenuAnchor(event.currentTarget);
  };
  const handleSpaceMenuClose = (spaceName?: string) => {
    setSpaceMenuAnchor(null);
    if (spaceName) {
      setCurrentSpaceName(spaceName); // 선택한 스페이스 이름으로 업데이트
    }
  };

  // --- 프로필 메뉴 핸들러 ---
  const handleProfileMenuClick = (event: React.MouseEvent<HTMLElement>) => { // ★ 7. 프로필 메뉴용 핸들러
    setProfileMenuAnchor(event.currentTarget);
  };
  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  // --- 로그아웃 핸들러 ---
  const handleLogout = () => {
    handleProfileMenuClose(); // 메뉴를 먼저 닫고
    logout();               // 로그아웃 실행
    alert('로그아웃 되었습니다.');
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1, // 사이드바 위에 위치
          backgroundColor: 'rgba(255, 255, 255, 0.8)', // 반투명한 흰색
          backdropFilter: 'blur(8px)',
          color: '#333',
          boxShadow: 'none',
          borderBottom: '1px solid #e0e0e0'
        }}
      >
        <Toolbar>
          {/* 로고 (Agent 페이지로 이동) */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ fontWeight: 'bold', cursor: 'pointer', minWidth: mainSidebarWidth, textAlign: 'center' }}
            onClick={() => navigate('/agent')}
          >
            AI 템플릿 만들기
          </Typography>

          {/* 1. 왼쪽 공간을 채우는 보이지 않는 스페이서 */}
          <Box sx={{ flexGrow: 1 }} />

          {/* 2. 이제 Typography 대신 Button을 사용합니다. */}
          <Button
            color="inherit"
            onClick={handleSpaceMenuClick}
            endIcon={<ArrowDropDownIcon />}
            sx={{ 
              textTransform: 'none', // 대문자 변환 방지
              fontSize: '1.1rem',
            }}
          >
            {currentSpaceName}
          </Button>

          {/* 3. 오른쪽 공간을 채우는 보이지 않는 스페이서 */}
          <Box sx={{ flexGrow: 1 }} />

          {/* ★ 9. Avatar를 클릭 가능하게 만듭니다. */}
          <IconButton onClick={handleProfileMenuClick} size="small">
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* --- 스페이스 메뉴 --- */}
      <Menu anchorEl={spaceMenuAnchor} open={isSpaceMenuOpen} onClose={() => handleSpaceMenuClose()}>
        {spaces.map((space) => (
          <MenuItem key={space.id} onClick={() => handleSpaceMenuClose(space.name)}>
            {space.name}
          </MenuItem>
        ))}
      </Menu>

      {/* ★ 10. 프로필 메뉴를 추가합니다. --- */}
      <Menu
        anchorEl={profileMenuAnchor}
        open={isProfileMenuOpen}
        onClose={handleProfileMenuClose}
        // 메뉴가 아바타 바로 아래 오른쪽에 나타나도록 위치 조정
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleProfileMenuClose}>
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          내 정보
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          로그아웃
        </MenuItem>
      </Menu>

      {/* 왼쪽 메인 Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: mainSidebarWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: mainSidebarWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar /> {/* Appbar와 높이를 맞추기 위한 빈 공간 */}
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {mainMenuItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton
                    onClick={() => navigate(item.path)}
                    sx={{
                      flexDirection: 'column',
                      justifyContent: 'center',
                      height: 72,
                      px: 1,
                      // ★ 4. isActive가 true일 때만 특별한 스타일을 적용합니다.
                      backgroundColor: isActive ? 'action.selected' : 'transparent',
                      '&:hover': {
                        backgroundColor: isActive ? 'action.selected' : 'action.hover',
                      },
                    }}
                  >
                    <ListItemIcon 
                      sx={{ 
                        minWidth: 'auto',
                        // ★ 5. 아이콘 색상도 활성화 상태에 따라 변경합니다.
                        color: isActive ? 'primary.main' : 'inherit',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        variant: 'caption',
                        sx: { 
                          mt: 0.5,
                          // ★ 6. 텍스트 색상도 활성화 상태에 따라 변경합니다.
                          fontWeight: isActive ? 'bold' : 'regular',
                          color: isActive ? 'primary.main' : 'inherit',
                        },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>

      {/* 메인 콘텐츠 영역 */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: '#f9fafb', minHeight: '100%' }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;