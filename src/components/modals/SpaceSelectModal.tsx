import { 
  Dialog, DialogTitle, DialogContent, DialogContentText, 
  List, ListItemButton, ListItemIcon, ListItemText, 
  Divider, DialogActions, Button 
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import type { Space } from '../../store/useAppStore'; // 스토어에서 Space 타입을 가져옵니다.

// 컴포넌트에 전달할 props의 타입을 정의합니다.
interface SpaceSelectModalProps {
  open: boolean;
  onClose: () => void;
  spaces: Space[];
  currentSpace: Space | null;
  onSelect: (space: Space) => void;
}

const SpaceSelectModal = ({ 
  open, 
  onClose, 
  spaces, 
  currentSpace, 
  onSelect 
}: SpaceSelectModalProps) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>스페이스 선택</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          어떤 스페이스에서 AI 제안을 받으시겠어요?
        </DialogContentText>
        <List>
          {/* 최근 사용 스페이스 선택지 */}
          {currentSpace && spaces.some(s => s.spaceId === currentSpace.spaceId) && (
            <>
              <ListItemButton onClick={() => onSelect(currentSpace)}>
                <ListItemIcon><HistoryIcon /></ListItemIcon>
                <ListItemText 
                  primary={`${currentSpace.spaceName} (최근 사용)`} 
                />
              </ListItemButton>
              <Divider />
            </>
          )}
          
          {/* 나머지 스페이스 목록 (최근 사용과 중복되지 않게) */}
          {spaces
            .filter(space => space.spaceId !== currentSpace?.spaceId)
            .map(space => (
              <ListItemButton key={space.spaceId} onClick={() => onSelect(space)}>
                <ListItemText primary={space.spaceName} />
              </ListItemButton>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SpaceSelectModal;
