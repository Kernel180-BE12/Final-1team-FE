import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper, Typography, Button, TextField, Avatar, IconButton, CircularProgress, Stack, ThemeProvider, createTheme, Divider } from '@mui/material';
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

// --- 상수 및 기본 데이터 (변경 없음) ---
const STYLE_SKELETONS: { [key: string]: StructuredTemplate } = { '기본형': { title: '[제목이 여기에 표시됩니다]', body: '고객에게 전달될 메시지 본문입니다.\n변수 #{고객명} 등을 사용하여 개인화된 메시지를 보낼 수 있습니다.', buttons: [['웹사이트', '자세히 보기']] }, '이미지형': { title: '[시선을 끄는 이미지 위 제목]', body: '이미지와 함께 전달될 메시지 본문입니다. 상품이나 이벤트를 시각적으로 강조할 때 유용합니다.', image_url: 'https://via.placeholder.com/1024x512.png?text=Image+Preview', buttons: [['웹사이트', '더 알아보기']] }, '아이템리스트형': { title: '[주문 내역, 상품 목록 등]', body: '여러 항목을 목록 형태로 전달할 때 사용합니다.\n- 상품명: #{상품명}\n- 주문번호: #{주문번호}\n- 배송 상태: #{배송상태}', buttons: [['웹사이트', '배송 조회하기']] } };

