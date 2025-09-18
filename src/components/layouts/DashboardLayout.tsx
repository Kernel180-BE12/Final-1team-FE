import React, { useState, useEffect, useMemo } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Toolbar, AppBar, Typography, Avatar, Menu, MenuItem, IconButton,
  ThemeProvider, createTheme, Divider
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import HomeIcon from '@mui/icons-material/Home';
import ContactsIcon from '@mui/icons-material/Contacts';
import ArticleIcon from '@mui/icons-material/Article';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import useAppStore from '../../store/useAppStore';


const fadeInAnimation = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const mainSidebarWidth = 80;
const mainMenuItems = [
  { text: 'AI', path: '/suggestion', icon: <AutoAwesomeIcon /> },
  { text: '내 템플릿', path: '/my-templates', icon: <ArticleIcon /> },
  { text: '연락처', path: '/contacts', icon: <ContactsIcon /> },
  { text: '스페이스', path: '/spaces', icon: <HomeIcon /> },
];

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { logout, user, currentSpace, isLoggedIn, fetchSpaces } = useAppStore();

  const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null);

  useEffect(() => {
    if (isLoggedIn) {
      fetchSpaces();
    }
  }, [isLoggedIn, fetchSpaces]);

  const handleProfileMenuClick = (event: React.MouseEvent<HTMLElement>) => setProfileMenuAnchor(event.currentTarget);
  const handleProfileMenuClose = () => setProfileMenuAnchor(null);
  const handleGoToMyInfo = () => {
    handleProfileMenuClose();
    navigate('/my-info');
  };
  const handleLogout = () => {
    handleProfileMenuClose();
    logout();
  };

  const dynamicTheme = useMemo(() => {
    const primaryColor = currentSpace?.color || '#90a4ae';
    return createTheme({
      palette: {
        primary: { main: primaryColor },
        action: {
          selected: alpha(primaryColor, 0.12),
          hover: alpha(primaryColor, 0.08),
        },
        // background: {
        //   default: alpha(primaryColor, 0.05),
        // }
      },
      typography: {
        fontFamily: '"Jua", "Nunito", "Roboto", sans-serif',
        h4: { fontWeight: 700, color: '#4e342e' },
        body2: { color: '#795548' },
    },
    });
  }, [currentSpace]);

  return (
    <ThemeProvider theme={dynamicTheme}>
      <style>{fadeInAnimation}</style>
      <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
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
              {currentSpace ? currentSpace.spaceName : '스페이스 없음'}
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Typography variant="subtitle1" sx={{ mr: 1.5 }}>{user?.username}님</Typography>
            <IconButton onClick={handleProfileMenuClick} size="small">
              <Avatar sx={{ bgcolor: 'background.paper' , color: 'primary.main' }}>{user?.username ? user.username.charAt(0).toUpperCase() : 'U'}</Avatar>
            </IconButton>
          </Toolbar>
        </AppBar>

        <Menu anchorEl={profileMenuAnchor} open={Boolean(profileMenuAnchor)} onClose={handleProfileMenuClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
          <MenuItem onClick={handleGoToMyInfo}><ListItemIcon><AccountCircleIcon fontSize="small" /></ListItemIcon>내 정보</MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}><ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>로그아웃</MenuItem>
        </Menu>

        <Drawer variant="permanent" sx={{ width: mainSidebarWidth, flexShrink: 0, [`& .MuiDrawer-paper`]: { width: mainSidebarWidth, boxSizing: 'border-box' } }}>
          <Toolbar />
          <Box sx={{ overflow: 'auto' }}>
            <List>
              {mainMenuItems.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <ListItem key={item.text} disablePadding>
                    <ListItemButton onClick={() => navigate(item.path)} sx={{ flexDirection: 'column', justifyContent: 'center', height: 72, px: 1, backgroundColor: isActive ? 'action.selected' : 'transparent', '&:hover': { backgroundColor: isActive ? 'action.selected' : 'action.hover' } }}>
                      <ListItemIcon sx={{ minWidth: 'auto', color: isActive ? 'primary.main' : 'inherit' }}>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.text} primaryTypographyProps={{ variant: 'caption', sx: { mt: 0.5, fontWeight: isActive ? 'bold' : 'regular', color: isActive ? 'primary.main' : 'inherit' } }} />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        </Drawer>

        <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: '#f9fafb', overflowY: 'auto' }}>
          <Toolbar />
          <Box 
            key={currentSpace?.spaceId || 'no-space'} // ★ 스페이스가 바뀔 때마다 이 컴포넌트를 새로 그리도록 강제
            sx={{ animation: 'fadeIn 0.5s ease-out' }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default DashboardLayout;
