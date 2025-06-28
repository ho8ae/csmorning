import React from 'react';
import { getKakaoSyncUrl } from '../../services/kakaoAuth';

const KakaoSyncLoginButton = () => {
  const handleKakaoSyncLogin = () => {
    const kakaoSyncUrl = getKakaoSyncUrl();
    // 하프뷰 형태로 열기 (팝업 또는 현재 창에서 열기 가능)
    window.location.href = kakaoSyncUrl;
  };
  
  return (
    <button 
      onClick={handleKakaoSyncLogin}
      className="px-4 py-2 bg-yellow-400 text-black font-semibold rounded-md flex items-center justify-center hover:bg-yellow-500 transition-colors"
    >
      <img 
        src="/assets/kakao-icon.png" 
        alt="Kakao" 
        className="w-5 h-5 mr-2" 
      />
      카카오로 시작하기
    </button>
  );
};

export default KakaoSyncLoginButton;