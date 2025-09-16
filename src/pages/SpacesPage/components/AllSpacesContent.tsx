// import React, { useState } from 'react';
// import {
//   Box,
//   TextField,
//   InputAdornment,
//   Button,
//   Typography,
//   List,
//   ListItem,
//   ListItemAvatar,
//   Avatar,
//   ListItemText,
//   IconButton,
//   Divider,
//   Menu,
//   MenuItem,
// } from '@mui/material';
// import SearchIcon from '@mui/icons-material/Search';
// import AddIcon from '@mui/icons-material/Add';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
// import CorporateFareIcon from '@mui/icons-material/CorporateFare';

// // 임시 데이터 (나중에 API로 받아올 데이터)
// const spaces = [
//   { id: 1, name: '커널 아카데미', role: '최고 관리자', lastVisited: new Date('2025-09-02T10:00:00'), createdAt: new Date('2024-01-15T09:00:00') },
//   { id: 2, name: '프론트엔드 스터디', role: '멤버', lastVisited: new Date('2025-08-28T15:30:00'), createdAt: new Date('2024-05-20T14:00:00') },
//   { id: 3, name: '알고리즘 챌린지', role: '멤버', lastVisited: new Date('2025-08-30T09:00:00'), createdAt: new Date('2023-11-10T18:00:00') },
// ];

// type SortOptionKey = 'recent' | 'name-asc' | 'name-desc' | 'created-asc';

// const sortOptions: { key: SortOptionKey; label: string }[] = [
//   { key: 'recent', label: '최근 방문순' },
//   { key: 'name-asc', label: '이름 오름차순' },
//   { key: 'name-desc', label: '이름 내림차순' },
//   { key: 'created-asc', label: '생성일순' },
// ];

// interface AllSpacesContentProps {
//   onAddSpace: () => void;
// }

// const AllSpacesContent: React.FC<AllSpacesContentProps> = ({ onAddSpace }) => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [sortOption, setSortOption] = useState<SortOptionKey>('recent');
  
//   const [sortMenuAnchorEl, setSortMenuAnchorEl] = useState<null | HTMLElement>(null);
//   const [itemMenuAnchorEl, setItemMenuAnchorEl] = useState<null | HTMLElement>(null);
  
//   const [openedMenuSpaceId, setOpenedMenuSpaceId] = useState<null | number>(null);

//   const handleSpaceItemClick = (spaceName: string) => {
//     alert(`'${spaceName}' 스페이스를 클릭했습니다. 상세 페이지로 이동합니다.`);
//   };

//   // --- 정렬 메뉴 핸들러 ---
//   const handleSortMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
//     setSortMenuAnchorEl(event.currentTarget);
//   };

//   const handleSortMenuClose = () => {
//     setSortMenuAnchorEl(null);
//   };

//   const handleSortSelect = (option: SortOptionKey) => {
//     setSortOption(option);
//     handleSortMenuClose();
//   };

//   // --- 아이템 '더보기' 메뉴 핸들러 ---
//   const handleItemMenuOpen = (event: React.MouseEvent<HTMLElement>, spaceId: number) => {
//     event.stopPropagation(); 
//     setItemMenuAnchorEl(event.currentTarget);
//     setOpenedMenuSpaceId(spaceId);
//   };

//   const handleItemMenuClose = (_event?: unknown, _reason?: "backdropClick" | "escapeKeyDown") => {
//     setItemMenuAnchorEl(null);
//     setOpenedMenuSpaceId(null);
//   };

//   const handleEditClick = (event: React.MouseEvent, spaceName: string) => {
//     event.stopPropagation();
//     alert(`'${spaceName}' 스페이스 수정 시작!`);
//     handleItemMenuClose();
//   };

//   const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(event.target.value);
//   };

//   const sortedAndFilteredSpaces = spaces
//     .filter(space => space.name.toLowerCase().includes(searchTerm.toLowerCase()))
//     .sort((a, b) => {
//       switch (sortOption) {
//         case 'name-asc':
//           return a.name.localeCompare(b.name);
//         case 'name-desc':
//           return b.name.localeCompare(a.name);
//         case 'created-asc':
//           return a.createdAt.getTime() - b.createdAt.getTime();
//         case 'recent':
//         default:
//           return b.lastVisited.getTime() - a.lastVisited.getTime();
//       }
//     });

//   const currentSortLabel = sortOptions.find(option => option.key === sortOption)?.label;

