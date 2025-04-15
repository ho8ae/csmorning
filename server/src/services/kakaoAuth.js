// services/kakaoAuth.js
import axios from 'axios';

const KAKAO_REST_API_KEY = process.env.REACT_APP_KAKAO_REST_API_KEY;
const KAKAO_REDIRECT_URI = `${window.location.origin}/auth/kakao/callback`;

/**
 * 카카오 로그인 URL 생성
 * @returns {string} 카카오 로그인 URL
 */
export const getKakaoAuthUrl = () => {
  return `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;
};

/**
 * 카카오 인증 코드로 토큰 받기
 * @param {string} code - 인증 코드
 * @returns {Promise<Object>} 백엔드에서 반환한 응답 객체
 */
export const getKakaoToken = async (code) => {
  try {
    const response = await axios.post('/api/auth/kakao', { code });
    return response.data;
  } catch (error) {
    console.error('카카오 토큰 요청 실패:', error);
    throw error;
  }
};

/**
 * 로그아웃 처리
 * @returns {Promise<Object>} 로그아웃 응답
 */
export const logout = async () => {
  try {
    const response = await axios.post('/api/auth/logout');
    return response.data;
  } catch (error) {
    console.error('로그아웃 실패:', error);
    throw error;
  }
};