// import { useState, useEffect } from 'react';
// import { Typography } from '@mui/material';

// // 컴포넌트가 받을 props 타입을 정의합니다.
// interface TypingEffectProps {
//   /** 화면에 타이핑될 전체 텍스트 */
//   text: string;
//   /** 한 글자가 나타나는 속도 (ms 단위) */
//   speed?: number;
//   /** 타이핑이 완료된 후 호출될 함수 */
//   onComplete?: () => void;
// }

// const TypingEffect = ({ text, speed = 40, onComplete = () => {} }: TypingEffectProps) => {
//   const [displayedText, setDisplayedText] = useState('');

//   useEffect(() => {
//     // text 내용이 바뀔 때마다 처음부터 다시 타이핑하도록 초기화합니다.
//     setDisplayedText('');
    
//     // 텍스트가 비어있으면 즉시 완료 처리합니다.
//     if (!text) {
//         onComplete();
//         return;
//     }

//     let i = 0;
//     const intervalId = setInterval(() => {
//       // 클로저 문제를 피하기 위해 함수형 업데이트를 사용합니다.
//       setDisplayedText(prev => prev + text.charAt(i));
//       i++;
//       if (i >= text.length) {
//         clearInterval(intervalId);
//         onComplete();
//       }
//     }, speed);

//     // 컴포넌트가 언마운트되거나 text가 바뀌면 인터벌을 정리합니다.
//     return () => clearInterval(intervalId);
//   }, [text, speed, onComplete]);

//   return (
//     <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
//       {displayedText}
//     </Typography>
//   );
// };

// export default TypingEffect;
