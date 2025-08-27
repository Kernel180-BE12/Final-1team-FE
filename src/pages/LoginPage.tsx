import React from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Divider,
    Stack,
    IconButton,
} from '@mui/material';

/**
 * @description 로그인 페이지 컴포넌트
 * @returns {React.ReactElement} LoginPage 컴포넌트
 */
const LoginPage = () => {
    return (
        // 전체 화면을 차지하고, 로그인 폼을 중앙에 배치하기 위한 Box 컨테이너
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alianItem: 'center',
                minHeight: '100vh', // 화면 전체 높이를 차지하도록 설정
            }}
        >
            <Box
                sx={{
                width: '100%',
                maxWidth: '400px', // 폼의 최대 너비는 유지합니다.
                display: 'flex',
                flexDirection: 'column',
                gap: 2, // 요소들 사이의 간격
                }}
            >
                {/* 로고 */}
                <Typography variant='h4' component="h1" align="center" sx={{ fontWeight: 'bold', mb: 2 }} >
                    JOBER
                </Typography>

                {/* 이메일/휴대전화 입력란 */}
                <TextField
                    fullWidth // 가로 너비를 100%로 설정
                    label="이메일 / 휴대전화"
                    variant="outlined"
                />

                {/* 비밀번호 입력란 */}
                <TextField
                    fullWidth
                    label="비밀번호"
                    type="password"  // 입력 내용을 점으로 표시
                    variant="outlined"
                />

                {/* 로그인 버튼 */}
                <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{ mt: 1, py: 1.5 }}  // 위쪽 여백(mt), 수직 패딩(py)
                >
                    로그인
                </Button>

                { /* 구분선 */}
                <Divider sx={{ my: 2 }}>또는</Divider>

                { /* 소셜 로그인 버튼 영역 */ }
                { /* Stack 컴포넌트는 자식 요소들을 가로(row) 또는 세로(column)로 정렬할 때 편리함 */}
                <Stack direction="row" spacing={2} justifyContent="center">
                {/* Button을 IconButton으로 변경하고, 원형 스타일을 적용합니다. */}
                <IconButton
                    sx={{
                    width: 56,
                    height: 56,
                    backgroundColor: '#FEE500', // 카카오 노란색
                    '&:hover': { backgroundColor: '#f0d900' },
                    }}
                >
                    {/* 여기에 카카오 로고 아이콘 넣어야 함 */}
                    K
                </IconButton>
                <IconButton
                    sx={{
                    width: 56,
                    height: 56,
                    border: '1px solid #e0e0e0',
                    '&:hover': { backgroundColor: '#f5f5f5' },
                    }}
                >
                    {/* 여기에 구글 로고 아이콘 넣어야 함 */}
                    G
                </IconButton>
                <IconButton
                    sx={{
                    width: 56,
                    height: 56,
                    backgroundColor: '#03C75A', // 네이버 초록색
                    color: 'white',
                    '&:hover': { backgroundColor: '#02b350' },
                    }}
                >
                    {/* 여기에 네이버 로고 아이콘 넣어야 함 */}
                    N
                </IconButton>
                </Stack>

                { /* 회원가입 및 비밀번호 재설정 버튼 영역 */}
                <Stack direction="column" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
                    <Button variant="outlined" sx={{ flex: 1 }}>회원가입</Button>
                    <Button variant="outlined" sx={{ flex: 1 }}>비밀번호 재설정</Button>
                </Stack>
            </Box>
        </Box>
    );
};

export default LoginPage;
