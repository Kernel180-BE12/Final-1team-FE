import { Box, Typography, Paper, TextField, Button, Avatar, Stack, Alert, Snackbar, } from '@mui/material';
import useAuthStore from '../store/useAuthStore';
import { useState } from 'react';

/**
 * @description 사용자 정보를 확인하고 수정하는 페이지
 * @returns {React.ReactElement} MyInfoPage 컴포넌트
 */
const MyInfoPage = () => {
    const { user } = useAuthStore();

    // 입력 폼의 상태를 관리합니다. 초기값으로 스토어의 사용자 정보를 설정합니다.
    // 실제 앱에서는 이름(name)과 이메일(email)도 user 객체에 포함되어 있을 것입니다.
    const [name, setName] = useState(user?.username || '사용자'); // 'name'이 없다면 'username'으로 대체
    const [email, setEmail] = useState('user@example.com'); // (임시) 이메일 정보

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');


    const handleUpdateProfile = () => {
        // TODO: API 호출 로직

        // ★ 2. alert() 대신 Snackbar를 띄우도록 수정합니다.
        setSnackbarMessage('프로필이 성공적으로 업데이트되었습니다.');
        setSnackbarOpen(true);
    };

    const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        // 사용자가 Snackbar 외부를 클릭해서 닫는 것은 허용합니다.
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

return (
    <Box sx={{ maxWidth: '700px', mx: 'auto' }}> {/* 콘텐츠가 너무 넓어지지 않도록 최대 너비와 중앙 정렬을 설정합니다. */}
      <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 4 }}>
        내 정보
      </Typography>

      <Stack spacing={4}>
        {/* 프로필 정보 수정 섹션 */}
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>프로필 정보</Typography>
          <Stack spacing={2.5} alignItems="flex-start">
            <Avatar sx={{ width: 80, height: 80, mb: 1, bgcolor: 'primary.main', fontSize: '2rem' }}>
              {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
            </Avatar>
            <TextField
              fullWidth
              label="아이디 (수정 불가)"
              defaultValue={user?.username || ''}
              InputProps={{
                readOnly: true, // 수정 불가능하도록 설정
              }}
              variant="filled" // 수정 불가 필드는 다른 스타일로 표시
            />
            <TextField
              fullWidth
              label="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              fullWidth
              label="이메일"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button variant="contained" onClick={handleUpdateProfile} sx={{ mt: 1 }}>
              프로필 업데이트
            </Button>
          </Stack>
        </Paper>
      </Stack>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000} // 3초 후에 자동으로 사라집니다.
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} // 화면 하단 중앙에 표시
      >
        {/* Alert 컴포넌트를 사용하여 더 예쁜 디자인을 적용합니다. */}
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MyInfoPage;
