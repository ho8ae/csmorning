import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleKakaoSyncSuccess } from '../../services/kakaoAuth';

const KakaoSyncSuccessPage = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // URL 파라미터에서 토큰 추출 및 저장
    const result = handleKakaoSyncSuccess();
    
    if (result) {
      setIsSuccess(true);
      // 잠시 후 메인/대시보드 페이지로 이동
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } else {
      // 토큰이 없으면 로그인 페이지로 이동
      navigate('/login', { state: { error: '카카오 로그인에 실패했습니다.' } });
    }
  }, [navigate]);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {isSuccess ? (
        <>
          <h1 className="text-2xl font-bold mb-4">로그인 성공!</h1>
          <p className="text-gray-600 mb-8">잠시 후 자동으로 이동합니다.</p>
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </>
      ) : (
        <p className="text-gray-600">로그인 처리 중...</p>
      )}
    </div>
  );
};

export default KakaoSyncSuccessPage;