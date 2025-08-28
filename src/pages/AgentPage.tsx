import React from 'react';
import { Box, Typography, TextField, IconButton, Paper } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// 사용자가 입력한 내용을 보여주기 위한 예시 데이터
const userInputExample = `안녕하세요. 마케팅리즈입니다.
지난번 공지드린 마케팅 특강이 이번주에 시작합니다.

- 일시: 25.11.11(화) 18시
- 장소: 서울 마포구 양화로 186 6층

참석을 원하시면 미리 답장을 주세요.
궁금하신 점이 있으시면 02-6402-0508로 연락주세요.
감사합니다.`;

// AI 생성 예시로 보여줄 데이터
const aiGenerationExample = {
  title: '행사 정보 안내드립니다!',
  content: `안녕하세요. 고객님 마케팅리즈입니다.
마케팅 특강 스터디 모임 일정이 확정되었습니다.

다음은 모임에 대한 상세 정보입니다.

▶ 모임명 : 마케팅 특강
▶ 일시 : 2025년 11월 11일(화) 오후 6시
▶ 장소 : 서울 마포구 양화로 186 6층
▶ 문의사항 : 02-6402-0508

참석을 원하시면 미리 답장을 주시기바랍니다.

감사합니다.`,
};

/**
 * @description AI 에이전트에게 사용자가 첫 요청을 보내는 페이지 컴포넌트입니다.
 * @returns {React.ReactElement} AgentPage 컴포넌트
 */
const AgentPage = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        p: 4,
      }}
    >
      {/* 1. 상단 타이틀 및 입력창 영역 */}
      <Box sx={{ width: '100%', maxWidth: '800px', textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          카카오 알림톡으로
          <br />
          발송할 메시지 내용을 입력하세요
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          문자 메시지를 보낸다고 생각하시고 메시지를 입력해주세요
        </Typography>
        <Box sx={{ position: 'relative' }}>
          <TextField
            multiline
            rows={12}
            placeholder={userInputExample}
            variant="outlined"
            fullWidth
            sx={{
              backgroundColor: 'white',
            }}
          />
          <IconButton
            sx={{
              position: 'absolute',
              right: 16,
              bottom: 16,
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
          >
            <ArrowUpwardIcon />
          </IconButton>
        </Box>
      </Box>

      {/* 2. 하단 예시 비교 영역 */}
      {/* [수정] 전체 너비를 위쪽 TextField와 맞추기 위해 maxWidth를 800px로 설정합니다. */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', maxWidth: '800px', mt: 4 }}>
        
        {/* 왼쪽: 입력한 내용 영역 */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* [수정] 제목을 Paper 바깥으로 뺐습니다. */}
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1.5, textAlign: 'center' }}>
            입력한 내용
          </Typography>
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              borderColor: '#e0e0e0',
              height: '40vh',
              overflowY: 'auto',
            }}
          >
            <Typography sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, color: 'text.secondary' }}>
              {userInputExample}
            </Typography>
          </Paper>
        </Box>

        {/* 가운데 화살표 */}
        <ArrowForwardIcon sx={{ fontSize: 40, color: 'grey.500', alignSelf: 'center', mt: 4 }} />

        {/* 오른쪽: AI 생성 예시 영역 */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* [수정] 제목을 Paper 바깥으로 뺐습니다. */}
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1.5, textAlign: 'center' }}>
            AI 생성 예시
          </Typography>
          <Paper
            sx={{
              p: 3,
              backgroundColor: '#fef01b',
              borderRadius: '12px',
              height: '40vh',
              overflowY: 'auto',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              {aiGenerationExample.title}
            </Typography>
            <Typography sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
              {aiGenerationExample.content}
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default AgentPage;
