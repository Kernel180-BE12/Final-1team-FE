import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Typography,
    Paper,
    Button,
    TextField,
    Avatar,
    IconButton,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

// --- 인터페이스 및 헬퍼 함수 (이전과 동일) ---
interface EditableVariables {
    parameterized_template: string;
    variables: { name: string; original_value: string; description: string; }[];
}

interface BotResponse {
    id: number;
    type: 'bot' | 'user';
    content: string;
    timestamp: Date;
    options?: string[];
    template?: string;
    html_preview?: string;
    editable_variables?: EditableVariables | null;
    templates?: string[];
    previews?: string[];
}

const generatePreviewHtml = (templateString: string): string => {
    if (!templateString) { return "<span>미리보기를 생성할 템플릿이 없습니다.</span>"; }
    const lines = templateString.trim().split('\n').map(l => l.trim()).filter(l => l);
    if (lines.length === 0) { return "<span>미리보기를 생성할 템플릿이 없습니다.</span>"; }
    const title = lines[0];
    const button_text = lines.length > 1 ? lines[lines.length - 1] : "버튼";
    const body_lines: string[] = [];
    const note_lines: string[] = [];
    const contentLines = lines.length > 1 ? lines.slice(1, -1) : [];
    contentLines.forEach(line => {
        if (line.startsWith('*')) { note_lines.push(line); } else { body_lines.push(line); }
    });
    let body = body_lines.join('\n');
    let note = note_lines.join('\n');
    body = body.replace(/(#{\w+})/g, '<span class="placeholder">$1</span>');
    note = note.replace(/(#{\w+})/g, '<span class="placeholder">$1</span>');
    return `
    <div class="template-preview">
        <div class="header">알림톡 도착</div>
        <div class="content">
            <div class="icon">📄</div>
            <h2 class="title">${title}</h2>
            <div class="body-text">${body}</div>
            <div class="note-text">${note}</div>
            <div class="button-container"><span>${button_text}</span></div>
        </div>
    </div>
    <style>
        .template-preview { max-width: 350px; border-radius: 8px; overflow: hidden; font-family: 'Malgun Gothic', '맑은 고딕', sans-serif; border: 1px solid #e0e0e0; margin: 1em 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .template-preview .header { background-color: #F0CA4F; color: #333; padding: 10px 15px; font-weight: bold; font-size: 14px; }
        .template-preview .content { background-color: #E6ECF2; padding: 25px 20px; position: relative; }
        .template-preview .icon { position: absolute; top: 25px; right: 20px; font-size: 36px; opacity: 0.5; }
        .template-preview .title { font-size: 24px; font-weight: bold; margin: 0 0 20px; padding-right: 40px; color: #333; }
        .template-preview .body-text, .template-preview .note-text { white-space: pre-wrap; }
        .template-preview .body-text { font-size: 15px; line-height: 1.6; color: #555; margin-bottom: 20px; }
        .template-preview .note-text { font-size: 13px; line-height: 1.5; color: #777; margin-bottom: 25px; }
        .template-preview .placeholder { color: #007bff; font-weight: bold; }
        .template-preview .button-container { background-color: #FFFFFF; border: 1px solid #d0d0d0; border-radius: 5px; text-align: center; padding: 12px 10px; font-size: 15px; font-weight: bold; color: #007bff; cursor: pointer; }
    </style>
    `;
};

const EditVariablesModal = ({ open, onClose, editableVariables, onSave }: { open: boolean; onClose: () => void; editableVariables: EditableVariables; onSave: (newTemplate: string, newVariables: EditableVariables) => void; }) => {
    const [editedValues, setEditedValues] = useState<{ [key: string]: string }>({});
    useEffect(() => {
        const initialValues: { [key: string]: string } = {};
        if (editableVariables?.variables) { editableVariables.variables.forEach(v => { initialValues[v.name] = v.original_value; }); }
        setEditedValues(initialValues);
    }, [editableVariables, open]);
    const handleValueChange = (variableName: string, value: string) => { setEditedValues(prev => ({ ...prev, [variableName]: value })); };
    const handleSaveChanges = () => {
        let newTemplate = editableVariables.parameterized_template;
        const newVariables = JSON.parse(JSON.stringify(editableVariables.variables));
        for (const key in editedValues) {
            newTemplate = newTemplate.replace(new RegExp(`#\\{${key}\\}`, 'g'), editedValues[key]);
            const variableToUpdate = newVariables.find((v: { name: string; }) => v.name === key);
            if(variableToUpdate) { variableToUpdate.original_value = editedValues[key]; }
        }
        const newEditableVariables: EditableVariables = { parameterized_template: editableVariables.parameterized_template, variables: newVariables };
        onSave(newTemplate, newEditableVariables);
        onClose();
    };
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>템플릿 변수 수정</DialogTitle>
            <DialogContent dividers>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                    {editableVariables.variables.map((variable) => (
                        <TextField key={variable.name} label={`${variable.description} (#${variable.name})`} size="small" value={editedValues[variable.name] || ''} onChange={(e) => handleValueChange(variable.name, e.target.value)} />
                    ))}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>취소</Button>
                <Button onClick={handleSaveChanges} variant="contained">저장하기</Button>
            </DialogActions>
        </Dialog>
    );
};

const FinalTemplateMessage = ({ botMessage, onEdit }: { botMessage: BotResponse, onEdit: () => void }) => {
    if (!botMessage.html_preview) return null;
    return (
        <Box>
            <div dangerouslySetInnerHTML={{ __html: botMessage.html_preview }} />
            {botMessage.editable_variables && (
                <Button variant="outlined" size="small" onClick={onEdit} sx={{ mt: 1.5, float: 'right' }}>
                    템플릿 수정하기
                </Button>
            )}
        </Box>
    );
};

export default function SuggestionPage() {
    const [conversation, setConversation] = useState<BotResponse[]>([
        { id: Date.now(), type: 'bot', content: '안녕하세요! 알림톡 템플릿 생성 도우미입니다. 🤖\n\n어떤 알림톡 템플릿을 만들어드릴까요?', timestamp: new Date() },
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionState, setSessionState] = useState({});
    const [livePreviewHtml, setLivePreviewHtml] = useState('');
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [editingMessage, setEditingMessage] = useState<BotResponse | null>(null);
    const [selectedOption, setSelectedOption] = useState<string>('');

    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversation]);

    const handleSendMessage = async (message: string) => {
        if (!message.trim()) return;

        const userMessage: BotResponse = { id: Date.now(), type: 'user', content: message, timestamp: new Date() };
        setConversation((prev) => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);
        setSelectedOption('');

        try {
            const response = await fetch('http://localhost:8000/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message, state: sessionState }) });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();

            if (data.success) {
                const botMessage: BotResponse = {
                    id: Date.now() + 1,
                    type: 'bot',
                    content: data.response,
                    timestamp: new Date(),
                    options: data.options || [],
                    template: data.template || '',
                    html_preview: data.html_preview || '',
                    editable_variables: data.editable_variables || null,
                    templates: data.templates || [],
                    previews: data.previews || [],
                };
                setConversation((prev) => [...prev, botMessage]);
                setSessionState(data.state);

                if (botMessage.previews && botMessage.previews.length > 0) {
                    const firstOption = botMessage.options?.[0] || '';
                    setSelectedOption(firstOption);
                    setLivePreviewHtml(botMessage.previews[0]);
                } else if (botMessage.html_preview) {
                    setLivePreviewHtml(botMessage.html_preview);
                }

            } else {
                throw new Error(data.error || 'Unknown error occurred');
            }
        } catch (error) {
            const errorMessage: BotResponse = { id: Date.now() + 1, type: 'bot', content: `오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`, timestamp: new Date() };
            setConversation((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOptionClick = (option: string, message: BotResponse) => {
        setSelectedOption(option);
        const selectedIndex = message.options?.indexOf(option);
        if (selectedIndex !== undefined && selectedIndex !== -1 && message.previews) {
            if (selectedIndex < message.previews.length) {
                setLivePreviewHtml(message.previews[selectedIndex]);
            } else {
                setLivePreviewHtml('');
            }
        }
    };

    const handleConfirmSelection = () => {
        if (selectedOption) {
            handleSendMessage(selectedOption);
        }
    };

    const openEditModal = (message: BotResponse) => { setEditingMessage(message); setEditModalOpen(true); };
    const handleSaveChanges = (newTemplate: string, newVariables: EditableVariables) => {
        if (!editingMessage) return;
        const newHtmlPreview = generatePreviewHtml(newTemplate);
        setConversation(prev => prev.map(msg => msg.id === editingMessage.id ? { ...msg, template: newTemplate, editable_variables: newVariables, html_preview: newHtmlPreview } : msg ));
        setLivePreviewHtml(newHtmlPreview);
    };
    const handleFormSubmit = (e: React.FormEvent) => { e.preventDefault(); handleSendMessage(inputValue); };

    return (
        <>
            <Box sx={{ display: 'flex', gap: 4, height: 'calc(100vh - 128px)' }}>
                <Paper variant="outlined" sx={{ width: '50%', display: 'flex', flexDirection: 'column', borderColor: '#e0e0e0' }}>
                    <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto' }}>
                        {conversation.map((msg) => (
                            <Box key={msg.id} sx={{ display: 'flex', justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start', mb: 2 }}>
                                <Box sx={{ display: 'flex', gap: 1.5, maxWidth: '90%', flexDirection: msg.type === 'user' ? 'row-reverse' : 'row' }}>
                                    <Avatar sx={{ bgcolor: msg.type === 'user' ? 'primary.main' : '#fbbf24' }}>
                                        {msg.type === 'user' ? <AccountCircleIcon /> : <SmartToyIcon />}
                                    </Avatar>
                                    <Paper sx={{ p: 1.5, borderRadius: '12px', bgcolor: msg.type === 'user' ? 'primary.main' : '#f1f3f5', color: msg.type === 'user' ? 'white' : 'black', width: '100%' }}>
                                        {msg.type === 'bot' && msg.html_preview ? (
                                            <FinalTemplateMessage botMessage={msg} onEdit={() => openEditModal(msg)} />
                                        ) : (
                                            <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                                {msg.content}
                                            </Typography>
                                        )}

                                        {msg.options && msg.options.length > 0 && !msg.html_preview && (
                                            <Box sx={{ mt: 1.5 }}>
                                                <List disablePadding>
                                                    {msg.options.map((option) => (
                                                        <ListItem key={option} disablePadding>
                                                            <ListItemButton
                                                                selected={selectedOption === option}
                                                                onClick={() => handleOptionClick(option, msg)}
                                                            >
                                                                <ListItemText primary={option} />
                                                            </ListItemButton>
                                                        </ListItem>
                                                    ))}
                                                </List>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    size="medium"
                                                    fullWidth
                                                    sx={{ mt: 1.5 }}
                                                    onClick={handleConfirmSelection}
                                                    disabled={!selectedOption}
                                                >
                                                    진행
                                                </Button>
                                            </Box>
                                        )}
                                    </Paper>
                                </Box>
                            </Box>
                        ))}
                        {isLoading && (
                            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}><Box sx={{ display: 'flex', gap: 1.5 }}><Avatar sx={{ bgcolor: '#fbbf24' }}><SmartToyIcon /></Avatar><Paper sx={{ p: 1.5, borderRadius: '12px', bgcolor: '#f1f3f5' }}><CircularProgress size={20} /></Paper></Box></Box>
                        )}
                        <div ref={chatEndRef} />
                    </Box>
                    <Box component="form" onSubmit={handleFormSubmit} sx={{ p: 2, borderTop: '1px solid #e0e0e0', display: 'flex', gap: 1 }}>
                        <TextField fullWidth variant="outlined" size="small" placeholder="메시지를 입력하세요..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} disabled={isLoading} />
                        <IconButton color="primary" type="submit" disabled={isLoading || !inputValue.trim()}><SendIcon /></IconButton>
                    </Box>
                </Paper>
                <Box sx={{ width: '50%', display: 'flex', flexDirection: 'column' }}>
                    <Paper variant="outlined" sx={{ flexGrow: 1, p: 2, borderColor: '#e0e0e0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        {livePreviewHtml ? (
                            <div dangerouslySetInnerHTML={{ __html: livePreviewHtml }} />
                        ) : (
                            <Typography variant="h6" color="text.secondary">템플릿 미리보기</Typography>
                        )}
                    </Paper>
                </Box>
            </Box>
            {editingMessage && editingMessage.editable_variables && (
                <EditVariablesModal open={isEditModalOpen} onClose={() => setEditModalOpen(false)} editableVariables={editingMessage.editable_variables} onSave={handleSaveChanges} />
            )}
        </>
    );
};

