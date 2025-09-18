import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import apiClient from '../../api';
// ★★★ 변경점 1: Space 타입을 import 합니다. ★★★
// 이 타입은 API 응답의 형태와 일치해야 합니다.
import type { Space } from '../../store/useAppStore'; 

// ★★★ 변경점 2: 부모로부터 받을 props 타입 수정 ★★★
interface CreateSpaceModalProps {
  open: boolean;
  onClose: () => void;
  // onSpaceCreated가 생성된 Space 객체를 인자로 받도록 변경합니다.
  onSpaceCreated: (newSpace: Space) => void;
}

const CreateSpaceModal: React.FC<CreateSpaceModalProps> = ({ open, onClose, onSpaceCreated }) => {
  const [spaceName, setSpaceName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [spaceNameError, setSpaceNameError] = useState('');
  const [ownerNameError, setOwnerNameError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    let isValid = true;
    if (!spaceName.trim()) {
      setSpaceNameError('스페이스 이름을 입력해주세요.');
      isValid = false;
    } else {
      setSpaceNameError('');
    }

    if (!ownerName.trim()) {
      setOwnerNameError('대표자 이름을 입력해주세요.');
      isValid = false;
    } else {
      setOwnerNameError('');
    }

    if (!isValid) return;

    setIsLoading(true);
    try {
      // ★★★ 변경점 3: API 응답으로 생성된 스페이스 정보를 받습니다. ★★★
      const response = await apiClient.post<Space>('/spaces', {
        spaceName: spaceName,
        ownerName: ownerName,
      });
      
      const newSpace = response.data;

      alert('새로운 스페이스가 생성되었습니다.');
      
      // ★★★ 변경점 4: 부모(AgentPage)에게 생성된 스페이스 객체를 전달합니다. ★★★
      onSpaceCreated(newSpace);   
      
      handleClose(); // 스스로 닫습니다.

    } catch (error) {
      console.error("스페이스 생성 실패:", error);
      alert("스페이스 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (isLoading) return;
    setSpaceName('');
    setOwnerName('');
    setSpaceNameError('');
    setOwnerNameError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold' }}>
        새 스페이스 만들기
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <TextField
          autoFocus
          margin="dense"
          id="space-name"
          label="스페이스 이름"
          type="text"
          fullWidth
          variant="outlined"
          sx={{ mt: 1 }}
          value={spaceName}
          onChange={(e) => setSpaceName(e.target.value)}
          error={!!spaceNameError}
          helperText={spaceNameError}
          disabled={isLoading}
        />
        <TextField
          margin="dense"
          id="owner-name"
          label="대표자 이름"
          type="text"
          fullWidth
          variant="outlined"
          value={ownerName}
          onChange={(e) => setOwnerName(e.target.value)}
          error={!!ownerNameError}
          helperText={ownerNameError}
          disabled={isLoading}
        />
      </DialogContent>
      <DialogActions sx={{ p: '16px 24px' }}>
        <Button onClick={handleClose} disabled={isLoading}>취소</Button>
        <Button onClick={handleCreate} variant="contained" disabled={isLoading}>
          {isLoading ? <CircularProgress size={24} color="inherit" /> : '만들기'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateSpaceModal;
