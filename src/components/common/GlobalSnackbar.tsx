// src/components/common/GlobalSnackbar.tsx (새로운 파일)

import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import useAppStore from '../../store/useAppStore';

const GlobalSnackbar = () => {
  const { snackbar, hideSnackbar } = useAppStore();

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    hideSnackbar();
  };

  if (!snackbar) return null;

  return (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={handleClose} severity={snackbar.severity} sx={{ width: '100%' }}>
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
};

export default GlobalSnackbar;