//   return (
//     <Box>
//       {/* 1. 상단 바 (검색창 및 추가 버튼) */}
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2 }}>
//         <TextField
//           variant="outlined"
//           placeholder="스페이스명으로 검색해주세요"
//           value={searchTerm}
//           onChange={handleSearchChange}
//           sx={{
//             flexGrow: 1,
//             width: '400px',
//             '& .MuiOutlinedInput-root': {
//               borderRadius: '8px',
//             },
//           }}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <SearchIcon />
//               </InputAdornment>
//             ),
//           }}
//         />
//         <Button
//           variant="contained"
//           startIcon={<AddIcon />}
//           onClick={onAddSpace}
//           sx={{ borderRadius: '8px', py: 1.5, px: 2, fontWeight: 'bold' }}
//         >
//           스페이스 추가하기
//         </Button>
//       </Box>

//       {/* 2. 콘텐츠 목록 */}
//       <Box sx={{ border: '1px solid #e0e0e0', borderRadius: '8px', p: 3 }}>
//         <Box
//           sx={{ display: 'flex', alignItems: 'center', mb: 2, cursor: 'pointer', width: 'fit-content' }}
//           onClick={handleSortMenuOpen}
//         >
//           <Typography variant="body2" sx={{ color: 'text.secondary' }}>
//             {currentSortLabel}
//           </Typography>
//           <KeyboardArrowDownIcon sx={{ color: 'text.secondary', fontSize: '16px' }} />
//         </Box>

//         {/* 정렬 옵션 메뉴 */}
//         <Menu anchorEl={sortMenuAnchorEl} open={Boolean(sortMenuAnchorEl)} onClose={handleSortMenuClose}>
//           {sortOptions.map(option => (
//             <MenuItem
//               key={option.key}
//               onClick={() => handleSortSelect(option.key)}
//               selected={sortOption === option.key}
//             >
//               {option.label}
//             </MenuItem>
//           ))}
//         </Menu>

//         {sortedAndFilteredSpaces.length > 0 ? (
//           <List sx={{ padding: 0 }}>
//             {sortedAndFilteredSpaces.map((space, index) => (
//               <React.Fragment key={space.id}>
//                 <ListItem
//                   onClick={() => handleSpaceItemClick(space.name)}
//                   sx={{
//                     py: 2,
//                     '&:hover': {
//                       backgroundColor: 'action.hover',
//                     },
//                     cursor: 'pointer',
//                   }}
//                   secondaryAction={
//                     <IconButton
//                       edge="end"
//                       aria-label="more-actions"
//                       onClick={(e) => handleItemMenuOpen(e, space.id)}
//                     >
//                       <MoreVertIcon />
//                     </IconButton>
//                   }
//                 >
//                   <ListItemAvatar>
//                     <Avatar sx={{ bgcolor: '#e6f4ea' }}>
//                       <CorporateFareIcon sx={{ color: '#4caf50' }} />
//                     </Avatar>
//                   </ListItemAvatar>
//                   <ListItemText
//                     primary={
//                       <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
//                         {space.name}
//                       </Typography>
//                     }
//                     secondary={space.role}
//                   />
//                 </ListItem>
//                 {index < sortedAndFilteredSpaces.length - 1 && <Divider component="li" />}
//               </React.Fragment>
//             ))}
//           </List>
//         ) : (
//           <Box sx={{ textAlign: 'center', py: 5 }}>
//             <Typography variant="body1" color="text.secondary">
//               검색 결과가 없습니다.
//             </Typography>
//           </Box>
//         )}

//         {/* 아이템별 '더보기' 메뉴 */}
//         <Menu
//           anchorEl={itemMenuAnchorEl}
//           open={Boolean(itemMenuAnchorEl)}
//           onClose={handleItemMenuClose}
//         >
//           <MenuItem onClick={(e) => {
//             const currentSpace = spaces.find(s => s.id === openedMenuSpaceId);
//             if (currentSpace) {
//               handleEditClick(e, currentSpace.name);
//             }
//           }}>
//             수정하기
//           </MenuItem>
//           {/* <MenuItem onClick={handleItemMenuClose}>삭제하기</MenuItem> */}
//         </Menu>
//       </Box>
//     </Box>
//   );
// };

// export default AllSpacesContent;


// 경로: src/pages/SpacesPage/components/AllSpacesContent.tsx

import React, { useState } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  Button,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  IconButton,
  Divider,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import apiClient from '../../../api';
import type { Space } from '..'; // 부모 컴포넌트에서 정의한 Space 타입을 가져옴

