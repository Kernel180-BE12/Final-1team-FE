import React, { useState, useEffect } from 'react';
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
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Alert,
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import useAppStore from '../store/useAppStore';

// 새로 추가할 연락처의 타입을 정의합니다.
interface NewContact {
    name: string;
    phoneNumber: string;
    email: string;
    tag: string; // tag는 항상 string 타입으로 관리 (빈 문자열 포함)
}

const ContactsPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    // ★ 1. newContact의 tag 초기값을 빈 문자열로 설정합니다.
    const [newContact, setNewContact] = useState<NewContact>({ name: '', phoneNumber: '', email: '', tag: '' });
    const [apiError, setApiError] = useState<string | null>(null);
    
    // ★ 2. 유효성 검사 에러 메시지를 관리할 state 추가
    const [validationErrors, setValidationErrors] = useState<Partial<NewContact>>({});

    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [currentContactId, setCurrentContactId] = useState<null | number>(null);
    const isMenuOpen = Boolean(menuAnchorEl);

    const { 
      contacts, 
      isLoadingContacts, 
      fetchContacts, 
      currentSpace,
      addContacts,
      deleteContact
    } = useAppStore();

    useEffect(() => {
        if (currentSpace) {
            fetchContacts();
        }
    }, [currentSpace, fetchContacts]);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setNewContact({ name: '', phoneNumber: '', email: '', tag: '' });
        setValidationErrors({});
        setApiError(null);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setNewContact(prev => ({ ...prev, [name]: value }));
    };

    // ★ 3. 유효성 검사 로직 함수 분리
    const validateContact = (): boolean => {
        const errors: Partial<NewContact> = {};

        // 이름 유효성 검사 (최소 2자)
        if (newContact.name.trim().length < 2) {
            errors.name = '이름은 2자 이상 입력해주세요.';
        }

        // 휴대전화 유효성 검사 (010-1234-5678 형식)
        const phoneRegex = /^010-\d{4}-\d{4}$/;
        if (!phoneRegex.test(newContact.phoneNumber)) {
            errors.phoneNumber = '휴대전화 형식이 올바르지 않습니다. (예: 010-1234-5678)';
        }

        // 이메일 유효성 검사 (입력된 경우에만)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (newContact.email && !emailRegex.test(newContact.email)) {
            errors.email = '유효한 이메일 주소를 입력해주세요.';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0; // 에러가 없으면 true 반환
    };

    // ★ 4. '저장' 버튼 핸들러에 유효성 검사 로직 추가
    const handleAddContact = async () => {
        setApiError(null);
        if (!validateContact()) {
            return; // 유효성 검사 실패 시 중단
        }

        try {
            // API payload를 생성합니다. 태그는 값이 있을 때만 포함시킵니다.
            const contactPayload = {
                name: newContact.name,
                phoneNumber: newContact.phoneNumber,
                email: newContact.email,
                ...(newContact.tag && { tag: newContact.tag })
            };

            await addContacts({ contacts: [contactPayload] });
            handleCloseModal();
        } catch (apiError) {
            console.error("연락처 추가 실패:", apiError);
            setApiError("연락처 추가에 실패했습니다. 다시 시도해주세요.");
        }
    };
    
    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, contactId: number) => {
        setMenuAnchorEl(event.currentTarget);
        setCurrentContactId(contactId);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
        setCurrentContactId(null);
    };
    
    const handleDeleteContact = async () => {
        if (currentContactId !== null) {
            if (window.confirm('정말로 이 연락처를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
                try {
                    await deleteContact(currentContactId);
                } catch (apiError) {
                    console.error("연락처 삭제 실패:", apiError);
                }
            }
        }
        handleMenuClose();
    };


    if (isLoadingContacts) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
       <>
            <Box sx={{ display: 'flex', position: 'relative' }}>
                <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        연락처
                        </Typography>
                        <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
                        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenModal}>
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
                                <TableCell align="right">작업</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {contacts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                                    등록된 연락처가 없습니다.
                                    </TableCell>
                                </TableRow>
                                ) : (
                                contacts.map((contact) => (
                                <TableRow key={contact.id}>
                                    <TableCell padding="checkbox">
                                        <Checkbox />
                                    </TableCell>
                                    <TableCell>{contact.name}</TableCell>
                                    <TableCell>{contact.tag || '-'}</TableCell>
                                    <TableCell>{contact.phoneNumber}</TableCell>
                                    <TableCell>{contact.email}</TableCell>
                                    <TableCell align="right">
                                        <IconButton size="small" onClick={(e) => handleMenuOpen(e, contact.id)}>
                                            <MoreVertIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                                ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>

            {/* ★ 5. 모달 UI 수정: 태그 필드 추가 및 유효성 검사 피드백 UI 연결 */}
            <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold' }}>새로운 연락처 등록</DialogTitle>
                <DialogContent>
                    {apiError && <Alert severity="error" sx={{ mb: 2 }}>{apiError}</Alert>}
                    <TextField
                        autoFocus
                        margin="dense"
                        name="name"
                        label="이름 (필수)"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newContact.name}
                        onChange={handleInputChange}
                        error={!!validationErrors.name}
                        helperText={validationErrors.name || ' '}
                    />
                    <TextField
                        margin="dense"
                        name="phoneNumber"
                        label="휴대전화 (필수)"
                        type="tel"
                        fullWidth
                        variant="outlined"
                        value={newContact.phoneNumber}
                        onChange={handleInputChange}
                        error={!!validationErrors.phoneNumber}
                        helperText={validationErrors.phoneNumber || '-(하이픈)을 넣어서 입력해주세요.'}
                    />
                    <TextField
                        margin="dense"
                        name="email"
                        label="이메일 (필수)"
                        type="email"
                        fullWidth
                        variant="outlined"
                        value={newContact.email}
                        onChange={handleInputChange}
                        error={!!validationErrors.email}
                        helperText={validationErrors.email || ' '}
                    />
                    <TextField
                        margin="dense"
                        name="tag"
                        label="태그 (선택)"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newContact.tag}
                        onChange={handleInputChange}
                        helperText=" "
                    />
                </DialogContent>
                <DialogActions sx={{ p: '16px 24px' }}>
                    <Button onClick={handleCloseModal} color="secondary">취소</Button>
                    <Button onClick={handleAddContact} variant="contained">저장</Button>
                </DialogActions>
            </Dialog>

            <Menu
                anchorEl={menuAnchorEl}
                open={isMenuOpen}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuItem onClick={handleDeleteContact} sx={{ color: 'error.main' }}>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText>삭제</ListItemText>
                </MenuItem>
            </Menu>
       </>
    );
};

export default ContactsPage;

