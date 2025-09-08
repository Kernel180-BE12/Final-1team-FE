import React, { useState } from 'react';
import { Box, Typography, TextField, IconButton, Paper, createTheme, ThemeProvider, CssBaseline, GlobalStyles, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button  } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

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

const interactiveTheme = createTheme({
    palette: {
        mode: 'light',
        primary: { main: '#1976d2' },
    },
    typography: {
        fontFamily: '"Jua", "Nunito", "Roboto", sans-serif',
        h4: { fontWeight: 700, color: '#4e342e' },
        body1: { color: '#795548', fontFamily: '"Nunito", "Roboto", sans-serif' },
        subtitle1: { fontFamily: '"Nunito", "Roboto", sans-serif', fontWeight: 'bold' },
        body2: { color: '#795548' },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '999px',
                    textTransform: 'none',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    transition: 'all 0.2s ease-in-out',
                },
            },
        },
    },
});


const AgentPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();
  const [inputText, setInputText] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSend = () => {
    if (isLoggedIn) {
      if (!inputText.trim()) {
        alert('전송할 메시지를 입력해주세요.');
        return;
      }
      
      navigate('/suggestion', {
        state: {
          userInput: inputText, // 'userInput'이라는 이름으로 inputText 값을 전달
        },
      });
    } else {
      setDialogOpen(true);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    // 조건: "Enter" 키를 눌렀고, "Shift" 키는 누르지 않았을 때
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); 
      handleSend();
    }
  };

   const handleDialogClose = () => {
    setDialogOpen(false);
  };

  // ★★★ Dialog에서 "로그인" 버튼을 눌렀을 때 실행될 함수 ★★★
  const handleGoToLogin = () => {
    setDialogOpen(false);
    navigate('/login');
  };

  return (
    <ThemeProvider theme={interactiveTheme}>
        <CssBaseline />
        <GlobalStyles styles={`
            @import url('https://fonts.googleapis.com/css2?family=Jua&family=Nunito:wght@700&display=swap');
            @keyframes animated-gradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
            body { background: linear-gradient(-45deg, #e0eafc, #cfdef3, #e7eaf6, #a7bfe8); background-size: 400% 400%; animation: animated-gradient 15s ease infinite; }
        `} />
        <Box 
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', p: 4 }}
        >
            <Paper
                elevation={12}
                sx={{
                    width: '100%',
                    maxWidth: '1000px',
                    background: 'rgba(255, 255, 255, 0.75)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '32px',
                    p: { xs: 3, sm: 5 },
                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-10px)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                    }
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 4,
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
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={handleKeyDown}
                                sx={{
                                    backgroundColor: 'rgba(255,255,255,0.8)',
                                    borderRadius: '16px',
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '16px',
                                    }
                                }}
                            />
                            <IconButton
                                onClick={handleSend}
                                sx={{
                                    position: 'absolute',
                                    right: 16,
                                    bottom: 16,
                                    backgroundColor: 'primary.main',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: 'primary.dark',
                                        transform: 'scale(1.1)'
                                    },
                                    transition: 'transform 0.2s'
                                }}
                            >
                                <ArrowUpwardIcon />
                            </IconButton>
                        </Box>
                    </Box>

                    {/* 2. 하단 예시 비교 영역 */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', maxWidth: '800px', mt: 4 }}>
                        {/* 왼쪽: 입력한 내용 영역 */}
                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
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
                                    borderRadius: '16px',
                                    backgroundColor: 'rgba(255,255,255,0.5)'
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
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1.5, textAlign: 'center' }}>
                                AI 생성 예시
                            </Typography>
                            <Paper
                                sx={{
                                    p: 3,
                                    backgroundColor: '#fef01b',
                                    borderRadius: '12px',
                                    height: '40vh',
                                    overflow: 'hidden',
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
            </Paper>
        </Box>

      {/* ★★★ 5. Dialog 컴포넌트를 렌더링합니다. ★★★ */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose} // 배경 클릭이나 ESC 키로 닫힐 때 호출
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"로그인이 필요한 기능입니다."}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            작성하신 내용을 저장하고 AI 제안을 받으려면 로그인이 필요합니다.
            로그인 페이지로 이동하시겠습니까?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>닫기</Button>
          <Button onClick={handleGoToLogin} variant="contained" autoFocus>
            로그인하러 가기
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default AgentPage;