// 정렬 옵션 (이 부분은 API 데이터에 맞게 조정될 수 있음)
type SortOptionKey = 'name-asc' | 'name-desc';
const sortOptions: { key: SortOptionKey; label: string }[] = [
  { key: 'name-asc', label: '이름 오름차순' },
  { key: 'name-desc', label: '이름 내림차순' },
];

// 부모로부터 받을 props 타입을 정의
interface AllSpacesContentProps {
  spaces: Space[];
  onAddSpace: () => void;
  onDataChange: () => void;
}

const AllSpacesContent: React.FC<AllSpacesContentProps> = ({ spaces, onAddSpace, onDataChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<SortOptionKey>('name-asc');
  
  const [sortMenuAnchorEl, setSortMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [itemMenuAnchorEl, setItemMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [openedMenuSpaceId, setOpenedMenuSpaceId] = useState<null | number>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSpace, setEditingSpace] = useState<{ id: number; name: string } | null>(null);
  const [newSpaceName, setNewSpaceName] = useState('');
  const [isApiLoading, setIsApiLoading] = useState(false);

  const handleSpaceItemClick = (spaceName: string) => {
    alert(`'${spaceName}' 스페이스를 클릭했습니다. 상세 페이지로 이동합니다.`);
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
    const currentSpace = spaces.find(s => s.spaceId === openedMenuSpaceId);
    if (currentSpace) {
      setEditingSpace({ id: currentSpace.spaceId, name: currentSpace.spaceName });
      setNewSpaceName(currentSpace.spaceName);
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
    if (!editingSpace || !newSpaceName.trim()) {
      alert('새 스페이스 이름을 입력해주세요.');
      return;
    }
    setIsApiLoading(true);
    try {
      await apiClient.patch(`/spaces/${editingSpace.id}`, { spaceName: newSpaceName });
      alert('스페이스 이름이 성공적으로 수정되었습니다.');
      handleCloseEditModal();
      onDataChange(); // 부모에게 데이터 새로고침 요청
    } catch (error) {
      console.error("스페이스 수정 실패:", error);
      alert('스페이스 수정에 실패했습니다. 권한을 확인해주세요.');
    } finally {
      setIsApiLoading(false);
    }
  };

  const handleDeleteClick = async () => {
    if (!openedMenuSpaceId) return;
    const spaceToDelete = spaces.find(s => s.spaceId === openedMenuSpaceId);
    if (!spaceToDelete) return;

    if (window.confirm(`'${spaceToDelete.spaceName}' 스페이스를 정말로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) {
      setIsApiLoading(true);
      handleItemMenuClose();
      try {
        await apiClient.delete(`/spaces/${openedMenuSpaceId}`);
        alert('스페이스가 성공적으로 삭제되었습니다.');
        onDataChange(); // 부모에게 데이터 새로고침 요청
      } catch (error) {
        console.error("스페이스 삭제 실패:", error);
        alert('스페이스 삭제에 실패했습니다. 권한을 확인해주세요.');
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
      switch (sortOption) {
        case 'name-desc':
          return b.spaceName.localeCompare(a.spaceName);
        case 'name-asc':
        default:
          return a.spaceName.localeCompare(b.spaceName);
      }
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
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddSpace}
          sx={{ borderRadius: '8px', py: 1.5, px: 2, fontWeight: 'bold' }}
        >
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
            {sortedAndFilteredSpaces.map((space, index) => (
              <React.Fragment key={space.spaceId}>
                <ListItem
                  onClick={() => handleSpaceItemClick(space.spaceName)}
                  sx={{ py: 2, '&:hover': { backgroundColor: 'action.hover' }, cursor: 'pointer' }}
                  secondaryAction={
                    <IconButton edge="end" aria-label="more-actions" onClick={(e) => handleItemMenuOpen(e, space.spaceId)}>
                      <MoreVertIcon />
                    </IconButton>
                  }
                >
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
            ))}
          </List>
        ) : (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <Typography variant="body1" color="text.secondary">검색 결과가 없습니다.</Typography>
          </Box>
        )}

        <Menu anchorEl={itemMenuAnchorEl} open={Boolean(itemMenuAnchorEl)} onClose={handleItemMenuClose}>
          <MenuItem onClick={handleEditClick}>수정하기</MenuItem>
          <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>삭제하기</MenuItem>
        </Menu>

        <Dialog open={isEditModalOpen} onClose={handleCloseEditModal} fullWidth maxWidth="xs">
          <DialogTitle>스페이스 이름 수정</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="새 스페이스 이름"
              type="text"
              fullWidth
              variant="standard"
              value={newSpaceName}
              onChange={(e) => setNewSpaceName(e.target.value)}
            />
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
