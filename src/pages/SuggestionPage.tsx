import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper, Typography, Button, TextField, Avatar, IconButton, CircularProgress, List, ListItem, ListItemButton, ListItemText, ThemeProvider, createTheme, Divider, Chip, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';

// --- 타입 정의 ---
type TemplateStyle = '기본형' | '이미지형' | '아이템리스트형';

interface StructuredTemplate {
    title: string;
    body: string;
    image_url?: string | null;
    buttons?: [string, string][] | null;
}

// --- 프런트엔드 예시 템플릿 데이터 ---
const exampleTemplates: Record<TemplateStyle, StructuredTemplate> = {
    '기본형': {
        title: '[기본형] 템플릿 제목',
        body: '여기에 기본형 템플릿의 본문 내용이 들어갑니다. 고객에게 전달할 핵심 정보를 명확하게 작성하세요.',
        buttons: [['WL', '웹사이트 바로가기']],
    },
    '이미지형': {
        title: '[이미지형] 시선을 사로잡는 제목',
        body: '이미지와 함께 전달할 메시지를 작성합니다. 이미지는 상품, 이벤트, 브랜드 로고 등 다양하게 활용될 수 있습니다.',
        image_url: 'https://via.placeholder.com/300x150.png?text=Example+Image',
        buttons: [['WL', '자세히 보기']],
    },
    '아이템리스트형': {
        title: '[아이템 리스트] 주문내역 안내',
        body: `#{고객명}님의 주문 내역입니다.\n\n- 상품명: #{상품명}\n- 결제금액: #{금액}\n- 주문일시: #{주문일시}\n\n감사합니다.`,
        buttons: [['WL', '주문 상세 보기'], ['DS', '배송 조회']],
    },
};


interface BotResponse {
    id: number;
    type: 'bot' | 'user';
    content: string;
    options?: string[];
    structured_template?: StructuredTemplate;
    timestamp: string;
}

// --- 스타일 컴포넌트들 ---
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

const Header = styled(Box)({
    backgroundColor: '#FEE500',
    color: '#191919',
    padding: '12px 20px',
    fontWeight: 'bold',
    fontSize: '15px',
});

const Content = styled(Box)({
    backgroundColor: '#FFFFFF',
    padding: '24px',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
});

const ButtonContainer = styled(Box)(({ theme }) => ({
    backgroundColor: '#FFFFFF',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: '8px',
    textAlign: 'center',
    padding: '14px 10px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
    cursor: 'pointer',
    marginTop: 'auto',
}));

const Placeholder = styled('span')({
    color: '#007bff',
    fontWeight: 'bold',
    backgroundColor: 'rgba(0, 123, 255, 0.1)',
    padding: '2px 4px',
    borderRadius: '4px',
});

// --- 초기 화면 안내 컴포넌트 ---
const EmptyChatPlaceholder = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', textAlign: 'center', p: 3 }}>
        <Avatar sx={{ bgcolor: '#FEE500', color: '#191919', width: 56, height: 56, mb: 2 }}>
            <SmartToyOutlinedIcon fontSize="large" />
        </Avatar>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}>
            무엇을 도와드릴까요?
        </Typography>
        <Typography sx={{ mb: 3, maxWidth: '600px', color: '#4B5563' }}>
            아래 입력창에 원하는 알림톡 내용을 자유롭게 작성해보세요.\nAI가 내용을 분석하여 최적의 템플릿을 추천해 드립니다.
        </Typography>
        <Paper
            variant="outlined"
            sx={{
                p: 2, bgcolor: 'transparent', borderRadius: '12px', borderStyle: 'dashed',
                maxWidth: '80%', textAlign: 'left', color: 'text.disabled'
            }}
        >
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
                <LightbulbOutlinedIcon fontSize="small" />
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>이렇게 입력해보세요:</Typography>
            </Stack>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                {`안녕하세요. 마케팅리즈입니다.\n지난번 공지드린 마케팅 특강이 이번주에 시작합니다.\n\n- 일시: 25.11.11(화) 18시\n- 장소: 서울 마포구 양화로 186 6층\n\n참석을 원하시면 미리 답장을 주세요.\n궁금하신 점이 있으시면 02-6402-0508로 연락주세요.\n감사합니다.`}
            </Typography>
        </Paper>
    </Box>
);

// --- 템플릿 미리보기 관련 함수들 ---
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

interface TemplatePreviewProps {
    structuredTemplate: StructuredTemplate | null;
}

