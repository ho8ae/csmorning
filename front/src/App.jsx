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
import DashboardPage from './pages/DashboardPage';

// auth 페이지
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// admin 페이지
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import QuestionsListPage from './pages/admin/QuestionsListPage';
import NewQuestionPage from './pages/admin/NewQuestionPage';
import EditQuestionPage from './pages/admin/EditQuestionPage';
import UsersListPage from './pages/admin/UsersListPage';

// kakao login 관려 페이지
import KakaoLinkPage from './pages/kakao/KakaoLinkPage';
import KakaoCallbackPage from './pages/kakao/KakaoCallbackPage';

// payment 페이지
import PremiumFeaturesPage from './pages/payment/PremiumFeaturesPage';
import PaymentSuccessPage from './pages/payment/PaymentSuccessPage';
import CheckoutPage from './pages/payment/CheckoutPage';

// legal 페이지
import SubscriptionTermsPage from './pages/legal/SubscriptionTermsPage';
import RefundPolicyPage from './pages/legal/RefundPolicyPage';
import TermsPage from './pages/legal/TermsPage';
import PrivacyContentPage from './pages/legal/PrivacyContentPage';

// debate 페이지
import DebateDetailPage from './pages/debate/DebateDetailPage';
import DebateListPage from './pages/debate/DebateListPage';

function App() {
  const { checkAuth } = useAuthStore();

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
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/kakao/callback" element={<KakaoCallbackPage />} />

        {/* 카카오 싱크 로그인 페이지 */}
        <Route path="/kakao-sync-success" element={<KakaoCallbackPage />} />

        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyContentPage />} />
        <Route path="/kakao-link" element={<KakaoLinkPage />} />

        <Route path="/premium-features" element={<PremiumFeaturesPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/payment-success" element={<PaymentSuccessPage />} />
        <Route path="/subscription-terms" element={<SubscriptionTermsPage />} />
        <Route path="/refund-policy" element={<RefundPolicyPage />} />

        <Route path="/premium/discussions" element={<DebateListPage />} />
        <Route path="/premium/discussions/:id" element={<DebateDetailPage />} />

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
