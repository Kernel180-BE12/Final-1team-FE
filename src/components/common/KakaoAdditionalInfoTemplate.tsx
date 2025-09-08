import React from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';

interface KakaoAdditionalInfoTemplateProps {
  title: string;
  content: string;
  additionalInfo: string;
  buttonText: string;
}

const KakaoAdditionalInfoTemplate: React.FC<KakaoAdditionalInfoTemplateProps> = ({ title, content, additionalInfo, buttonText }) => {
  return (
    <Paper 
      elevation={0}
      sx={{
        width: '100%',
        maxWidth: '320px',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        mx: 'auto',
      }}
    >
      <Box sx={{ p: '12px 16px', backgroundColor: '#FEE500' }}>
        <Typography sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#191919' }}>
          알림톡 도착
        </Typography>
      </Box>

      <Box sx={{ p: 3, backgroundColor: 'white' }}>
        <Typography sx={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#333', mb: 2 }}>
          {title}
        </Typography>
        <Typography sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, color: '#555', fontSize: '0.95rem' }}>
          {content}
        </Typography>
      </Box>
      
      {/* 부가 정보 영역 */}
      <Box sx={{ px: 3, pb: 2, backgroundColor: 'white' }}>
        <Typography sx={{ fontSize: '0.85rem', color: '#888', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
          {additionalInfo}
        </Typography>
      </Box>

      <Box sx={{ px: 2, pb: 2, pt: 1,  backgroundColor: 'white' }}>
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

export default KakaoAdditionalInfoTemplate;
