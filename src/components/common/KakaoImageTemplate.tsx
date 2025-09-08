import React from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';

interface KakaoImageTemplateProps {
  imageUrl: string;
  content: string;
  buttonText: string;
}

const KakaoImageTemplate: React.FC<KakaoImageTemplateProps> = ({ imageUrl, content, buttonText }) => {
  return (
    <Paper 
      elevation={0}
      sx={{
        width: '100%',
        maxWidth: '320px',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        mx: 'auto',
        overflow: 'hidden'
      }}
    >
      {/* 이미지 영역 */}
      <Box sx={{ 
        backgroundColor: '#F9F9F9', // 가이드라인 배경색
        aspectRatio: '2 / 1', // 가이드라인 비율
      }}>
         <img src={imageUrl} alt="Template Header" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </Box>

      <Box sx={{ p: 3, backgroundColor: 'white' }}>
        <Typography sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, color: '#555', fontSize: '0.95rem' }}>
          {content}
        </Typography>
      </Box>
      
      <Box sx={{ px: 2, pb: 2, pt: 1, backgroundColor: 'white' }}>
        <Button 
          fullWidth
          variant="contained"
          sx={{
            backgroundColor: '#f5f5f5',
            color: '#333',
            boxShadow: 'none',
            borderRadius: '8px',
            py: 1.5,
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#e0e0e0'
            }
          }}
        >
          {buttonText}
        </Button>
      </Box>
    </Paper>
  );
};

export default KakaoImageTemplate;
