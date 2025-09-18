import React, { useState, useEffect } from 'react'; // React를 import 합니다.
import { 
  Box, Typography, TextField, IconButton, Paper, createTheme, ThemeProvider, 
  CssBaseline, GlobalStyles, Dialog, DialogActions, DialogContent, 
  DialogContentText, DialogTitle, Button, CircularProgress
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import useAppStore from '../store/useAppStore';
import type { Space } from '../store/useAppStore'; // Space 타입을 type-only로 import
import KakaoBasicTemplate from '../components/common/KakaoBasicTemplate';

// 분리된 모달 컴포넌트들을 import 합니다.
import SpaceSelectModal from '../components/modals/SpaceSelectModal';
import CreateSpaceModal from '../components/modals/CreateSpaceModal';

// --- 예시 데이터 (생략 없음) ---
const userInputExample = `안녕하세요. 마케팅리즈입니다.
지난번 공지드린 마케팅 특강이 이번주에 시작합니다.

- 일시: 25.11.11(화) 18시
- 장소: 서울 마포구 양화로 186 6층

참석을 원하시면 미리 답장을 주세요.
궁금하신 점이 있으시면 02-6402-0508로 연락주세요.
감사합니다.`;

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

// --- 테마 설정 (생략 없음) ---
const interactiveTheme = createTheme({
    palette: { mode: 'light', primary: { main: '#1976d2' } },
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

// --- 메인 AgentPage 컴포넌트 ---
const AgentPage = () => {
  const navigate = useNavigate();
  
  const { 
    isLoggedIn, currentSpace, spaces, isLoading,
    setCurrentSpace, fetchSpaces,
  } = useAppStore(); 
  
  const [inputText, setInputText] = useState('');
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [isSpaceCreateModalOpen, setSpaceCreateModalOpen] = useState(false);
  const [isSpaceSelectModalOpen, setSpaceSelectModalOpen] = useState(false);

   // ★★★ 3. 이 useEffect 훅을 추가하여 데이터 로딩을 보장합니다. ★★★
  useEffect(() => {
    // 이 컴포넌트가 화면에 나타났을 때,
    // 만약 로그인 상태라면, 스페이스 목록을 '반드시' 다시 불러옵니다.
    // 이렇게 하면 다른 곳에서 fetchSpaces 호출을 놓쳤더라도 여기서 확실히 실행됩니다.
    if (isLoggedIn) {
      fetchSpaces();
    }
  }, [isLoggedIn, fetchSpaces]); // isLoggedIn 상태가 바뀔 때마다 재실행


  const handleSend = () => {
    if (!isLoggedIn) {
      setLoginDialogOpen(true);
      return;
    }
    if (!inputText.trim()) {
      alert('전송할 메시지를 입력해주세요.');
      return;
    }
    
    if (!spaces || spaces.length === 0) {
      alert("등록된 스페이스가 없습니다. 스페이스를 새로 생성해주세요.");
      setSpaceCreateModalOpen(true);
      return;
    }

    setSpaceSelectModalOpen(true);
  };

  const handleCreateSpaceAndNavigate = async (newSpace: Space) => {
    await fetchSpaces();
    setCurrentSpace(newSpace);
    navigate(`/spaces/${newSpace.spaceId}/suggestion`, {
      state: { userInput: inputText },
    });
  };

  const handleSelectSpaceAndNavigate = (selectedSpace: Space) => {
    setCurrentSpace(selectedSpace);
    setSpaceSelectModalOpen(false);
    navigate(`/spaces/${selectedSpace.spaceId}/suggestion`, {
      state: { userInput: inputText },
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); 
      handleSend();
    }
  };

  const handleLoginDialogClose = () => setLoginDialogOpen(false);
  const handleGoToLogin = () => {
    setLoginDialogOpen(false);
    navigate('/login');
  };

  return (
    <ThemeProvider theme={interactiveTheme}>
        <CssBaseline />
        <GlobalStyles styles={`
            @import url('https://fonts.googleapis.com/css2?family=Jua&family=Nunito:wght@700&display=swap'   );
        `} />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 10 }}>
            <Paper elevation={12} sx={{ width: '100%', maxWidth: '1000px', background: 'rgba(255, 255, 255, 0.75)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '32px', p: { xs: 3, sm: 5 }, transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out', '&:hover': { transform: 'translateY(-10px)', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' } }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <Box sx={{ width: '100%', maxWidth: '800px', textAlign: 'center' }}>
                        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>카카오 알림톡으로  
                          발송할 메시지 내용을 입력하세요</Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>문자 메시지를 보낸다고 생각하시고 메시지를 입력해주세요</Typography>
                        <Box sx={{ position: 'relative' }}>
                            <TextField multiline rows={12} placeholder={userInputExample} variant="outlined" fullWidth value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={handleKeyDown} disabled={isLoading} sx={{ backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: '16px', '& .MuiOutlinedInput-root': { borderRadius: '16px' } }} />
                            <IconButton onClick={handleSend} disabled={isLoading} sx={{ position: 'absolute', right: 16, bottom: 16, backgroundColor: 'primary.main', color: 'white', '&:disabled': { backgroundColor: 'grey.300' }, '&:hover': { backgroundColor: 'primary.dark', transform: 'scale(1.1)' }, transition: 'transform 0.2s' }}>
                              {isLoading ? <CircularProgress size={24} color="inherit" /> : <ArrowUpwardIcon />}
                            </IconButton>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', maxWidth: '800px', mt: 4 }}>
                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1.5, textAlign: 'center' }}>입력한 내용</Typography>
                            <Paper variant="outlined" sx={{ p: 3, borderColor: '#e0e0e0', overflowY: 'auto', borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.5)' }}>
                                <Typography sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, color: 'text.secondary' }}>{userInputExample}</Typography>
                            </Paper>
                        </Box>
                        <ArrowForwardIcon sx={{ fontSize: 40, color: 'grey.500', alignSelf: 'center', mt: 4 }} />
                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1.5, textAlign: 'center' }}>AI 생성 예시</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <KakaoBasicTemplate title={aiGenerationExample.title} content={aiGenerationExample.content} buttonText="자세히 보기" />
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Paper>
        </Box>

      <Dialog open={loginDialogOpen} onClose={handleLoginDialogClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{"로그인이 필요한 기능입니다."}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">작성하신 내용을 저장하고 AI 제안을 받으려면 로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLoginDialogClose}>닫기</Button>
          <Button onClick={handleGoToLogin} variant="contained" autoFocus>로그인하러 가기</Button>
        </DialogActions>
      </Dialog>

      <CreateSpaceModal 
        open={isSpaceCreateModalOpen}
        onClose={() => setSpaceCreateModalOpen(false)}
        onSpaceCreated={handleCreateSpaceAndNavigate}
      />
      <SpaceSelectModal
        open={isSpaceSelectModalOpen}
        onClose={() => setSpaceSelectModalOpen(false)}
        spaces={spaces}
        currentSpace={currentSpace}
        onSelect={handleSelectSpaceAndNavigate}
      />
    </ThemeProvider>
  );
};

export default AgentPage;
