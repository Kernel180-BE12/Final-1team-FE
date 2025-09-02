import React from 'react';
import { Paper, Box, Avatar, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { SUB_SIDEBAR_WIDTH } from '../../styles/layoutConstants';

// SubSidebar가 받을 props 타입을 정의합니다.
interface SubSidebarProps {
  isOpen: boolean;
  menuItems: { key: string; text: string; icon: React.ReactNode; }[];
  selectedMenuKey: string;
  onMenuClick: (key: string) => void;
}

const SubSidebar = ({ isOpen, menuItems, selectedMenuKey, onMenuClick }: SubSidebarProps) => {
  return (
    <Paper
      variant="outlined"
      sx={{
        width: isOpen ? SUB_SIDEBAR_WIDTH : 0,
        minWidth: isOpen ? SUB_SIDEBAR_WIDTH : 0,
        borderColor: '#e0e0e0',
        alignSelf: 'flex-start',
        transition: (theme) => theme.transitions.create(['width', 'min-width', 'padding', 'opacity']),
        overflow: 'hidden',
        opacity: isOpen ? 1 : 0,
      }}
    >
      <Box sx={{ width: SUB_SIDEBAR_WIDTH }}>
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, borderBottom: '1px solid #e0e0e0' }}>
          <Avatar sx={{ width: 48, height: 48 }}>H</Avatar>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>홍길동</Typography>
        </Box>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.key} disablePadding>
              <ListItemButton
                selected={selectedMenuKey === item.key}
                onClick={() => onMenuClick(item.key)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Paper>
  );
};

export default SubSidebar;
