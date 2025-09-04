import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper, Typography, Button, TextField, Avatar, IconButton, CircularProgress, Stack, ThemeProvider, createTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';

// --- 타입 정의 ---
interface StructuredTemplate {
    title: string;
    body: string;
    image_url?: string | null;
    buttons?: [string, string][] | null;
}

interface BotResponse {
    id: number;
    type: 'bot' | 'user';
    content: string;
    timestamp: string;
    templates?: StructuredTemplate[];
    selected_template_id?: number | null;
    options?: string[];
}

// [추가] 프론트엔드에 미리 정의해두는 스타일 뼈대 데이터
const STYLE_SKELETONS: { [key: string]: StructuredTemplate } = {
    '기본형': {
        title: '[제목이 여기에 표시됩니다]',
        body: '고객에게 전달될 메시지 본문입니다.\n변수 #{고객명} 등을 사용하여 개인화된 메시지를 보낼 수 있습니다.',
        buttons: [['웹사이트', '자세히 보기']]
    },
    '이미지형': {
        title: '[시선을 끄는 이미지 위 제목]',
        body: '이미지와 함께 전달될 메시지 본문입니다. 상품이나 이벤트를 시각적으로 강조할 때 유용합니다.',
        image_url: 'https://via.placeholder.com/1024x512.png?text=Image+Preview',
        buttons: [['웹사이트', '더 알아보기']]
    },
    '아이템리스트형': {
        title: '[주문 내역, 상품 목록 등]',
        body: '여러 항목을 목록 형태로 전달할 때 사용합니다.\n- 상품명: #{상품명}\n- 주문번호: #{주문번호}\n- 배송 상태: #{배송상태}',
        buttons: [['웹사이트', '배송 조회하기']]
    }
};

// --- 스타일 컴포넌트들 ---
const Placeholder = styled('span')({ color: '#007bff', fontWeight: 'bold', backgroundColor: 'rgba(0, 123, 255, 0.1)', padding: '2px 4px', borderRadius: '4px' });

// --- 초기 화면 안내 컴포넌트 ---
const EmptyChatPlaceholder = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', textAlign: 'center', p: 3 }}>
        <Avatar sx={{ bgcolor: '#FEE500', color: '#191919', width: 56, height: 56, mb: 2 }}><SmartToyOutlinedIcon fontSize="large" /></Avatar>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}>무엇을 도와드릴까요?</Typography>
        <Typography sx={{ mb: 3, maxWidth: '600px', color: '#4B5563' }}>원하는 알림톡 내용을 자유롭게 작성해보세요.</Typography>
    </Box>
);

// --- 템플릿 미리보기 컴포넌트 ---
const TemplatePreview = ({ template }: { template: StructuredTemplate }) => {
    const { title, body, image_url, buttons } = template;
    return (
        <Paper sx={{ flex: 1, borderRadius: '20px', overflow: 'hidden', border: '1px solid #e0e0e0', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ backgroundColor: '#FEE500', color: '#191919', p: '12px 20px', fontWeight: 'bold', fontSize: '15px' }}>알림톡 도착</Box>
            <Box sx={{ p: 3, bgcolor: 'white', flex: 1, display: 'flex', flexDirection: 'column' }}>
                {image_url && <Box component="img" src={image_url} alt="Preview" sx={{ mb: 2, maxWidth: '100%', borderRadius: '8px' }} />}
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>{renderTemplateWithPlaceholders(title)}</Typography>
                <Typography component="div" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, flex: 1 }}>{renderTemplateWithPlaceholders(body)}</Typography>
                {buttons && buttons.length > 0 && (
                    <Stack spacing={1} sx={{ mt: 2 }}>
                        {buttons.map(([type, text], index) => (
                            <Box key={index} sx={{ border: '1px solid #e0e0e0', borderRadius: '8px', textAlign: 'center', p: '14px 10px', fontSize: '16px', fontWeight: '500', color: '#333' }}>
                                {renderTemplateWithPlaceholders(text)}
                            </Box>
                        ))}
                    </Stack>
                )}
            </Box>
        </Paper>
    );
};

