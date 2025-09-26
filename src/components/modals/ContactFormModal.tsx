// src/components/modals/ContactFormModal.tsx (새로운 파일)

import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Autocomplete, CircularProgress } from '@mui/material';
import type { NewContactPayload, Contact } from '../../store/useAppStore';

interface ContactFormModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (contact: NewContactPayload | Contact) => Promise<void>;
    contact: NewContactPayload | Contact | null;
    title: string;
    allTags: string[];
}

const ContactFormModal = ({ open, onClose, onSave, contact, title, allTags }: ContactFormModalProps) => {
    const [formData, setFormData] = useState(contact);
    const [errors, setErrors] = useState<Partial<NewContactPayload>>({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (open) {
            setFormData(contact); // 모달이 열릴 때마다 form 데이터 초기화
            setErrors({});
        }
    }, [open, contact]);

    if (!open || !formData) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleTagChange = (_event: React.SyntheticEvent, newValue: string | null) => {
        setFormData({ ...formData, tag: newValue || '' });
    };

    const validate = () => {
        const newErrors: Partial<NewContactPayload> = {};
        if (formData.name.trim().length < 2) newErrors.name = '이름은 2자 이상 입력해주세요.';
        const phoneRegex = /^010-\d{4}-\d{4}$/;
        if (!phoneRegex.test(formData.phoneNumber)) newErrors.phoneNumber = '휴대전화 형식이 올바르지 않습니다. (예: 010-1234-5678)';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email || !emailRegex.test(formData.email)) newErrors.email = '유효한 이메일 주소를 입력해주세요.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (validate()) {
            setIsSaving(true);
            try {
                await onSave(formData);
                onClose();
            // eslint-disable-next-line no-empty
            } catch {
            } finally {
                setIsSaving(false);
            }
        }
    };

    return (
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold' }}>{title}</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" name="name" label="이름" fullWidth value={formData.name} onChange={handleChange} error={!!errors.name} helperText={errors.name || ' '} />
                    <TextField margin="dense" name="phoneNumber" label="휴대전화" fullWidth value={formData.phoneNumber} onChange={handleChange} error={!!errors.phoneNumber} helperText={errors.phoneNumber || '-(하이픈)을 넣어서 입력해주세요.'} />
                    <TextField margin="dense" name="email" label="이메일" fullWidth value={formData.email} onChange={handleChange} error={!!errors.email} helperText={errors.email || ' '} />
                    <Autocomplete
                        freeSolo
                        options={allTags}
                        value={formData.tag}
                        onChange={handleTagChange}
                        onInputChange={(_event, newInputValue) => {
                            // 사용자가 직접 타이핑할 때도 상태가 업데이트되도록 함
                            setFormData({ ...formData, tag: newInputValue || '' });
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                margin="dense"
                                label="태그"
                                variant="outlined"
                                helperText="기존 태그를 선택하거나 새 태그를 입력하세요."
                            />
                        )}
                    />
                </DialogContent>
                <DialogActions sx={{ p: '16px 24px' }}>
                    <Button onClick={onClose} color="secondary" disabled={isSaving}>취소</Button>
                <Button onClick={handleSave} variant="contained" disabled={isSaving}>
                    {isSaving ? <CircularProgress size={24} color="inherit" /> : '저장'}
                </Button>
                </DialogActions>
            </Dialog>
        );
    };
    
    export default ContactFormModal;