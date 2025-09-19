import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, CssBaseline, GlobalStyles, Button, TextField,
  InputAdornment, CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import useAppStore from '../store/useAppStore';
import apiClient from '../api';

// --- SuggestionPage에서 가져온 헬퍼 컴포넌트 및 타입 ---

interface StructuredTemplate {
    title: string;
    body: string;
    image_url?: string | null;
    buttons?: [string, string][] | null;
    image_layout?: 'header' | 'background' | null;
}

const Placeholder = styled('span')({
    color: '#3b82f6',
    fontWeight: 'bold',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    padding: '2px 4px',
    borderRadius: '4px'
});

const renderTemplateWithPlaceholders = (text: string) => (
    <>
        {text.split(/(#{\w+})/g).map((part, index) => (
            /#{\w+}/.test(part) ? <Placeholder key={index}>{part}</Placeholder> : part
        ))}
    </>
);


const IPhoneKakaoPreview = ({ template }: { template: StructuredTemplate }) => {
    const { title, body, image_url, buttons, image_layout } = template;
    const isBackgroundLayout = image_layout === 'background' && image_url;
    const isHeaderLayout = image_layout === 'header' && image_url;

    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                border: '1px solid rgba(0,0,0,0.05)',
                width: '100%',
                fontFamily: "'Pretendard', sans-serif",
                bgcolor: '#b2c7d9',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', p: '12px', flexGrow: 1 }}>
                <Paper sx={{
                    position: 'relative',
                    borderRadius: '18px',
                    overflow: 'hidden',
                    boxShadow: '0 1px 1px rgba(0,0,0,0.05)',
                    width: '100%',
                    bgcolor: '#fff',
                    backdropFilter: 'none',
                    border: 'none',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <Box sx={{ bgcolor: '#FFEB00', p: '10px 12px', position: 'relative' }}>
                        <Typography sx={{ fontSize: '12px', color: '#000', fontWeight: 'bold' }}>알림톡 도착</Typography>
                    </Box>

                    {isHeaderLayout && (
                        <Box component="img" src={image_url} alt="Header" sx={{ width: '100%', display: 'block' }} />
                    )}

                    <Box sx={{ p: '16px', ...(isBackgroundLayout && { position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100px' }) }}>
                        {isBackgroundLayout && (
                            <>
                                <Box component="img" src={image_url} alt="Background" sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} />
                                <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.3)', zIndex: 1 }} />
                            </>
                        )}
                        <Typography variant="h6" sx={{ position: 'relative', zIndex: 2, fontSize: '17px', fontWeight: 'bold', color: isBackgroundLayout ? '#fff' : '#000', textAlign: isBackgroundLayout ? 'center' : 'left' }}>
                            {renderTemplateWithPlaceholders(title)}
                        </Typography>
                    </Box>

                    <Box sx={{ p: '16px', borderTop: '1px solid #f0f0f0' }}>
                        <Typography component="div" sx={{ fontSize: '15px', whiteSpace: 'pre-wrap', lineHeight: 1.5, color: '#333' }}>
                            {renderTemplateWithPlaceholders(body)}
                        </Typography>
                    </Box>

                    {buttons && buttons.length > 0 && (
                        <Box sx={{ borderTop: '1px solid #f0f0f0', position: 'relative', bgcolor: '#fff' }}>
                            {buttons.map(([text], index) => (
                                <Box key={index} sx={{ textAlign: 'center', p: '14px 16px', fontSize: '15px', fontWeight: '500', color: '#555', cursor: 'pointer' }}>
                                    {renderTemplateWithPlaceholders(text)}
                                </Box>
                            ))}
                        </Box>
                    )}
                </Paper>
            </Box>
        </Paper>
    );
};


const MyTemplatesPage = () => {
  const navigate = useNavigate();
  // ★ 2. 스토어에서 deleteTemplate 액션을 제거합니다.
  const { templates = [], isLoadingTemplates = false, fetchTemplates, currentSpace } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  

  useEffect(() => {
    if (currentSpace) {
      fetchTemplates();
    }
  }, [currentSpace, fetchTemplates]);

  // ★ 3. handleDelete 함수가 다시 apiClient를 직접 호출하도록 수정합니다.
  const handleDelete = async (templateIdToDelete: number) => {
    if (currentSpace) {
      if (window.confirm("정말로 이 템플릿을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
        try {
          await apiClient.delete('/template/delete', {
            data: {
              spaceId: currentSpace.spaceId,
              templateId: templateIdToDelete, 
            }
          });
          alert(`템플릿이 삭제되었습니다.`);
          fetchTemplates(); // 목록 새로고침
        } catch (error) {
          console.error('템플릿 삭제 실패:', error);
          // 전역 에러 핸들러가 사용자에게 실패 알림을 보여줍니다.
        }
      }
    }
  };

  const filteredTemplates = templates.filter(t =>
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.parameterizedTemplate.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

        <Box sx={{
            height: '100%',
            overflowY: 'auto',
            p: 4,
        }}>
        <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4">내 템플릿 목록</Typography>
            <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={() => navigate('../suggestion')}>
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
            {filteredTemplates.map((template) => {
                const previewData: StructuredTemplate = {
                    title: template.title,
                    body: template.parameterizedTemplate,
                    buttons: [['웹사이트', '자세히 보기']], 
                };

                return (
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
                    <IPhoneKakaoPreview template={previewData} />
                    
                    <Box className="dim-overlay" sx={{
                      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      borderRadius: '16px',
                      zIndex: 1,
                    }} />
                    <Box 
                      className="actions-overlay"
                      sx={{ 
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        display: 'flex',
                        zIndex: 2,
                      }}
                    >
                        <Button 
                          variant="contained" 
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDelete(template.id)}
                          sx={{
                            backgroundColor: 'white',
                            color: '#d32f2f',
                            fontWeight: 'bold',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                            '&:hover': {
                              backgroundColor: '#f5f5f5'
                            }
                          }}
                        >
                          삭제하기
                        </Button>
                    </Box>
                  </Box>
                )
            })}
          </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default MyTemplatesPage;
