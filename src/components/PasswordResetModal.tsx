import React, { useState } from 'react';
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
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [error, setError] = useState('');

  /**
   * @description '메시지 전송' 버튼 클릭 시 호출될 함수
   */
  const handleSend = () => {
    // 유효성 검사
    if (!emailOrPhone) {
      setError('이메일 또는 휴대전화를 입력해주세요.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^010-?([0-9]{4})-?([0-9]{4})$/;
    if (!emailRegex.test(emailOrPhone) && !phoneRegex.test(emailOrPhone)) {
        setError('올바르지 않은 이메일 또는 전화번호 형식입니다.');
        return;
    }

    // 유효성 검사 통과 시
    setError('');  // 에러 메시지를 초기화
    alert(`입력하신 ${emailOrPhone}(으)로 비밀번호 재설정 메시지를 보냈습니다. (임시)`);
    onClose();
  };

  /**
   * @description 모달이 닫힐 때 입력값과 에러 메시지를 초기화하는 함수
   */
  const handleClose = () => {
    setEmailOrPhone('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
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
          value={emailOrPhone}
          onChange={(e) => setEmailOrPhone(e.target.value)}
          error={!!error}
          helperText={error}
        />
      </DialogContent>
      <DialogActions sx={{ p: '16px 24px' }}>
        <Button onClick={handleSend} variant="contained" fullWidth>
          비밀번호 재설정 메시지 전송
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PasswordResetModal;
