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

// 부모로부터 받을 props 타입에 onSpaceCreated를 추가
interface CreateSpaceModalProps {
  open: boolean;
  onClose: () => void;
  onSpaceCreated: () => void;  // 스페이스 생성이 성공했을 때 호출될 함수
}

const CreateSpaceModal: React.FC<CreateSpaceModalProps> = ({ open, onClose, onSpaceCreated }) => {
  const [spaceName, setSpaceName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [spaceNameError, setSpaceNameError] = useState('');
  const [ownerNameError, setOwnerNameError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // ★ 2. API 통신 로딩 상태를 관리할 state

  // async 키워드를 추가하여 비동기 함수로 만듦
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

    // ★ 3. 실제 API 호출 로직
    setIsLoading(true); // 로딩 시작
    try {
      await apiClient.post('/spaces', {
        spaceName: spaceName,
        ownerName: ownerName,
      });
      
      alert('새로운 스페이스가 생성되었습니다.');
      handleClose();
      onSpaceCreated();   

    } catch (error) {
      console.error("스페이스 생성 실패:", error);
      alert("스페이스 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

   // 모달이 닫힐 때 모든 상태를 초기화하는 함수
  const handleClose = () => {
    if (isLoading) return; // 로딩 중에는 닫히지 않도록 방지
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
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
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
