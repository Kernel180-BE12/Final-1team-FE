import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// TypeScript를 위해, 이 컴포넌트가 받을 props의 타입을 정의합니다.
interface SignupModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * @description 이메일/휴대전화로 회원가입하는 팝업(모달) 컴포넌트입니다.
 * @param {object} props - React 컴포넌트 props
 * @param {boolean} props.open - 모달의 열림/닫힘 상태
 * @param {() => void} props.onClose - 모달을 닫을 때 호출되는 함수
 * @returns {React.ReactElement} SignupModal 컴포넌트
 */
const SignupModal = ({ open, onClose }: SignupModalProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold' }}>
        회원가입
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            autoFocus
            label="이름"
            type="text"
            fullWidth
            variant="outlined"
          />
          <TextField
            label="이메일 / 휴대전화"
            type="text"
            fullWidth
            variant="outlined"
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: '16px 24px' }}>
        <Button onClick={onClose} variant="contained" fullWidth size="large">
          회원가입하기
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SignupModal;
