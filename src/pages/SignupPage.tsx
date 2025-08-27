import React from 'react';
import {
    Box,
    Typography,
    Button,
    Divider,
    Stack,
    IconButton,
} from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'; // 카카오 아이콘 예시

/**
 * @description 서비스의 회원가입 페이지 컴포넌트입니다.
 * @returns {React.ReactElement} SignupPage 컴포넌트
 */
const SignupPage = () => {
    return (
    // 전체 화면을 차지하고, 내용을 중앙에 배치하기 위한 Box 컨테이너입니다.
    <Box
        sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            textAlign: 'center',
        }}
    >
        <Box
            sx={{
                width: '100%',
                maxWidth: '500px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2.5,
            }}
        >
        
            {/* 메인 텍스트 */}
            <Typography variant="h5" sx={{ fontWeight: 'medium' }}>
                여러 명에게 원하는 메시지를 보내보세요.
            </Typography>

            {/* 카카오로 시작하기 버튼 */}
            <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={<ChatBubbleOutlineIcon />} // 아이콘 추가
                sx={{
                    mt: 2,
                    py: 1.5,
                    backgroundColor: '#FEE500', // 카카오 노란색
                    color: '#191919',
                    '&:hover': {
                    backgroundColor: '#f0d900',
                    },
                }}
            >
                카카오로 시작하기
            </Button>

            {/* 구분선 */}
            <Divider sx={{ width: '100%' }}>또는</Divider>

            <Stack direction="row" spacing={2} justifyContent="center">
            {/* Button을 IconButton으로 변경하고, 원형 스타일을 적용합니다. */}
            <IconButton
                sx={{
                width: 56,
                height: 56,
                border: '1px solid #e0e0e0', // 구글 경계선
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
            <IconButton
                sx={{
                width: 56,
                height: 56,
                backgroundColor: 'rgba(89, 89, 89, 1)', // 네이버 초록색
                color: 'white',
                '&:hover': { backgroundColor: 'rgba(114, 114, 114, 1)' },
                }}
            >
                {/* 여기에 이메일 아이콘 넣어야 함 */}
                E
            </IconButton>
            <IconButton
                sx={{
                width: 56,
                height: 56,
                backgroundColor: 'rgba(89, 89, 89, 1)',
                color: 'white',
                '&:hover': { backgroundColor: 'rgba(114, 114, 114, 1)' },
                }}
            >
                {/* 여기에 휴대전화 아이콘 넣어야 함 */}
                C
            </IconButton>
            </Stack>

            {/* 약관 안내 텍스트 */}
            <Typography variant="caption" color="text.secondary" sx={{ mt: 3, fontSize: '0.7rem' }}>
                가입을 진행하시면 자버 전자문서 서비스 이용약관 및 개인정보 수집 이용에 동의하는 것으로 간주합니다.
            </Typography>

            {/* 기존 계정 로그인 안내 */}
            <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ mt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                    자버 계정이 있으신가요?
                </Typography>
                <Button size="small">로그인</Button>
            </Stack>
            
            {/* 로고 */}
            <Typography variant='h4' component="h1" align="center" sx={{ fontWeight: 'bold', mb: 2 }} >
                JOBER
            </Typography>
        </Box>
    </Box>
    );
};

export default SignupPage;
