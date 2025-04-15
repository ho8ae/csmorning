import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

/**
 * 보호된 라우트 컴포넌트
 * 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
 * 
 * @param {Object} props 
 * @param {string} props.requiredRole - 접근에 필요한 역할 (선택 사항)
 */
const ProtectedRoute = ({ requiredRole }) => {
  const { isAuthenticated, user } = useAuthStore();
  
  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // 특정 역할이 필요한 경우, 해당 역할을 확인
  if (requiredRole && user?.role !== requiredRole) {
    // 권한이 없는 경우, 대시보드 또는 홈으로 리다이렉트
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }
  
  // 인증되고 권한이 있는 경우 자식 라우트 렌더링
  return <Outlet />;
};

export default ProtectedRoute;