import React, { useState } from 'react';
import {
    Box,
    Tab,
    Tabs,
    FormControl,
    Select,
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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';


/**
 * @description '초대 및 권한 설정' 메뉴를 클릭했을 때 보여줄 콘텐츠입니다.
 */
const InviteSettingsContent = () => {
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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
  
  const members = [
    { id: 1, name: '홍길동', permission: '최고 관리자', docPermission: '관리자', status: '연결됨', tag: null, invitedContact: '' },
  ];

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="permission settings tabs">
          <Tab label="초대 완료 구성원" />
          <Tab label="초대 중 구성원" />
          <Tab label="전체 연락처" />
          <Tab label="권한관리" />
        </Tabs>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FormControl size="small" variant="outlined">
                <Select value="all-tags" displayEmpty>
                    <MenuItem value="all-tags">태그 전체</MenuItem>
                </Select>
            </FormControl>
            <FormControl size="small" variant="outlined">
                <Select value="admin" displayEmpty>
                    <MenuItem value="admin">최고 관리자</MenuItem>
                </Select>
            </FormControl>
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
                <TableCell>전자문서 관리 권한</TableCell>
                <TableCell>초대 상태</TableCell>
                <TableCell>태그</TableCell>
                <TableCell>초대한 연락처</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {members.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((member) => (
                <TableRow key={member.id} hover>
                  <TableCell padding="checkbox"><Checkbox /></TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 24, height: 24, fontSize: '0.8rem' }}>H</Avatar>
                      {member.name}
                    </Box>
                  </TableCell>
                  <TableCell>{member.permission}</TableCell>
                  <TableCell>{member.docPermission}</TableCell>
                  <TableCell>
                    <Chip label={member.status} color="success" size="small" />
                  </TableCell>
                  <TableCell>{member.tag || '-'}</TableCell>
                  <TableCell>{member.invitedContact || '-'}</TableCell>
                  <TableCell align="center"><IconButton size="small"><AddIcon /></IconButton></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 20, 50]}
          component="div"
          count={members.length}
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
