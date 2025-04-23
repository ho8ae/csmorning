// services/kakaoAuth.js
import axios from 'axios';

const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
const KAKAO_REDIRECT_URI = `${window.location.origin}/api/auth/kakao/callback`;

/**
 * 카카오 로그인 URL 생성 (추가 동의 항목 포함)
 * @returns {string} 카카오 로그인 URL
 */
export const getKakaoAuthUrl = () => {
  // 요청할 추가 동의 항목들
  const scope = [
    'profile_nickname',
    'profile_image', 
    'account_email',
    'gender',
    'age_range',
    'birthday',
    'birthyear',
    'phone_number'
  ].join(',');

  return `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code&scope=${scope}`;
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


/**
 * 카카오 싱크 하프뷰 로그인 URL 생성
 * @returns {string} 카카오 싱크 로그인 URL
 */
export const getKakaoSyncUrl = () => {
  const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
  const KAKAO_SYNC_REDIRECT_URI = `${window.location.origin}/api/auth/kakao/sync-callback`;
  const KAKAO_SYNC_CONTINUE_URL = `${window.location.origin}/kakao-sync-success`;
  
  // continue_url은 인증 완료 후 리다이렉트될 URL (사용자에게 보여질 페이지)
  return `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_SYNC_REDIRECT_URI}&response_type=code&continue=${KAKAO_SYNC_CONTINUE_URL}`;
};

/**
 * 카카오 싱크 성공 후 URL 파라미터에서 토큰 추출 및 저장
 * @returns {object|null} 사용자 정보 또는 null
 */
export const handleKakaoSyncSuccess = () => {
  // URL 파라미터에서 토큰과 사용자 ID 추출
  const urlParams = new URLSearchParams(window.location.search);
  const authToken = urlParams.get('auth_token');
  const userId = urlParams.get('user_id');
  
  if (authToken && userId) {
    // 토큰 저장
    localStorage.setItem('token', authToken);
    localStorage.setItem('user_id', userId);
    
    // URL 파라미터 정리 (선택 사항)
    window.history.replaceState({}, document.title, window.location.pathname);
    
    return { authToken, userId };
  }
  
  return null;
};

