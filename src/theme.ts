import { createTheme } from '@mui/material/styles';

// 리퀴드 글래스 테마 정의
const liquidGlassTheme = createTheme({
  // [요청사항] 폰트 통일
  typography: {
    fontFamily: '"Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h4: {
      // PageLayout의 제목 폰트 스타일
      fontWeight: 700,
    },
    // 필요에 따라 다른 폰트 스타일도 정의 가능
  },
  
  // 컴포넌트 기본 스타일 오버라이드
  components: {
    // Paper 컴포넌트 (테이블, 카드 등의 배경)
    MuiPaper: {
      styleOverrides: {
        root: {
          // 리퀴드 글래스 효과의 핵심
          backgroundColor: 'rgba(255, 255, 255, 0.6)', // 반투명 흰색 배경
          backdropFilter: 'blur(12px)', // 뒷 배경 흐림 효과
          border: '1px solid rgba(255, 255, 255, 0.2)', // 은은한 테두리
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)', // 부드러운 그림자
          borderRadius: '16px', // 둥근 모서리
        },
      },
    },
    // 버튼 컴포넌트
    MuiButton: {
      styleOverrides: {
        // Contained(채워진) 버튼 스타일
        contained: {
          borderRadius: '12px', // 둥근 모서리
          fontWeight: 'bold',
          boxShadow: 'none', // 그림자 제거 (테마와 어울리게)
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            boxShadow: 'none',
            transform: 'scale(1.03)', // 호버 시 살짝 커지는 효과
          },
        },
      },
    },
    // 테이블 헤더 셀
    MuiTableCell: {
        styleOverrides: {
            head: {
                backgroundColor: 'transparent', // 헤더 배경 투명하게
                fontWeight: 'bold',
            }
        }
    },
    // Dialog (모달) 컴포넌트
    MuiDialog: {
        styleOverrides: {
            paper: { // 모달창에도 글래스 효과 적용
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
                borderRadius: '24px',
            }
        }
    }
  },
});

export default liquidGlassTheme;


// 필요하다면, 앱의 기본 테마도 여기에 정의할 수 있습니다.
// export const baseTheme = createTheme({
//     typography: {
//         fontFamily: '"Pretendard", sans-serif',
//     },
//     // ... 다른 기본 스타일
// });