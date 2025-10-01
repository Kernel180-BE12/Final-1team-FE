import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

// 이 컴포넌트가 받을 props 타입을 정의합니다.
interface PageLayoutProps {
  title: string; // 페이지 제목 (예: "연락처", "템플릿")
  actionButtonText?: string; // 오른쪽 상단 버튼의 텍스트 (예: "새로운 연락처 등록")
  onActionButtonClick?: () => void; // 버튼 클릭 시 실행될 함수
  children: React.ReactNode; // 페이지의 실제 컨텐츠 (예: 테이블, 카드 목록 등)
}

const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  actionButtonText,
  onActionButtonClick,
  children,
}) => {
  return (
    <Box sx={{ p: 3 }}> {/* 페이지 전체에 일관된 여백을 줍니다. */}
      {/* 페이지 헤더: 제목과 액션 버튼 */}
      <Stack 
        direction="row" 
        justifyContent="space-between" 
        alignItems="center" 
        sx={{ mb: 3 }}
      >
        <Typography variant="h4" fontWeight="bold">
          {title}
        </Typography>
        
        {actionButtonText && onActionButtonClick && (
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={onActionButtonClick}
            size="large" // [요청사항] 버튼 크기 통일
          >
            {actionButtonText}
          </Button>
        )}
      </Stack>

      {/* 페이지의 실제 컨텐츠가 이 아래에 렌더링됩니다. */}
      <Box>
        {children}
      </Box>
    </Box>
  );
};

export default PageLayout;
