import React, { useState } from 'react'; // [수정] useState를 import합니다.
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  IconButton,
  InputBase,
  Button,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SettingsIcon from '@mui/icons-material/Settings'; 
import AccountBoxIcon from '@mui/icons-material/AccountBox'; 
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { SUB_SIDEBAR_WIDTH } from '../styles/layoutConstants';


const subMenuItems = [
  { text: '전체 스페이스', icon: <AccountBoxIcon /> },
  { text: '계정 관리', icon: <SettingsIcon /> },
];

const spaces = [
    { id: 1, name: '커리어아카데미', role: '최고 관리자', icon: 'K' },
    { id: 2, name: '마케팅팀', role: '멤버', icon: 'M' },
    { id: 3, name: '사이드 프로젝트', role: '소유자', icon: 'S' },
];

/**
 * @description 사용자가 속한 스페이스 목록을 보여주는 페이지입니다.
 * @returns {React.ReactElement} SpacesPage 컴포넌트
 */
const SpacesPage = () => {
  const [isSubSidebarOpen, setSubSidebarOpen] = useState(true);
  // [추가] 현재 선택된 서브 메뉴를 관리하는 상태를 만듭니다. 초기값은 '전체 스페이스'입니다.
  const [selectedSubMenu, setSelectedSubMenu] = useState(subMenuItems[0].text);

  return (
    <Box sx={{ display: 'flex' }}>
      {/* 1. 왼쪽 서브 사이드바 */}
      <Paper 
        variant="outlined"
        sx={{ 
            width: isSubSidebarOpen ? SUB_SIDEBAR_WIDTH : 0,
            minWidth: isSubSidebarOpen ? SUB_SIDEBAR_WIDTH : 0,
            borderColor: '#e0e0e0',
            alignSelf: 'flex-start',
            transition: (theme) => theme.transitions.create(['width', 'min-width', 'padding', 'opacity'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflow: 'hidden',
            opacity: isSubSidebarOpen ? 1 : 0,
        }}
    >
        <Box sx={{ width: SUB_SIDEBAR_WIDTH }}>
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, borderBottom: '1px solid #e0e0e0' }}>
              <Avatar sx={{ width: 48, height: 48 }}>H</Avatar>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>홍길동</Typography>
            </Box>
            <List>
              {subMenuItems.map((item) => (
                <ListItem key={item.text} disablePadding>
                  {/* [수정] 메뉴를 클릭하면 selectedSubMenu 상태가 업데이트되고, 선택된 항목은 시각적으로 표시됩니다. */}
                  <ListItemButton 
                    selected={selectedSubMenu === item.text}
                    onClick={() => setSelectedSubMenu(item.text)}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
        </Box>
      </Paper>

      {/* 2. 오른쪽 메인 콘텐츠 */}
      <Box sx={{ flexGrow: 1, pl: 3 }}>
        {/* [수정] 헤더 영역에 동적인 소제목과 구분선을 추가합니다. */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
          <IconButton onClick={() => setSubSidebarOpen(!isSubSidebarOpen)}>
            {isSubSidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>

          {/* [추가] 선택된 서브 메뉴의 이름을 소제목으로 보여줍니다. */}
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            {selectedSubMenu}
          </Typography>

          <Divider orientation="vertical" flexItem sx={{ ml: 1 }}/>

          <Paper
            variant="outlined"
            component="form"
            sx={{ 
              p: '2px 4px', 
              display: 'flex', 
              alignItems: 'center', 
              flexGrow: 1, 
              borderColor: '#e0e0e0' 
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="스페이스명으로 검색해주세요"
            />
            <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>
          
          <Button variant="contained" startIcon={<AddIcon />}>
            스페이스 추가하기
          </Button>
        </Box>

        <List>
            {spaces.map((space) => (
                <ListItemButton 
                    key={space.id}
                    sx={{ 
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        mb: 1.5,
                    }}
                >
                    <ListItemIcon>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>{space.icon}</Avatar>
                    </ListItemIcon>
                    <ListItemText primary={space.name} secondary={space.role} />
                    <ArrowForwardIosIcon fontSize="small" />
                </ListItemButton>
            ))}
        </List>
      </Box>
    </Box>
  );
};

export default SpacesPage;
