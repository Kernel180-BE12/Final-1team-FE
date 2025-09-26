import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Button, TextField, Avatar, IconButton, Stack, ThemeProvider, createTheme, Snackbar, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SaveIcon from '@mui/icons-material/Save';

import apiClient from '../api';
import useAppStore from '../store/useAppStore';


// --- 타입 정의 ---
interface ApiErrorData {
    detail?: string;
    response?: string;
}

interface StructuredTemplate {
    title: string;
    body: string;
    image_url?: string | null;
    buttons?: [string, string][] | null;
    image_layout?: 'header' | 'background' | null;
}

interface TemplateVariable {
    name: string;
    type: 'string' | 'number';
    example?: string | number;
}

interface EditableVariables {
    parameterized_template: string;
    variables: TemplateVariable[];
}

interface BotResponse {
    id: number;
    type: 'bot' | 'user';
    content: string;
    timestamp: string;
    templates?: StructuredTemplate[];
    selected_template_id?: number | null;
    options?: string[];
    isFinalized?: boolean;
    template?: string;
    structured_template?: StructuredTemplate;
    buttons?: [string, string][];
    hasImage?: boolean;
    editable_variables?: EditableVariables;
}


const pulseAnimation = `
  @keyframes pulse {
    0% { transform: scale(1); opacity: 0.7; }
    50% { transform: scale(1.1); opacity: 1; }
    100% { transform: scale(1); opacity: 0.7; }
  }
`;

const shimmerAnimation = `
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`;

// --- 상수 및 기본 데이터 ---
const STYLE_SKELETONS: { [key: string]: StructuredTemplate } = {
    '기본형': {
        title: '[제목이 여기에 표시됩니다]',
        body: '고객에게 전달될 메시지 본문입니다.\n변수 #{고객명} 등을 사용하여 개인화된 메시지를 보낼 수 있습니다.',
        buttons: [['웹사이트', '자세히 보기']]
    },
    '이미지형': {
        title: '[시선을 끄는 이미지 위 제목]',
        body: '이미지와 함께 전달될 메시지 본문입니다. 상품이나 이벤트를 시각적으로 강조할 때 유용합니다.',
        image_url: 'https://placehold.co/1024x512/e2e8f0/475569?text=Image+Preview',
        buttons: [['웹사이트', '더 알아보기']]
    },
    '아이템리스트형': {
        title: '[주문 내역, 상품 목록 등]',
        body: '여러 항목을 목록 형태로 전달할 때 사용합니다.\n- 상품명: #{상품명}\n- 주문번호: #{주문번호}\n- 배송 상태: #{배송상태}',
        buttons: [['웹사이트', '배송 조회하기']]
    }
};

// --- 스타일 컴포넌트 ---
const Placeholder = styled('span')({
    color: '#3b82f6',
    fontWeight: 'bold',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    padding: '2px 4px',
    borderRadius: '4px'
});

const customTheme = createTheme({
    typography: {
        fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', sans-serif",
    },
    palette: {
        primary: {
            main: '#3b82f6',
        },
        secondary: {
            main: '#64748b',
        },
        background: {
            default: 'transparent',
            paper: 'rgba(255, 255, 255, 0.6)',
        },
        text: {
            primary: '#0f172a',
            secondary: '#475569',
        }
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    backdropFilter: 'blur(16px) saturate(180%)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                    borderRadius: '24px',
                    background: 'rgba(255, 255, 255, 0.6)',
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: '12px',
                    fontWeight: 600,
                    boxShadow: 'none',
                    transition: 'transform 0.1s ease-in-out',
                    '&:active': {
                        transform: 'scale(0.98)',
                    }
                },
                contained: {
                    backgroundColor: '#3b82f6',
                    '&:hover': {
                        backgroundColor: '#2563eb',
                    }
                },
                outlined: {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    color: '#334155',
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        borderColor: 'rgba(255, 255, 255, 0.8)',
                    }
                }
            }
        },
        MuiAvatar: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    color: '#1e293b',
                }
            }
        }
    }
});

const InteractiveCard = styled(Paper)({});

