import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Avatar,
  IconButton,
  Stack,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';

// --- 타입 정의 ---
interface Message {
  id: number;
  type: 'user' | 'bot';
  text: string;
  options?: string[];
  isSelectionStage?: boolean;
  timestamp: string;
}

interface Suggestion {
  id: number;
  title: string;
  templateTitle: string;
  content: string;
  buttonText?: string;
}

// --- 컴포넌트 ---
const EmptyChatPlaceholder = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', textAlign: 'center', p: 3 }}>
    <Avatar sx={{ bgcolor: '#FEE500', color: '#191919', width: 56, height: 56, mb: 2 }}>
      <SmartToyOutlinedIcon fontSize="large" />
    </Avatar>
    <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}>
      무엇을 도와드릴까요?
    </Typography>
    <Typography sx={{ mb: 3, maxWidth: '600px', color: '#4B5563' }}>
      아래 입력창에 원하는 알림톡 내용을 자유롭게 작성해보세요.  

      AI가 내용을 분석하여 최적의 템플릿을 추천해 드립니다.
    </Typography>
    <Paper
      variant="outlined"
      sx={{
        p: 2, bgcolor: 'transparent', borderRadius: '12px', borderStyle: 'dashed',
        maxWidth: '80%', textAlign: 'left', color: 'text.disabled'
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
        <LightbulbOutlinedIcon fontSize="small" />
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>이렇게 입력해보세요:</Typography>
      </Stack>
      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
        {`안녕하세요. 마케팅리즈입니다.
지난번 공지드린 마케팅 특강이 이번주에 시작합니다.

- 일시: 25.11.11(화) 18시
- 장소: 서울 마포구 양화로 186 6층

참석을 원하시면 미리 답장을 주세요.
궁금하신 점이 있으시면 02-6402-0508로 연락주세요.
감사합니다.`}
      </Typography>
    </Paper>
  </Box>
);

const SuggestionPage = () => {
  const [conversation, setConversation] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Suggestion | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const finalTemplates: { [key: string]: Suggestion } = {
    '기본형': { id: 101, title: '기본형 템플릿', templateTitle: '생성된 템플릿 (기본형)', content: '기본형으로 생성된 템플릿 내용입니다.' },
    '이미지형': { id: 102, title: '이미지형 템플릿', templateTitle: '생성된 템플릿 (이미지형)', content: '[이미지]\n이미지형으로 생성된 템플릿 내용입니다.' },
    '아이템리스트형': { id: 103, title: '아이템리스트형 템플릿', templateTitle: '생성된 템플릿 (아이템리스트형)', content: '■ 주제: 아이템 리스트\n- 항목1: 내용1\n- 항목2: 내용2' },
    '템플릿 1': {
      id: 1,
      title: '템플릿 1',
      templateTitle: '마케팅 특강 안내',
      content: `안녕하세요. 고객님, 마케팅 특강 첫 수업이 예정되어 있습니다. 
수업 일정을 확인해주세요. 

▶ 수업명 : 마케팅 특강 
▶ 수업 일정 : 2025.11.11(화) 18시 
▶ 수업 장소 : 서울 마포구 양화로 186 6층 
참석을 원하시면 미리 답장 부탁드립니다. 
문의사항은 02-6402-0508로 연락해주세요. 

수업 일정 변경이 필요한 경우, 문의 부탁드립니다. 
감사합니다.`,
      buttonText: '수업 정보 확인하기'
    },
    '템플릿 2': {
      id: 2,
      title: '템플릿 2',
      templateTitle: '서비스 개편 안내 (이미지)',
      content: `안녕하세요. 고객님,
마케팅 특강 첫 수업이 예정되어 있습니다.
수업 일정을 확인해주세요.

▶ 수업명 : 마케팅 특강
▶ 수업 일정 : 11월 11일(화) 18시
▶ 수업 장소 : 서울 마포구 양화로 186 6층
참석을 원하시면 미리 답장 부탁드리며, 문의: 02-6402-0508

수업 일정 변경이 필요한 경우, 문의 부탁드립니다.
감사합니다. `,
      buttonText: '문의하기'
    },
    '템플릿 3': {
      id: 3,
      title: '템플릿 3',
      templateTitle: '서비스 개편 상세 안내',
      content: `안녕하세요 회원님,
신청하신 마케팅리즈 일정을 안내해 드립니다.

▶ 신청일 : 참석을 원하시면 미리 답장해 주세요.

문의: 02-6402-0508
▶ 참가일 : 2025.11.11(화) 18시

장소: 서울 마포구 양화로 186 6층
▶ 참가 시 주의사항 : 홈페이지에서 신청해주세요.

※ 이 메시지는 신청하신 회원들에게 전송되는 1회성 메시지입니다.`,
      buttonText: '수업 정보 확인하기'
    },
  };

  const getCurrentTime = () => new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });

  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage = { ...message, id: Date.now(), timestamp: getCurrentTime() };
    setConversation(prev => [...prev, newMessage]);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    addMessage({ type: 'user', text: inputValue });
    setTimeout(() => {
      addMessage({ type: 'bot', text: "요청하신 내용을 바탕으로 템플릿을 제안해 드릴게요.", options: ['템플릿 1', '템플릿 2', '템플릿 3', '신규 생성'], isSelectionStage: true });
    }, 500);
    setInputValue('');
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    const template = finalTemplates[option];
    if (template) setSelectedTemplate(template);
    else setSelectedTemplate(null);
  };

  const handleSelectionComplete = () => {
    if (!selectedOption) return;
    addMessage({ type: 'user', text: selectedOption });
    setTimeout(() => {
      if (selectedOption === '신규 생성') {
        addMessage({ type: 'bot', text: "템플릿을 생성합니다. 기본형, 이미지형, 아이템리스트형 중에 선택해주세요.", options: ['기본형', '이미지형', '아이템리스트형'], isSelectionStage: true });
      } else if (['기본형', '이미지형', '아이템리스트형'].includes(selectedOption)) {
        const template = finalTemplates[selectedOption];
        addMessage({ type: 'bot', text: `선택하신 [${selectedOption}]으로 템플릿을 생성했습니다.` });
        setSelectedTemplate(template);
      } else {
        addMessage({ type: 'bot', text: `선택하신 [${selectedOption}] 템플릿으로 적용합니다.` });
      }
    }, 500);
    setSelectedOption(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 3, height: 'calc(100vh - 64px)' }}>
      {/* 왼쪽: AI와 대화하는 패널 */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, border: '1px solid #e0e0e0', borderRadius: '12px', overflow: 'hidden', }}>
        <Box sx={{ flexGrow: 1, overflowY: 'auto', bgcolor: '#b2c7d9', p: 2 }}>
          {conversation.length === 0 ? <EmptyChatPlaceholder /> : (
            <Stack spacing={2}>
              {conversation.map((msg) => (
                <Stack key={msg.id} direction={msg.type === 'user' ? 'row-reverse' : 'row'} spacing={1} alignItems="flex-start">
                  {msg.type === 'bot' && <Avatar sx={{ bgcolor: '#f0f0f0' }}><SmartToyOutlinedIcon sx={{ color: '#555' }} /></Avatar>}
                  <Stack direction={msg.type === 'user' ? 'row-reverse' : 'row'} spacing={1} alignItems="flex-end">
                    <Paper
                      elevation={0}
                      sx={{
                        p: '10px 14px',
                        borderRadius: '18px',
                        bgcolor: msg.type === 'user' ? '#FEE500' : '#FFFFFF',
                        color: '#191919',
                        maxWidth: '100%',
                      }}
                    >
                      <Typography sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.6 }}>{msg.text}</Typography>
                      {msg.options && (
                        <Box sx={{ mt: 1.5, pt: 1.5, borderTop: msg.text ? '1px solid #f0f0f0' : 'none' }}>
                          <Stack spacing={1}>
                            {msg.options.map((opt) => (
                              <Button
                                key={opt}
                                variant={selectedOption === opt ? "contained" : "outlined"}
                                size="medium"
                                onClick={() => handleOptionSelect(opt)}
                                sx={{
                                  justifyContent: 'flex-start',
                                  borderRadius: '12px',
                                  borderColor: '#e0e0e0',
                                  bgcolor: selectedOption === opt ? '#4dabf7' : 'white',
                                  color: selectedOption === opt ? 'white' : 'black',
                                  '&:hover': {
                                    borderColor: '#c0c0c0',
                                    bgcolor: selectedOption === opt ? '#3c9ce0' : '#f5f5f5',
                                  },
                                  p: 1.5,
                                  textTransform: 'none',
                                }}
                              >
                                {opt}
                              </Button>
                            ))}
                          </Stack>
                          {msg.isSelectionStage && (
                            <Button variant="contained" onClick={handleSelectionComplete} disabled={!selectedOption} fullWidth sx={{ mt: 1.5, bgcolor: '#f0f0f0', color: selectedOption ? 'black' : '#aaa', '&:hover': { bgcolor: '#e0e0e0' } }}>
                              선택 완료
                            </Button>
                          )}
                        </Box>
                      )}
                    </Paper>
                    <Typography variant="caption" sx={{ color: '#666' }}>{msg.timestamp}</Typography>
                  </Stack>
                </Stack>
              ))}
              <div ref={chatEndRef} />
            </Stack>
          )}
        </Box>
        <Paper component="form" onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} elevation={0} sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 1, borderTop: '1px solid #e0e0e0' }}>
          <TextField
            fullWidth
            variant="standard"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="메시지를 입력하세요"
            multiline
            minRows={1}
            sx={{ "& .MuiInput-underline:before, & .MuiInput-underline:after, & .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: 'none' }, px: 1.5 }}
          />
          <IconButton type="submit" sx={{ bgcolor: '#FEE500', color: '#191919', '&:hover': { bgcolor: '#fdd835' } }}><SendIcon fontSize="small" /></IconButton>
        </Paper>
      </Box>

      {/* 오른쪽: 미리보기 패널 */}
      <Stack spacing={2} sx={{ width: '480px', minWidth: '480px' }}>
        <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
          <Button variant="contained" sx={{ background: 'linear-gradient(to right, #6D28D9, #4F46E5)', borderRadius: '8px', fontWeight: 'bold', px: 3, py: 1 }}>카톡 발송하기</Button>
        </Stack>
        {selectedTemplate ? (
          <Paper sx={{ flex: 1, borderRadius: '20px', overflow: 'hidden', border: '1px solid #e0e0e0', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ backgroundColor: '#FEE500', color: '#191919', p: '12px 20px', fontWeight: 'bold', fontSize: '15px' }}>알림톡 도착</Box>
            <Box sx={{ p: 3, bgcolor: 'white', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>{selectedTemplate.templateTitle}</Typography>
              <Typography component="div" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, flex: 1 }}>
                {selectedTemplate.content}
              </Typography>
              {selectedTemplate.buttonText && (
                <Box sx={{ backgroundColor: '#FFFFFF', border: '1px solid #e0e0e0', borderRadius: '8px', textAlign: 'center', p: '14px 10px', fontSize: '16px', fontWeight: '500', color: '#333', cursor: 'pointer', mt: 2 }}>
                  {selectedTemplate.buttonText}
                </Box>
              )}
            </Box>
          </Paper>
        ) : (
          <Paper sx={{ flex: 1, borderRadius: '20px', border: '1px dashed #d1d5db', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'transparent' }}>
            <Typography color="text.secondary">템플릿을 선택하면 여기에 미리보기가 표시됩니다.</Typography>
          </Paper>
        )}
      </Stack>
    </Box>
  );
};

export default SuggestionPage;
