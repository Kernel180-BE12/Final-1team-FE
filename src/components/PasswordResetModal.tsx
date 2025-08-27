import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Button,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface PasswordResetModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * @description 비밀번호 재설정 팝업(모달) 컴포넌트입니다.
 * @param {object} props - React 컴포넌트 props
 * @param {boolean} props.open - 모달의 열림/닫힘 상태
 * @param {() => void} props.onClose - 모달을 닫을 때 호출되는 함수
 * @returns {React.ReactElement} PasswordResetModal 컴포넌트
 */
const PasswordResetModal = ({ open, onClose }: PasswordResetModalProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, fontWeight: 'bold' }}>
        비밀번호 재설정
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
        <Typography gutterBottom>
          로그인 시 사용하는 이메일 또는 전화번호를 입력해주세요. 입력하신 이메일 또는 휴대전화로 비밀번호 재설정 링크가 전송됩니다.
        </Typography>
        <TextField
          autoFocus
          margin="dense"
          id="emailOrPhone"
          label="이메일 / 휴대전화"
          type="text"
          fullWidth
          variant="outlined"
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions sx={{ p: '16px 24px' }}>
        <Button onClick={onClose} variant="contained" fullWidth>
          비밀번호 재설정 메시지 전송
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PasswordResetModal;
