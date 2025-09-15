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
import useAuthStore from '../../store/useAuthStore';


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
  const { logout, user } = useAuthStore();

  const [spaceMenuAnchor, setSpaceMenuAnchor] = useState<null | HTMLElement>(null);
  const isSpaceMenuOpen = Boolean(spaceMenuAnchor);
  const [currentSpaceName, setCurrentSpaceName] = useState('커널 아카데미');

  const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null);
  const isProfileMenuOpen = Boolean(profileMenuAnchor);

  const handleSpaceMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setSpaceMenuAnchor(event.currentTarget);
  };
  const handleSpaceMenuClose = (spaceName?: string) => {
    setSpaceMenuAnchor(null);
    if (spaceName) {
      setCurrentSpaceName(spaceName);
    }
  };

  const handleProfileMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setProfileMenuAnchor(event.currentTarget);
  };
  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleGoToMyInfo = () => {
    handleProfileMenuClose();
    navigate('/my-info');
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    logout();
    alert('로그아웃 되었습니다.');
    navigate('/login');
  };

  return (
    // ★ 1. 전체 레이아웃을 화면 높이에 꽉 채우고, 스크롤을 방지합니다.
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(8px)',
          color: '#333',
          boxShadow: 'none',
          borderBottom: '1px solid #e0e0e0'
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ fontWeight: 'bold', cursor: 'pointer', minWidth: mainSidebarWidth, textAlign: 'center' }}
            onClick={() => navigate('/agent')}
          >
            AI 템플릿 만들기
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            color="inherit"
            onClick={handleSpaceMenuClick}
            endIcon={<ArrowDropDownIcon />}
            sx={{ textTransform: 'none', fontSize: '1.1rem' }}
          >
            {currentSpaceName}
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          <Typography variant="subtitle1" sx={{ mr: 1.5 }}>
            {user?.username}님
          </Typography>
          <IconButton onClick={handleProfileMenuClick} size="small">
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Menu anchorEl={spaceMenuAnchor} open={isSpaceMenuOpen} onClose={() => handleSpaceMenuClose()}>
        {spaces.map((space) => (
          <MenuItem key={space.id} onClick={() => handleSpaceMenuClose(space.name)}>
            {space.name}
          </MenuItem>
        ))}
      </Menu>

      <Menu
        anchorEl={profileMenuAnchor}
        open={isProfileMenuOpen}
        onClose={handleProfileMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleGoToMyInfo}>
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

      <Drawer
        variant="permanent"
        sx={{
          width: mainSidebarWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: mainSidebarWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
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
                      backgroundColor: isActive ? 'action.selected' : 'transparent',
                      '&:hover': {
                        backgroundColor: isActive ? 'action.selected' : 'action.hover',
                      },
                    }}
                  >
                    <ListItemIcon 
                      sx={{ 
                        minWidth: 'auto',
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

      {/* ★ 2. 메인 콘텐츠 영역을 수직 Flexbox 컨테이너로 만듭니다. */}
      <Box component="main" sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column',
          // backgroundColor: '#f9fafb' // 배경색은 유지
      }}>
        <Toolbar /> {/* AppBar와 동일한 높이의 공간 확보 */}
        
        {/* ★ 3. Outlet이 렌더링될 영역이 남은 공간을 모두 차지하도록 설정합니다. */}
        <Box sx={{
          flex: 1, // Toolbar를 제외한 모든 남은 공간을 차지
          minHeight: 0, // Flexbox 높이 계산 오류 방지를 위한 필수 속성
          p: 3, // 기존 패딩을 이곳으로 이동
          backgroundColor: '#f9fafb' // 배경색을 이곳으로 이동
        }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
