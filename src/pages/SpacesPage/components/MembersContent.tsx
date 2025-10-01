import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, CircularProgress, IconButton,
  Menu, MenuItem, ListItemIcon, ListItemText, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField,
  Alert, Chip, Stack, InputAdornment, Avatar, Checkbox
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import useAppStore from '../../../store/useAppStore';
import type { SpaceMember, NewMemberInvitation } from '../../../store/useAppStore';

// --- 멤버 초대 모달 컴포넌트 ---
interface InviteMembersModalProps {
  open: boolean;
  onClose: () => void;
}

const InviteMembersModal: React.FC<InviteMembersModalProps> = ({ open, onClose }) => {
  const { inviteSpaceMembers, showSnackbar } = useAppStore();
  const [invitations, setInvitations] = useState<NewMemberInvitation[]>([{ email: '',tag: '' }]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddRow = () => {
    setInvitations([...invitations, { email: '', tag: '' }]);
  };

  const handleInputChange = (index: number, field: keyof NewMemberInvitation, value: string) => {
    const newInvitations = [...invitations];
    newInvitations[index][field] = value;
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
      setInvitations([{ email: '', tag: '' }]);
      setError(null);
      setIsLoading(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle fontWeight="bold">스페이스 멤버 초대</DialogTitle>
      <DialogContent>
        <Alert severity="info" icon={<InfoOutlined fontSize="inherit" />} sx={{ mb: 2 }}>
          초대된 멤버는 모두 <strong>MEMBER</strong> 권한을 갖게 됩니다.
        </Alert>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {invitations.map((invite, index) => (
          <Stack key={index} direction="row" spacing={2} sx={{ my: 2 }}>
            <TextField label="이메일" type="email" value={invite.email} onChange={(e) => handleInputChange(index, 'email', e.target.value)} sx={{ flex: 3 }} />
            <TextField
              label="권한"
              value="MEMBER"
              disabled
              sx={{ flex: 1 }}
            />
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
    const [tag, setTag] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (member) {
            setTag(member.tag || '');
        }
    }, [member]);

    const handleSave = async () => {
        if (!member) return;
        setIsLoading(true);
        try {
            await updateSpaceMember(member.id, { tag });
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
                <Typography variant="subtitle1" sx={{mb: 2}}>멤버: {member?.name} ({member?.email})</Typography>
                <TextField 
                  fullWidth 
                  margin="normal" 
                  label="태그" 
                  value={tag} 
                  onChange={(e) => setTag(e.target.value)} 
                  autoFocus
                />
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
    deleteSelectedSpaceMembers,
    selectedMemberIds,
    toggleMemberSelection,
    toggleAllMembersSelection,
    user,
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
  
  const handleDelete = (memberId: number, memberName: string) => {
    // 메뉴를 닫는 동작을 먼저 수행하여 상태 문제를 방지
    handleMenuClose();
    // ID가 유효한지 다시 한번 확인
    if (memberId && window.confirm(`'${memberName}' 멤버를 정말로 삭제하시겠습니까?`)) {
        deleteSpaceMember(memberId);
    }
  };

  const handleEdit = () => {
    if (selectedMember) {
      setEditModalOpen(true);
    }
    handleMenuClose();
  }

  const handleBulkDelete = () => {
    if (selectedMemberIds.length > 0 && window.confirm(`선택된 ${selectedMemberIds.length}명의 멤버를 정말로 삭제하시겠습니까?`)) {
      deleteSelectedSpaceMembers();
    }
  };

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
  
  const selectableMemberIds = filteredMembers
    .filter(member => member.email !== user?.email)
    .map(member => member.id);

  const isAllSelected = selectableMemberIds.length > 0 && selectedMemberIds.length === selectableMemberIds.length;
  const isIndeterminate = selectedMemberIds.length > 0 && selectedMemberIds.length < selectableMemberIds.length;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        {selectedMemberIds.length > 0 && isCurrentUserAdmin ? (
            <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={handleBulkDelete}>
                {selectedMemberIds.length}명 삭제
            </Button>
        ) : (
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
        )}
      </Box>
      
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead sx={{ bgcolor: 'grey.100' }}>
            <TableRow>
              <TableCell padding="checkbox">
                  <Checkbox 
                    checked={isAllSelected} 
                    indeterminate={isIndeterminate} 
                    onChange={toggleAllMembersSelection} 
                    disabled={selectableMemberIds.length === 0 || !isCurrentUserAdmin} 
                  />
              </TableCell>
              <TableCell>멤버</TableCell>
              <TableCell>권한</TableCell>
              <TableCell>태그</TableCell>
              <TableCell align="right">작업</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                  <Typography color="text.secondary">{searchTerm ? '검색 결과가 없습니다.' : '아직 멤버가 없습니다.'}</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredMembers.map((member) => {
                const isSelf = member.email === user?.email;
                // ▼ 1. 현재 행의 멤버가 ADMIN인지 확인하는 변수를 추가합니다.
                const isMemberAdmin = member.authority === 'ADMIN';

                return (
                  <TableRow key={member.id} hover selected={selectedMemberIds.includes(member.id)}>
                    <TableCell padding="checkbox">
                        <Checkbox 
                          checked={selectedMemberIds.includes(member.id)} 
                          onChange={() => toggleMemberSelection(member.id)} 
                          // ▼ 2. disabled 조건에 '|| isMemberAdmin'을 추가합니다.
                          // 이제 본인이거나, 다른 ADMIN 멤버는 체크할 수 없습니다.
                          disabled={!isCurrentUserAdmin || isSelf || isMemberAdmin}
                        />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ width: 32, height: 32, mr: 1.5, bgcolor: 'primary.light' }}>
                              <PersonIcon fontSize="small" />
                          </Avatar>
                          <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {member.name}
                                {isSelf && <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>(나)</Typography>}
                              </Typography>
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
                        // ▼ 3. 여기에도 동일하게 '|| isMemberAdmin' 조건을 추가합니다.
                        // 이제 본인 또는 다른 ADMIN 멤버의 수정/삭제 메뉴는 열 수 없습니다.
                        disabled={!isCurrentUserAdmin || isSelf || isMemberAdmin}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
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
        {selectedMember && (
          <MenuItem 
            onClick={() => handleDelete(selectedMember.id, selectedMember.name)} 
            sx={{ color: 'error.main' }}
          >
            <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
            <ListItemText>삭제</ListItemText>
          </MenuItem>
        )}
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
