import React, { useState, useMemo } from 'react';
import {
    Box,
    Tab,
    Tabs,
    TextField,
    MenuItem,
    Button,
    Paper,
    TableContainer,
    Table,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
    TablePagination,
    Checkbox,
    Avatar,
    Chip,
    IconButton,
    ListItemText,
} from '@mui/material';
// [수정] SelectChangeEvent는 더 이상 직접 사용하지 않으므로 제거해도 됩니다.
// import type { SelectChangeEvent } from '@mui/material'; 
import AddIcon from '@mui/icons-material/Add';

const tagOptions = ['#재직자', '#퇴사자', '#프리랜서', '#외부인', '#주주'];
const authorityOptions = ['권한그룹전체', '최고관리자', '전자문서관리자', '구성원', '접근권한없음'];

const members = [
  { id: 1, name: '홍길동', permission: '최고관리자', status: '연결됨', tags: ['#재직자', '#주주'] },
  { id: 2, name: '김철수', permission: '구성원', status: '연결됨', tags: ['#재직자'] },
  { id: 3, name: '이영희', permission: '구성원', status: '초대중', tags: ['#프리랜서'] },
  { id: 4, name: '박지성', permission: '전자문서관리자', status: '연결됨', tags: ['#재직자'] },
  { id: 5, name: '손흥민', permission: '구성원', status: '연결됨', tags: ['#외부인'] },
  { id: 6, name: '차범근', permission: '접근권한없음', status: '만료됨', tags: ['#퇴사자'] },
];

const InviteSettingsContent = () => {
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedAuthority, setSelectedAuthority] = useState<string>('권한그룹전체');

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // [수정] 이벤트 타입을 React.ChangeEvent<HTMLInputElement>로 받고, value를 타입 단언합니다.
  const handleTagChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelectedTags(typeof value === 'string' ? value.split(',') : (value as string[]));
  };

  // [수정] 이벤트 타입을 React.ChangeEvent<HTMLInputElement>로 받고, value를 타입 단언합니다.
  const handleAuthorityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAuthority(event.target.value as string);
  };

  const filteredMembers = useMemo(() => {
    return members.filter(member => {
      const tagMatch = selectedTags.length === 0 || selectedTags.every(tag => member.tags.includes(tag));
      const authorityMatch = selectedAuthority === '권한그룹전체' || member.permission === selectedAuthority;
      return tagMatch && authorityMatch;
    });
  }, [selectedTags, selectedAuthority]);

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="permission settings tabs">
          <Tab label="구성원" />
          <Tab label="권한관리" />
        </Tabs>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TextField
                select
                label="태그 전체"
                value={selectedTags}
                onChange={handleTagChange}
                size="small"
                sx={{ minWidth: 150 }}
                SelectProps={{
                    multiple: true,
                    renderValue: (selected) => {
                        const s = selected as string[];
                        if (s.length === 0) {
                            // 플레이스홀더처럼 보이게 하기 위해 빈 값을 반환
                            // 라벨은 TextField가 알아서 처리해줍니다.
                            return '';
                        }
                        return s.join(', ');
                    },
                }}
            >
                {tagOptions.map((tag) => (
                    <MenuItem key={tag} value={tag}>
                        
                        <ListItemText primary={tag} />
                    </MenuItem>
                ))}
            </TextField>

            <TextField
                select
                label="권한 그룹"
                value={selectedAuthority}
                onChange={handleAuthorityChange}
                size="small"
                sx={{ minWidth: 150 }}
            >
                {authorityOptions.map((auth) => (
                    <MenuItem key={auth} value={auth}>
                        {auth}
                    </MenuItem>
                ))}
            </TextField>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />}>
            초대하기
        </Button>
      </Box>

      <Paper variant="outlined" sx={{ borderColor: '#e0e0e0' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell padding="checkbox"><Checkbox /></TableCell>
                <TableCell>이름</TableCell>
                <TableCell>권한</TableCell>
                <TableCell>초대 상태</TableCell>
                <TableCell>태그</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMembers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((member) => (
                <TableRow key={member.id} hover>
                  <TableCell padding="checkbox"><Checkbox /></TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 24, height: 24, fontSize: '0.8rem' }}>{member.name.charAt(0)}</Avatar>
                      {member.name}
                    </Box>
                  </TableCell>
                  <TableCell>{member.permission}</TableCell>
                  <TableCell>
                    <Chip 
                      label={member.status} 
                      color={member.status === '연결됨' ? 'success' : member.status === '초대중' ? 'warning' : 'default'} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {member.tags.length > 0 ? member.tags.map(tag => <Chip key={tag} label={tag} size="small" />) : '-'}
                    </Box>
                  </TableCell>
                  <TableCell align="center"><IconButton size="small"></IconButton></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 20, 50]}
          component="div"
          count={filteredMembers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="줄 수:"
        />
      </Paper>
    </Box>
  );
};

export default InviteSettingsContent;
