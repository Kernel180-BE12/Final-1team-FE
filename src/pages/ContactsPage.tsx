import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    List,
    ListItemButton,
    ListItemText,
    Paper,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Checkbox,
    ListItemIcon,
    IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import GroupIcon from '@mui/icons-material/Group';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const subSidebarWidth = 240;

/**
 * @description 사용자가 속한 스페이스 목록을 보여주는 페이지 컴포넌트입니다.
 * @returns {React.ReactElement} ContactsPage 컴포넌트
 */
const ContactsPage = () => {
    const [isSubSidebarOpen, setSubSidebarOpen] = useState(true);

    const contacts = [
    { id: 1, name: '우리 회사 마케팅팀', tag: '바로가기 >', nikName: '효주', affiliation: '' },
    { id: 2, name: '사이드 프로젝트: 댕댕이 산책 앱', tag: '바로가기 >', nikName: '', affiliation: '' },
    { id: 3, name: '개인 워크스페이스', tag: '바로가기 >', nikName: '', affiliation: '' },
    ];

    return (
    <Box sx={{ display: 'flex', position: 'relative' }}>
      {/* 왼쪽 하위 메뉴 패널의 너비와 마진을 동적으로 조절합니다. */}
        <Paper
        variant="outlined"
        sx={{
            width: isSubSidebarOpen ? subSidebarWidth : 0,
            minWidth: isSubSidebarOpen ? subSidebarWidth : 0,
            borderColor: '#e0e0e0',
            alignSelf: 'flex-start',
            transition: (theme) => theme.transitions.create(['width', 'min-width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
            }),
            // 너비가 0일 때 내부 내용이 삐져나오지 않도록 숨김
            overflow: 'hidden',
        }}
        >
        <Box sx={{ width: subSidebarWidth }}>
            <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                연락처
            </Typography>
            </Box>
        <List>
            <ListItemButton selected>
            <ListItemIcon sx={{ minWidth: 32 }}>
                <GroupIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="전체" />
            <Typography variant="body2" color="text.secondary">
                2
            </Typography>
            </ListItemButton>
            <ListItemButton>
            <ListItemText primary="> 모두 보기" sx={{ pl: 4 }} />
            </ListItemButton>
        </List>
        </Box>
        </Paper>

      {/* [수정] 오른쪽 메인 콘텐츠 패널의 marginLeft 로직을 단순화합니다. */}
        <Box 
        sx={{ 
            flexGrow: 1,
            marginLeft: isSubSidebarOpen ? 3 : 0,
            transition: (theme) => theme.transitions.create('margin-left', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
            }),
        }}
        >
        {/* 헤더 영역에 토글 버튼을 추가합니다. */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <IconButton onClick={() => setSubSidebarOpen(!isSubSidebarOpen)} sx={{ mr: 1 }}>
            {isSubSidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            연락처
            </Typography>
            <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
            <Button variant="contained" startIcon={<AddIcon />}>
            새로운 연락처 등록
            </Button>
        </Box>

        <TableContainer component={Paper} variant="outlined">
            <Table sx={{ minWidth: 650 }} aria-label="contact table">
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox />
                </TableCell>
                <TableCell>이름</TableCell>
                <TableCell>개별 운임</TableCell>
                <TableCell>태그</TableCell>
                <TableCell>닉네임</TableCell>
                <TableCell>소속</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {contacts.map((contact) => (
                <TableRow key={contact.id}>
                    <TableCell padding="checkbox">
                    <Checkbox />
                    </TableCell>
                    <TableCell>{contact.name}</TableCell>
                    <TableCell />
                    <TableCell>{contact.tag}</TableCell>
                    <TableCell>{contact.nikName}</TableCell>
                    <TableCell>{contact.affiliation}</TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </TableContainer>
        </Box>
    </Box>
    );
};

export default ContactsPage;
