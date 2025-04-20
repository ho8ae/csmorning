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
      className={`flex items-center justify-center w-full py-3 px-4 bg-[#ffe813] hover:bg-yellow-500 text-gray-800 font-medium rounded-lg transition-colors ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <img
        src="/logo/kakaoLogo.png"
        alt="KakaoTalk"
        className="w-6 h-6 mr-2"
      />
      {text}
    </motion.button>
  );
};

export default KakaoLoginButton;