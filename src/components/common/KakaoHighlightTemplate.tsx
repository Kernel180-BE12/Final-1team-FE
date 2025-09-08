import React from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';

interface KakaoHighlightTemplateProps {
  highlightTitle: string;
  highlightSubtitle: string;
  content: string;
  buttonText: string;
}

const KakaoHighlightTemplate: React.FC<KakaoHighlightTemplateProps> = ({ highlightTitle, highlightSubtitle, content, buttonText }) => {
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
      {/* 강조 표기 영역 */}
      <Box sx={{ p: 3, backgroundColor: 'white', borderBottom: '1px solid #f0f0f0' }}>
        <Typography sx={{ color: '#888', fontSize: '0.9rem', mb: 0.5 }}>
          {highlightSubtitle}
        </Typography>
        <Typography sx={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#333', lineHeight: 1.2 }}>
          {highlightTitle}
        </Typography>
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

export default KakaoHighlightTemplate;
