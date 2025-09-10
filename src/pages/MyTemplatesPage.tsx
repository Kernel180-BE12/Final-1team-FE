
//         { id: 1, title: '국가 검진 안내', type: '메시지형', body: '안녕하세요, #{고객명}님. #{발신 스페이스}입니다.올해 국가검진 대상자인 직원분들께 발송되는 메시지입니다...' },
//         { id: 2, title: '회사소개서 발송', type: '문서연결형', body: '요청하신 회사소개서를 보내드립니다! 확인 후 연락주세요...' },
//         { id: 3, title: '서비스 소개서 발송', type: '링크연결형', body: '요청하신 서비스 소개서가 발송되었습니다. 확인해주세요...' },
//         { id: 4, title: '회원가입 완료', type: '메시지형', body: '회원가입을 축하합니다! #{고객명}님의 가입이 정상적으로 완료되었습니다.' },
//         // { id: 5, title: '쿠폰 발급 안내', type: '메시지형', content: '안녕하세요! #{고객명}님께만 드리는 특별 쿠폰이 발급되었습니다.' },
//         // { id: 6, title: '주문 발송 안내', type: '링크연결형', content: '주문하신 상품이 발송되었습니다. 송장번호: #{송장번호}' },
//         // { id: 7, title: '예약 확인 안내', type: '메시지형', content: '#{고객명}님, #{예약일시}에 예약이 확정되었습니다. 잊지 말고 방문해주세요.' },
//         // { id: 8, title: '제품 브로슈어', type: '문서연결형', content: '신제품 브로슈어를 첨부하여 보내드립니다. 검토 후 피드백 부탁드립니다.' },
//         // { id: 9, title: '설문조사 참여 요청', type: '링크연결형', content: '서비스 개선을 위한 설문조사에 참여해주세요. 참여하기: #{링크}' },
//         // { id: 10, title: '비밀번호 재설정', type: '메시지형', content: '비밀번호 재설정을 위한 인증번호는 [#{인증번호}] 입니다.' },
//         // { id: 11, title: '블로그 새 글 알림', type: '링크연결형', content: '새로운 글이 포스팅되었습니다! 지금 바로 확인해보세요. 제목: #{글제목}' },
//         // { id: 12, title: '세금계산서 발행 안내', type: '문서연결형', content: '요청하신 세금계산서가 발행되었습니다. 국세청 홈택스에서 확인 가능합니다.' },
//         // { id: 13, title: '추석 감사 인사', type: '메시지형', content: '풍요로운 한가위 보내세요. 저희 서비스를 이용해주셔서 항상 감사합니다.' },
//         // { id: 14, title: '앱 다운로드 링크', type: '링크연결형', content: '더 편리한 서비스 이용을 위해 앱을 다운로드하세요! 다운로드: #{앱링크}' },


import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, createTheme, ThemeProvider, CssBaseline, GlobalStyles, Button, TextField, InputAdornment, IconButton, Menu, MenuItem, ListItemIcon, ListItemText, CircularProgress, } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SendIcon from '@mui/icons-material/Send';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';

// --- 미리보기용 Mock 구현 ---
const KakaoTemplatePreview = ({ title, content, buttonText }: { title: string, content: string, buttonText: string }) => (
    <Paper 
      elevation={0}
      sx={{
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        border: '1px solid rgba(0,0,0,0.05)',
        width: '100%',
        fontFamily: "'Pretendard', sans-serif"
      }}
    >
      <Box sx={{ bgcolor: '#FFEB00', p: '10px 12px' }}>
        <Typography sx={{ fontSize: '12px', color: '#000', fontWeight: 'bold' }}>
          알림톡 도착
        </Typography>
      </Box>
      <Box sx={{ p: '16px', backgroundColor: 'white' }}>
        <Typography variant="h6" sx={{ fontSize: '17px', fontWeight: 'bold', mb: 1, color: '#000' }}>
          {title}
        </Typography>
        <Typography component="div" sx={{ fontSize: '15px', whiteSpace: 'pre-wrap', lineHeight: 1.5, color: '#333' }}>
          {content}
        </Typography>
      </Box>
      <Box sx={{ borderTop: '1px solid #f0f0f0', backgroundColor: 'white' }}>
        <Box sx={{ textAlign: 'center', p: '14px 16px', fontSize: '15px', fontWeight: '500', color: '#555', cursor: 'pointer' }}>
          {buttonText}
        </Box>
      </Box>
    </Paper>
);
// --- Mock 구현 끝 ---

const allMockTemplates = [
    { id: 1, title: '행사 정보 안내', content: '안녕하세요. 고객님 마케팅리즈입니다...', buttonText: '자세히 보기' },
    { id: 2, title: '주문 완료 안내', content: '고객님의 주문이 성공적으로 완료되었습니다...', buttonText: '주문 내역 확인' },
    { id: 3, title: '배송 시작 알림', content: '주문하신 상품의 배송이 시작되었습니다...', buttonText: '배송 조회' },
    { id: 4, title: '신규 가입 환영', content: '회원이 되신 것을 진심으로 환영합니다...', buttonText: '혜택 확인하기' },
    { id: 5, title: '이벤트 당첨 안내', content: '축하합니다! 이벤트에 당첨되셨습니다...', buttonText: '경품 확인' },
    { id: 6, title: '비밀번호 변경 안내', content: '회원님의 비밀번호가 안전하게 변경되었습니다.', buttonText: '내 정보 보기' },
    { id: 7, title: '설문조사 참여 요청', content: '더 나은 서비스를 위해 고객님의 소중한 의견을 들려주세요...', buttonText: '설문 참여하기' },
    { id: 8, title: '이번 주 추천 콘텐츠', content: '새롭게 업데이트된 콘텐츠를 확인해보세요!', buttonText: '콘텐츠 보기' },
];

const professionalTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#3b82f6' },
  },
  typography: {
    fontFamily: '"Nunito", "Roboto", sans-serif',
    h4: { fontWeight: 700, color: '#1e293b' },
    h5: { fontWeight: 600, color: '#334155' },
    body1: { color: '#475569' },
  },
});

const MyTemplatesPage = () => {
  const [templates, setTemplates] = useState(allMockTemplates.slice(0, 6));
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [currentTemplateId, setCurrentTemplateId] = useState<null | number>(null);
  const isMenuOpen = Boolean(menuAnchorEl);

  const fetchMoreData = () => {
    if (isLoadingMore) return;

    if (templates.length >= allMockTemplates.length) {
      setHasMore(false);
      return;
    }

    setIsLoadingMore(true);
    setTimeout(() => {
      setTemplates(prev => prev.concat(allMockTemplates.slice(prev.length, prev.length + 3)));
      setIsLoadingMore(false);
    }, 1000);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop < document.documentElement.offsetHeight - 100 || !hasMore || isLoadingMore) {
        return;
      }
      fetchMoreData();
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, templates, isLoadingMore]);


  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, templateId: number) => {
    setMenuAnchorEl(event.currentTarget);
    setCurrentTemplateId(templateId);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setCurrentTemplateId(null);
  };

  // [추가] '편집' 메뉴 클릭 시 실행될 함수
  const handleEdit = () => {
    if (currentTemplateId !== null) {
      alert(`ID: ${currentTemplateId} 템플릿을 편집합니다.`);
      // 여기에 실제 편집 로직 (e.g., navigate(`/templates/${currentTemplateId}/edit`)) 추가
    }
    handleMenuClose();
  };

  // [추가] '삭제' 메뉴 클릭 시 실행될 함수
  const handleDelete = () => {
    if (currentTemplateId !== null) {
      alert(`ID: ${currentTemplateId} 템플릿을 삭제합니다.`);
      // 여기에 실제 삭제 API 호출 로직 추가
    }
    handleMenuClose();
  };

  const filteredTemplates = templates.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ThemeProvider theme={professionalTheme}>
      <CssBaseline />
      <GlobalStyles styles={`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');
        body { background: linear-gradient(135deg, #f5f7fa, #e9ecef); }
      `} />
      
      <Box sx={{ p: 4, minHeight: 'calc(100vh - 64px)' }}>
        <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4">내 템플릿 목록</Typography>
            <Button variant="contained" startIcon={<AddCircleOutlineIcon />}>
              새 템플릿 만들기
            </Button>
          </Box>

          <TextField
            fullWidth
            placeholder="템플릿 제목 또는 내용으로 검색..."
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 4, '& .MuiOutlinedInput-root': { borderRadius: '16px', backgroundColor: 'rgba(255, 255, 255, 0.7)' } }}
            InputProps={{ startAdornment: ( <InputAdornment position="start"> <SearchIcon /> </InputAdornment> ), }}
          />

          {/* [수정] MUI Grid 대신 CSS Grid를 사용하는 Box로 변경 */}
          <Box 
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)'
            }}
            gap={3}
          >
            {filteredTemplates.map((template) => (
              <Box 
                key={template.id}
                sx={{ 
                  position: 'relative', 
                  height: '100%', 
                  borderRadius: '18px',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': { transform: 'translateY(-5px)' },
                  '& .dim-overlay, & .actions-overlay': {
                      opacity: 0,
                      transition: 'opacity 0.3s ease-in-out',
                  },
                  '&:hover .dim-overlay, &:hover .actions-overlay': {
                      opacity: 1,
                  }
              }}>
                <KakaoTemplatePreview 
                  title={template.title}
                  content={template.content}
                  buttonText={template.buttonText}
                />
                <Box className="dim-overlay" sx={{
                  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  borderRadius: '16px',
                }} />
                <Box 
                  className="actions-overlay"
                  sx={{ 
                    position: 'absolute', bottom: 0, left: 0, right: 0, p: 2,
                    display: 'flex', justifyContent: 'flex-end', alignItems: 'center',
                    gap: 1, zIndex: 1,
                  }}
                >
                    <Button size="small" variant="contained" startIcon={<SendIcon />}>발송하기</Button>
                    <IconButton size="small" sx={{ bgcolor: 'rgba(255,255,255,0.8)', '&:hover': {bgcolor: 'white'} }} onClick={(e) => handleMenuOpen(e, template.id)}>
                        <MoreVertIcon />
                    </IconButton>
                </Box>
              </Box>
            ))}
          </Box>
          {isLoadingMore && <Box sx={{display: 'flex', justifyContent: 'center', py: 4}}><CircularProgress /></Box>}
        </Box>
      </Box>

      <Menu
        anchorEl={menuAnchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon> <EditIcon fontSize="small" /> </ListItemIcon>
          <ListItemText>편집</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{color: 'error.main'}}>
          <ListItemIcon> <DeleteIcon fontSize="small" color="error" /> </ListItemIcon>
          <ListItemText>삭제</ListItemText>
        </MenuItem>
      </Menu>
    </ThemeProvider>
  );
};

export default MyTemplatesPage;

