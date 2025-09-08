import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

/**
 * @description 로그인된 사용자만 접근 가능한 페이지를 보호하는 보안요원 컴포넌트입니다.
 * @returns {React.ReactElement} 로그인 상태에 따라 페이지 또는 리다이렉트를 반환합니다.
 */
const PrivateRoute = () => {
  // Zustand 스토어(게시판)에서 현재 로그인 상태를 가져옵니다.
  const { isLoggedIn } = useAuthStore();

  // 만약 로그인 상태라면, 자식 페이지(<Outlet />)를 그대로 보여주고,
  // 아니라면 로그인 페이지로 보냅니다.
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;