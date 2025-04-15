import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const KakaoCallbackPage = () => {
  const location = useLocation();
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const { loginWithKakao, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const processKakaoLogin = async () => {
      // URL에서 인증 코드 추출
      const params = new URLSearchParams(location.search);
      const code = params.get('code');
      
      if (!code) {
        setError('인증 코드가 없습니다.');
        setIsProcessing(false);
        return;
      }
      
      try {
        // 카카오 로그인 처리
        await loginWithKakao(code);
        setIsProcessing(false);
      } catch (error) {
        console.error('카카오 로그인 처리 중 오류:', error);
        setError('로그인 처리 중 오류가 발생했습니다.');
        setIsProcessing(false);
      }
    };
    
    processKakaoLogin();
  }, [location, loginWithKakao]);

  // 이미 인증되었거나 처리가 완료된 경우
  if (!isProcessing && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        {isProcessing ? (
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">카카오 로그인 처리 중...</p>
          </div>
        ) : error ? (
          <div className="text-center">
            <div className="w-16 h-16 flex items-center justify-center mx-auto bg-red-100 rounded-full">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h2 className="mt-4 text-xl font-semibold text-gray-800">로그인 실패</h2>
            <p className="mt-2 text-red-500">{error}</p>
            <button
              onClick={() => window.location.href = '/'}
              className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
            >
              홈으로 돌아가기
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default KakaoCallbackPage;