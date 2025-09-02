import React, { useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import RememberMeIcon from '@mui/icons-material/RememberMe';
import SettingsIcon from '@mui/icons-material/Settings';

import AllSpacesContent from './components/AllSpacesContent';
import InviteSettingsContent from './components/InviteSettingsContent';
import AccountManagementContent from './components/AccountManagementContent';

import SubSidebar from '../../components/layout/SubSidebar';
import CreateSpaceModal from '../../components/modals/CreateSpaceModal';

const subMenuItems = [
  { key: 'all-spaces', text: '전체 스페이스', icon: <AccountBoxIcon /> },
  { key: 'invites', text: '초대 및 권한 설정', icon: <RememberMeIcon /> },
  { key: 'account-settings', text: '계정 관리', icon: <SettingsIcon /> },
];

const SpacesPage = () => {
  const [isSubSidebarOpen, setSubSidebarOpen] = useState(true);
  const [selectedMenuKey, setSelectedMenuKey] = useState('invites');
  const [isModalOpen, setModalOpen] = useState(false);

  const renderMainContent = () => {
    switch (selectedMenuKey) {
      case 'all-spaces':
        return <AllSpacesContent onAddSpace={() => setModalOpen(true)} />;
      case 'invites':
        return <InviteSettingsContent />;
      case 'account-settings':
        return <AccountManagementContent />;
      default:
        return null;
    }
  };

  const selectedMenuText = subMenuItems.find(item => item.key === selectedMenuKey)?.text || '';

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <SubSidebar
          isOpen={isSubSidebarOpen}
          menuItems={subMenuItems}
          selectedMenuKey={selectedMenuKey}
          onMenuClick={setSelectedMenuKey}
        />
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
            <IconButton onClick={() => setSubSidebarOpen(!isSubSidebarOpen)}>
              {isSubSidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              {selectedMenuText}
            </Typography>
          </Box>
          {renderMainContent()}
        </Box>
      </Box>
      <CreateSpaceModal open={isModalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default SpacesPage;
