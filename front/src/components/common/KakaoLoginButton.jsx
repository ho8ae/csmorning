import React from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { getKakaoAuthUrl } from '../../services/kakaoAuth';

const KakaoLoginButton = ({ text = '카카오로 시작하기', className = '' }) => {
  const handleKakaoLogin = () => {
    // 카카오 로그인 페이지로 리다이렉트
    window.location.href = getKakaoAuthUrl();
  };

  return (
    <motion.button
      onClick={handleKakaoLogin}
      className={`flex items-center justify-center w-full py-3 px-4 bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-medium rounded-lg transition-colors ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <svg 
        className="w-5 h-5 mr-2" 
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 3C6.48 3 2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10c0-5.52-4.48-10-10-10zm0 2.5c4.14 0 7.5 3.36 7.5 7.5 0 1.71-.57 3.29-1.54 4.55l1.56 1.56c.05-.19.08-.39.08-.59 0-1.38-1.12-2.5-2.5-2.5h-2.5v-2.5c0-1.38-1.12-2.5-2.5-2.5h-2.5v2.5h2.5v2.5h-2.5v2.5h5c.28 0 .5.22.5.5s-.22.5-.5.5h-5c-.83 0-1.5-.67-1.5-1.5v-7c0-.83.67-1.5 1.5-1.5h2.5c.83 0 1.5.67 1.5 1.5v.5h.5c.83 0 1.5.67 1.5 1.5v.5h.5c1.93 0 3.5 1.57 3.5 3.5 0 .54-.12 1.05-.34 1.51l1.56-1.56c-.98-1.26-1.56-2.84-1.56-4.55 0-4.14-3.36-7.5-7.5-7.5z"/>
      </svg>
      {text}
    </motion.button>
  );
};

export default KakaoLoginButton;