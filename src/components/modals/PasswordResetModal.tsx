import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Button,
  IconButton,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import apiClient from '../../api';
interface PasswordResetModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * @description 비밀번호 재설정 팝업(모달) 컴포넌트입니다.
 * 회원가입 시 등록한 이메일로 비밀번호 재설정을 요청합니다.
 */
const PasswordResetModal = ({ open, onClose }: PasswordResetModalProps) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * @description '비밀번호 재설정 요청' 버튼 클릭 시 호출
   */
  const handleSend = async () => {
    // 유효성 검사
    if (!email) {
      setError('이메일을 입력해주세요.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('올바른 이메일 형식을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      // 서버에 비밀번호 재설정 요청 API 호출
      const response = await apiClient.post('/user/reset-password', { email });

      if (response.status === 200) {
        setError('');
        setSuccessMessage(`입력하신 ${email} 주소로 비밀번호 재설정 메일을 보냈습니다.`);
        setTimeout(() => {
          handleClose();
        }, 2000);
      }
    } catch (err) {
      if (apiClient.isAxiosError(err) && err.response) {
        const data = err.response.data;
        if (typeof data === 'object' && data !== null && 'message' in data && typeof (data as { message: unknown }).message === 'string') {
          setError((data as { message: string }).message);
        } else {
          setError('해당 이메일로 가입된 계정을 찾을 수 없습니다.');
        }
      } else {
        setError('네트워크 오류 또는 알 수 없는 문제가 발생했습니다.');
      }
      console.error('비밀번호 재설정 요청 실패:', err);
    } finally {
        setIsLoading(false);
    }
  };
  /**
   * @description 모달이 닫힐 때 입력값/에러 초기화
   */
  const handleClose = () => {
    setEmail('');
    setError('');
    setSuccessMessage('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, fontWeight: 'bold' }}>
        비밀번호 재설정
        <IconButton
          aria-label="close"
          onClick={handleClose}
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
          회원가입 시 등록한 이메일 주소를 입력해주세요. 입력하신 이메일로 비밀번호 재설정 링크가 전송됩니다.
        </Typography>
        <TextField
          autoFocus
          margin="dense"
          id="email"
          label="이메일"
          type="email"
          fullWidth
          variant="outlined"
          sx={{ mt: 2 }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!error}
          helperText={error || successMessage}
          FormHelperTextProps={{ sx: { color: successMessage ? 'green' : 'red' } }}
          disabled={isLoading || !!successMessage}
        />
      </DialogContent>
      <DialogActions sx={{ p: '16px 24px' }}>
        <Button onClick={handleSend} variant="contained" fullWidth size="large" disabled={isLoading || !!successMessage}>
          {isLoading ? <CircularProgress size={24} color="inherit" /> : '비밀번호 재설정 요청'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PasswordResetModal;
