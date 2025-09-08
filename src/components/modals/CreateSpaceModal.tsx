import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// TypeScript를 위해, 이 컴포넌트가 받을 props의 타입을 정의합니다.
interface CreateSpaceModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * @description 새로운 스페이스를 생성하는 팝업(모달) 컴포넌트입니다.
 * @param {object} props - React 컴포넌트 props
 * @param {boolean} props.open - 모달의 열림/닫힘 상태
 * @param {() => void} props.onClose - 모달을 닫을 때 호출되는 함수
 * @returns {React.ReactElement} CreateSpaceModal 컴포넌트
 */
const CreateSpaceModal = ({ open, onClose }: CreateSpaceModalProps) => {
  const [spaceName, setSpaceName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerNameError, setOwnerNameError] = useState('');
  const [spaceNameError, setSpaceNameError] = useState('');

  const handleCreate = () => {
    let isValid = true;
    if (!spaceName.trim()) {
      setSpaceNameError('스페이스 이름을 입력해주세요.');
      isValid = false;
    } else {
      setSpaceNameError('');
    }

    // [추가] 대표자 이름 유효성 검사
    if (!ownerName.trim()) {
      setOwnerNameError('대표자 이름을 입력해주세요.');
      isValid = false;
    } else {
      setOwnerNameError('');
    }

    if (!isValid) return;
    // TODO: 여기에 실제로 API를 호출하는 로직을 추가합니다.
    // 예: axios.post('/spaces', { name: spaceName });
    console.log('생성할 스페이스 이름:', spaceName, ownerName );
    handleClose();
  };

  const handleClose = () => {
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
        />
      </DialogContent>
      <DialogActions sx={{ p: '16px 24px' }}>
        <Button onClick={handleClose}>취소</Button>
        <Button onClick={handleCreate} variant="contained">만들기</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateSpaceModal;
