import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, CssBaseline, GlobalStyles, Button, TextField, InputAdornment, IconButton, Menu, MenuItem, ListItemIcon, ListItemText, CircularProgress, } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SendIcon from '@mui/icons-material/Send';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import useAppStore from '../store/useAppStore';
import apiClient from '../api';

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


const MyTemplatesPage = () => {
  const navigate = useNavigate();

  const { templates = [], isLoadingTemplates = false, fetchTemplates, currentSpace } = useAppStore();

  const [searchTerm, setSearchTerm] = useState('');  
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [currentTemplateId, setCurrentTemplateId] = useState<null | number>(null);
  const isMenuOpen = Boolean(menuAnchorEl);

  useEffect(() => {
    if (currentSpace) {
      fetchTemplates();
    }
    }, [currentSpace, fetchTemplates]);

  // ✨ 4. 무한 스크롤 관련 로직은 일단 주석 처리하거나 삭제합니다.
  //    (현재 API는 페이지네이션을 지원하지 않으므로 불필요합니다.)

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, templateId: number) => {
    setMenuAnchorEl(event.currentTarget);
    setCurrentTemplateId(templateId);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setCurrentTemplateId(null);
  };

  const handleEdit = () => {
    if (currentTemplateId !== null) {
      alert(`ID: ${currentTemplateId} 템플릿을 편집합니다.`);
      // TODO: 실제 편집 페이지로 이동하는 로직 구현
      // navigate(`/template/${currentTemplateId}/edit`);
    }
    handleMenuClose();
  };

  // ✨ 5. 삭제(Delete) 함수를 실제 API 호출로 변경합니다.
  const handleDelete = async () => {
    if (currentTemplateId !== null && currentSpace) {
      try {
        // API 명세에 따라 spaceId와 templateId가 필요합니다.
        // 하지만 현재 template 객체에는 templateId가 없으므로, 임시로 currentTemplateId(index)를 사용합니다.
        // TODO: 백엔드에서 templateId를 응답으로 주면, 그 값으로 교체해야 합니다.
        await apiClient.delete('/template/delete', {
          data: {
            spaceId: currentSpace.spaceId,
            templateId: currentTemplateId, // 이것은 현재 배열의 index일 뿐, 실제 DB의 ID가 아님!
          }
        });
        alert(`템플릿이 삭제되었습니다.`);
        fetchTemplates(); // 삭제 성공 후 목록을 새로고침합니다.
      } catch (error) {
        console.error('템플릿 삭제 실패:', error);
        // 전역 에러 핸들러가 alert를 띄워줄 것입니다.
      }
    }
    handleMenuClose();
  };

  // ✨ 6. 검색(filter) 로직을 실제 데이터 구조에 맞게 수정합니다.
  const filteredTemplates = templates.filter(t =>
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.parameterizedTemplate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✨ 7. 로딩 상태일 때 로딩 스피너를 보여줍니다.
  if (isLoadingTemplates) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 64px)' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <CssBaseline />
      <GlobalStyles styles={`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');
        body { background: linear-gradient(135deg, #f5f7fa, #e9ecef); }
      `} />
      
      <Box sx={{ p: 4, minHeight: 'calc(100vh - 64px)' }}>
        <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4">내 템플릿 목록</Typography>
            <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={() => navigate('/suggestion')}>
              AI로 새 템플릿 만들기
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

          {filteredTemplates.length === 0 && !isLoadingTemplates ? (
            <Paper sx={{ textAlign: 'center', p: 4, borderRadius: 2, mt: 4 }}>
              <Typography variant="h6">아직 생성된 템플릿이 없습니다.</Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                'AI로 새 템플릿 만들기' 버튼을 눌러 첫 템플릿을 만들어보세요!
              </Typography>
            </Paper>
          ) : (
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
                  content={template.parameterizedTemplate}
                  buttonText="자세히 보기"
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
          )}
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
    </>
  );
};

export default MyTemplatesPage;

