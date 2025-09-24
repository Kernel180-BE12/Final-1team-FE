import React from 'react';
import { Box, Paper, Typography, Button, Stack } from '@mui/material';

// REVISED: 공통 버튼 타입 정의
interface TemplateButton {
    text: string;
}

// REVISED: Props 타입을 export하고 buttons 배열을 받도록 수정
export interface KakaoHighlightTemplateProps {
    highlightTitle: string;
    highlightSubtitle: string;
    content: string;
    buttons: TemplateButton[];
}

const KakaoHighlightTemplate: React.FC<KakaoHighlightTemplateProps> = ({ highlightTitle, highlightSubtitle, content, buttons }) => {
    return (
        <Paper
            elevation={0}
            sx={{
                width: '100%',
                maxWidth: '320px',
                borderRadius: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                mx: 'auto',
                overflow: 'hidden'
            }}
        >
            <Box sx={{ p: 3, backgroundColor: 'white', borderBottom: '1px solid #f0f0f0' }}>
                <Typography sx={{ color: '#888', fontSize: '0.9rem', mb: 0.5 }}>
                    {highlightSubtitle}
                </Typography>
                <Typography sx={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#333', lineHeight: 1.2 }}>
                    {highlightTitle}
                </Typography>
            </Box>

            <Box sx={{ p: 3, backgroundColor: 'white' }}>
                <Typography sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, color: '#555', fontSize: '0.95rem' }}>
                    {content}
                </Typography>
            </Box>

            {/* REVISED: 버튼 렌더링 로직을 배열 기반으로 수정 */}
            {buttons && buttons.length > 0 && (
                <Box sx={{ px: 2, pb: 2, pt: 1, backgroundColor: 'white' }}>
                    <Stack spacing={1}>
                        {buttons.map((button, index) => (
                            <Button
                                key={index}
                                fullWidth
                                variant="contained"
                                sx={{
                                    backgroundColor: '#f5f5f5',
                                    color: '#333',
                                    boxShadow: 'none',
                                    borderRadius: '8px',
                                    py: 1.2,
                                    fontWeight: 'bold',
                                    '&:hover': { backgroundColor: '#e0e0e0' }
                                }}
                            >
                                {button.text}
                            </Button>
                        ))}
                    </Stack>
                </Box>
            )}
        </Paper>
    );
};

export default KakaoHighlightTemplate;