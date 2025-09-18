// import React, { useState, useEffect, useMemo } from 'react';
// import { Outlet, useNavigate, useLocation } from 'react-router-dom';
// import {
//   Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
//   Toolbar, AppBar, Typography, Avatar, Menu, MenuItem, IconButton,
//   ThemeProvider, createTheme, Divider
// } from '@mui/material';
// import { alpha } from '@mui/material/styles';
// import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
// import HomeIcon from '@mui/icons-material/Home';
// import ContactsIcon from '@mui/icons-material/Contacts';
// import ArticleIcon from '@mui/icons-material/Article';
// import LogoutIcon from '@mui/icons-material/Logout';
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import useAppStore from '../../store/useAppStore';


// const fadeInAnimation = `
//   @keyframes fadeIn {
//     from { opacity: 0; transform: translateY(10px); }
//     to { opacity: 1; transform: translateY(0); }
//   }
// `;

// const mainSidebarWidth = 80;
// const mainMenuItems = [
//   { text: 'AI', path: '/suggestion', icon: <AutoAwesomeIcon /> },
//   { text: '내 템플릿', path: '/my-templates', icon: <ArticleIcon /> },
//   { text: '연락처', path: '/contacts', icon: <ContactsIcon /> },
//   { text: '스페이스', path: '/spaces', icon: <HomeIcon /> },
// ];

// const DashboardLayout = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   const { logout, user, currentSpace, isLoggedIn, fetchSpaces } = useAppStore();

//   const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null);

//   useEffect(() => {
//     if (isLoggedIn) {
//       fetchSpaces();
//     }
//   }, [isLoggedIn, fetchSpaces]);

//   const handleProfileMenuClick = (event: React.MouseEvent<HTMLElement>) => setProfileMenuAnchor(event.currentTarget);
//   const handleProfileMenuClose = () => setProfileMenuAnchor(null);
//   const handleGoToMyInfo = () => {
//     handleProfileMenuClose();
//     navigate('/my-info');
//   };
//   const handleLogout = () => {
//     handleProfileMenuClose();
//     logout();
//   };

//   const dynamicTheme = useMemo(() => {
//     const primaryColor = currentSpace?.color || '#90a4ae';
//     return createTheme({
//       palette: {
//         primary: { main: primaryColor },
//         action: {
//           selected: alpha(primaryColor, 0.12),
//           hover: alpha(primaryColor, 0.08),
//         },
//         // background: {
//         //   default: alpha(primaryColor, 0.05),
//         // }
//       },
//       typography: {
//         fontFamily: '"Jua", "Nunito", "Roboto", sans-serif',
//         h4: { fontWeight: 700, color: '#4e342e' },
//         body2: { color: '#795548' },
//     },
//     });
//   }, [currentSpace]);

//   return (
//     <ThemeProvider theme={dynamicTheme}>
//       <style>{fadeInAnimation}</style>
//       <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
//         <AppBar 
//           position="fixed" 
//           sx={{ 
//             zIndex: (theme) => theme.zIndex.drawer + 1,
//             backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.8),
//             backdropFilter: 'blur(12px)',
//             color: '#333',
//             boxShadow: 'none',
//             borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
//             transition: 'background-color 0.5s ease',
//           }}
//         >
//           <Toolbar>
//             <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold', cursor: 'pointer', minWidth: mainSidebarWidth, textAlign: 'center' }} onClick={() => navigate('/agent')}>
//               AI 템플릿 만들기
//             </Typography>
//             <Box sx={{ flexGrow: 1 }} />
//             <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
//               {currentSpace ? currentSpace.spaceName : '스페이스 없음'}
//             </Typography>
//             <Box sx={{ flexGrow: 1 }} />
//             <Typography variant="subtitle1" sx={{ mr: 1.5 }}>{user?.username}님</Typography>
//             <IconButton onClick={handleProfileMenuClick} size="small">
//               <Avatar sx={{ bgcolor: 'background.paper' , color: 'primary.main' }}>{user?.username ? user.username.charAt(0).toUpperCase() : 'U'}</Avatar>
//             </IconButton>
//           </Toolbar>
//         </AppBar>

//         <Menu anchorEl={profileMenuAnchor} open={Boolean(profileMenuAnchor)} onClose={handleProfileMenuClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
//           <MenuItem onClick={handleGoToMyInfo}><ListItemIcon><AccountCircleIcon fontSize="small" /></ListItemIcon>내 정보</MenuItem>
//           <Divider />
//           <MenuItem onClick={handleLogout}><ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>로그아웃</MenuItem>
//         </Menu>

//         <Drawer variant="permanent" sx={{ width: mainSidebarWidth, flexShrink: 0, [`& .MuiDrawer-paper`]: { width: mainSidebarWidth, boxSizing: 'border-box' } }}>
//           <Toolbar />
//           <Box sx={{ overflow: 'auto' }}>
//             <List>
//               {mainMenuItems.map((item) => {
//                 const isActive = location.pathname.startsWith(item.path);
//                 return (
//                   <ListItem key={item.text} disablePadding>
//                     <ListItemButton onClick={() => navigate(item.path)} sx={{ flexDirection: 'column', justifyContent: 'center', height: 72, px: 1, backgroundColor: isActive ? 'action.selected' : 'transparent', '&:hover': { backgroundColor: isActive ? 'action.selected' : 'action.hover' } }}>
//                       <ListItemIcon sx={{ minWidth: 'auto', color: isActive ? 'primary.main' : 'inherit' }}>{item.icon}</ListItemIcon>
//                       <ListItemText primary={item.text} primaryTypographyProps={{ variant: 'caption', sx: { mt: 0.5, fontWeight: isActive ? 'bold' : 'regular', color: isActive ? 'primary.main' : 'inherit' } }} />
//                     </ListItemButton>
//                   </ListItem>
//                 );
//               })}
//             </List>
//           </Box>
//         </Drawer>

