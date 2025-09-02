import React, { useState } from 'react';
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

// TypeScript를 위해, 이 컴포넌트가 받을 props의 타입을정의
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
    // 각 입력창의 값을 지정하기 위한 state
    const [name, setName] = useState('');
    const [emailOrPhone, setEmailOrPhone] = useState('');

    // 유효성 검사 에러 메시지를 저장하기 위한 state
    const [nameError, setNameError] = useState('');
    const [emailOrPhoneError, setEmailOrPhoneError] = useState('');

    /**
     * @description '회원가입하기' 버튼 클릭 시 호출될 함수
     */
    const handleSignup = () => {
        let isValid = true;

        // 이름 유효성 검사
        if (!name.trim()) {
            setNameError('이름을 입력해주세요.');
            isValid = false;
        } else {
            setNameError('');
        }

        // 이메일 / 휴대전화 유효성 검사
        if (!emailOrPhone.trim()) {
            setEmailOrPhoneError('이메일 또는 휴대전화를 입력해주세요.');
            isValid = false;
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const phoneRegex = /^010-?([0-9]{4})-?([0-9]{4})$/;
            if (!emailRegex.test(emailOrPhone) && !phoneRegex.test(emailOrPhone)) {
                setEmailOrPhoneError('올바르지 않은 이메일 또는 전화번호 형식입니다.');
                isValid = false;
            } else {
                setEmailOrPhoneError('');
            }
        }

        // 모든 유효성 검사를 통과했을 때만 "회원가입 성공" 메시지
        if (isValid) {
            console.log('회원가입 시도:', {name, emailOrPhone});
            alert('회원가입 성공! (임시)');
            onClose();
        }
    };

    /**
     * @description 모달이 닫힐 때 입력값과 에러 메시지를 초기화하는 함수
     */
    const handleClose = () => {
        setName('');
        setEmailOrPhone('');
        setNameError('');
        setEmailOrPhoneError('');
        onClose();
    };


    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
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
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={!!nameError}
                    helperText={nameError}
                />
                <TextField
                    label="이메일 / 휴대전화"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    error={!!emailOrPhoneError}
                    helperText={emailOrPhoneError}
                />
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: '16px 24px' }}>
            <Button onClick={handleSignup} variant="contained" fullWidth size="large">
                회원가입하기
            </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SignupModal;
