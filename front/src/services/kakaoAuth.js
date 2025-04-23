// services/kakaoAuth.js
import axios from 'axios';
const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
// 프론트엔드 라우트로 변경 (백엔드가 아닌 프론트엔드에서 처리)
const KAKAO_REDIRECT_URI = `${window.location.origin}/api/auth/kakao/callback`;

/**
 * 카카오 로그인 URL 생성
 * @returns {string} 카카오 로그인 URL
 */
export const getKakaoAuthUrl = () => {
  return `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;
};

export const getKakaoToken = async (code) => {
  try {
    const response = await axios.get(`/api/auth/kakao?code=${code}`);
    return response.data;
  } catch (error) {
    console.error('카카오 토큰 요청 실패:', error);
    throw error;
  }
};