// --- 유틸리티 및 헬퍼 컴포넌트 ---
const EmptyChatPlaceholder = ({ onExampleClick }: { onExampleClick: (text: string) => void }) => (
    <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        p: 3,
        color: 'text.secondary',
        flex: 1
    }}>
        <Avatar sx={{ width: 72, height: 72, mb: 2, backgroundColor: 'rgba(255,255,255,0.7)' }}>
            <SmartToyOutlinedIcon sx={{ fontSize: 36, color: '#475569' }} />
        </Avatar>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}>AI 템플릿 만들기</Typography>
        <Typography sx={{ mb: 3, maxWidth: '600px' }}>원하는 알림톡 내용을 자유롭게 작성해보세요.</Typography>
        <Stack direction="row" spacing={1.5}>
            <Button variant="outlined" onClick={() => onExampleClick("배송 시작 알림톡 만들어줘")}>"배송 시작 알림톡"</Button>
            <Button variant="outlined" onClick={() => onExampleClick("신규 가입 환영 메시지 작성해줘")}>"신규 가입 환영 메시지"</Button>
        </Stack>
    </Box>
);

const renderTemplateWithPlaceholders = (text: string) => (
    <>
        {text.split(/(#{\w+})/g).map((part, index) => (
            /#{\w+}/.test(part) ? <Placeholder key={index}>{part}</Placeholder> : part
        ))}
    </>
);