// --- 스타일 컴포넌트 (변경 없음) ---
const Placeholder = styled('span' )({ color: '#3b82f6', fontWeight: 'bold', backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: '2px 4px', borderRadius: '4px' });
const customTheme = createTheme({ typography: { fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', sans-serif", }, palette: { primary: { main: '#3b82f6', }, secondary: { main: '#64748b', }, background: { default: 'transparent', paper: 'rgba(255, 255, 255, 0.6)', }, text: { primary: '#0f172a', secondary: '#475569', } }, components: { MuiPaper: { styleOverrides: { root: { backdropFilter: 'blur(16px) saturate(180%)', border: '1px solid rgba(255, 255, 255, 0.2)', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)', borderRadius: '24px', background: 'rgba(255, 255, 255, 0.6)', } } }, MuiButton: { styleOverrides: { root: { textTransform: 'none', borderRadius: '12px', fontWeight: 600, boxShadow: 'none', transition: 'transform 0.1s ease-in-out', '&:active': { transform: 'scale(0.98)', } }, contained: { backgroundColor: '#3b82f6', '&:hover': { backgroundColor: '#2563eb', } }, outlined: { borderColor: 'rgba(255, 255, 255, 0.5)', color: '#334155', backgroundColor: 'rgba(255, 255, 255, 0.3)', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.5)', borderColor: 'rgba(255, 255, 255, 0.8)', } } } }, MuiAvatar: { styleOverrides: { root: { backgroundColor: 'rgba(255, 255, 255, 0.8)', color: '#1e293b', } } } } });
const InteractiveCard = styled(Paper)({});

// --- 유틸리티 및 헬퍼 컴포넌트 ---
const EmptyChatPlaceholder = ({ onExampleClick }: { onExampleClick: (text: string) => void }) => ( <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', textAlign: 'center', p: 3, color: 'text.secondary' }}> <Avatar sx={{ width: 72, height: 72, mb: 2, backgroundColor: 'rgba(255,255,255,0.7)' }}><SmartToyOutlinedIcon sx={{ fontSize: 36, color: '#475569' }} /></Avatar> <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}>AI 템플릿 만들기</Typography> <Typography sx={{ mb: 3, maxWidth: '600px' }}>원하는 알림톡 내용을 자유롭게 작성해보세요.</Typography> <Stack direction="row" spacing={1.5}> <Button variant="outlined" onClick={() => onExampleClick("배송 시작 알림톡 만들어줘")}>"배송 시작 알림톡"</Button> <Button variant="outlined" onClick={() => onExampleClick("신규 가입 환영 메시지")}>"신규 가입 환영 메시지"</Button> </Stack> </Box> );
const renderTemplateWithPlaceholders = (text: string) => ( <>{text.split(/(#{\w+})/g).map((part, index) => (/#{\w+}/.test(part) ? <Placeholder key={index}>{part}</Placeholder> : part))}</> );
const IPhoneKakaoPreview = ({ template }: { template: StructuredTemplate }) => { const { title, body, image_url, buttons } = template; const today = new Date(); const dateString = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`; return ( <Box sx={{ p: '12px', bgcolor: '#b2c7d9', fontFamily: 'sans-serif', height: '100%', display: 'flex', flexDirection: 'column' }}> <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}> <Typography sx={{ bgcolor: 'rgba(0,0,0,0.1)', color: '#fff', fontSize: '11px', fontWeight: 'bold', px: 1.5, py: 0.5, borderRadius: '12px' }}> {dateString} </Typography> </Box> <Box sx={{ display: 'flex', alignItems: 'flex-start' }}> <Avatar variant="rounded" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iYmxhY2siLz4KPHBhdGggZD0iTTExIDIwLjI0MDNMMjAuMjQwMyAxMUwyOS40ODAzIDIwLjI0MDNMMjAuMjQwMyAyOS4_NDgwMyTDExIDIwLjI0MDNaIiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfMjcxXzEwMzgpIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfMjcxXzEwMzgiIHgxPSIxMSIgeTE9IjExIiB4Mj0iMjkuNDgwMyIgeTI9IjI hallmarksIgeTI9IjI5LjQ4MDMiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iI0ZGRTgwQSIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY_Rvb3I9IiNGRkEyMDAiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K" sx={{ width: 40, height: 40, mr: 1, borderRadius: '14px' }} /> <Box sx={{ flex: 1 }}> <Typography sx={{ fontSize: '13px', fontWeight: 400, color: '#000', mb: 0.5 }}>자버 채널</Typography> <Paper sx={{ position: 'relative', borderRadius: '18px', borderTopLeftRadius: '4px', overflow: 'hidden', boxShadow: '0 1px 1px rgba(0,0,0,0.05)', maxWidth: '90%', p: 0, bgcolor: '#fff', backdropFilter: 'none', border: 'none' }}> <Box sx={{ content: '""', position: 'absolute', left: -7, top: 8, width: 0, height: 0, border: '8px solid transparent', borderLeft: 'none', borderRightColor: '#FFEB00' }} /> <Box sx={{ bgcolor: '#FFEB00', p: '10px 12px' }}> <Typography sx={{ fontSize: '12px', color: '#000', fontWeight: 'bold' }}>알림톡 도착</Typography> </Box> <Box sx={{ p: '16px' }}> {image_url && <Box component="img" src={image_url} alt="Preview" sx={{ mb: 1.5, width: '100%', borderRadius: '10px' }} />} <Typography variant="h6" sx={{ fontSize: '17px', fontWeight: 'bold', mb: 1, color: '#000' }}>{renderTemplateWithPlaceholders(title)}</Typography> <Typography component="div" sx={{ fontSize: '15px', whiteSpace: 'pre-wrap', lineHeight: 1.5, color: '#333' }}>{renderTemplateWithPlaceholders(body)}</Typography> </Box> {buttons && buttons.length > 0 && ( <Box sx={{ borderTop: '1px solid #f0f0f0' }}> {buttons.map(([ text], index) => ( <Box key={index} sx={{ textAlign: 'center', p: '14px 16px', fontSize: '15px', fontWeight: '500', color: '#555', cursor: 'pointer' }}> {renderTemplateWithPlaceholders(text)} </Box> ))} </Box> )} </Paper> </Box> </Box> </Box> ); };

// ▼▼▼ [수정된 부분 시작] ▼▼▼
const IPhoneMockup = ({ children }: { children: React.ReactNode }) => (
    <Paper sx={{
        width: '100%',
        height: '760px', // 실제 비율과 유사하도록 고정 높이 설정
        maxHeight: '100%', // 컨테이너를 벗어나지 않도록 설정
        borderRadius: '44px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        background: '#1c1c1e',
        border: '4px solid #d1d1d6',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)'
    }}>
        <Box sx={{ position: 'absolute', top: 4, left: '50%', transform: 'translateX(-50%)', width: '40%', height: '30px', bgcolor: '#1c1c1e', borderRadius: '0 0 16px 16px', zIndex: 2 }} />
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#b2c7d9', overflow: 'hidden' }}>
            <Box sx={{ p: '4px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#000', zIndex: 1, height: '44px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path></svg>
                <Typography sx={{ fontSize: '17px', fontWeight: '600' }}>자버 채널</Typography>
                <Box sx={{ display: 'flex', gap: '16px' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path></svg>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path></svg>
                </Box>
            </Box>
            <Box sx={{ flex: 1, overflowY: 'auto', '&::-webkit-scrollbar': { width: '8px', backgroundColor: 'transparent' }, '&::-webkit-scrollbar-thumb': { backgroundColor: 'transparent', borderRadius: '4px' }, '&:hover': { '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(0, 0, 0, 0.2)' } } }}>
                {children}
            </Box>
        </Box>
    </Paper>
);
// ▲▲▲ [수정된 부분 끝] ▲▲▲

interface OptionsPresenterProps {
    msg: BotResponse;
    onOptionSelect: (option: string) => void;
    selectedStyle: string | null;
    onStyleSelect: (style: string) => void;
}

const OptionsPresenter = ({ msg, onOptionSelect, selectedStyle, onStyleSelect }: OptionsPresenterProps) => {
    if (!msg.options || msg.options.length === 0) return null;

    const isStyleSelection = msg.options.includes('기본형') && msg.options.includes('이미지형') && msg.options.includes('아이템리스트형');

    // 스타일 선택 UI일 경우
    if (isStyleSelection) {
        return (
            <Paper elevation={0} sx={{ p: 2, mt: 1, bgcolor: 'rgba(255,255,255,0.4)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.2)' }}>
                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 'bold', color: '#475569' }}>스타일 선택</Typography>
                <Stack spacing={1}>
                    {msg.options.map((option, index) => (
                        <Button
                            key={index}
                            variant={selectedStyle === option ? "contained" : "outlined"}
                            onClick={() => onStyleSelect(option)}
                        >
                            {option}
                        </Button>
                    ))}
                </Stack>
                <Button
                    variant="contained"
                    fullWidth
                    disabled={!selectedStyle}
                    onClick={() => {
                        if (selectedStyle) {
                            onOptionSelect(selectedStyle);
                        }
                    }}
                    sx={{ mt: 2 }}
                >
                    클릭한 스타일로 진행하기
                </Button>
            </Paper>
        );
    }

    // 그 외 일반적인 옵션 UI (예: 예/아니오)
    let title = "옵션 선택";
    if (JSON.stringify(msg.options) === JSON.stringify(['예', '아니오'])) {
        title = "진행 여부 확인";
    }

    return (
        <Paper elevation={0} sx={{ p: 2, mt: 1, bgcolor: 'rgba(255,255,255,0.4)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.2)' }}>
            <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 'bold', color: '#475569' }}>{title}</Typography>
            <Stack spacing={1}>
                {msg.options.map((option, index) => (
                    <Button
                        key={index}
                        variant="outlined"
                        onClick={() => onOptionSelect(option)}
                    >
                        {option}
                    </Button>
                ))}
            </Stack>
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
    const [sessionState, setSessionState] = useState({});
    const [livePreviewTemplate, setLivePreviewTemplate] = useState<StructuredTemplate | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const [selectedStyleOption, setSelectedStyleOption] = useState<string | null>(null);

    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [conversation]);

    const getCurrentTime = () => new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });

    const callChatApi = async (message: string, currentState: object) => {
        setIsLoading(true);
        try {
            const res = await fetch('http://15.164.102.187:8000/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message, state: currentState } ) });
            if (!res.ok) throw new Error((await res.json()).detail || '서버 오류');
            const data = await res.json();
            if (!data.success) throw new Error(data.response);
            const newBotMessage: BotResponse = { id: Date.now() + 1, type: 'bot', content: data.response, timestamp: getCurrentTime(), templates: data.structured_templates, options: data.options, selected_template_id: null };
            setConversation(prev => [...prev, newBotMessage]);
            setSessionState(data.state);
            if (data.structured_template) {
                setLivePreviewTemplate(data.structured_template);
            } else if (data.structured_templates && data.structured_templates.length > 0) {
                setLivePreviewTemplate(data.structured_templates[0]);
            } else {
                const isConfirmation = data.options && JSON.stringify(data.options) === JSON.stringify(['예', '아니오']);
                if(!isConfirmation) setLivePreviewTemplate(null);
            }
            if (data.response.includes("AI가 자동으로 수정하겠습니다.")) { setTimeout(() => callChatApi("자동 수정 진행", data.state), 1500); }
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
        setSelectedStyleOption(null);
        setConversation(prev => {
            const newConversation = prev.map(msg => ({ ...msg, templates: undefined, options: undefined }));
            return [...newConversation, { id: Date.now(), type: 'user', content: userMessage, timestamp: getCurrentTime() }];
        });
        await callChatApi(userMessage, sessionState);
    };

    const handleTemplateSelect = (messageId: number, templateIndex: number, template: StructuredTemplate) => {
        setConversation(prev => prev.map(msg => msg.id === messageId ? { ...msg, selected_template_id: templateIndex } : msg));
        setLivePreviewTemplate(template);
    };

    const handleConfirmSelection = (messageId: number) => {
        const message = conversation.find(msg => msg.id === messageId);
        if (!message || message.selected_template_id === null || message.selected_template_id === undefined) return;
        const messageToSend = `템플릿 ${message.selected_template_id + 1}`;
        handleSendMessage(messageToSend);
    };

    const handleStyleSelect = (style: string) => {
        setSelectedStyleOption(style);
        setLivePreviewTemplate(STYLE_SKELETONS[style]);
    };

    return (
        <ThemeProvider theme={customTheme}>
            <Box sx={{ flex: 1, minHeight: 0, display: 'flex', gap: 3, p: 3 }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <InteractiveCard sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <Box sx={{ flex: 1, overflowY: 'auto', p: 2, minHeight: 0, '&::-webkit-scrollbar': { display: 'none' }, scrollbarWidth: 'none' }}>
                            {conversation.length === 0 ? <EmptyChatPlaceholder onExampleClick={(text) => handleSendMessage(text)} /> : conversation.map(msg => (
                                <Box key={msg.id} sx={{ mb: 2, display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start' }}>
                                    {msg.type === 'bot' && <Avatar sx={{ mr: 1.5 }}><SmartToyOutlinedIcon /></Avatar>}
                                    <Box sx={{ maxWidth: '80%', display: 'flex', flexDirection: 'column', alignItems: msg.type === 'user' ? 'flex-end' : 'flex-start' }}>
                                        <Paper elevation={0} sx={{ p: '12px 16px', borderRadius: msg.type === 'user' ? '20px 20px 4px 20px' : '4px 20px 20px 20px', bgcolor: msg.type === 'user' ? 'primary.main' : 'rgba(255,255,255,0.8)', color: msg.type === 'user' ? 'white' : 'text.primary', whiteSpace: 'pre-wrap', wordBreak: 'break-word', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)', backdropFilter: 'none', border: 'none' }}>
                                            <Typography variant="body1">{msg.content}</Typography>
                                        </Paper>

                                        {msg.type === 'bot' && msg.templates && msg.templates.length > 0 && msg.options && (
                                            <Paper elevation={0} sx={{ p: 2, mt: 1, bgcolor: 'rgba(255,255,255,0.4)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.2)' }}>
                                                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 'bold', color: '#475569' }}>추천 템플릿 선택</Typography>

                                                <Stack spacing={1} divider={<Divider orientation="horizontal" flexItem />}>
                                                    {msg.templates.map((template, index) => (
                                                        <Button
                                                            key={`template-${index}`}
                                                            variant={msg.selected_template_id === index ? "contained" : "outlined"}
                                                            onClick={() => handleTemplateSelect(msg.id, index, template)}
                                                        >
                                                            {renderTemplateWithPlaceholders(template.body.split('\n')[0])}
                                                        </Button>
                                                    ))}
                                                    <Button
                                                        key="new-template-button"
                                                        variant="outlined"
                                                        onClick={() => handleSendMessage("새로 만들기")}
                                                    >
                                                        새로 만들기
                                                    </Button>
                                                </Stack>

                                                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                                                    <Button
                                                        variant="contained"
                                                        onClick={() => handleConfirmSelection(msg.id)}
                                                        disabled={msg.selected_template_id === null || msg.selected_template_id === undefined}
                                                        sx={{ flexGrow: 1 }}
                                                    >
                                                        선택한 템플릿으로 진행
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        onClick={() => handleSendMessage("실행 취소")}
                                                        sx={{ flexGrow: 1 }}
                                                    >
                                                        실행 취소
                                                    </Button>
                                                </Stack>
                                            </Paper>
                                        )}

                                        {msg.type === 'bot' && (!msg.templates || msg.templates.length === 0) && msg.options && (
                                            <OptionsPresenter
                                                msg={msg}
                                                onOptionSelect={handleSendMessage}
                                                selectedStyle={selectedStyleOption}
                                                onStyleSelect={handleStyleSelect}
                                            />
                                        )}

                                        <Typography variant="caption" sx={{ display: 'block', mt: 0.5, px: 1, color: 'text.secondary' }}>{msg.timestamp}</Typography>
                                    </Box>
                                </Box>
                            ))}
                            {isLoading && (<Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}><CircularProgress size={32} /></Box>)}
                            <div ref={chatEndRef} />
                        </Box>
                        <Box sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.2)', bgcolor: 'rgba(255, 255, 255, 0.3)' }}>
                            <Paper component="form" onSubmit={e => { e.preventDefault(); handleSendMessage(inputValue); }} sx={{ p: '4px 8px', display: 'flex', alignItems: 'center', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.4)', background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'none', boxShadow: 'none' }}>
                                <TextField fullWidth multiline maxRows={5} variant="standard" placeholder="메시지를 입력하거나, 예시를 클릭해보세요..." value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyPress={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(inputValue); } }} sx={{ ml: 1, flex: 1 }} InputProps={{ disableUnderline: true }} />
                                <IconButton color="primary" type="submit" sx={{ p: '10px' }} disabled={!inputValue.trim() || isLoading}>
                                    {isLoading ? <CircularProgress size={24} /> : <SendIcon />}
                                </IconButton>
                            </Paper>
                        </Box>
                    </InteractiveCard>
                </Box>
                <Box sx={{ width: '360px', height: 'calc(100vh - 48px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <IPhoneMockup>
                        {livePreviewTemplate ? <IPhoneKakaoPreview template={livePreviewTemplate} /> : (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'text.secondary' }}>
                                <Typography variant="body2">템플릿 미리보기</Typography>
                            </Box>
                        )}
                    </IPhoneMockup>
                </Box>
            </Box>
        </ThemeProvider>
    );
}