const renderTemplateWithPlaceholders = (text: string) => (
    <>{text.split(/(#{\w+})/g).map((part, index) => (/#{\w+}/.test(part) ? <Placeholder key={index}>{part}</Placeholder> : part))}</>
);

// [추가] 스타일 선택 UI 컴포넌트
const StyleSelector = ({ msg, onStyleSelect, onConfirm, selectedStyle }: { msg: BotResponse, onStyleSelect: (style: string) => void, onConfirm: (style: string) => void, selectedStyle: string | null }) => {
    if (!msg.options || msg.options.length === 0) return null;

    return (
        <Paper elevation={1} sx={{ p: 2, mt: 1, bgcolor: '#f9f9f9', borderRadius: '12px' }}>
            <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 'bold', color: 'text.secondary' }}>스타일 선택하여 미리보기</Typography>
            <Stack spacing={1}>
                {msg.options.map((option, index) => (
                    <Button
                        key={index}
                        variant={selectedStyle === option ? "contained" : "outlined"}
                        onClick={() => onStyleSelect(option)}
                        sx={{ justifyContent: 'flex-start', textTransform: 'none', textAlign: 'left' }}
                    >
                        {option}
                    </Button>
                ))}
            </Stack>
            <Button
                variant="contained"
                sx={{ mt: 2, width: '100%' }}
                onClick={() => onConfirm(selectedStyle!)}
                disabled={!selectedStyle}
            >
                이 스타일로 진행하기
            </Button>
        </Paper>
    );
};


// --------------------------------------------------------------------------
//  메인 UI 컴포넌트
// --------------------------------------------------------------------------
export default function SuggestionPage() {
    const [conversation, setConversation] = useState<BotResponse[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionState, setSessionState] = useState({ step: 'initial' });
    const [livePreviewTemplate, setLivePreviewTemplate] = useState<StructuredTemplate | null>(null);
    const [selectedStyle, setSelectedStyle] = useState<string | null>(null); // [추가] 현재 선택된 스타일 미리보기 상태
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [conversation]);

    const getCurrentTime = () => new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });

    const callChatApi = async (message: string, currentState: object) => {
        setIsLoading(true);
        setLivePreviewTemplate(null); // API 호출 시작 시 미리보기 초기화
        try {
            const res = await fetch('http://localhost:8000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message, state: currentState } ),
            });
            if (!res.ok) throw new Error((await res.json()).response || '서버 오류');
            const data = await res.json();
            if (!data.success) throw new Error(data.response);

            setConversation(prev => [...prev, {
                id: Date.now() + 1,
                type: 'bot',
                content: data.response,
                timestamp: getCurrentTime(),
                templates: data.structured_templates,
                options: data.options,
                selected_template_id: null,
            }]);

            setSessionState(data.state);

            if (data.structured_template) {
                setLivePreviewTemplate(data.structured_template);
            }

            if (data.response.includes("AI가 자동으로 수정하겠습니다.")) {
                setTimeout(() => callChatApi("진행", data.state), 1500);
            }
        } catch (error) {
            setConversation(prev => [...prev, { id: Date.now() + 1, type: 'bot', content: `오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`, timestamp: getCurrentTime() }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = async (message: string) => {
        if (!message.trim() || isLoading) return;
        const userMessage = message;
        setInputValue('');

        setConversation(prev => {
            const newConversation = prev.map(msg => ({ ...msg, templates: undefined, options: undefined }));
            return [...newConversation, { id: Date.now(), type: 'user', content: userMessage, timestamp: getCurrentTime() }];
        });

        // [수정] 스타일 선택 상태 초기화
        setSelectedStyle(null);
        await callChatApi(userMessage, sessionState);
    };

    const handleTemplateSelect = (messageId: number, templateIndex: number, template: StructuredTemplate) => {
        setConversation(prev => prev.map(msg =>
            msg.id === messageId ? { ...msg, selected_template_id: templateIndex } : msg
        ));
        setLivePreviewTemplate(template);
    };

    const handleConfirmSelection = (messageId: number) => {
        const message = conversation.find(msg => msg.id === messageId);
        if (!message || message.selected_template_id === null || message.selected_template_id === undefined) return;

        const messageToSend = `템플릿 ${message.selected_template_id + 1}`;
        handleSendMessage(messageToSend);
    };

    // [추가] 스타일 선택 미리보기 핸들러
    const handleStyleSelect = (style: string) => {
        setSelectedStyle(style);
        setLivePreviewTemplate(STYLE_SKELETONS[style]);
    };

    // [추가] 스타일 확정 및 서버 전송 핸들러
    const handleConfirmStyle = (style: string) => {
        handleSendMessage(style);
    };

    const theme = createTheme({ typography: { fontFamily: "'Pretendard', sans-serif" } });

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: 'flex', gap: 3, height: 'calc(100vh - 64px)', p: 2 }}>
                {/* 왼쪽: AI와 대화하는 패널 */}
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, border: '1px solid #e0e0e0', borderRadius: '12px', overflow: 'hidden' }}>
                    <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
                        {conversation.length === 0 ? <EmptyChatPlaceholder /> : conversation.map(msg => (
                            <Box key={msg.id} sx={{ mb: 2, display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
                                {msg.type === 'bot' && <Avatar sx={{ bgcolor: '#FEE500', color: '#191919', mr: 1.5 }}><SmartToyOutlinedIcon /></Avatar>}
                                {msg.type === 'user' && <Box sx={{ width: 54 }} />}

                                <Box sx={{ width: '100%', ml: msg.type === 'user' ? 'auto' : 0, display: 'flex', flexDirection: msg.type === 'user' ? 'row-reverse' : 'column' }}>
                                    <Paper elevation={0} sx={{ p: '10px 14px', borderRadius: msg.type === 'user' ? '18px 18px 4px 18px' : '4px 18px 18px 18px', bgcolor: msg.type === 'user' ? '#FEE500' : '#f0f0f0', color: msg.type === 'user' ? '#191919' : 'text.primary', whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxWidth: 'fit-content' }}>
                                        <Typography variant="body2">{msg.content}</Typography>
                                    </Paper>

                                    {/* 추천 템플릿 UI */}
                                    {msg.type === 'bot' && msg.templates && msg.templates.length > 0 && (
                                        <Paper elevation={1} sx={{ p: 2, mt: 1, bgcolor: '#f9f9f9', borderRadius: '12px' }}>
                                            <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 'bold', color: 'text.secondary' }}>추천 템플릿 선택</Typography>
                                            <Stack spacing={1}>
                                                {msg.templates.map((template, index) => (
                                                    <Button key={index} variant={msg.selected_template_id === index ? "contained" : "outlined"} onClick={() => handleTemplateSelect(msg.id, index, template)} sx={{ justifyContent: 'flex-start', textTransform: 'none', textAlign: 'left' }}>
                                                        {template.title}
                                                    </Button>
                                                ))}
                                                <Button variant="outlined" size="small" onClick={() => handleSendMessage('새로 만들기')} sx={{ mt: 1 }}>새로 만들기</Button>
                                            </Stack>
                                            <Button variant="contained" sx={{ mt: 2, width: '100%' }} onClick={() => handleConfirmSelection(msg.id)} disabled={msg.selected_template_id === null}>선택한 템플릿으로 진행</Button>
                                        </Paper>
                                    )}

                                    {/* [수정] 새로운 스타일 선택 UI 렌더링 */}
                                    {msg.type === 'bot' && msg.options && msg.options.length > 0 && (
                                        <StyleSelector
                                            msg={msg}
                                            selectedStyle={selectedStyle}
                                            onStyleSelect={handleStyleSelect}
                                            onConfirm={handleConfirmStyle}
                                        />
                                    )}

                                    <Typography variant="caption" sx={{ display: 'block', textAlign: msg.type === 'user' ? 'right' : 'left', mt: 0.5, px: 1, color: 'text.secondary' }}>{msg.timestamp}</Typography>
                                </Box>
                            </Box>
                        ))}
                        {isLoading && <CircularProgress size={24} sx={{ display: 'block', mx: 'auto', my: 2 }} />}
                        <div ref={chatEndRef} />
                    </Box>

                    {/* 메시지 입력창 */}
                    <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
                        <Paper component="form" onSubmit={e => { e.preventDefault(); handleSendMessage(inputValue); }} sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%', borderRadius: '24px', border: '1px solid #ccc' }}>
                            <TextField fullWidth multiline maxRows={5} variant="standard" placeholder="메시지를 입력하세요..." value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyPress={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(inputValue); } }} sx={{ ml: 1, flex: 1 }} InputProps={{ disableUnderline: true }} />
                            <IconButton type="submit" color="primary" sx={{ p: '10px' }} disabled={isLoading || !inputValue.trim()}><SendIcon /></IconButton>
                        </Paper>
                    </Box>
                </Box>

                {/* 오른쪽: 미리보기 패널 */}
                <Stack spacing={2} sx={{ width: '480px', minWidth: '480px' }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>미리보기</Typography>
                        <Button variant="contained" sx={{ background: 'linear-gradient(to right, #6D28D9, #4F46E5)', borderRadius: '8px', fontWeight: 'bold', px: 3, py: 1 }} disabled={!livePreviewTemplate}>카톡 발송하기</Button>
                    </Stack>
                    {livePreviewTemplate ? <TemplatePreview template={livePreviewTemplate} /> : (
                        <Paper sx={{ flex: 1, borderRadius: '20px', border: '1px dashed #d1d5db', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'transparent' }}>
                            <Typography color="text.secondary">템플릿을 선택하면 여기에 미리보기가 표시됩니다.</Typography>
                        </Paper>
                    )}
                </Stack>
            </Box>
        </ThemeProvider>
    );
}