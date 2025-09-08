import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import HomeIcon from '@mui/icons-material/Home';
import ContactsIcon from '@mui/icons-material/Contacts';
import ArticleIcon from '@mui/icons-material/Article';
import { Outlet, useNavigate } from 'react-router-dom';

const mainSidebarWidth = 80;

const mainMenuItems = [
  { text: 'AI', path: '/suggestion', icon: <AutoAwesomeIcon /> },
  { text: '연락처', path: '/contacts', icon: <ContactsIcon /> },
  { text: '내 템플릿', path: '/my-templates', icon: <ArticleIcon /> },
  { text: '스페이스', path: '/spaces', icon: <HomeIcon /> },
];

/**
 * @description 로그인한 사용자를 위한 공용 레이아웃입니다. (마이페이지 개념)
 * @returns {React.ReactElement} DashboardLayout 컴포넌트
 */
const DashboardLayout = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex' }}>
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
            {mainMenuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    height: 72,
                    px: 1,
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 'auto' }}>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      variant: 'caption',
                      sx: { mt: 0.5 },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* 메인 콘텐츠 영역 */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: '#f9fafb', minHeight: '100%' }}>
        {/* 이 Outlet 부분에 스페이스, 내 템플릿 등 로그인 후 페이지들이 렌더링됩니다. */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;