const IPhoneKakaoPreview = ({ template }: { template: StructuredTemplate }) => {
    const { title, body, image_url, buttons, image_layout } = template;
    const isBackgroundLayout = image_layout === 'background' && image_url;
    const isHeaderLayout = image_layout === 'header' && image_url;
    const today = new Date();
    const dateString = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;

    return (
        <Box sx={{ p: '12px', bgcolor: '#b2c7d9', fontFamily: 'sans-serif', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
                <Typography sx={{ bgcolor: 'rgba(0,0,0,0.1)', color: '#fff', fontSize: '11px', fontWeight: 'bold', px: 1.5, py: 0.5, borderRadius: '12px' }}>{dateString}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Avatar variant="rounded" sx={{ width: 40, height: 40, mr: 1, borderRadius: '14px', bgcolor: '#FEE500', color: '#000' }}>
                    <ChatBubbleOutlineIcon sx={{ fontSize: '20px' }}/>
                </Avatar>
                <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: '13px', fontWeight: 400, color: '#000', mb: 0.5 }}>자버 채널</Typography>
                    <Paper sx={{
                        position: 'relative',
                        borderRadius: '18px',
                        borderTopLeftRadius: '4px',
                        overflow: 'hidden',
                        boxShadow: '0 1px 1px rgba(0,0,0,0.05)',
                        maxWidth: '90%',
                        bgcolor: '#fff',
                        backdropFilter: 'none',
                        border: 'none',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <Box sx={{ content: '""', position: 'absolute', left: -7, top: 8, width: 0, height: 0, border: '8px solid transparent', borderLeft: 'none', borderRightColor: '#FFEB00', zIndex: 3 }} />
                        <Box sx={{ bgcolor: '#FFEB00', p: '10px 12px', position: 'relative', zIndex: 2 }}>
                            <Typography sx={{ fontSize: '12px', color: '#000', fontWeight: 'bold' }}>알림톡 도착</Typography>
                        </Box>

                        {isHeaderLayout && (
                            <Box component="img" src={image_url} alt="Header" sx={{ width: '100%', display: 'block' }} />
                        )}

                        <Box sx={{
                            p: '16px',
                            ...(isBackgroundLayout && {
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minHeight: '100px',
                            })
                        }}>
                            {isBackgroundLayout && (
                                <>
                                    <Box component="img" src={image_url} alt="Background" sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} />
                                    <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.3)', zIndex: 1 }} />
                                </>
                            )}
                            <Typography variant="h6" sx={{
                                position: 'relative',
                                zIndex: 2,
                                fontSize: '17px',
                                fontWeight: 'bold',
                                color: isBackgroundLayout ? '#fff' : '#000',
                                textAlign: isBackgroundLayout ? 'center' : 'left',
                            }}>
                                {renderTemplateWithPlaceholders(title)}
                            </Typography>
                        </Box>

                        <Box sx={{
                            p: '16px',
                            borderTop: '1px solid #f0f0f0',
                        }}>
                            <Typography component="div" sx={{ fontSize: '15px', whiteSpace: 'pre-wrap', lineHeight: 1.5, color: '#333' }}>
                                {renderTemplateWithPlaceholders(body)}
                            </Typography>
                        </Box>

                        {buttons && buttons.length > 0 && (
                            <Box sx={{ borderTop: '1px solid #f0f0f0', position: 'relative', zIndex: 1, bgcolor: '#fff' }}>
                                {buttons.map(([text], index) => (
                                    <Box key={index} sx={{ textAlign: 'center', p: '14px 16px', fontSize: '15px', fontWeight: '500', color: '#555', cursor: 'pointer' }}>
                                        {renderTemplateWithPlaceholders(text)}
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
};

const IPhoneMockup = ({ children }: { children: React.ReactNode }) => (
    <Paper sx={{ width: '100%', height: '760px', borderRadius: '44px', overflow: 'hidden', display: 'flex', flexDirection: 'column', background: '#1c1c1e', border: '4px solid #d1d1d6', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)' }}>
        <Box sx={{ position: 'absolute', top: 4, left: '50%', transform: 'translateX(-50%)', width: '40%', height: '30px', bgcolor: '#1c1c1e', borderRadius: '0 0 16px 16px', zIndex: 2 }} />
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#b2c7d9', overflow: 'hidden', minHeight: 0 }}>
            <Box sx={{ p: '4px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#000', zIndex: 1, height: '44px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
                </svg>
                <Box sx={{ display: 'flex', gap: '16px' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
                    </svg>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
                    </svg>
                </Box>
            </Box>
            <Box sx={{
                flex: 1,
                minHeight: 0,
                overflowY: 'auto',
                '&::-webkit-scrollbar': { width: '8px', backgroundColor: 'transparent' },
                '&::-webkit-scrollbar-thumb': { backgroundColor: 'transparent', borderRadius: '4px' },
                '&:hover': { '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(0, 0, 0, 0.2)' } }
            }}>
                {children}
            </Box>
        </Box>
    </Paper>
);

interface OptionsPresenterProps {
    msg: BotResponse;
    onOptionSelect: (option: string) => void;
    selectedStyle: string | null;
    onStyleSelect: (style: string) => void;
}

const OptionsPresenter = ({ msg, onOptionSelect, selectedStyle, onStyleSelect }: OptionsPresenterProps) => {
    if (!msg.options || msg.options.length === 0) return null;

    const isStyleSelection = msg.options.includes('기본형') && msg.options.includes('이미지형') && msg.options.includes('아이템리스트형');
    const isFeedbackSelection = msg.options.includes('네, 수정할래요') && msg.options.includes('아니요, 괜찮아요');

    const buttonSx = {
        justifyContent: 'flex-start',
        textAlign: 'left',
        textTransform: 'none',
        padding: '10px 16px',
        lineHeight: 1.4,
        fontWeight: 500,
        '&.MuiButton-outlined': {
            borderColor: 'primary.main',
            color: 'primary.main',
            borderWidth: '1.5px',
            '&:hover': {
                backgroundColor: 'rgba(59, 130, 246, 0.05)',
            }
        }
    };

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
                            sx={buttonSx}
                        >
                            {option}
                        </Button>
                    ))}
                </Stack>
                <Button variant="contained" fullWidth disabled={!selectedStyle} onClick={() => { if (selectedStyle) { onOptionSelect(selectedStyle); } }} sx={{ mt: 2 }} >
                    클릭한 스타일로 진행하기
                </Button>
            </Paper>
        );
    }

    let title = "옵션 선택";
    if (JSON.stringify(msg.options) === JSON.stringify(['예', '아니오'])) {
        title = "진행 여부 확인";
    } else if (isFeedbackSelection) {
        title = "피드백 요청";
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
                        sx={buttonSx}
                    >
                        {option}
                    </Button>
                ))}
            </Stack>
        </Paper>
    );
};

const TemplateSelector = ({ msg, onTemplateSelect, onConfirm, onSendMessage }: {
    msg: BotResponse;
    onTemplateSelect: (messageId: number, templateIndex: number, template: StructuredTemplate) => void;
    onConfirm: (messageId: number, isFinal: boolean) => void;
    onSendMessage: (message: string) => void;
}) => {
    if (!msg.templates || msg.templates.length === 0) return null;

    const isInitialRecommendation = msg.options?.includes('새로 만들기');
    const isFinalLayoutChoice = msg.templates.length > 1 && !isInitialRecommendation;

    if (msg.templates.length === 1 && !isInitialRecommendation) {
        return null;
    }

    if (msg.isFinalized) {
        return (
            <Paper elevation={0} sx={{ p: 2, mt: 1, bgcolor: 'rgba(255,255,255,0.4)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.2)' }}>
                <Box sx={{display: 'flex', alignItems: 'center', color: 'primary.main'}}>
                    <CheckCircleIcon sx={{mr: 1}}/>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>선택이 완료되었습니다.</Typography>
                </Box>
            </Paper>
        );
    }

    let title = "추천 템플릿";
    if (isFinalLayoutChoice) title = "레이아웃 선택";

    return (
        <Paper elevation={0} sx={{ p: 2, mt: 1, bgcolor: 'rgba(255,255,255,0.4)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.2)' }}>
            <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 'bold', color: '#475569' }}>{title}</Typography>
            <Stack spacing={1}>
                {msg.templates.map((template, index) => {
                    const isSelected = msg.selected_template_id === index;
                    const buttonText = template.title;

                    return (
                        <Button
                            key={index}
                            variant={isSelected ? "contained" : "outlined"}
                            onClick={() => onTemplateSelect(msg.id, index, template)}
                            sx={{
                                justifyContent: 'flex-start',
                                textAlign: 'left',
                                textTransform: 'none',
                                padding: '10px 16px',
                                lineHeight: 1.4,
                                fontWeight: 500,
                                ...(!isSelected && {
                                    borderColor: 'primary.main',
                                    color: 'primary.main',
                                    borderWidth: '1.5px',
                                    '&:hover': {
                                        backgroundColor: 'rgba(59, 130, 246, 0.05)',
                                    }
                                })
                            }}
                        >
                            {renderTemplateWithPlaceholders(buttonText)}
                        </Button>
                    );
                })}
            </Stack>
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <Button
                    variant="contained"
                    onClick={() => onConfirm(msg.id, isFinalLayoutChoice)}
                    disabled={msg.selected_template_id === null || msg.selected_template_id === undefined}
                    sx={{ flexGrow: 1,
                        backgroundColor: '#14b8a6',
                        '&:hover': {
                            backgroundColor: '#0d9488'
                        }}}
                >
                    선택한 템플릿으로 진행
                </Button>
                {isInitialRecommendation && (
                    <Button
                        variant="contained"
                        onClick={() => onSendMessage("새로 만들기")}
                        sx={{
                            flexGrow: 1,
                            backgroundColor: '#f97316',
                            '&:hover': {
                                backgroundColor: '#ea580c'
                            },
                        }}
                    >
                        새로 만들기
                    </Button>
                )}
            </Stack>
        </Paper>
    );
};


