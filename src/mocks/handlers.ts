import { http, HttpResponse } from 'msw';

interface LoginRequestBody {
  username?: string;
  password?: string;
}

export const handlers = [
  http.post('/api/user/login', async ({ request }) => {
    // 2. request.json()의 결과를 위에서 정의한 타입으로 지정(type assertion)합니다.
    const userInfo = (await request.json()) as LoginRequestBody;

    // 3. 이제 userInfo.username, userInfo.password에 안전하게 접근할 수 있습니다.
    if (userInfo.username === 'test' && userInfo.password === 'password') {
      return HttpResponse.json(
        {
          userId: 1,
          username: 'testuser',
        },
        {
          status: 200,
        }
      );
    } else {
      return new HttpResponse(null, {
        status: 401,
        statusText: 'Invalid credentials',
      });
    }
  }),
];
