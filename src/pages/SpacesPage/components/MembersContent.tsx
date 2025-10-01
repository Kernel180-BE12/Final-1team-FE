import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, CircularProgress, IconButton,
  Menu, MenuItem, ListItemIcon, ListItemText, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Select, FormControl, InputLabel,
  Alert, Chip, Stack, InputAdornment, Avatar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person'; // 멤버 아이콘 추가
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
                {/* ★ 이제 사용자 ID 대신 이름과 이메일을 보여줍니다. */}
                <Typography variant="subtitle1" sx={{mb: 2}}>멤버: {member?.name} ({member?.email})</Typography>
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
  const [searchTerm, setSearchTerm] = useState('');

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
    // ★ 삭제 확인 창에 사용자 이름을 표시합니다.
    if (selectedMember && window.confirm(`'${selectedMember.name}' 멤버를 정말로 삭제하시겠습니까?`)) {
        deleteSpaceMember(selectedMember.id);
    }
    handleMenuClose();
  };

  const handleEdit = () => {
    setEditModalOpen(true);
    handleMenuClose();
  }

  // ★ 검색 로직 업데이트: 이름, 이메일, 태그로 검색
  const filteredMembers = spaceMembers.filter(member => {
    if (!member) return false;
    const searchTermLower = searchTerm.toLowerCase();
    
    const nameMatch = member.name?.toLowerCase().includes(searchTermLower);
    const emailMatch = member.email?.toLowerCase().includes(searchTermLower);
    const tagMatch = member.tag?.toLowerCase().includes(searchTermLower);

    return nameMatch || emailMatch || tagMatch;
  });

  if (isLoadingSpaceMembers) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            placeholder="이름, 이메일, 태그로 검색..."
            variant="outlined"
            size="small"
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
            sx={{ flexShrink: 0, whiteSpace: 'nowrap' }}
          >
            멤버 초대
          </Button>
        </Box>
      </Box>
      
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead sx={{ bgcolor: 'grey.100' }}>
            <TableRow>
              {/* ★ 테이블 헤더를 '멤버'로 변경 */}
              <TableCell>멤버</TableCell>
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
                  {/* ★ 멤버 정보를 이름과 이메일로 표시하도록 UI 개선 */}
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ width: 32, height: 32, mr: 1.5, bgcolor: 'primary.light' }}>
                            <PersonIcon fontSize="small" />
                        </Avatar>
                        <Box>
                            <Typography variant="body2" fontWeight="medium">{member.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{member.email}</Typography>
                        </Box>
                    </Box>
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
                      disabled={!isCurrentUserAdmin}
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

