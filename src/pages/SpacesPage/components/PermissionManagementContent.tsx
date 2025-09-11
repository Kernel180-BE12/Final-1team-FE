import React from 'react';
import { Paper, Typography } from '@mui/material';

const PermissionManagementContent = () => {
  return (
    <Paper variant="outlined" sx={{ borderColor: '#e0e0e0', p: 3, textAlign: 'center' }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        권한 관리
      </Typography>
      <Typography color="text.secondary">
        이곳에 권한 그룹을 설정하고 관리하는 기능이 표시됩니다.
      </Typography>
    </Paper>
  );
};

export default PermissionManagementContent;