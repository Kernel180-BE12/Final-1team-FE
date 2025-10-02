import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface PageLayoutProps {
  title: string;
  actionButtonText?: string;
  onActionButtonClick?: () => void;
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  actionButtonText,
  onActionButtonClick,
  children,
}) => {
  return (
    // 페이지의 가장 바깥쪽 Box, 전체 높이를 차지하고 스크롤의 기준이 됨
    <Box sx={{ height: '100%', overflowY: 'auto' }}>
      
      {/* 중앙 정렬 및 최대 너비를 담당하는 컨테이너 */}
      <Box sx={{ maxWidth: '1200px', width: '100%', mx: 'auto', pt: 7 }}>
        
        {/* 페이지 헤더: 제목과 액션 버튼 */}
        <Stack 
          direction="row" 
          justifyContent="space-between" 
          alignItems="center" 
          sx={{ mb: 4, flexShrink: 0 }}
        >
          <Typography variant="h4" fontWeight="bold">
            {title}
          </Typography>
          
          {actionButtonText && onActionButtonClick && (
            <Button 
              variant="contained" 
              startIcon={<AddIcon />} 
              onClick={onActionButtonClick}
              size="large"
            >
              {actionButtonText}
            </Button>
          )}
        </Stack>

        {/* 
          [수정 2] 페이지 컨텐츠 영역입니다. 
          이전에는 이 Box에 overflow 속성이 있었지만, 이제 가장 바깥쪽 Box가 담당합니다.
          이로써 그림자나 호버 효과가 잘리는 문제가 해결됩니다.
        */}
        <Box>
          {children}
        </Box>

      </Box>
    </Box>
  );
};

export default PageLayout;
