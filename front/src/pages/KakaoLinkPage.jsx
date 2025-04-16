import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import useAuthStore from '../store/authStore';

const KakaoLinkPage = () => {
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('연동 중입니다...');
  const { search } = useLocation();
  const navigate = useNavigate();
  const { token, isAuthenticated, checkAuth } = useAuthStore();
  
  useEffect(() => {
    const handleLinking = async () => {
      try {
        // URL 파라미터에서 연동 코드 추출
        const params = new URLSearchParams(search);
        const linkCode = params.get('code');
        
        if (!linkCode) {
          setStatus('error');
          setMessage('유효하지 않은 연동 코드입니다.');
          return;
        }
        
        // 인증 여부 확인
        if (!isAuthenticated) {
          await checkAuth();
        }
        
        if (!token) {
          // 로그인이 필요한 경우 처리
          setStatus('error');
          setMessage('계정 연동을 위해 먼저 로그인이 필요합니다.');
          setTimeout(() => {
            navigate('/login', { state: { redirectTo: `/kakao-link?code=${linkCode}` } });
          }, 2000);
          return;
        }
        
        // 계정 연동 요청
        const response = await authAPI.linkKakaoChannel(linkCode);
        
        setStatus('success');
        setMessage(response.message || '계정이 성공적으로 연동되었습니다.');
        
        // 3초 후 창 닫기 안내 또는 메인으로 리다이렉트
        setTimeout(() => {
          window.close(); // 웹뷰에서는 동작하지 않을 수 있음
          navigate('/'); // 웹뷰에서 창이 닫히지 않을 경우 메인으로 리다이렉트
        }, 3000);
        
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || '계정 연동에 실패했습니다.');
      }
    };
    
    handleLinking();
  }, [search, navigate, token, isAuthenticated, checkAuth]);
  
  // 상태에 따른 아이콘 및 색상
  const statusConfig = {
    loading: {
      icon: (
        <svg className="animate-spin w-12 h-12 text-blue-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ),
      color: 'text-blue-500',
    },
    success: {
      icon: (
        <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
      ),
      color: 'text-green-500',
    },
    error: {
      icon: (
        <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      ),
      color: 'text-red-500',
    },
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
        <div className="flex justify-center mb-4">
          {statusConfig[status].icon}
        </div>
        
        <h2 className={`text-xl font-semibold mb-2 ${statusConfig[status].color}`}>
          {status === 'loading' ? '처리 중...' : status === 'success' ? '연동 성공!' : '연동 실패'}
        </h2>
        
        <p className="text-gray-600 mb-4">{message}</p>
        
        {status === 'success' && (
          <p className="text-sm text-gray-500">잠시 후 자동으로 창이 닫힙니다...</p>
        )}
        
        {status === 'error' && (
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            홈으로 이동
          </button>
        )}
      </div>
    </div>
  );
};

export default KakaoLinkPage;