//         <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: '#f9fafb', overflowY: 'auto' }}>
//           <Toolbar />
//           <Box 
//             key={currentSpace?.spaceId || 'no-space'} // ★ 스페이스가 바뀔 때마다 이 컴포넌트를 새로 그리도록 강제
//             sx={{ animation: 'fadeIn 0.5s ease-out' }}
//           >
//             <Outlet />
//           </Box>
//         </Box>
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default DashboardLayout;


import React, { useState, useEffect, useMemo } from 'react';
import { Outlet, useNavigate, useLocation, useParams } from 'react-router-dom';
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
  { text: 'AI', path: 'suggestion', icon: <AutoAwesomeIcon /> },
  { text: '내 템플릿', path: 'templates', icon: <ArticleIcon /> },
  { text: '연락처', path: 'contacts', icon: <ContactsIcon /> },
  { text: '스페이스', path: 'management', icon: <HomeIcon /> },
];

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { spaceId } = useParams<{ spaceId: string }>();
  
  // ★★★ 변경점 2: 스토어에서 필요한 모든 것을 가져옵니다 ★★★
  const { 
    logout, 
    user, 
    currentSpace, 
    spaces, // 스페이스 목록 전체
    setCurrentSpace, // currentSpace를 변경하는 액션
    isLoggedIn, 
    fetchSpaces 
  } = useAppStore();

  const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null);

  useEffect(() => {
    if (isLoggedIn) {
      fetchSpaces();
    }
  }, [isLoggedIn, fetchSpaces]);

  // ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
  // ★★★ 핵심 기능: URL과 currentSpace 상태 동기화 ★★★
  // ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
  useEffect(() => {
    // URL에 spaceId가 있고, 스페이스 목록(spaces)도 로딩된 상태일 때
    if (spaceId && spaces.length > 0) {
      // 현재 URL의 spaceId와 스토어의 currentSpace.spaceId가 다른 경우에만 업데이트
      if (currentSpace?.spaceId !== Number(spaceId)) {
        // 스페이스 목록에서 URL과 일치하는 스페이스를 찾습니다.
        const targetSpace = spaces.find(s => s.spaceId === Number(spaceId));
        
        if (targetSpace) {
          // 일치하는 스페이스를 찾았다면, 스토어의 currentSpace를 업데이트합니다.
          console.log(`URL 변경 감지: currentSpace를 ${targetSpace.spaceName}(으)로 변경합니다.`);
          setCurrentSpace(targetSpace);
        }
      }
    } else if (!spaceId) {
      // URL에 spaceId가 없는 경우 (예: /spaces/management)
      // currentSpace를 null로 설정하여 혼동을 방지할 수 있습니다. (선택적)
      // setCurrentSpace(null);
    }
  }, [spaceId, spaces, currentSpace, setCurrentSpace]); // 의존성 배열에 필요한 모든 것을 추가


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

  const dynamicTheme = useMemo(() => {
    return createTheme({
      palette: {
        primary: { main: currentSpace?.color || '#90a4ae' },
        action: {
          selected: alpha(currentSpace?.color || '#90a4ae', 0.12),
          hover: alpha(currentSpace?.color || '#90a4ae', 0.08),
        },
      },
      typography: {
        fontFamily: '"Jua", "Nunito", "Roboto", sans-serif',
      },
    });
  }, [currentSpace]);

  return (
    <ThemeProvider theme={dynamicTheme}>
      <style>{fadeInAnimation}</style>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
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
              <Avatar sx={{ bgcolor: 'background.paper' , color: 'primary.main' }}>{user?.username ? user.username.charAt(0).toUpperCase() : 'U'}</Avatar>
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
              {/* ★★★ 변경점 3: 메뉴 렌더링 로직 수정 ★★★ */}
              {/* 더 이상 spaceId 유무로 렌더링을 결정하지 않고, 항상 모든 메뉴를 보여줍니다. */}
              {mainMenuItems.map((item) => {
                let fullPath: string;
                let isActive: boolean;

                // '스페이스' 메뉴는 경로 구조가 다릅니다.
                if (item.path === 'management') {
                  fullPath = '/spaces/management';
                  isActive = location.pathname === fullPath;
                } else {
                  // 다른 메뉴들은 spaceId가 필요합니다.
                  // 1. URL에 spaceId가 있으면 그것을 사용합니다. (예: /spaces/123/suggestion)
                  // 2. URL에 spaceId가 없으면(예: /spaces/management), 전역 상태의 currentSpace.spaceId를 사용합니다.
                  const targetSpaceId = spaceId || currentSpace?.spaceId;
                  
                  // 만약 targetSpaceId도 없다면 (스페이스가 아예 없는 초기 상태), 링크를 비활성화할 수 있습니다.
                  if (!targetSpaceId) {
                    fullPath = '#'; // 임시 경로
                  } else {
                    fullPath = `/spaces/${targetSpaceId}/${item.path}`;
                  }
                  isActive = location.pathname === fullPath;
                }

                return (
                  <ListItem key={item.text} disablePadding>
                    <ListItemButton 
                      onClick={() => fullPath !== '#' && navigate(fullPath)} 
                      disabled={fullPath === '#'} // 경로가 없으면 버튼 비활성화
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

        <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: '#f9fafb', overflowY: 'auto' }}>
          <Toolbar />
          <Box 
            key={currentSpace?.spaceId || 'no-space'}
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