const TemplatePreview = ({ structuredTemplate }: TemplatePreviewProps) => {
    if (!structuredTemplate) {
        return <Typography color="text.secondary">미리보기 템플릿이 없습니다.</Typography>;
    }

    const { title, body, image_url, buttons } = structuredTemplate;

    const renderBodyContent = () => {
        const lines = body.split('\n');
        return lines.map((line, index) => (
            <Typography key={index} sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                {renderTemplateWithPlaceholders(line)}
            </Typography>
        ));
    };

    return (
        <PreviewContainer>
            <Header>알림톡 도착</Header>
            <Content>
                {image_url && (
                    <Box sx={{ mb: 2, textAlign: 'center' }}>
                        <img src={image_url} alt="Template Image" style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }} />
                    </Box>
                )}
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {renderTemplateWithPlaceholders(title)}
                </Typography>
                <Box sx={{ flexGrow: 1, mb: 2 }}>
                    {renderBodyContent()}
                </Box>
                {buttons && buttons.length > 0 && (
                    <Stack spacing={1} sx={{ mt: 'auto' }}>
                        {buttons.map(([type, text], index) => (
                            <ButtonContainer key={index}>
                                {renderTemplateWithPlaceholders(text)}
                            </ButtonContainer>
                        ))}
                    </Stack>
                )}
            </Content>
        </PreviewContainer>
    );
};

