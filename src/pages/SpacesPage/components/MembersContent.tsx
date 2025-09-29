import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, CircularProgress, IconButton,
  Menu, MenuItem, ListItemIcon, ListItemText, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Select, FormControl, InputLabel,
  Alert, Chip, Stack, InputAdornment
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search'; // 검색 아이콘 추가
import useAppStore from '../../../store/useAppStore';
import type { SpaceMember, NewMemberInvitation } from '../../../store/useAppStore';

// --- 멤버 초대 모달 컴포넌트 ---
interface InviteMembersModalProps {
  open: boolean;
  onClose: () => void;
}

const InviteMembersModal: React.FC<InviteMembersModalProps> = ({ open, onClose }) => {
  const { inviteSpaceMembers, showSnackbar } = useAppStore();
  const [invitations, setInvitations] = useState<NewMemberInvitation[]>([{ email: '', authority: 'MEMBER', tag: '' }]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddRow = () => {
    setInvitations([...invitations, { email: '', authority: 'MEMBER', tag: '' }]);
  };

  const handleInputChange = (index: number, field: keyof NewMemberInvitation, value: string) => {
    const newInvitations = [...invitations];
    if (field === 'authority') {
        newInvitations[index][field] = value as 'ADMIN' | 'MEMBER';
    } else {
        newInvitations[index][field] = value;
    }
    setInvitations(newInvitations);
  };

  const handleSubmit = async () => {
    const invalidEmail = invitations.find(inv => !/\S+@\S+\.\S+/.test(inv.email));
    if (invalidEmail) {
      setError('올바른 이메일 형식을 입력해주세요.');
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const result = await inviteSpaceMembers(invitations);
      if (result.duplicateEmails && result.duplicateEmails.length > 0) {
        showSnackbar({ message: `초대 완료. (중복: ${result.duplicateEmails.join(', ')})`, severity: 'warning' });
      } else {
        showSnackbar({ message: '멤버를 성공적으로 초대했습니다.', severity: 'success' });
      }
      onClose();
    } catch (apiError) {
      console.error(apiError);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (!open) {
      setInvitations([{ email: '', authority: 'MEMBER', tag: '' }]);
      setError(null);
      setIsLoading(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle fontWeight="bold">스페이스 멤버 초대</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {invitations.map((invite, index) => (
          <Stack key={index} direction="row" spacing={2} sx={{ my: 2 }}>
            <TextField label="이메일" type="email" value={invite.email} onChange={(e) => handleInputChange(index, 'email', e.target.value)} sx={{ flex: 3 }} />
            <FormControl sx={{ flex: 1 }}>
              <InputLabel>권한</InputLabel>
              <Select native value={invite.authority} onChange={(e) => handleInputChange(index, 'authority', e.target.value)} label="권한">
                <option value="MEMBER">MEMBER</option>
                <option value="ADMIN">ADMIN</option>
              </Select>
            </FormControl>
            <TextField label="태그 (선택)" value={invite.tag} onChange={(e) => handleInputChange(index, 'tag', e.target.value)} sx={{ flex: 1 }} />
          </Stack>
        ))}
        <Button onClick={handleAddRow} size="small" sx={{ mt: 1 }}>+ 행 추가</Button>
      </DialogContent>
      <DialogActions sx={{ p: '16px 24px' }}>
        <Button onClick={onClose} disabled={isLoading}>취소</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={isLoading}>
          {isLoading ? <CircularProgress size={24} /> : '초대 메일 보내기'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// --- 멤버 수정 모달 컴포넌트 ---
interface EditMemberModalProps {
    open: boolean;
    onClose: () => void;
    member: SpaceMember | null;
}

const EditMemberModal: React.FC<EditMemberModalProps> = ({ open, onClose, member }) => {
    const { updateSpaceMember } = useAppStore();
    const [authority, setAuthority] = useState<'ADMIN' | 'MEMBER'>('MEMBER');
    const [tag, setTag] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (member) {
            setAuthority(member.authority);
            setTag(member.tag || '');
        }
    }, [member]);

    const handleSave = async () => {
        if (!member) return;
        setIsLoading(true);
        try {
            await updateSpaceMember(member.id, { authority, tag });
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle fontWeight="bold">멤버 정보 수정</DialogTitle>
            <DialogContent>
                <Typography variant="subtitle1" sx={{mb: 2}}>사용자 아이디: {member?.userId}</Typography>
                <FormControl fullWidth margin="normal">
                    <InputLabel>권한</InputLabel>
                    <Select native value={authority} onChange={(e) => setAuthority(e.target.value as 'ADMIN' | 'MEMBER')} label="권한">
                        <option value="MEMBER">MEMBER</option>
                        <option value="ADMIN">ADMIN</option>
                    </Select>
                </FormControl>
                <TextField fullWidth margin="normal" label="태그" value={tag} onChange={(e) => setTag(e.target.value)} />
            </DialogContent>
            <DialogActions sx={{ p: '16px 24px' }}>
                <Button onClick={onClose} disabled={isLoading}>취소</Button>
                <Button onClick={handleSave} variant="contained" disabled={isLoading}>
                    {isLoading ? <CircularProgress size={24} /> : '저장'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};


// --- 메인 페이지 컴포넌트 ---
const MembersContent = () => {
  const { 
    currentSpace, 
    spaceMembers, 
    isLoadingSpaceMembers, 
    fetchSpaceMembers,
    deleteSpaceMember,
  } = useAppStore();

  const [isInviteModalOpen, setInviteModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMember, setSelectedMember] = useState<SpaceMember | null>(null);
  const [searchTerm, setSearchTerm] = useState(''); // ★ 검색어 상태 추가

  // ★ 현재 로그인한 유저가 ADMIN인지 확인하는 변수
  const isCurrentUserAdmin = currentSpace?.authority === 'ADMIN';

  useEffect(() => {
    if (currentSpace) {
      fetchSpaceMembers();
    }
  }, [currentSpace, fetchSpaceMembers]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, member: SpaceMember) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedMember(member);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedMember(null);
  };
  
  const handleDelete = () => {
    if (selectedMember && window.confirm(`정말로 이 멤버를 삭제하시겠습니까?`)) {
        deleteSpaceMember(selectedMember.id);
    }
    handleMenuClose();
  };

  const handleEdit = () => {
    setEditModalOpen(true);
    handleMenuClose();
  }

  // ★ 검색어에 따라 멤버 목록을 필터링하는 로직
  const filteredMembers = spaceMembers.filter(member => {
    const searchTermLower = searchTerm.toLowerCase();
    // TODO: API가 멤버 이름/이메일을 반환하면 검색 조건에 추가해야 합니다.
    const userIdMatch = member.userId.toString().includes(searchTermLower);
    const tagMatch = member.tag?.toLowerCase().includes(searchTermLower);
    return userIdMatch || tagMatch;
  });

  if (isLoadingSpaceMembers) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;
  }

  return (
    <Box>
      {/* 2. 검색창과 초대 버튼을 한 줄에 배치 */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <TextField
          fullWidth
          placeholder="사용자 ID 또는 태그로 검색..."
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
              startAdornment: (
              <InputAdornment position="start">
                  <SearchIcon />
              </InputAdornment>
              ),
          }}
        />

        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => setInviteModalOpen(true)}
          disabled={!isCurrentUserAdmin}
          sx={{ flexShrink: 0, whiteSpace: 'nowrap' }} // 버튼이 줄어들거나 글자가 줄바꿈되지 않도록 설정
        >
          멤버 초대
        </Button>
      </Box>

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead sx={{ bgcolor: 'grey.100' }}>
            <TableRow>
              <TableCell>사용자 ID</TableCell>
              <TableCell>권한</TableCell>
              <TableCell>태그</TableCell>
              <TableCell align="right">작업</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                  <Typography color="text.secondary">{searchTerm ? '검색 결과가 없습니다.' : '아직 멤버가 없습니다.'}</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <Typography variant="body2">{member.userId}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={member.authority} 
                      color={member.authority === 'ADMIN' ? 'primary' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{member.tag || '-'}</TableCell>
                  <TableCell align="right">
                    <IconButton 
                      size="small" 
                      onClick={(event) => handleMenuOpen(event, member)}
                      disabled={!isCurrentUserAdmin} // ★ ADMIN이 아니면 더보기 버튼 비활성화
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          <ListItemText>수정</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
          <ListItemText>삭제</ListItemText>
        </MenuItem>
      </Menu>

      <InviteMembersModal 
        open={isInviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
      />

      <EditMemberModal
        open={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        member={selectedMember}
      />
    </Box>
  );
};

export default MembersContent;

