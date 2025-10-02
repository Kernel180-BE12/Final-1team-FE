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
import liquidGlassTheme from '../../theme';

// [수정] 'Jua' 폰트 import 및 애니메이션 정의
const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Jua&display=swap');
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

// 사이드바 너비 상수
const mainSidebarWidth = 80;

// 메뉴 아이템 정의
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

    const {
        logout, user, currentSpace, spaces, isLoggedIn, fetchSpaces, setCurrentSpace,
    } = useAppStore();

    const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null);

    useEffect(() => {
        if (isLoggedIn) {
            fetchSpaces();
        }
    }, [isLoggedIn, fetchSpaces]);

    useEffect(() => {
        if (spaceId && spaces.length > 0 && currentSpace?.spaceId !== Number(spaceId)) {
            const targetSpace = spaces.find(s => s.spaceId === Number(spaceId));
            if (targetSpace) {
                setCurrentSpace(targetSpace);
            }
        }
    }, [spaceId, spaces, currentSpace, setCurrentSpace]);

    const handleProfileMenuClick = (e: React.MouseEvent<HTMLElement>) => setProfileMenuAnchor(e.currentTarget);
    const handleProfileMenuClose = () => setProfileMenuAnchor(null);
    const handleGoToMyInfo = () => {
        handleProfileMenuClose();
        if (spaceId || currentSpace?.spaceId) {
            navigate(`/spaces/${spaceId || currentSpace?.spaceId}/my-info`);
        }
    };
    const handleLogout = () => {
        handleProfileMenuClose();
        logout();
    };

    const theme = useMemo(() => {
        const primaryColor = currentSpace?.color || '#546e7a';

        // 기본 liquidGlassTheme 위에 스페이스별 동적 색상만 덮어씁니다.
        const dynamicTheme = createTheme(liquidGlassTheme, {
            palette: {
                primary: { main: primaryColor },
                action: {
                    selected: alpha(primaryColor, 0.16),
                    hover: alpha(primaryColor, 0.08),
                },
            },
            components: {
                MuiAppBar: {
                    styleOverrides: {
                        root: {
                            backgroundColor: alpha(primaryColor, 0.6),
                            backdropFilter: 'blur(16px) saturate(180%)',
                            WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                            borderRadius: 0,
                        }
                    }
                },
                MuiDrawer: {
                    styleOverrides: {
                        paper: {
                            borderRight: 'none',
                            backgroundColor: 'rgba(255, 255, 255, 0.4)',
                            backdropFilter: 'blur(16px) saturate(180%)',
                            WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                        }
                    }
                },
            }
        });

        return dynamicTheme;
    }, [currentSpace]);

    // [추가] 헤더 텍스트를 위한 공통 스타일
    const headerTextStyle = {
        fontFamily: "'Jua', cursive",
        fontWeight: 400,
        color: '#4e342e',
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <style>{customStyles}</style>

            <Box sx={{
                display: 'flex',
                height: '100vh',
                overflow: 'hidden',
                backgroundColor: '#f8f9fa',
            }}>

                <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <Toolbar>
                        {/* Jober 로고 스타일 */}
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{
                                ...headerTextStyle,
                                fontSize: '1.6rem',
                                cursor: 'pointer',
                                minWidth: mainSidebarWidth,
                                textAlign: 'center'
                            }}
                            onClick={() => navigate('/agent')}
                        >
                            Jober
                        </Typography>
                        <Box sx={{ flexGrow: 1 }} />
                        {/* [수정] 스페이스 이름 스타일 */}
                        <Typography variant="h6" sx={{
                            ...headerTextStyle,
                            fontSize: '1.2rem',
                        }}>
                            {currentSpace ? currentSpace.spaceName : '스페이스 관리'}
                        </Typography>
                        <Box sx={{ flexGrow: 1 }} />
                        {/* [수정] 사용자 이름 스타일 */}
                        <Typography variant="subtitle1" sx={{
                            ...headerTextStyle,
                            fontSize: '1rem',
                            mr: 1.5,
                        }}>{user?.username}님</Typography>
                        <IconButton onClick={handleProfileMenuClick} size="small">
                            <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.7)', color: 'primary.main', border: '1px solid rgba(0,0,0,0.05)' }}>{user?.username ? user.username.charAt(0).toUpperCase() : 'U'}</Avatar>
                        </IconButton>
                    </Toolbar>
                </AppBar>

                <Menu anchorEl={profileMenuAnchor} open={Boolean(profileMenuAnchor)} onClose={handleProfileMenuClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
                    <MenuItem onClick={handleGoToMyInfo} disabled={!(spaceId || currentSpace?.spaceId)}><ListItemIcon><AccountCircleIcon fontSize="small" /></ListItemIcon>내 정보</MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}><ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>로그아웃</MenuItem>
                </Menu>

                <Drawer variant="permanent" sx={{ width: mainSidebarWidth, flexShrink: 0, [`& .MuiDrawer-paper`]: { width: mainSidebarWidth, boxSizing: 'border-box' } }}>
                    <Toolbar />
                    <Box sx={{ overflow: 'auto' }}>
                        <List>
                            {mainMenuItems.map((item) => {
                                let fullPath: string;
                                let isActive: boolean;

                                if (item.path === 'management') {
                                    fullPath = '/spaces/management';
                                    isActive = location.pathname === fullPath;
                                } else {
                                    const targetSpaceId = spaceId || currentSpace?.spaceId;
                                    fullPath = targetSpaceId ? `/spaces/${targetSpaceId}/${item.path}` : '#';
                                    isActive = location.pathname === fullPath;
                                }

                                return (
                                    <ListItem key={item.text} disablePadding>
                                        <ListItemButton onClick={() => fullPath !== '#' && navigate(fullPath)} disabled={fullPath === '#'} sx={{ flexDirection: 'column', justifyContent: 'center', height: 72, px: 1, backgroundColor: isActive ? 'action.selected' : 'transparent', '&:hover': { backgroundColor: isActive ? 'action.selected' : 'action.hover' } }}>
                                            <ListItemIcon sx={{ minWidth: 'auto', color: isActive ? 'primary.main' : 'inherit' }}>{item.icon}</ListItemIcon>
                                            <ListItemText primary={item.text} primaryTypographyProps={{ variant: 'caption', sx: { mt: 0.5, fontWeight: isActive ? 'bold' : 'regular', color: isActive ? 'primary.main' : 'inherit' } }} />
                                        </ListItemButton>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Box>
                </Drawer>

                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100vh',
                        overflowY: 'hidden',
                        backgroundColor: 'transparent'
                    }}
                >
                    <Toolbar />
                    <Box
                        key={currentSpace?.spaceId || 'no-space'}
                        sx={{
                            animation: 'fadeIn 0.5s ease-out',
                            flex: 1,
                            overflow : 'auto'
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

