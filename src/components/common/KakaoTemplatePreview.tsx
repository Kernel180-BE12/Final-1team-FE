import { Box, Paper, Typography, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';

// --- 타입 정의 ---
// 이 컴포넌트가 받을 데이터의 모양(타입)을 정의합니다.
export interface TemplateData {
    title: string;
    body: string;
    image_url?: string | null;
    buttons?: [string, string][] | null;
}

// --- 스타일 및 헬퍼 컴포넌트 ---
const Placeholder = styled('span')({
    color: '#3b82f6',
    fontWeight: 'bold',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    padding: '2px 4px',
    borderRadius: '4px',
});

const renderTemplateWithPlaceholders = (text: string) => (
    <>{text.split(/(#{\w+})/g).map((part, index) => (
        /#{\w+}/.test(part) ? <Placeholder key={index}>{part}</Placeholder> : part
    ))}</>
);

// --- 메인 컴포넌트 ---
// 이제 이 컴포넌트는 어디서든 가져다 쓸 수 있는 "공용 부품"이 되었습니다.
const KakaoTemplatePreview = ({ template }: { template: TemplateData }) => {
    const { title, body, image_url, buttons } = template;
    const today = new Date();
    const dateString = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;

    return (
        <Box sx={{ p: '12px', bgcolor: '#b2c7d9', fontFamily: 'sans-serif', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
                <Typography sx={{ bgcolor: 'rgba(0,0,0,0.1)', color: '#fff', fontSize: '11px', fontWeight: 'bold', px: 1.5, py: 0.5, borderRadius: '12px' }}>
                    {dateString}
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Avatar variant="rounded" src="data:image/svg+xml;..." sx={{ width: 40, height: 40, mr: 1, borderRadius: '14px' }} />
                <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: '13px', fontWeight: 400, color: '#000', mb: 0.5 }}>자버 채널</Typography>
                    <Paper sx={{ position: 'relative', borderRadius: '18px', /* ... 나머지 스타일 ... */ }}>
                        <Box sx={{ bgcolor: '#FFEB00', p: '10px 12px' }}>
                            <Typography sx={{ fontSize: '12px', color: '#000', fontWeight: 'bold' }}>알림톡 도착</Typography>
                        </Box>
                        <Box sx={{ p: '16px' }}>
                            {image_url && <Box component="img" src={image_url} alt="Preview" sx={{ mb: 1.5, width: '100%', borderRadius: '10px' }} />}
                            <Typography variant="h6" sx={{ fontSize: '17px', fontWeight: 'bold', mb: 1, color: '#000' }}>{renderTemplateWithPlaceholders(title)}</Typography>
                            <Typography component="div" sx={{ fontSize: '15px', whiteSpace: 'pre-wrap', lineHeight: 1.5, color: '#333' }}>{renderTemplateWithPlaceholders(body)}</Typography>
                        </Box>
                        {buttons && buttons.length > 0 && (
                            <Box sx={{ borderTop: '1px solid #f0f0f0' }}>
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

export default KakaoTemplatePreview;