// --- 메인 UI 컴포넌트 ---
export default function SuggestionPage() {
    const [conversation, setConversation] = useState<BotResponse[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [sessionState, setSessionState] = useState({});
    const [livePreviewTemplate, setLivePreviewTemplate] = useState<StructuredTemplate | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const [selectedStyleOption, setSelectedStyleOption] = useState<string | null>(null);
    const location = useLocation();
    const navigate = useNavigate();
    const effectRan = useRef(false);
    const { currentSpace } = useAppStore();
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
    const [isConversationComplete, setIsConversationComplete] = useState(false);
    const [isThinking, setIsThinking] = useState(false);


    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversation, isLoading]);

    useEffect(() => {
        if (!effectRan.current && location.state?.userInput) {
            const initialUserInput = location.state.userInput;
            handleSendMessage(initialUserInput);
            navigate('.', { replace: true, state: {} });
        }
        return () => { effectRan.current = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.state]);

    const getCurrentTime = () => new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });

    // --- ▼▼▼ 여기가 수정된 최종 callChatApi 함수입니다 ▼▼▼ ---
    const callChatApi = async (message: string, currentState: object) => {
        setIsLoading(true);
        setIsConversationComplete(false);
        setIsThinking(false); // 새 메시지 전송 시 초기화

        const streamingMessageId = Date.now() + 1;

        let currentBotResponse: BotResponse = {
            id: streamingMessageId,
            type: 'bot',
            content: '',
            timestamp: getCurrentTime(),
        };

        try {
            const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/template/sse`;
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'text/event-stream',
                },
                body: JSON.stringify({ message, state: currentState }),
                credentials: 'include'
            });

            if (!response.ok) throw new Error(`서버 오류: ${response.statusText}`);

            const reader = response.body?.getReader();
            if (!reader) throw new Error('응답 스트림을 읽을 수 없습니다.');

            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.startsWith('data:')) {
                        const jsonStr = line.substring(6);
                        try {
                            // 1. .data 접근 로직 제거: JSON 문자열을 객체로 바로 파싱
                            const streamData = JSON.parse(jsonStr);

                            if (streamData.success === false) {
                                // AI가 생각 중일 때: 로딩 애니메이션을 켭니다.
                                setIsThinking(true);
                            } else {
                                // 최종 응답 도착 시: 로딩 애니메이션을 끄고, 받은 데이터로 메시지를 채웁니다.
                                setIsThinking(false);

                                if (streamData.state) {
                                    setSessionState(streamData.state);
                                }

                                currentBotResponse.content = streamData.response;
                                currentBotResponse.options = streamData.options;
                                currentBotResponse.template = streamData.template;
                                currentBotResponse.editable_variables = streamData.editable_variables;

                                if (streamData.structured_templates && streamData.structured_templates.length > 0) {
                                    currentBotResponse.templates = streamData.structured_templates;
                                } else if (streamData.structured_template) {
                                    if (streamData.hasImage) {
                                        const baseTemplate = streamData.structured_template;
                                        const placeholderUrl = 'https://placehold.co/1024x512/e2e8f0/475569?text=Image+Preview';
                                        currentBotResponse.templates = [
                                            { ...baseTemplate, image_url: placeholderUrl, image_layout: 'header' },
                                            { ...baseTemplate, image_url: placeholderUrl, image_layout: 'background' }
                                        ];
                                    } else {
                                        currentBotResponse.templates = [streamData.structured_template];
                                    }
                                }

                                if (currentBotResponse.content?.includes("템플릿 생성을 마칩니다")) {
                                    setIsConversationComplete(true);
                                }

                                setConversation(prev => [...prev, currentBotResponse]);

                                if (currentBotResponse.templates && currentBotResponse.templates.length > 0) {
                                    const selectedIndex = currentBotResponse.selected_template_id ?? 0;
                                    setLivePreviewTemplate(currentBotResponse.templates[selectedIndex]);
                                }
                            }
                        } catch (e) {
                            console.error('스트림 데이터 파싱 오류:', e, '받은 데이터:', jsonStr);
                        }
                    }
                }
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
            currentBotResponse.content = `오류: ${errorMessage}`;
            setConversation(prev => [...prev, currentBotResponse]);
        } finally {
            setIsLoading(false);
            setIsThinking(false);
        }
    };
    // --- ▲▲▲ 여기가 수정된 최종 callChatApi 함수입니다 ▲▲▲ ---


    const handleSendMessage = async (message: string) => {
        if (!message.trim() || isLoading) return;
        const userMessage = message;
        setInputValue('');
        setSelectedStyleOption(null);

        setConversation(prev => {
            const clearedConversation = prev.map(msg => ({
                ...msg,
                options: undefined,
                isFinalized: msg.isFinalized || (msg.templates ? true : undefined),
            }));

            return [
                ...clearedConversation,
                { id: Date.now(), type: 'user', content: userMessage, timestamp: getCurrentTime() } as BotResponse
            ];
        });

        await callChatApi(userMessage, sessionState);
    };

    const handleTemplateSelect = (messageId: number, templateIndex: number, template: StructuredTemplate) => {
        setConversation(prev => prev.map(msg => msg.id === messageId ? { ...msg, selected_template_id: templateIndex } : msg));
        setLivePreviewTemplate(template);
    };

    const handleConfirmSelection = (messageId: number, isFinal: boolean = false) => {
        const message = conversation.find(msg => msg.id === messageId);
        if (!message || message.selected_template_id === null || message.selected_template_id === undefined) return;

        if (isFinal) {
            setConversation(prev => prev.map(msg => msg.id === messageId ? { ...msg, isFinalized: true, options: undefined } : msg));
        } else {
            const messageToSend = `템플릿 ${message.selected_template_id + 1} 사용`;
            handleSendMessage(messageToSend);
        }
    };

    const handleStyleSelect = (style: string) => {
        setSelectedStyleOption(style);
        setLivePreviewTemplate(STYLE_SKELETONS[style]);
    };


    const handleSaveTemplate = async () => {
        if (!livePreviewTemplate) {
            setSnackbar({ open: true, message: '저장할 템플릿이 없습니다.', severity: 'error' });
            return;
        }
        if (!currentSpace) {
            setSnackbar({ open: true, message: '워크스페이스를 선택해주세요.', severity: 'error' });
            return;
        }

        const finalBotMessage = conversation.slice().reverse().find(msg =>
            msg.type === 'bot' && msg.editable_variables && msg.template
        );

        if (!finalBotMessage) {
            setSnackbar({ open: true, message: '저장할 템플릿 정보를 찾을 수 없습니다. AI와의 대화를 완료해주세요.', severity: 'error' });
            return;
        }

        setIsSaving(true);
        try {
            const payload = {
                spaceId: currentSpace.spaceId,
                title: livePreviewTemplate.title,
                description: "AI 생성 템플릿",
                type: "알림/정보",
                template: finalBotMessage.template,
                structuredTemplate: JSON.stringify(livePreviewTemplate),
                editableVariables: JSON.stringify(finalBotMessage.editable_variables),
                hasImage: !!livePreviewTemplate.image_url,
            };

            await apiClient.post('/template/save', payload);
            setSnackbar({ open: true, message: '템플릿이 성공적으로 저장되었습니다!', severity: 'success' });

        } catch (error) {
            let errorMessage = '템플릿 저장에 실패했습니다.';
            if (apiClient.isAxiosError(error) && error.response) {
                const errorData = error.response.data as ApiErrorData;
                errorMessage = errorData.detail || errorData.response || error.message;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            setSnackbar({ open: true, message: `오류: ${errorMessage}`, severity: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <ThemeProvider theme={customTheme}>
            <Box sx={{ display: 'flex', gap: 3, height: '100%', minHeight: 0 }}>

                {/* 1. 왼쪽 채팅창 섹션 */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <InteractiveCard sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
                        <Box sx={{
                            flex: 1,
                            p: 2,
                            minHeight: 0,
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            '&::-webkit-scrollbar': { display: 'none' },
                            scrollbarWidth: 'none',
                            position: 'relative'
                        }}>
                            {isThinking && (
                                <Box sx={{
                                    position: 'absolute',
                                    top: 0, left: 0, right: 0, bottom: 0,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    zIndex: 10,
                                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                    backdropFilter: 'blur(4px)',
                                }}>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: '10px 16px', borderRadius: '16px', bgcolor: '#e2e8f0',
                                            color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1.5,
                                            boxShadow: 'none', backdropFilter: 'none', border: 'none'
                                        }}
                                    >
                                        <style>{pulseAnimation}{shimmerAnimation}</style>
                                        <AutoAwesomeIcon sx={{ fontSize: 20, animation: 'pulse 2s infinite ease-in-out' }} />
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontWeight: 500,
                                                background: (theme) => `linear-gradient(to right, ${theme.palette.text.secondary}, #fff, ${theme.palette.text.secondary})`,
                                                backgroundSize: '200% 100%', color: 'transparent',
                                                backgroundClip: 'text', animation: 'shimmer 3s infinite linear',
                                            }}
                                        >
                                            AI가 생각 중입니다...
                                        </Typography>
                                    </Paper>
                                </Box>
                            )}
                            {conversation.length === 0 ? <EmptyChatPlaceholder onExampleClick={(text) => handleSendMessage(text)} /> : conversation.map(msg => (
                                <Box key={msg.id} sx={{ mb: 2, display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start' }}>
                                    {msg.type === 'bot' && <Avatar sx={{ mr: 1.5 }}><SmartToyOutlinedIcon /></Avatar>}
                                    <Box sx={{ maxWidth: '80%', display: 'flex', flexDirection: 'column', alignItems: msg.type === 'user' ? 'flex-end' : 'flex-start' }}>
                                        <Paper elevation={0} sx={{ p: '12px 16px', borderRadius: msg.type === 'user' ? '20px 20px 4px 20px' : '4px 20px 20px 20px', bgcolor: msg.type === 'user' ? 'primary.main' : '#e2e8f0', color: msg.type === 'user' ? 'white' : 'text.primary', whiteSpace: 'pre-wrap', wordBreak: 'break-word', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.05)', backdropFilter: 'none', border: 'none' }}>
                                            <Typography variant="body1">{msg.content}</Typography>
                                        </Paper>

                                        {msg.type === 'bot' && msg.templates && msg.templates.length > 0 && !(msg.options?.includes('네, 수정할래요')) && (
                                            <TemplateSelector
                                                msg={msg}
                                                onTemplateSelect={handleTemplateSelect}
                                                onConfirm={handleConfirmSelection}
                                                onSendMessage={handleSendMessage}
                                            />
                                        )}

                                        {msg.type === 'bot' && Array.isArray(msg.options) && msg.options.length > 0 &&
                                            (!msg.templates || msg.templates.length < 3) && (
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
                            <div ref={chatEndRef} />
                        </Box>
                        <Box sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.2)', bgcolor: 'rgba(255, 255, 255, 0.3)' }}>
                            <Paper component="form" onSubmit={e => { e.preventDefault(); handleSendMessage(inputValue); }} sx={{ p: '4px 8px', display: 'flex', alignItems: 'center', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.4)', background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'none', boxShadow: 'none' }}>
                                <TextField
                                    fullWidth
                                    multiline
                                    maxRows={5}
                                    variant="standard"
                                    placeholder="메시지를 입력하거나, 예시를 클릭해보세요..."
                                    value={inputValue}
                                    onChange={e => setInputValue(e.target.value)}
                                    onKeyPress={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(inputValue); } }}
                                    sx={{ ml: 1, flex: 1 }}
                                    InputProps={{ disableUnderline: true }}
                                />
                                <IconButton color="primary" type="submit" sx={{ p: '10px' }} disabled={!inputValue.trim() || isLoading}>
                                    <SendIcon />
                                </IconButton>
                            </Paper>
                        </Box>
                    </InteractiveCard>
                </Box>
                {/* 2. 오른쪽 미리보기 섹션 */}
                <Box sx={{
                    width: '360px',
                    minWidth: '360px',
                    display: { xs: 'none', md: 'flex' },
                    flexDirection: 'column',
                    minHeight: 0,
                }}>
                    <IPhoneMockup>
                        {livePreviewTemplate ? <IPhoneKakaoPreview template={livePreviewTemplate} /> : (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'text.secondary' }}>
                                <Typography variant="body2">템플릿 미리보기</Typography>
                            </Box>
                        )}
                    </IPhoneMockup>

                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<SaveIcon />}
                        onClick={handleSaveTemplate}
                        disabled={!isConversationComplete || isSaving}
                        sx={{ mt: 2, width: '100%', py: 1.5, fontSize: '1rem' }}
                    >
                        {isSaving ? '저장하는 중...' : '이 템플릿 저장하기'}
                    </Button>
                </Box>
            </Box>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </ThemeProvider>
    );
}