import React from 'react';
import { Box, TextField, Button, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

interface TableToolbarProps {
  searchTerm: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  searchPlaceholder?: string;
  actionButtonText?: string;
  onActionButtonClick?: () => void;
}

const TableToolbar: React.FC<TableToolbarProps> = ({
  searchTerm,
  onSearchChange,
  searchPlaceholder = "검색...",
  actionButtonText,
  onActionButtonClick,
}) => {
  return (
    // AllSpacesContent의 레이아웃을 그대로 가져옵니다.
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2 }}>
      {/* AllSpacesContent의 검색창 스타일을 그대로 가져옵니다. */}
      <TextField
        variant="outlined"
        placeholder={searchPlaceholder}
        value={searchTerm}
        onChange={onSearchChange}
        // [핵심] sx prop으로 스타일을 완벽하게 복제합니다.
        sx={{ 
          flexGrow: 1, 
          width: '400px', // width를 지정하여 다른 페이지에서도 동일한 너비를 유지
          '& .MuiOutlinedInput-root': { 
            borderRadius: '8px' 
          } 
        }}
        InputProps={{ 
          startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) 
        }}
      />

      {/* AllSpacesContent의 버튼 스타일을 그대로 가져옵니다. */}
      {actionButtonText && onActionButtonClick && (
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={onActionButtonClick} 
          // [핵심] sx prop으로 스타일을 완벽하게 복제합니다.
          sx={{ 
            borderRadius: '8px', 
            py: 1.5, 
            px: 2, 
            fontWeight: 'bold',
            flexShrink: 0,
            whiteSpace: 'nowrap',
          }}
        >
          {actionButtonText}
        </Button>
      )}
    </Box>
  );
};

export default TableToolbar;
