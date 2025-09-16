import React, { useState } from 'react';
import {
  Box, TextField, InputAdornment, Button, Typography, List, ListItem,
  ListItemAvatar, Avatar, ListItemText, IconButton, Divider, Menu, MenuItem,
  Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import apiClient from '../../../api';
import useAppStore from '../../../store/useAppStore';
import type { Space } from '../../../store/useAppStore';

type SortOptionKey = 'name-asc' | 'name-desc';
const sortOptions: { key: SortOptionKey; label: string }[] = [
  { key: 'name-asc', label: '이름 오름차순' },
  { key: 'name-desc', label: '이름 내림차순' },
];

interface AllSpacesContentProps {
  spaces: Space[];
  onAddSpace: () => void;
  onDataChange: () => void;
}

const AllSpacesContent: React.FC<AllSpacesContentProps> = ({ spaces, onAddSpace, onDataChange }) => {
  const { currentSpace, setCurrentSpace } = useAppStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<SortOptionKey>('name-asc');
  
  const [sortMenuAnchorEl, setSortMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [itemMenuAnchorEl, setItemMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [openedMenuSpaceId, setOpenedMenuSpaceId] = useState<null | number>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSpace, setEditingSpace] = useState<{ id: number; name: string } | null>(null);
  const [newSpaceName, setNewSpaceName] = useState('');
  const [isApiLoading, setIsApiLoading] = useState(false);

  const handleSpaceItemClick = (space: Space) => {
    setCurrentSpace(space);
  };

  const handleSortMenuOpen = (event: React.MouseEvent<HTMLElement>) => setSortMenuAnchorEl(event.currentTarget);
  const handleSortMenuClose = () => setSortMenuAnchorEl(null);
  const handleSortSelect = (option: SortOptionKey) => {
    setSortOption(option);
    handleSortMenuClose();
  };

  const handleItemMenuOpen = (event: React.MouseEvent<HTMLElement>, spaceId: number) => {
    event.stopPropagation(); 
    setItemMenuAnchorEl(event.currentTarget);
    setOpenedMenuSpaceId(spaceId);
  };

  const handleItemMenuClose = () => {
    setItemMenuAnchorEl(null);
    setOpenedMenuSpaceId(null);
  };

  const handleEditClick = () => {
    const spaceToEdit = spaces.find(s => s.spaceId === openedMenuSpaceId);
    if (spaceToEdit) {
      setEditingSpace({ id: spaceToEdit.spaceId, name: spaceToEdit.spaceName });
      setNewSpaceName(spaceToEdit.spaceName);
      setIsEditModalOpen(true);
    }
    handleItemMenuClose();
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingSpace(null);
    setNewSpaceName('');
  };

  const handleUpdateSpaceName = async () => {
    if (!editingSpace || !newSpaceName.trim()) return;
    setIsApiLoading(true);
    try {
      await apiClient.patch(`/spaces/${editingSpace.id}`, { spaceName: newSpaceName });
      handleCloseEditModal();
      onDataChange();
    } catch (error) {
      console.error("스페이스 수정 실패:", error);
    } finally {
      setIsApiLoading(false);
    }
  };

  const handleDeleteClick = async () => {
    if (!openedMenuSpaceId) return;
    const spaceToDelete = spaces.find(s => s.spaceId === openedMenuSpaceId);
    if (!spaceToDelete) return;

    if (window.confirm(`'${spaceToDelete.spaceName}' 스페이스를 정말로 삭제하시겠습니까?`)) {
      setIsApiLoading(true);
      handleItemMenuClose();
      try {
        await apiClient.delete(`/spaces/${openedMenuSpaceId}`);
        onDataChange();
      } catch (error) {
        console.error("스페이스 삭제 실패:", error);
      } finally {
        setIsApiLoading(false);
      }
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const sortedAndFilteredSpaces = [...spaces]
    .filter(space => space.spaceName.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortOption === 'name-desc') {
        return b.spaceName.localeCompare(a.spaceName);
      }
      return a.spaceName.localeCompare(b.spaceName);
    });

  const currentSortLabel = sortOptions.find(option => option.key === sortOption)?.label;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2 }}>
        <TextField
          variant="outlined"
          placeholder="스페이스명으로 검색해주세요"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ flexGrow: 1, width: '400px', '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }}
        />
        <Button variant="contained" startIcon={<AddIcon />} onClick={onAddSpace} sx={{ borderRadius: '8px', py: 1.5, px: 2, fontWeight: 'bold' }}>
          스페이스 추가하기
        </Button>
      </Box>

      <Box sx={{ border: '1px solid #e0e0e0', borderRadius: '8px', p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, cursor: 'pointer', width: 'fit-content' }} onClick={handleSortMenuOpen}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>{currentSortLabel}</Typography>
          <KeyboardArrowDownIcon sx={{ color: 'text.secondary', fontSize: '16px' }} />
        </Box>

        <Menu anchorEl={sortMenuAnchorEl} open={Boolean(sortMenuAnchorEl)} onClose={handleSortMenuClose}>
          {sortOptions.map(option => (
            <MenuItem key={option.key} onClick={() => handleSortSelect(option.key)} selected={sortOption === option.key}>
              {option.label}
            </MenuItem>
          ))}
        </Menu>

        {sortedAndFilteredSpaces.length > 0 ? (
          <List sx={{ padding: 0 }}>
            {sortedAndFilteredSpaces.map((space, index) => {
              const isSelected = currentSpace?.spaceId === space.spaceId;
              return (
                <React.Fragment key={space.spaceId}>
                  <ListItem
                    onClick={() => handleSpaceItemClick(space)}
                    sx={{
                      py: 2, cursor: 'pointer', borderRadius: '8px', transition: 'background-color 0.2s',
                      backgroundColor: isSelected ? 'action.selected' : 'transparent',
                      '&:hover': { backgroundColor: isSelected ? 'action.selected' : 'action.hover' },
                    }}
                    secondaryAction={
                      <IconButton edge="end" aria-label="more-actions" onClick={(e) => handleItemMenuOpen(e, space.spaceId)}>
                        <MoreVertIcon />
                      </IconButton>
                    }
                  >
                    <Box 
                      sx={{ 
                        width: 10, height: 10, borderRadius: '50%', 
                        backgroundColor: space.color || '#ccc', // ★ API에서 받은 색상 적용, 없으면 회색
                        mr: 1.5, border: '1px solid rgba(0,0,0,0.1)'
                      }} 
                    />
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: '#e6f4ea' }}><CorporateFareIcon sx={{ color: '#4caf50' }} /></Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Typography variant="body1" sx={{ fontWeight: 'bold' }}>{space.spaceName}</Typography>}
                      secondary={space.authority}
                    />
                  </ListItem>
                  {index < sortedAndFilteredSpaces.length - 1 && <Divider component="li" />}
                </React.Fragment>
              );
            })}
          </List>
        ) : (
          <Box sx={{ textAlign: 'center', py: 5 }}><Typography variant="body1" color="text.secondary">검색 결과가 없습니다.</Typography></Box>
        )}

        <Menu anchorEl={itemMenuAnchorEl} open={Boolean(itemMenuAnchorEl)} onClose={handleItemMenuClose}>
          <MenuItem onClick={handleEditClick}>수정하기</MenuItem>
          <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>삭제하기</MenuItem>
        </Menu>

        <Dialog open={isEditModalOpen} onClose={handleCloseEditModal} fullWidth maxWidth="xs">
          <DialogTitle>스페이스 이름 수정</DialogTitle>
          <DialogContent>
            <TextField autoFocus margin="dense" label="새 스페이스 이름" type="text" fullWidth variant="standard" value={newSpaceName} onChange={(e) => setNewSpaceName(e.target.value)} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditModal}>취소</Button>
            <Button onClick={handleUpdateSpaceName} disabled={isApiLoading}>
              {isApiLoading ? <CircularProgress size={24} /> : '저장'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default AllSpacesContent;
