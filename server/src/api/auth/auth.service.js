const axios = require('axios');
const qs = require('qs');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { generateToken } = require('../../middleware/auth.middleware');
const createError = require('http-errors');

/**
 * 관리자 로그인 처리
 * @param {string} username - 이메일 주소
 * @param {string} password - 비밀번호
 * @returns {Promise<Object>} 토큰과 사용자 정보
 */
const login = async (username, password) => {
  // 이메일로 사용자 조회
  const user = await prisma.user.findUnique({
    where: { email: username }
  });
  
  // 사용자가 없거나 비밀번호가 일치하지 않는 경우
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw createError(401, '아이디 또는 비밀번호가 올바르지 않습니다.');
  }
  
  // 관리자가 아닌 경우
  if (user.role !== 'admin') {
    throw createError(403, '관리자 권한이 없습니다.');
  }
  
  // JWT 토큰 생성
  const token = generateToken({ userId: user.id });
  
  // 비밀번호 필드 제외하고 응답
  const { password: _, ...userWithoutPassword } = user;
  
  return {
    token,
    user: userWithoutPassword
  };
};

/**
 * 카카오 로그인 처리
 * @param {string} code - 카카오 인증 코드
 * @returns {Promise<Object>} 토큰과 사용자 정보
 */
const processKakaoLogin = async (code) => {
  // 카카오 토큰 받기
  const tokenResponse = await axios.post(
    'https://kauth.kakao.com/oauth/token',
    qs.stringify({
      grant_type: 'authorization_code',
      client_id: process.env.KAKAO_REST_API_TEST_KEY,
      redirect_uri: process.env.KAKAO_REDIRECT_URI,
      code: code
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    }
  );

  console.log('카카오 토큰 정보:', tokenResponse.data);

  
  const { access_token } = tokenResponse.data;
  
  // 카카오 사용자 정보 가져오기
  const userResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
  });
  
  const kakaoAccount = userResponse.data.kakao_account;
  const { id: kakaoId } = userResponse.data;
  
  // 기존 사용자 조회
  let user = await prisma.user.findUnique({
    where: { kakaoId: kakaoId.toString() }
  });
  
  // 신규 사용자인 경우 등록
  if (!user) {
    user = await prisma.user.create({
      data: {
        kakaoId: kakaoId.toString(),
        nickname: kakaoAccount.profile?.nickname || `사용자${Math.floor(1000 + Math.random() * 9000)}`,
        profileImage: kakaoAccount.profile?.thumbnail_image_url,
        isSubscribed: true,
        role: 'user' // 일반 사용자 역할 부여
      }
    });
  }
  
  // JWT 토큰 생성
  const token = generateToken({ userId: user.id });
  
  return {
    token,
    user
  };
};

module.exports = {
  login,
  processKakaoLogin
};