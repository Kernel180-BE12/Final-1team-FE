import React, { useState, useCallback, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// 모달이 받을 props 타입을 정의합니다.
type RegisterModalProps = {
  open: boolean;
  onClose: () => void;
};

// 1. 유효성 검사 규칙 정의 (정규식)
const usernameRegex = /^[a-z0-9]{5,15}$/;
const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RegisterModal = ({ open, onClose }: RegisterModalProps) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    passwordConfirm: '',
    name: '',
    email: '',
  });
  
  const [errors, setErrors] = useState({
    username: '',
    password: '',
    passwordConfirm: '',
    name: '',
    email: '',
  });
  
  // 4. 로딩 및 API 에러 상태 추가
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');


  const validateField = useCallback((name: string, value: string) => {
    switch (name) {
      case 'username':
        return !usernameRegex.test(value) ? '5~15자의 영문 소문자, 숫자만 사용 가능합니다.' : '';
      case 'password':
        return !passwordRegex.test(value) ? '8~16자 영문, 숫자, 특수문자를 조합해주세요.' : '';
      case 'passwordConfirm':
        return value !== formData.password ? '비밀번호가 일치하지 않습니다.' : '';
      case 'name':
        return value.length < 2 ? '이름은 2자 이상 입력해주세요.' : '';
      case 'email':
        return !emailRegex.test(value) ? '올바른 이메일 형식이 아닙니다.' : '';
      default:
        return '';
    }
  }, [formData.password]);

  useEffect(() => {
    if (formData.passwordConfirm) {
      const errorMessage = validateField('passwordConfirm', formData.passwordConfirm);
      setErrors(errors => ({ ...errors, passwordConfirm: errorMessage }));
    }
  }, [formData.password, formData.passwordConfirm, validateField]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setApiError(''); // 입력 시 API 에러 메시지 초기화
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const errorMessage = validateField(name, value);
    setErrors(prevErrors => ({ ...prevErrors, [name]: errorMessage }));
  };

  const handleSubmit = async () => {
    setApiError('');
    const newErrors = {
      username: validateField('username', formData.username),
      password: validateField('password', formData.password),
      passwordConfirm: validateField('passwordConfirm', formData.passwordConfirm),
      name: validateField('name', formData.name),
      email: validateField('email', formData.email),
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error !== '')) {
      return;
    }

    setIsLoading(true); // 로딩 시작

    try {
      const { passwordConfirm: _, ...payload } = formData;
      
      // 1. 환경 변수를 사용한 API URL (실제로는 axios 인스턴스 사용 권장)
      // const API_URL = `${import.meta.env.VITE_API_BASE_URL || ''}/api/user/register`;
      // const response = await axios.post(API_URL, payload);
      
      // 여기서는 간단하게 상대 경로
      const response = await axios.post('/api/user/register', payload);

      if (response.status === 200) {
        alert('회원가입이 성공적으로 완료되었습니다. 로그인 페이지로 이동합니다.');
        onClose();
        navigate('/login');
      }
    } catch (error) {
        // 3. 상세한 에러 핸들링
        if (axios.isAxiosError(error) && error.response) {
            // 백엔드에서 보낸 구체적인 에러 메시지를 상태에 저장
            const errorMessage = error.response.data.message || '요청 데이터가 잘못되었거나 이미 존재하는 사용자입니다.';
            setApiError(errorMessage);
            console.error('회원가입 실패:', error.response.data);
        } else {
            setApiError('네트워크 오류 또는 알 수 없는 문제가 발생했습니다.');
            console.error('회원가입 실패:', error);
        }
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '8px',
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
          회원가입
        </Typography>
        <Stack spacing={2}>
          <TextField name="username" label="아이디" fullWidth onChange={handleChange} onBlur={handleBlur} error={!!errors.username} helperText={errors.username} disabled={isLoading} />
          <TextField name="password" label="비밀번호" type="password" fullWidth onChange={handleChange} onBlur={handleBlur} error={!!errors.password} helperText={errors.password} disabled={isLoading} />
          <TextField name="passwordConfirm" label="비밀번호 확인" type="password" fullWidth onChange={handleChange} onBlur={handleBlur} error={!!errors.passwordConfirm} helperText={errors.passwordConfirm} disabled={isLoading} />
          <TextField name="name" label="이름" fullWidth onChange={handleChange} onBlur={handleBlur} error={!!errors.name} helperText={errors.name} disabled={isLoading} />
          <TextField name="email" label="이메일" type="email" fullWidth onChange={handleChange} onBlur={handleBlur} error={!!errors.email} helperText={errors.email} disabled={isLoading} />
          
          {apiError && (
            <Typography color="error" variant="body2" sx={{ textAlign: 'center' }}>
                {apiError}
            </Typography>
          )}

          <Button 
            variant="contained" 
            size="large" 
            fullWidth 
            onClick={handleSubmit}
            disabled={isLoading}
            sx={{ height: 56 }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : '가입하기'}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default RegisterModal;

