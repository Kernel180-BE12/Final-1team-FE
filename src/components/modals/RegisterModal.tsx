import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  CircularProgress,
} from '@mui/material';
import apiClient from '../../api';

type RegisterModalProps = {
  open: boolean;
  onClose: () => void;
};

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

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  // 중복 체크를 위한 상태 추가 -> 어떤 필드가 중복 검사 중인지 추적
  const [isChecking, setIsChecking] = useState({
    username: false,
    email: false,
  })


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
    setApiError('');
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // 1. 먼저 형식 유효성부터 검사합니다.
    const formatError = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: formatError }));

    // 2. 형식부터 틀렸거나, 필드가 비어있거나, 아이디/이메일 필드가 아니면 중복 검사를 하지 않습니다.
    if (formatError || !value || (name !== 'username' && name !== 'email')) {
      return;
    }

    // 3. 중복 검사 API를 호출합니다.
    setIsChecking(prev => ({ ...prev, [name]: true })); // 검사 시작 상태로 변경
    try {
      const endpoint = name === 'username' ? '/user/id/check' : '/user/email/check';
      await apiClient.post(endpoint, { [name]: value });

      // 성공(200 OK)은 중복되지 않음을 의미합니다.
      // 기존에 있던 에러 메시지를 지워줍니다. (예: 이전에 중복됐다가 사용 가능한 아이디로 바꾼 경우)
      setErrors(prev => ({ ...prev, [name]: '' }));

    } catch (error) {
      // 실패(400 Bad Request)는 중복됨을 의미합니다.
      if (apiClient.isAxiosError(error) && error.response?.status === 400) {
        const duplicateMessage = name === 'username'
          ? '이미 사용 중인 아이디입니다.'
          : '이미 등록된 이메일입니다.';
        setErrors(prev => ({ ...prev, [name]: duplicateMessage }));
      }
    } finally {
      setIsChecking(prev => ({ ...prev, [name]: false })); // 검사 완료 상태로 변경
    }
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
      const response = await apiClient.post('/user/register', payload);

      if (response.status === 200) {
        alert('회원가입이 성공적으로 완료되었습니다. 로그인 페이지로 이동합니다.');
        onClose();
        navigate('/login');
      }
    } catch (error) {
      if (apiClient.isAxiosError(error) && error.response) {
      const data = error.response.data as { message?: string };
      const message = data.message || ''; // 백엔드 메시지를 변수에 저장

      // 1. 백엔드 메시지에 '아이디', '이메일', '존재', '사용' 같은 키워드가 포함되어 있는지 확인합니다.
      const isDuplicateError = 
        message.includes('아이디') || 
        message.includes('이메일') || 
        message.includes('존재') ||
        message.includes('사용');

      // 2. 만약 '중복 에러'가 아니라면, 그때만 버튼 위의 apiError를 설정합니다.
      if (!isDuplicateError) {
        setApiError(message || '회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.');
      }
      // 3. 만약 '중복 에러'라면, 아무것도 하지 않습니다. (setApiError를 호출하지 않음)
      //    그러면 사용자는 이미 입력창 아래에 표시된 프론트엔드 에러 메시지만 보게 됩니다.

    } else {
      setApiError('네트워크 오류 또는 알 수 없는 문제가 발생했습니다.');
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
        <form onSubmit={(e) => {
          e.preventDefault();  // 브라우저의 기본 GET 요청 동작을 막음
          handleSubmit();  // 내가 만든 handleSubmit 동작 실행
        }}>
          <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
            회원가입
          </Typography>
          <Stack spacing={2}>
            <TextField name="name" label="이름" fullWidth onChange={handleChange} onBlur={handleBlur} error={!!errors.name} helperText={errors.name} disabled={isLoading} />
            <TextField name="username" label="아이디" fullWidth onChange={handleChange} onBlur={handleBlur} error={!!errors.username} helperText={errors.username} disabled={isLoading} InputProps={{ endAdornment: isChecking.username ? <CircularProgress size={20} /> : null }}/>
            <TextField name="email" label="이메일" type="email" fullWidth onChange={handleChange} onBlur={handleBlur} error={!!errors.email} helperText={errors.email} disabled={isLoading} InputProps={{ endAdornment: isChecking.email ? <CircularProgress size={20} /> : null }}/>
            <TextField name="password" label="비밀번호" type="password" fullWidth onChange={handleChange} onBlur={handleBlur} error={!!errors.password} helperText={errors.password} disabled={isLoading} />
            <TextField name="passwordConfirm" label="비밀번호 확인" type="password" fullWidth onChange={handleChange} onBlur={handleBlur} error={!!errors.passwordConfirm} helperText={errors.passwordConfirm} disabled={isLoading} />          
            {apiError && (
              <Typography color="error" variant="body2" sx={{ textAlign: 'center' }}>
                  {apiError}
              </Typography>
            )}

            <Button 
              type="submit"
              variant="contained" 
              size="large" 
              fullWidth 
              disabled={isLoading}
              sx={{ height: 56 }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : '가입하기'}
            </Button>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
};

export default RegisterModal;
