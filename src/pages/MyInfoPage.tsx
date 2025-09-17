import { Box, Typography, Paper, TextField, Button, Avatar, Stack, Alert, Snackbar, CircularProgress } from '@mui/material';
import useAppStore from '../store/useAppStore';
import { useState, useEffect } from 'react';
import apiClient from '../api';

/**
 * @description 사용자 정보를 확인하고 수정하는 페이지
 * @returns {React.ReactElement} MyInfoPage 컴포넌트
 */
const MyInfoPage = () => {
    const { user } = useAppStore();

    // 폼 상태와 API 통신 관련 상태들을 정의합니다.
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    // Snackbar 상태 정의 (메시지, 타입)
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error' | 'info' | 'warning',
    });

    // 페이지 로드 시, 서버에서 최신 사용자 정보를 가져오는 로직
    useEffect(() => {
        setIsLoading(true);
        apiClient.get('/user/info')
            .then(response => {
                const { name, email } = response.data;
                setName(name || ''); // 서버에서 null이 올 경우를 대비
                setEmail(email || '');
            })
            .catch(error => {
                console.error("사용자 정보 로딩 실패:", error);
                setSnackbar({ open: true, message: '사용자 정보를 불러오는 데 실패했습니다.', severity: 'error' });
                // 실패 시 스토어의 기본값이나 임시값 사용
                setName(user?.username || '사용자');
                setEmail('정보를 불러올 수 없습니다.');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [user?.username]); // user.username이 바뀔 때 (로그인/로그아웃) 다시 불러오도록 설정

    // 프로필 업데이트 버튼 클릭 시, 서버에 변경된 정보를 전송하는 로직
    const handleUpdateProfile = async () => {
        setIsUpdating(true);
        try {
            const response = await apiClient.put('/user/update', { name, email });

            if (response.status === 200) {
                setSnackbar({ open: true, message: '프로필이 성공적으로 업데이트되었습니다.', severity: 'success' });
                // ✨ API 명세에는 없지만, 만약 백엔드가 업데이트된 정보를 응답으로 준다면
                //    그 데이터로 상태를 업데이트하는 것이 가장 효율적
                if (response.data) {
                    const { name: updatedName, email: updatedEmail } = response.data;
                    setName(updatedName || name);
                    setEmail(updatedEmail || email);
                }
            } else if (response.status === 204) {
                setSnackbar({ open: true, message: '변경사항이 없습니다.', severity: 'info' });
            }
        } catch (error) {
            let errorMessage = '업데이트 중 오류가 발생했습니다.';
            if (apiClient.isAxiosError(error) && error.response) {
              const data = error.response.data;

              if (typeof data === 'object' && data !== null && 'message' in data && typeof (data as { message: string }).message === 'string') {
                  errorMessage = (data as { message: string }).message;
              } 
              // 백엔드가 메시지를 안 줬을 경우, status 코드로 분기
              else if (error.response.status >= 500) {
                  errorMessage = '서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
              } else if (error.response.status === 400) {
                  errorMessage = '이미 사용 중인 이메일이거나, 입력이 잘못되었습니다.';
              }
          }
          setSnackbar({ open: true, message: errorMessage, severity: 'error' });
        } finally {
            setIsUpdating(false);
        }
    };

    const handleSnackbarClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    // 로딩 중일 때 보여줄 UI
    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: '700px', mx: 'auto' }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 4 }}>
                내 정보
            </Typography>

            <Stack spacing={4}>
                <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="h6" sx={{ mb: 3 }}>프로필 정보</Typography>
                    <Stack spacing={2.5} alignItems="flex-start">
                        <Avatar sx={{ width: 80, height: 80, mb: 1, bgcolor: 'primary.main', fontSize: '2rem' }}>
                            {name ? name.charAt(0).toUpperCase() : (user?.username ? user.username.charAt(0).toUpperCase() : 'U')}
                        </Avatar>
                        <TextField
                            fullWidth
                            label="아이디 (수정 불가)"
                            value={user?.username || ''}
                            InputProps={{ readOnly: true }}
                            variant="filled"
                        />
                        <TextField
                            fullWidth
                            label="이름"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={isUpdating}
                        />
                        <TextField
                            fullWidth
                            label="이메일"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isUpdating}
                        />
                        <Button
                            variant="contained"
                            onClick={handleUpdateProfile}
                            sx={{ mt: 1 }}
                            disabled={isUpdating}
                        >
                            {isUpdating ? <CircularProgress size={24} color="inherit" /> : '프로필 업데이트'}
                        </Button>
                    </Stack>
                </Paper>
            </Stack>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default MyInfoPage;
