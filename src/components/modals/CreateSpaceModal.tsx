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

// TypeScript를 위해, 이 컴포넌트가 받을 props의 타입을 정의합니다.
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

  // 모달이 닫힐 때 모든 상태를 초기화하는 함수
  const handleClose = () => {
    if (isLoading) return; // 로딩 중에는 닫히지 않도록 방지
    setSpaceName('');
    setOwnerName('');
    setSpaceNameError('');
    setOwnerNameError('');
    onClose();
  };

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
      // POST /spaces API 호출
      await apiClient.post('/spaces', { spaceName, ownerName });
      
      alert('새로운 스페이스가 생성되었습니다.');
      
      // ★ 4. 생성이 성공하면, onSpaceCreated 함수를 호출하여 부모에게 알립니다.
      onSpaceCreated();
      
      // ★ 5. 그 다음에 모달을 닫습니다. (handleClose를 호출하여 상태 초기화까지 한번에)
      handleClose();

    } catch (error) {
      console.error("스페이스 생성 실패:", error);
      alert("스페이스 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false); // 로딩 종료
    }
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
        {/* ★ 6. 로딩 상태에 따라 버튼 UI를 변경합니다. */}
        <Button onClick={handleCreate} variant="contained" disabled={isLoading}>
          {isLoading ? <CircularProgress size={24} /> : '만들기'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateSpaceModal;
