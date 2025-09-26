import { Box, Typography, Paper, TextField, Button, Avatar, Stack, Alert, Snackbar, CircularProgress, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import useAppStore from '../store/useAppStore';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api';

/**
 * @description 사용자 정보를 확인하고 수정하는 페이지
 * @returns {React.ReactElement} MyInfoPage 컴포넌트
 */
const MyInfoPage = () => {
    const { user, deleteAccount } = useAppStore();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error' | 'info' | 'warning',
    });

    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

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
    }, [user?.username]);

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
        if (reason === 'clickaway') return;
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const handleOpenDeleteModal = () => setDeleteModalOpen(true);
    const handleCloseDeleteModal = () => setDeleteModalOpen(false);

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        try {
            await deleteAccount();
            handleCloseDeleteModal();
            navigate('/agent', {state: { snackbar: { open: true, message: '회원 탈퇴가 정상적으로 처리되었습니다.', severity: 'success'}}});
        } catch (error) {
            console.error("회원 탈퇴 처리 중 오류 발생:", error);
            setSnackbar({open: true, message: '회원 탈퇴 중 오류가 발생했습니다. 다시 시도해주세요.', severity: 'error'});
            setIsDeleting(false);
            handleCloseDeleteModal();
        }
    }

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
                <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, borderColor: 'error.light' }}>
                    <Typography variant="h6" color="error.main" gutterBottom>회원 탈퇴</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        회원 탈퇴 시 계정과 관련된 모든 데이터(스페이스, 템플릿, 연락처 등)가 영구적으로 삭제되며, 이 작업은 되돌릴 수 없습니다.
                    </Typography>
                    <Button 
                        variant="outlined" 
                        color="error"
                        onClick={handleOpenDeleteModal}
                        disabled={isDeleting} // 탈퇴 진행 중 비활성화
                    >
                        회원 탈퇴
                    </Button>
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

            <Dialog
                open={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                aria-labelledby="account-delete-dialog-title"
                aria-describedby="account-delete-dialog-description"
            >
                <DialogTitle id="account-delete-dialog-title">
                    정말로 회원을 탈퇴하시겠습니까?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="account-delete-dialog-description">
                        이 작업은 되돌릴 수 없습니다. 계정과 관련된 모든 데이터가 영구적으로 삭제됩니다.
                        정말로 진행하시려면 아래 '탈퇴' 버튼을 클릭해주세요.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteModal} disabled={isDeleting}>취소</Button>
                    <Button onClick={handleDeleteAccount} color="error" disabled={isDeleting}>
                        {isDeleting ? <CircularProgress size={24} color="inherit" /> : '탈퇴'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default MyInfoPage;