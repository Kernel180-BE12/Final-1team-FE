import {
    Box,
    Typography,
    Button,
    Paper,
    Chip,
    IconButton,
} from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';

/**
 * 
 * @description 저장된 모든 템플릿을 모아보는 보관함 페이지
 * @returns {React.ReactElement} MyTemplatesPage 컴포넌트
 */
const MyTemplatePage = () => {
    // 저장된 템플릿 목록. 후에 API와 연결함(임시 더미 데이터)
    
    const savedTemplates = [
        { id: 1, title: '국가 검진 안내', type: '메시지형', content: '안녕하세요, #{고객명}님. #{발신 스페이스}입니다.올해 국가검진 대상자인 직원분들께 발송되는 메시지입니다...' },
        { id: 2, title: '회사소개서 발송', type: '문서연결형', content: '요청하신 회사소개서를 보내드립니다! 확인 후 연락주세요...' },
        { id: 3, title: '서비스 소개서 발송', type: '링크연결형', content: '요청하신 서비스 소개서가 발송되었습니다. 확인해주세요...' },
        { id: 4, title: '회원가입 완료', type: '메시지형', content: '회원가입을 축하합니다! #{고객명}님의 가입이 정상적으로 완료되었습니다.' },
        { id: 5, title: '쿠폰 발급 안내', type: '메시지형', content: '안녕하세요! #{고객명}님께만 드리는 특별 쿠폰이 발급되었습니다.' },
        { id: 6, title: '주문 발송 안내', type: '링크연결형', content: '주문하신 상품이 발송되었습니다. 송장번호: #{송장번호}' },
        { id: 7, title: '예약 확인 안내', type: '메시지형', content: '#{고객명}님, #{예약일시}에 예약이 확정되었습니다. 잊지 말고 방문해주세요.' },
        { id: 8, title: '제품 브로슈어', type: '문서연결형', content: '신제품 브로슈어를 첨부하여 보내드립니다. 검토 후 피드백 부탁드립니다.' },
        { id: 9, title: '설문조사 참여 요청', type: '링크연결형', content: '서비스 개선을 위한 설문조사에 참여해주세요. 참여하기: #{링크}' },
        { id: 10, title: '비밀번호 재설정', type: '메시지형', content: '비밀번호 재설정을 위한 인증번호는 [#{인증번호}] 입니다.' },
        { id: 11, title: '블로그 새 글 알림', type: '링크연결형', content: '새로운 글이 포스팅되었습니다! 지금 바로 확인해보세요. 제목: #{글제목}' },
        { id: 12, title: '세금계산서 발행 안내', type: '문서연결형', content: '요청하신 세금계산서가 발행되었습니다. 국세청 홈택스에서 확인 가능합니다.' },
        { id: 13, title: '추석 감사 인사', type: '메시지형', content: '풍요로운 한가위 보내세요. 저희 서비스를 이용해주셔서 항상 감사합니다.' },
        { id: 14, title: '앱 다운로드 링크', type: '링크연결형', content: '더 편리한 서비스 이용을 위해 앱을 다운로드하세요! 다운로드: #{앱링크}' },
    ];

    // 타입에 따라 Chip의 색상을 결정하는 함수
    const getTypeColor = (type: string) => {
        if (type === '메시지형') return 'primary';
        if (type === '문서연결형') return 'success';
        if (type === '링크연결형') return 'warning';
        return 'default';
    }

    return (
        <Box>
            { /* 페이지 상단 헤더 */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                    내가 만든 템플릿
                </Typography>
                {/* <Button variant="contained" size="large">
                    새 템플릿 만들기
                </Button> */}
            </Box>

            {/* 반응형 */}
            <Box
                sx={{
                    display: 'grid',
                    rowGap: 8,
                    columnGap: 3,

                    // 화면 크기에 따라 한 줄에 표시될 카드 개수를 조절
                    gridTemplateColumns: {
                        xs: 'repeat(1, 1fr)', // 가장 작은 화면: 1개
                        sm: 'repeat(2, 1fr)', // 작은 화면: 2개
                        md: 'repeat(2, 1fr)',
                        lg: 'repeat(3, 1fr)', // 중간 화면: 3개
                        xl: 'repeat(4, 1fr)', // 큰 화면: 4개
                    },
                }}
            >
                {savedTemplates.map((template) => (
                    <Paper
                        key={template.id}
                        variant="outlined"
                        sx={{
                        p: 2.5,
                        borderColor: '#e0e0e0',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        }}
                    >
                        {/* 카드 상단 헤더 */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                            <Chip label={template.type} color={getTypeColor(template.type)} size="small" />
                            <IconButton size="small">
                                <StarBorderIcon fontSize="small" />
                            </IconButton>
                        </Box>

                        {/* 카드 내부에 템플릿 미리보기 */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                backgroundColor: '#f5f5f5',
                                borderRadius: '8px',
                                flexGrow: 1,
                                my: 2,
                            }}
                        >
                            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                {template.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 4,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}>
                                {template.content}
                            </Typography>
                        </Paper>

                    
                       {/* 카드 하단 버튼 */}
                        <Button fullWidth variant="text" sx={{ justifyContent: 'flex-start' }}>
                            자세히 보기
                        </Button>
                    </Paper>
                ))}
            </Box>
        </Box>
    );
};

export default MyTemplatePage;
