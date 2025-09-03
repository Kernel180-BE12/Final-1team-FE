import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper, Typography, Button, TextField, Avatar, IconButton, CircularProgress, List, ListItem, ListItemButton, ListItemText, ThemeProvider, createTheme, Divider, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

// --- 타입 정의 ---
type TemplateStyle = '기본형' | '이미지형' | '아이템리스트형';

interface BotResponse {
    id: number;
    type: 'bot' | 'user';
    content: string;
    options?: string[];
    template?: string;
    html_preview?: string;
    html_previews?: string[];
    templates?: string[];
}

// ... (이전과 동일한 스타일 컴포넌트들) ...
const PreviewContainer = styled(Paper)(({ theme }) => ({
    width: '340px',
    minHeight: '500px',
    borderRadius: '12px',
    overflow: 'hidden',
    fontFamily: "'Pretendard', 'Malgun Gothic', '맑은 고딕', sans-serif",
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    margin: '1em 0',
    display: 'flex',
    flexDirection: 'column',
}));
const Header = styled(Box)({ backgroundColor: '#FEE500', color: '#191919', padding: '12px 20px', fontWeight: 'bold', fontSize: '15px' });
const Content = styled(Box)({ backgroundColor: '#FFFFFF', padding: '24px', flexGrow: 1, display: 'flex', flexDirection: 'column' });
const ButtonContainer = styled(Box)(({ theme }) => ({ backgroundColor: '#FFFFFF', border: `1px solid ${theme.palette.divider}`, borderRadius: '8px', textAlign: 'center', padding: '14px 10px', fontSize: '16px', fontWeight: 'bold', color: '#333', cursor: 'pointer', marginTop: 'auto' }));
const ImageTypeIcon = styled(Box)({ fontSize: '64px', textAlign: 'center', margin: '20px 0' });
const BasicTypeListItem = styled(ListItem)({ padding: '4px 0', alignItems: 'flex-start' });
const ItemListHeader = styled(Box)({ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' });
const ItemListTitle = styled(Typography)({ fontSize: '24px', fontWeight: 'bold' });
const ItemListSubTitle = styled(Typography)({ fontSize: '15px', color: '#666' });
const Placeholder = styled('span')({
    color: '#007bff',
    fontWeight: 'bold',
    backgroundColor: 'rgba(0, 123, 255, 0.1)',
    padding: '2px 4px',
    borderRadius: '4px',
});

// ... (TemplatePreview 컴포넌트는 이전과 동일) ...
const renderTemplateWithPlaceholders = (text: string) => {
    const parts = text.split(/(#{\w+})/g);
    return (
        <React.Fragment>
            {parts.map((part, index) => {
                if (/#{\w+}/.test(part)) {
                    return <Placeholder key={index}>{part}</Placeholder>;
                }
                return part;
            })}
        </React.Fragment>
    );
};

const TemplatePreview = ({ templateContent, style = '기본형' }: { templateContent: string | null; style?: TemplateStyle }) => {
    if (!templateContent) { return <Typography color="text.secondary">미리보기 템플릿이 없습니다.</Typography>; }

    const lines = templateContent.trim().split('\n').map(l => l.trim()).filter(Boolean);

    const renderContent = () => {
        switch (style) {
            case '이미지형':
                return (
                    <>
                        <ImageTypeIcon>🚚</ImageTypeIcon>
                        <Typography variant="h5" sx={{ textAlign: 'center', fontWeight: 'bold', mb: 2 }}>{renderTemplateWithPlaceholders(lines[0] || '')}</Typography>
                        <Typography sx={{ textAlign: 'center', color: '#555', whiteSpace: 'pre-wrap', flexGrow: 1 }}>{renderTemplateWithPlaceholders(lines.slice(1, -1).join('\n'))}</Typography>
                    </>
                );
            case '아이템리스트형':
                const items: { key: string, value: string }[] = [];
                let body = ''; let isBodySection = false;
                lines.slice(2, -1).forEach(line => {
                    const match = line.match(/^([^\n:]+):\s*(.*)/);
                    if (match && !isBodySection) items.push({ key: match[1].trim(), value: match[2].trim() });
                    else { isBodySection = true; body += (body ? '\n' : '') + line; }
                });
                return (
                    <>
                        <ItemListHeader>
                            <Box><ItemListTitle>{renderTemplateWithPlaceholders(lines[0] || '')}</ItemListTitle><ItemListSubTitle>{renderTemplateWithPlaceholders(lines[1] || '')}</ItemListSubTitle></Box>
                            <Chip icon={<span style={{ fontSize: '20px' }}>🕒</span>} label="" variant="outlined" />
                        </ItemListHeader>
                        <Divider sx={{ my: 1 }} />
                        <List dense>
                            {items.map((item, i) => <ListItem key={i} disablePadding><ListItemText primary={<Typography variant="body2" color="text.secondary">{renderTemplateWithPlaceholders(item.key)}</Typography>} secondary={<Typography variant="body1" sx={{ fontWeight: 500 }}>{renderTemplateWithPlaceholders(item.value)}</Typography>} /></ListItem>)}
                        </List>
                        <Typography variant="body2" sx={{ mt: 2, flexGrow: 1, whiteSpace: 'pre-wrap' }}>{renderTemplateWithPlaceholders(body)}</Typography>
                    </>
                );
            case '기본형':
            default:
                const basicItems: { key: string, value: string }[] = [];
                const bodyLines: string[] = [];
                lines.slice(0, -1).forEach(line => {
                    const match = line.match(/▶\s*([^:]+):\s*(.*)/);
                    if (match) basicItems.push({ key: match[1].trim(), value: match[2].trim() });
                    else bodyLines.push(line);
                });
                return (
                    <>
                        <Typography variant="body1" sx={{ mb: 3, whiteSpace: 'pre-wrap' }}>{renderTemplateWithPlaceholders(bodyLines.join('\n'))}</Typography>
                        {basicItems.length > 0 && <List dense sx={{ flexGrow: 1 }}>{basicItems.map((item, i) => <BasicTypeListItem key={i}><Typography variant="body2" sx={{ minWidth: '80px', color: 'text.secondary' }}>{renderTemplateWithPlaceholders(item.key)}</Typography><Typography variant="body2" sx={{ fontWeight: '500' }}>{renderTemplateWithPlaceholders(item.value)}</Typography></BasicTypeListItem>)}</List>}
                    </>
                );
        }
    };

    const buttonTemplate = lines.length > 1 ? lines[lines.length - 1] : "버튼";

    return (<PreviewContainer><Header>알림톡 도착</Header><Content>{renderContent()}<ButtonContainer>{renderTemplateWithPlaceholders(buttonTemplate)}</ButtonContainer></Content></PreviewContainer>);
};


// --------------------------------------------------------------------------
//  SuggestionPage 컴포넌트 (메인 UI)
// --------------------------------------------------------------------------
export default function SuggestionPage() {
    const [conversation, setConversation] = useState<BotResponse[]>([
        { id: Date.now(), type: 'bot', content: '안녕하세요! 템플릿 생성을 도와드릴게요. 어떤 템플릿을 만들어드릴까요?' },
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionState, setSessionState] = useState({});
    const [livePreviewContent, setLivePreviewContent] = useState<string | null>(null);
    const [livePreviewHtml, setLivePreviewHtml] = useState<string | null>(null);
    const [selectedOption, setSelectedOption] = useState<string>('');
    const [currentStyle, setCurrentStyle] = useState<TemplateStyle>('기본형');
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [conversation]);

    // --- [수정된 부분 1] ---
    // 백엔드와 통신하는 로직을 별도의 함수로 분리합니다.
    const callChatApi = async (message: string, currentState: object) => {
        setIsLoading(true);
        try {
            const res = await fetch('http://localhost:8000/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message, state: currentState }) });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.response || '서버에서 오류가 발생했습니다.');
            }
            const data = await res.json();
            if (!data.success) throw new Error(data.response);

            const botMessage: BotResponse = {
                id: Date.now() + 1,
                type: 'bot',
                content: data.response,
                options: data.options,
                template: data.template,
                html_preview: data.html_preview,
                html_previews: data.html_previews,
                templates: data.templates
            };

            setConversation(prev => [...prev, botMessage]);
            setSessionState(data.state);

            if (data.state && data.state.selected_style) {
                setCurrentStyle(data.state.selected_style);
            }

            // --- 미리보기 로직 ---
            if (botMessage.html_preview) {
                setLivePreviewHtml(botMessage.html_preview);
                setLivePreviewContent(null);
            } else if (botMessage.html_previews && botMessage.html_previews.length > 0) {
                setLivePreviewHtml(botMessage.html_previews[0]);
                setLivePreviewContent(null);
                if (botMessage.options && botMessage.options.length > 0) setSelectedOption(botMessage.options[0]);
            } else if (botMessage.templates && botMessage.templates.length > 0) {
                setLivePreviewContent(botMessage.templates[0]);
                setLivePreviewHtml(null);
                if (botMessage.options && botMessage.options.length > 0) setSelectedOption(botMessage.options[0]);
            }

            // --- 자동 진행 로직 ---
            // 백엔드가 보낸 메시지에 특정 키워드가 포함되어 있으면, 1.5초 후 자동으로 다음 단계를 진행합니다.
            if (data.response.includes("AI가 자동으로 수정하겠습니다.")) {
                setTimeout(() => {
                    // "진행"이라는 메시지를 백엔드로 보내 다음 프로세스를 트리거합니다.
                    callChatApi("진행", data.state);
                }, 1500);
            }

        } catch (error) {
            setConversation(prev => [...prev, { id: Date.now() + 1, type: 'bot', content: `오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}` }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = async (message: string) => {
        if (!message.trim() || isLoading) return;
        setConversation(prev => [...prev, { id: Date.now(), type: 'user', content: message }]);
        setInputValue('');
        setSelectedOption('');
        await callChatApi(message, sessionState);
    };
    // --- [수정 끝] ---

    const handleOptionClick = (option: string, message: BotResponse) => {
        setSelectedOption(option);
        if (message.options) {
            const idx = message.options.indexOf(option);
            if (idx !== -1) {
                if (message.html_previews && idx < message.html_previews.length) {
                    setLivePreviewHtml(message.html_previews[idx]);
                    setLivePreviewContent(null);
                }
                else if (message.templates && idx < message.templates.length) {
                    setLivePreviewContent(message.templates[idx]);
                    setLivePreviewHtml(null);
                }
            }
        }
    };

    const theme = createTheme({ typography: { fontFamily: "'Pretendard', sans-serif" } });

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: 'flex', gap: 4, p: 4, height: '100vh', boxSizing: 'border-box', bgcolor: '#f4f6f8' }}>
                <Paper variant="outlined" sx={{ width: '50%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto' }}>
                        {conversation.map(msg => (
                            <Box key={msg.id} sx={{ display: 'flex', justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start', mb: 2 }}>
                                <Box sx={{ display: 'flex', gap: 1.5, maxWidth: '90%', flexDirection: msg.type === 'user' ? 'row-reverse' : 'row' }}>
                                    <Avatar sx={{ bgcolor: msg.type === 'user' ? 'primary.main' : '#FEE500', color: '#191919' }}>
                                        { msg.type === 'user' ? <AccountCircleIcon /> : <SmartToyIcon /> }
                                    </Avatar>
                                    <Paper sx={{ p: 1.5, borderRadius: '12px', bgcolor: msg.type === 'user' ? '#4dabf7' : '#f1f3f5', color: msg.type === 'user' ? 'white' : 'black' }}>
                                        <Typography sx={{ whiteSpace: 'pre-wrap' }}>{msg.content}</Typography>

                                        {/* --- [수정된 부분 2]: 버튼 로직 변경 --- */}
                                        {msg.options && !msg.template && (
                                            <Box sx={{ mt: 1.5 }}>
                                                <List dense>
                                                    {msg.options.map(opt => (
                                                        <ListItemButton key={opt} selected={selectedOption === opt} onClick={() => handleOptionClick(opt, msg)}>
                                                            <ListItemText primary={opt} />
                                                        </ListItemButton>
                                                    ))}
                                                </List>
                                                <Button
                                                    variant="contained"
                                                    fullWidth
                                                    sx={{ mt: 1 }}
                                                    onClick={() => handleSendMessage(selectedOption)}
                                                    disabled={!selectedOption}
                                                >
                                                    {/* 버튼 텍스트를 동적으로 변경합니다. */}
                                                    {msg.content.includes("AI가 자동으로 수정하겠습니다.") ? "자동 수정 진행 중..." : "선택 완료"}
                                                </Button>
                                            </Box>
                                        )}
                                        {/* --- [수정 끝] --- */}


                                        {msg.template && (
                                            <Box sx={{ mt: 2, p: 2, bgcolor: '#e8f5e8', borderRadius: '8px' }}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>✅ 완성된 템플릿:</Typography>
                                                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                                                    {msg.template}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Paper>
                                </Box>
                            </Box>
                        ))}
                        {isLoading && <CircularProgress sx={{ display: 'block', mx: 'auto' }} />}
                        <div ref={chatEndRef} />
                    </Box>
                    <Box component="form" onSubmit={e => { e.preventDefault(); handleSendMessage(inputValue); }} sx={{ p: 2, borderTop: '1px solid #e0e0e0', display: 'flex', gap: 1 }}>
                        <TextField fullWidth size="small" placeholder="메시지 입력..." value={inputValue} onChange={e => setInputValue(e.target.value)} disabled={isLoading} />
                        <IconButton color="primary" type="submit" disabled={isLoading || !inputValue.trim()}><SendIcon /></IconButton>
                    </Box>
                </Paper>

                <Box sx={{ width: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                    {(livePreviewContent || livePreviewHtml) && (
                        <>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>실시간 미리보기</Typography>
                            {livePreviewHtml ? (
                                <Box dangerouslySetInnerHTML={{ __html: livePreviewHtml }} />
                            ) : (
                                <TemplatePreview templateContent={livePreviewContent} style={currentStyle} />
                            )}
                        </>
                    )}
                </Box>
            </Box>
        </ThemeProvider>
    );
}