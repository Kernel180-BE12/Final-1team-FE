import React from 'react';
import { Box, Paper, Typography, Button, Stack, Divider } from '@mui/material';
//--- KakaoItemListTemplate 컴포넌트 시작 ---
// NOTE: "Could not resolve" 오류를 해결하기 위해 컴포넌트를 이 파일에 직접 포함합니다.

// 컴포넌트가 받을 props 타입 정의
interface ItemHighlight {
  thumbnailUrl?: string;
  text: string;
  description?: string;
}

interface ListItem {
  name: string;
  description: string;
  summary?: string;
}

interface KakaoItemListTemplateProps {
  title: string;
  header: string;
  topImageUrl?: string;
  highlight?: ItemHighlight;
  items: ListItem[];
  buttonText: string;
}

const KakaoItemListTemplate: React.FC<KakaoItemListTemplateProps> = ({ title, header, topImageUrl, highlight, items, buttonText }) => {
  return (
    <Paper 
      elevation={0}
      sx={{
        width: '100%',
        maxWidth: '320px',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        mx: 'auto',
        overflow: 'hidden',
        backgroundColor: '#F7F7F7'
      }}
    >
      {/* [수정] 이미지와 동일한 헤더 구조로 변경 */}
      <Box sx={{ p: '16px', backgroundColor: 'white', borderBottom: '1px solid #f0f0f0' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography sx={{ fontSize: '0.9rem', color: 'text.secondary' }}>
                {title}
            </Typography>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#BDBDBD' }}>
                kakao
            </Typography>
        </Box>
        <Typography sx={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#333' }}>
          {header}
        </Typography>
      </Box>

      {/* 상단 이미지 (선택적) */}
      {topImageUrl && (
        <Box sx={{ aspectRatio: '2 / 1', backgroundColor: 'white' }}>
           <img src={topImageUrl} alt="Template Top" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </Box>
      )}

      {/* 아이템 하이라이트 (선택적) */}
      {highlight && (
        <Box sx={{ p: 2, backgroundColor: 'white', display: 'flex', alignItems: 'center', gap: 2, borderTop: '1px solid #f0f0f0' }}>
          {highlight.thumbnailUrl && (
            <Box sx={{ width: '54px', height: '54px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
              <img src={highlight.thumbnailUrl} alt="Highlight Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </Box>
          )}
          <Box>
            <Typography sx={{ fontWeight: 'bold', color: '#333' }}>{highlight.text}</Typography>
            {highlight.description && <Typography sx={{ fontSize: '0.9rem', color: '#888' }}>{highlight.description}</Typography>}
          </Box>
        </Box>
      )}

      {/* 아이템 리스트 */}
      <Box sx={{ backgroundColor: 'white', mt: highlight ? 0 : '8px', borderTop: highlight ? '8px solid #F7F7F7' : 'none' }}>
        <Stack divider={<Divider flexItem />}>
          {items.map((item, index) => (
            <Box key={index} sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography sx={{ fontWeight: 'bold', fontSize: '0.95rem', color: '#555' }}>{item.name}</Typography>
                <Typography sx={{ fontSize: '0.9rem', color: '#777' }}>{item.description}</Typography>
              </Box>
              {item.summary && (
                <Typography sx={{ fontWeight: 'bold', color: '#333', flexShrink: 0, ml: 2 }}>
                  {item.summary}
                </Typography>
              )}
            </Box>
          ))}
        </Stack>
      </Box>
      
      {/* 하단 버튼 */}
      <Box sx={{ px: 2, py: 2, pt:1, ackgroundColor: 'white' }}>
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

export default KakaoItemListTemplate;
