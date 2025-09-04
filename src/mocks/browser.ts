import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// 위에서 만든 핸들러들을 사용해 Mock 서버를 설정합니다.
export const worker = setupWorker(...handlers);