// --------------------------------------------------------------------------
//  SuggestionPage 컴포넌트 (메인 UI)
// --------------------------------------------------------------------------
export default function SuggestionPage() {
    const [conversation, setConversation] = useState<BotResponse[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionState, setSessionState] = useState({});
    const [livePreviewStructuredTemplate, setLivePreviewStructuredTemplate] = useState<StructuredTemplate | null>(null);
    const [selectedOption, setSelectedOption] = useState<string>('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    // 템플릿 종류 선택 버튼의 활성화 상태를 관리하는 state
    const [selectedTemplateType, setSelectedTemplateType] = useState<TemplateStyle | null>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversation]);

    // 현재 시간 가져오기 함수
    const getCurrentTime = () => new Date().toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });

    // 백엔드와 통신하는 로직
    const callChatApi = async (message: string, currentState: object) => {
        setIsLoading(true);
        try {
            const res = await fetch('http://localhost:8000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message, state: currentState }),
            });

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
                structured_template: data.structured_template,
                timestamp: getCurrentTime(),
            };

            setConversation((prev) => [...prev, botMessage]);
            setSessionState(data.state);

            // AI 응답으로 structured_template가 오면 미리보기 업데이트
            // 이전에 선택된 템플릿 종류가 있다면 초기화
            if (botMessage.structured_template) {
                setLivePreviewStructuredTemplate(botMessage.structured_template);
                setSelectedTemplateType(null);
            }

            // 자동 진행 로직
            if (data.response.includes("AI가 자동으로 수정하겠습니다.")) {
                setTimeout(() => {
                    callChatApi("진행", data.state);
                }, 1500);
            }

        } catch (error) {
            setConversation((prev) => [...prev, {
                id: Date.now() + 1,
                type: 'bot',
                content: `오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
                timestamp: getCurrentTime(),
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = async (message: string) => {
        if (!message.trim() || isLoading) return;

        setConversation((prev) => [...prev, {
            id: Date.now(),
            type: 'user',
            content: message,
            timestamp: getCurrentTime(),
        }]);

        setInputValue('');
        setSelectedOption('');
        // 사용자 메시지 전송 시 미리보기 초기화 (AI 응답 대기)
        setLivePreviewStructuredTemplate(null);
        setSelectedTemplateType(null);
        await callChatApi(message, sessionState);
    };

    const handleOptionClick = (option: string, message: BotResponse) => {
        setSelectedOption(option);
        if (message.options && message.structured_template) {
            setLivePreviewStructuredTemplate(message.structured_template);
            setSelectedTemplateType(null); // 옵션 선택 시 타입 선택 초기화
        }
    };

    // --- 템플릿 타입 버튼 클릭 핸들러 ---
    const handleTemplateTypeClick = (templateType: TemplateStyle) => {
        const selectedTemplate = exampleTemplates[templateType];
        setLivePreviewStructuredTemplate(selectedTemplate);
        setSelectedTemplateType(templateType); // 선택된 타입 저장
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(inputValue);
        }
    };

    const theme = createTheme({
        typography: {
            fontFamily: "'Pretendard', sans-serif",
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: 'flex', gap: 3, height: 'calc(100vh - 64px)' }}>
                {/* 왼쪽: AI와 대화하는 패널 */}
                <Box sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    minWidth: 0,
                    border: '1px solid #e0e0e0',
                    borderRadius: '12px',
                    overflow: 'hidden',
                }}>
                    {/* --- 템플릿 종류 선택 UI --- */}
                    <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0', bgcolor: '#f9f9f9' }}>
                        <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 'bold', color: 'text.secondary' }}>템플릿 종류 선택</Typography>
                        <Stack direction="row" spacing={1}>
                            {(Object.keys(exampleTemplates) as TemplateStyle[]).map((type) => (
                                <Button
                                    key={type}
                                    variant={selectedTemplateType === type ? "contained" : "outlined"}
                                    size="small"
                                    onClick={() => handleTemplateTypeClick(type)}
                                >
                                    {type}
                                </Button>
                            ))}
                        </Stack>
                    </Box>

                    <Box sx={{
                        flexGrow: 1,
                        overflowY: 'auto',
                        bgcolor: '#b2c7d9',
                        p: 2,
                    }}>
                        {conversation.length === 0 ? (
                            <EmptyChatPlaceholder />
                        ) : (
                            <Stack spacing={2}>
                                {conversation.map((msg) => (
                                    <Stack
                                        key={msg.id}
                                        direction={msg.type === 'user' ? 'row-reverse' : 'row'}
                                        spacing={1}
                                        alignItems="flex-start"
                                    >
                                        {msg.type === 'bot' && (
                                            <Avatar sx={{ bgcolor: '#f0f0f0' }}>
                                                <SmartToyOutlinedIcon sx={{ color: '#555' }} />
                                            </Avatar>
                                        )}
                                        <Stack
                                            direction={msg.type === 'user' ? 'row-reverse' : 'row'}
                                            spacing={1}
                                            alignItems="flex-end"
                                        >
                                            <Paper
                                                elevation={0}
                                                sx={{
                                                    p: '10px 14px',
                                                    borderRadius: '18px',
                                                    bgcolor: msg.type === 'user' ? '#FEE500' : '#FFFFFF',
                                                    color: '#191919',
                                                    maxWidth: '100%',
                                                }}
                                            >
                                                <Typography sx={{
                                                    whiteSpace: 'pre-wrap',
                                                    wordBreak: 'break-word',
                                                    lineHeight: 1.6,
                                                }}>
                                                    {msg.content}
                                                </Typography>

                                                {/* 옵션 버튼들 */}
                                                {msg.options && (
                                                    <Box sx={{
                                                        mt: 1.5,
                                                        pt: 1.5,
                                                        borderTop: msg.content ? '1px solid #f0f0f0' : 'none',
                                                    }}>
                                                        <Stack spacing={1}>
                                                            {msg.options.map((opt) => (
                                                                <Button
                                                                    key={opt}
                                                                    variant={selectedOption === opt ? "contained" : "outlined"}
                                                                    size="medium"
                                                                    onClick={() => handleOptionClick(opt, msg)}
                                                                    sx={{
                                                                        justifyContent: 'flex-start',
                                                                        borderRadius: '12px',
                                                                        borderColor: '#e0e0e0',
                                                                        bgcolor: selectedOption === opt ? '#4dabf7' : 'white',
                                                                        color: selectedOption === opt ? 'white' : '#333',
                                                                        '&:hover': {
                                                                            bgcolor: selectedOption === opt ? '#379de5' : '#f5f5f5',
                                                                        },
                                                                    }}
                                                                >
                                                                    {opt}
                                                                </Button>
                                                            ))}
                                                        </Stack>
                                                    </Box>
                                                )}
                                            </Paper>
                                            <Typography variant="caption" sx={{ color: '#616161' }}>
                                                {msg.timestamp}
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                ))}
                                <div ref={chatEndRef} />
                            </Stack>
                        )}
                    </Box>
                    {/* 메시지 입력창 */}
                    <Paper
                        component="form"
                        onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); }}
                        elevation={0}
                        sx={{
                            p: '8px 12px',
                            display: 'flex',
                            alignItems: 'center',
                            borderTop: '1px solid #e0e0e0',
                            borderRadius: 0,
                        }}
                    >
                        <TextField
                            fullWidth
                            multiline
                            maxRows={5}
                            variant="standard"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={isLoading ? "AI가 답변을 생성중입니다..." : "메시지를 입력하세요..."}
                            disabled={isLoading}
                            InputProps={{
                                disableUnderline: true,
                                sx: {
                                    fontSize: '15px',
                                    lineHeight: 1.6,
                                    borderBottom: 'none',
                                },
                                px: 1.5,
                            }}
                        />
                        <IconButton
                            type="submit"
                            disabled={isLoading || !inputValue.trim()}
                            sx={{
                                bgcolor: '#FEE500',
                                color: '#191919',
                                '&:hover': { bgcolor: '#fdd835' },
                            }}
                        >
                            <SendIcon fontSize="small" />
                        </IconButton>
                    </Paper>
                </Box>

                {/* 오른쪽: 미리보기 패널 */}
                <Stack spacing={2} sx={{ width: '480px', minWidth: '480px' }}>
                    <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
                        <Button
                            variant="contained"
                            sx={{
                                background: 'linear-gradient(to right, #6D28D9, #4F46E5)',
                                borderRadius: '8px',
                                fontWeight: 'bold',
                                px: 3,
                                py: 1,
                            }}
                        >
                            카톡 발송하기
                        </Button>
                    </Stack>

                    {livePreviewStructuredTemplate ? (
                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                            <TemplatePreview
                                structuredTemplate={livePreviewStructuredTemplate}
                            />
                        </Box>
                    ) : (
                        <Paper sx={{
                            flex: 1,
                            borderRadius: '20px',
                            border: '1px dashed #d1d5db',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: 'transparent',
                        }}>
                            <Typography color="text.secondary">
                                템플릿을 선택하면 여기에 미리보기가 표시됩니다.
                            </Typography>
                        </Paper>
                    )}
                </Stack>
            </Box>
        </ThemeProvider>
    );
}


