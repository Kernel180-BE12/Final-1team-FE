import React from 'react';
import { Box, Typography, TextField, IconButton } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

const examplePlaceholder = `(예시)
안녕하세요. 마케팅리즈입니다.
지난번 공지드린 마케팅 특강이 이번주에 시작합니다.

- 일시: 25.11.11(화) 18시
- 장소: 서울 마포구 양화로 186 6층

참석을 원하시면 미리 답장을 주세요.
궁금하신 점이 있으시면 02-6402-0508로 연락주세요.

감사합니다.`;

const AgentPage = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        p: 4,
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        카카오 알림톡으로 발송할 메시지 내용을 입력하세요
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        문자 메시지를 보낸다고 생각하시고 메시지를 입력해주세요
      </Typography>

      {/* 1. TextField와 IconButton을 감싸는 Box 컨테이너를 만듭니다. */}
      <Box
        sx={{
          position: 'relative', // 자식 요소의 위치 기준점이 됩니다.
          width: '100%',
          maxWidth: '700px',
        }}
      >
        <TextField
          multiline
          rows={10}
          placeholder={examplePlaceholder}
          variant="outlined"
          sx={{
            width: '100%',
            backgroundColor: 'white',
          }}
        />
        
        {/* 2. 텍스트 상자 내부에 위치할 아이콘 버튼입니다. */}
        <IconButton
          sx={{
            position: 'absolute', // 부모(Box)를 기준으로 위치를 절대적으로 지정합니다.
            right: 16, // 오른쪽에서 16px 떨어짐
            bottom: 16, // 아래쪽에서 16px 떨어짐
            backgroundColor: 'primary.main', // 버튼 배경색
            color: 'white', // 아이콘 색상
            '&:hover': {
              backgroundColor: 'primary.dark', // 마우스 올렸을 때 배경색
            },
          }}
        >
          <ArrowUpwardIcon />
        </IconButton>
      </Box>

      {/* 기존에 있던 A/B 생성 버튼은 제거되었습니다. */}
    </Box>
  );
};

export default AgentPage;