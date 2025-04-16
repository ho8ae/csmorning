import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useEffect } from 'react';
import useAuthStore from './store/authStore';

// 일반 페이지
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import KakaoCallbackPage from './pages/KakaoCallbackPage';
import DashboardPage from './pages/DashboardPage';

// 관리자 페이지
import AdminDashboardPage from './pages/AdminDashboardPage';
import QuestionsListPage from './pages/admin/QuestionsListPage';
import NewQuestionPage from './pages/admin/NewQuestionPage';
import EditQuestionPage from './pages/admin/EditQuestionPage';
import UsersListPage from './pages/admin/UsersListPage';
import TermsPage from './pages/TermsPage';


function App() {
  const { checkAuth, isAuthenticated } = useAuthStore();

  // 초기 인증 상태 확인
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <Routes>
        {/* 공용 라우트 */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/kakao/callback" element={<KakaoCallbackPage />} />

        <Route path="/kakao-callback" element={<KakaoCallbackPage />} />
        
        <Route path="/terms" element={<TermsPage/>} />

        <Route path="/kakao-link" element={<KakaoLinkPage />} />

        {/* 사용자 인증 라우트 */}
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* 관리자 라우트 */}
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/questions" element={<QuestionsListPage />} />
        <Route path="/admin/questions/new" element={<NewQuestionPage />} />
        <Route path="/admin/questions/:id" element={<EditQuestionPage />} />
        <Route path="/admin/users" element={<UsersListPage />} />

        {/* 404 리다이렉트 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
