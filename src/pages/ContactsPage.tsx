import React, { useState, useEffect } from 'react';
import {
    Box, Button, Paper, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Checkbox,
    CircularProgress, Alert, IconButton, Menu, MenuItem,
    ListItemIcon, ListItemText, Chip, Stack,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import useAppStore from '../store/useAppStore';
import type { NewContactPayload, Contact } from '../store/useAppStore';
import ContactFormModal from '../components/modals/ContactFormModal';
import PageLayout from '../components/layouts/PageLayout';

const ContactsPage = () => {
    // --- State Hooks ---
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [editingContact, setEditingContact] = useState<Contact | null>(null);
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [currentContact, setCurrentContact] = useState<Contact | null>(null);

    // --- Zustand Store Hooks ---
    const { 
        filteredContacts, isLoadingContacts, fetchContacts, currentSpace,
        addContacts, updateContact, deleteContact, apiError,
        allTags, selectedTags,toggleTagFilter, clearTagFilter,
        selectedContactIds, toggleContactSelection, toggleAllContactsSelection, deleteSelectedContacts
    } = useAppStore();

    // --- Effects ---
    useEffect(() => {
        if (currentSpace) {
            fetchContacts();
        }
    }, [currentSpace, fetchContacts]);

    // --- Event Handlers ---
    const handleAddContact = async (contact: NewContactPayload | Contact) => {
        await addContacts({ contacts: [contact as NewContactPayload] });
    };

    const handleUpdateContact = async (contact: NewContactPayload | Contact) => {
        await updateContact(contact as Contact);
    };

    const handleOpenEditModal = () => {
        if (currentContact) {
            setEditingContact(currentContact);
            setEditModalOpen(true);
            handleMenuClose();
        }
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, contact: Contact) => {
        setMenuAnchorEl(event.currentTarget);
        setCurrentContact(contact);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
        setCurrentContact(null);
    };
    
    const handleDeleteContact = async () => {
        if (currentContact && window.confirm('정말로 이 연락처를 삭제하시겠습니까?')) {
            await deleteContact(currentContact.id);
        }
        handleMenuClose();
    };

    const handleBulkDelete = async () => {
        if (selectedContactIds.length > 0 && window.confirm(`선택된 ${selectedContactIds.length}개의 연락처를 정말로 삭제하시겠습니까?`)) {
            await deleteSelectedContacts();
        }
    };

    // --- Render Logic ---
    if (isLoadingContacts) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    if (apiError) return <Alert severity="error">{apiError}</Alert>;

    const isAllSelected = filteredContacts.length > 0 && selectedContactIds.length === filteredContacts.length;
    const isIndeterminate = selectedContactIds.length > 0 && selectedContactIds.length < filteredContacts.length;

    return (
    <>
        <PageLayout
            title="연락처"
            actionButtonText="새로운 연락처 등록"
            onActionButtonClick={() => setAddModalOpen(true)}
        >
            {/* PageLayout의 자식으로 페이지의 실제 컨텐츠를 넣습니다. */}
            <Box sx={{ flexGrow: 1 }}>
                {/* --- 일괄 삭제 버튼 (선택된 항목이 있을 때만 보임) --- */}
                {selectedContactIds.length > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                        <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={handleBulkDelete}>
                            {selectedContactIds.length}개 삭제
                        </Button>
                    </Box>
                )}
                
                {/* --- Tag Filters --- */}
                <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                    <Chip label="전체" color={selectedTags.length === 0 ? "primary" : "default"} onClick={clearTagFilter} clickable />
                    {allTags.map(tag => (
                        <Chip key={tag} label={tag} color={selectedTags.includes(tag) ? "primary" : "default"} onClick={() => toggleTagFilter(tag)} clickable />
                    ))}
                </Stack>

                {/* --- Contacts Table --- */}
                <TableContainer component={Paper} variant="outlined">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox checked={isAllSelected} indeterminate={isIndeterminate} onChange={toggleAllContactsSelection} disabled={filteredContacts.length === 0} />
                                </TableCell>
                                <TableCell>이름</TableCell>
                                <TableCell>태그</TableCell>
                                <TableCell>휴대전화</TableCell>
                                <TableCell>이메일</TableCell>
                                <TableCell align="right">작업</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredContacts.length === 0 ? (
                                <TableRow><TableCell colSpan={6} align="center" sx={{ py: 5 }}>표시할 연락처가 없습니다.</TableCell></TableRow>
                            ) : (
                                filteredContacts.map((contact) => (
                                <TableRow key={contact.id} hover selected={selectedContactIds.includes(contact.id)}>
                                    <TableCell padding="checkbox">
                                        <Checkbox checked={selectedContactIds.includes(contact.id)} onChange={() => toggleContactSelection(contact.id)} />
                                    </TableCell>
                                    <TableCell>{contact.name}</TableCell>
                                    <TableCell>{contact.tag || '-'}</TableCell>
                                    <TableCell>{contact.phoneNumber}</TableCell>
                                    <TableCell>{contact.email}</TableCell>
                                    <TableCell align="right">
                                        <IconButton size="small" onClick={(e) => handleMenuOpen(e, contact)}><MoreVertIcon fontSize="small" /></IconButton>
                                    </TableCell>
                                </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </PageLayout>

        {/* --- Modals & Menu (이 부분은 UI에 직접 나타나지 않으므로 PageLayout 밖에 있어도 괜찮습니다) --- */}
        <ContactFormModal 
            open={isAddModalOpen}
            onClose={() => setAddModalOpen(false)}
            onSave={handleAddContact}
            contact={{ name: '', phoneNumber: '', email: '', tag: '' }}
            title="새로운 연락처 등록"
            allTags={allTags}
        />
        <ContactFormModal 
            open={isEditModalOpen}
            onClose={() => setEditModalOpen(false)}
            onSave={handleUpdateContact}
            contact={editingContact}
            title="연락처 정보 수정"
            allTags={allTags}
        />
        <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={handleOpenEditModal}><ListItemIcon><EditIcon fontSize="small" /></ListItemIcon><ListItemText>수정</ListItemText></MenuItem>
            <MenuItem onClick={handleDeleteContact} sx={{ color: 'error.main' }}><ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon><ListItemText>삭제</ListItemText></MenuItem>
        </Menu>
    </>
    );
};

export default ContactsPage;
