import { useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Checkbox,
    CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import useAppStore from '../store/useAppStore';

/**
 * @description 사용자가 속한 스페이스 목록을 보여주는 페이지 컴포넌트입니다.
 * @returns {React.ReactElement} ContactsPage 컴포넌트
 */
const ContactsPage = () => {

    const { 
      contacts, 
      isLoadingContacts, 
      fetchContacts, 
      currentSpace 
    } = useAppStore();

    // 스페이스 바뀔 때 마다 연락처 목록 새로 불러옴
    useEffect(() => {
        if (currentSpace) {
            fetchContacts();
        }
    }, [currentSpace, fetchContacts]);

    if (isLoadingContacts) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
   <Box sx={{ display: 'flex', position: 'relative' }}>
        <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
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
                <TableCell>태그</TableCell>
                <TableCell>휴대전화</TableCell>
                <TableCell>이메일</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {/* 5. 연락처 목록이 비어있을 때의 처리 */}
                {contacts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                      등록된 연락처가 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  // 6. 가짜 데이터 대신, 스토어에서 가져온 진짜 contacts 배열을 사용합니다.
                  contacts.map((contact) => (
                  <TableRow key={contact.id}>
                      <TableCell padding="checkbox">
                          <Checkbox />
                      </TableCell>
                      <TableCell>{contact.name}</TableCell>
                      <TableCell>{contact.tag || '-'}</TableCell> {/* 태그가 없으면 '-' 표시 */}
                      <TableCell>{contact.phoneNumber}</TableCell>
                      <TableCell>{contact.email}</TableCell>
                  </TableRow>
                  ))
                )}
            </TableBody>
            </Table>
        </TableContainer>
        </Box>
    </Box>
    );
};

export default ContactsPage;