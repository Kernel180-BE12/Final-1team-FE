import React, { useState } from 'react';
import { Box,
  Typography,
  Paper,
  Button,
  List,
  ListItemButton,
  ListItemText,
  TextField,
  Avatar,
  IconButton,
  FormControlLabel,
  Switch,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

/**
 * @description AI가 템플릿을 '추천'하거나 '생성'하는 핵심 작업 공간입니다.
 * @returns {React.ReactElement} SuggestionPage 컴포넌트
 */
const SuggestionPage = () => {
  // AI가 제안한 템플릿 버전 목록 (임시 데이터)
  const suggestions = [
    {
      id: 1,
      title: '버전 1 (기본형)',
      description: '가장 기본적인 텍스트 형태의 템플릿입니다.',
      templateTitle: '모임 일정 안내',
      content: '안녕하세요, #{참가자명}님.\n#{모임명} 스터디 모임 일정이 확정되었습니다.\n\n다음은 모임에 대한 상세 정보입니다.\n\n▶︎ 모임명: #{모임명}\n▶︎ 일시: #{일시}\n▶︎ 장소: #{장소}',
    },
    {
      id: 2,
      title: '버전 2 (이미지형)',
      description: '이미지가 포함되어 시각적으로 강조된 템플릿입니다.',
      templateTitle: '마케팅 특강에 초대합니다!',
      content: '[이미지 영역]\n\n#{참가자명}님, #{모임명} 스터디에 초대합니다!\n\n- 일시: #{일시}\n- 장소: #{장소}\n\n자세한 내용은 아래 버튼을 확인해주세요.',
    },
    {
      id: 3,
      title: '버전 3 (아이템 리스트형)',
      description: '정보를 목록 형태로 깔끔하게 정리한 템플릿입니다.',
      templateTitle: '모임 상세 정보',
      content: '안녕하세요, #{참가자명}님.\n\n[#{모임명} 안내]\n\n■ 일시\n#{일시}\n\n■ 장소\n#{장소}\n\n■ 준비물\n#{준비물}',
    },
  ];

  // 현재 선택된 템플릿을 관리하는 상태
  const [selectedTemplate, setSelectedTemplate] = useState(suggestions[0]);
  // 변수값 표시 토글 상태를 관리하는 상태
  const [showVariables, setShowVariables] = useState(true);

  // 사용자가 처음 입력한 메시지 (임시 데이터)
  const userInitialMessage = `안녕하세요. 마케팅리즈입니다.
지난번 공지드린 마케팅 특강이 이번주에 시작합니다.

- 일시: 25.11.11(화) 18시
- 장소: 서울 마포구 양화로 186 6층

참석을 원하시면 미리 답장을 주세요.
궁금하신 점이 있으시면 02-6402-0508로 연락주세요.

감사합니다.`;

  /**
   * @description 토글 상태에 따라 미리보기 텍스트를 변환하는 함수입니다.
   * @param {string} text - 원본 템플릿 텍스트
   * @returns {string} 변환된 텍스트
   */
  const getPreviewContent = (text) => {
    if (showVariables) {
      return text; // 토글이 켜져 있으면 원본 그대로 반환
    }
    // 토글이 꺼져 있으면 변수를 예시 값으로 변경
     return text
      .replace(/#\{참가자명\}/g, '홍길동')
      .replace(/#\{모임명\}/g, '마케팅 특강')
      .replace(/#\{일시\}/g, '2025년 11월 11일(화) 오후 6시')
      .replace(/#\{장소\}/g, '서울 마포구 양화로 186 6층')
      .replace(/#\{준비물\}/g, '필기도구');
  };

  return (
    <Box sx={{ display: 'flex', gap: 4, height: 'calc(100vh - 128px)' }}>
      {/* 왼쪽: AI와 대화하는 패널 */}
      <Paper
        variant="outlined"
        sx={{
          width: '50%',
          display: 'flex',
          flexDirection: 'column',
          borderColor: '#e0e0e0',
        }}
      >
        <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Paper sx={{ p: 1.5, borderRadius: '12px', bgcolor: 'primary.main', color: 'white', maxWidth: '80%' }}>
              <Typography sx={{ whiteSpace: 'pre-wrap' }}>{userInitialMessage}</Typography>
            </Paper>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>AI</Avatar>
            <Paper sx={{ p: 1.5, borderRadius: '12px', bgcolor: '#f1f3f5', width: '100%' }}>
              <Typography variant="body1" sx={{ mb: 1.5 }}>
                요청하신 내용을 바탕으로 3가지 버전의 템플릿을 제안해 드릴게요.
              </Typography>
              <List disablePadding>
                {suggestions.map((item) => (
                  <ListItemButton
                    key={item.id}
                    selected={selectedTemplate.id === item.id}
                    onClick={() => setSelectedTemplate(item)}
                    sx={{ borderRadius: '8px', mb: 1 }}
                  >
                    <ListItemText primary={<strong>{item.title}</strong>} secondary={item.description} />
                  </ListItemButton>
                ))}
              </List>
            </Paper>
          </Box>
        </Box>
        <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0', display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="AI에게 추가로 요청할 내용을 입력하세요."
          />
          <IconButton color="primary" sx={{ flexShrink: 0 }}>
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>


      {/* 오른쪽: 미리보기 패널 */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 2, gap: 1 }}>
          {/* '변수값 표시' 버튼을 토글 스위치로 변경 */}
          <FormControlLabel
            control={<Switch checked={showVariables} onChange={(e) => setShowVariables(e.target.checked)} />}
            label="변수값 표시"
          />
          <Button variant="contained" size="small">이 기록으로 발송하기</Button>
        </Box>
        <Paper
          sx={{
            flex: 1,
            p: 3,
            backgroundColor: '#fef01b',
            borderRadius: '12px',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            {selectedTemplate.templateTitle}
          </Typography>
          <Typography sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
            {getPreviewContent(selectedTemplate.content)}
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default SuggestionPage;
