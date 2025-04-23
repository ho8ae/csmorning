const axios = require('axios');
const qs = require('qs');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { generateToken } = require('../../middleware/auth.middleware');
const createError = require('http-errors');

/**
 * 로그인 처리 (관리자 및 일반 사용자)
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
 * 일반 회원가입 처리
 * @param {string} email - 이메일 주소
 * @param {string} password - 비밀번호
 * @param {string} nickname - 닉네임
 * @param {string} name - 이름
 * @param {string} gender - 성별 (male/female)
 * @param {string} ageGroup - 연령대 (10~19, 20~29 등)
 * @param {Date} birthDate - 생일
 * @param {number} birthYear - 출생연도
 * @param {string} phoneNumber - 전화번호
 * @returns {Promise<Object>} 토큰과 사용자 정보
 */
const register = async (
  email, 
  password, 
  nickname,
  name,
  gender,
  ageGroup,
  birthDate,
  birthYear,
  phoneNumber
) => {
  // 이메일 중복 확인
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });
  
  if (existingUser) {
    throw createError(409, '이미 사용 중인 이메일입니다.');
  }
  
  // 전화번호 중복 확인
  const existingPhoneUser = await prisma.user.findFirst({
    where: { phoneNumber }
  });
  
  if (existingPhoneUser) {
    throw createError(409, '이미 사용 중인 전화번호입니다.');
  }
  
  // 비밀번호 해싱
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // 회원 생성
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      nickname,
      name,
      gender,
      ageGroup,
      birthDate: new Date(birthDate),
      birthYear,
      phoneNumber,
      isSubscribed: true,
      role: 'user'
    }
  });
  
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

  const { access_token, refresh_token, expires_in, refresh_token_expires_in } = tokenResponse.data;

  console.log('카카오 토큰 정보:', {
    access_token,
    refresh_token,
    expires_in,
    refresh_token_expires_in
  });
  
  // 카카오 사용자 정보 가져오기
  const userResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
  });
  
  const kakaoAccount = userResponse.data.kakao_account;
  const { id: kakaoId } = userResponse.data;
  
  console.log('카카오 사용자 정보:', {
    kakaoId,
    has_email: !!kakaoAccount.email,
    has_profile: !!kakaoAccount.profile,
    has_gender: !!kakaoAccount.gender,
    has_age_range: !!kakaoAccount.age_range,
    has_birthday: !!kakaoAccount.birthday,
    has_phone_number: !!kakaoAccount.phone_number
  });
  
  // 기존 사용자 조회
  let user = await prisma.user.findUnique({
    where: { kakaoId: kakaoId.toString() }
  });
  
  // 신규 사용자인 경우 등록
  if (!user) {
    // 생일 처리 (MMDD 형식을 Date 객체로 변환)
    let birthDate = null;
    if (kakaoAccount.birthday) {
      const month = kakaoAccount.birthday.substring(0, 2);
      const day = kakaoAccount.birthday.substring(2, 4);
      const year = kakaoAccount.birthyear || new Date().getFullYear();
      birthDate = new Date(year, month - 1, day);
    }
    
    // 사용자 생성 데이터 준비
    const userData = {
      kakaoId: kakaoId.toString(),
      nickname: kakaoAccount.profile?.nickname || `사용자${Math.floor(1000 + Math.random() * 9000)}`,
      profileImage: kakaoAccount.profile?.thumbnail_image_url,
      email: kakaoAccount.has_email === true ? kakaoAccount.email : null,
      gender: kakaoAccount.has_gender === true ? kakaoAccount.gender : null,
      ageGroup: kakaoAccount.has_age_range === true ? kakaoAccount.age_range : null,
      birthDate: birthDate,
      birthYear: kakaoAccount.birthyear ? parseInt(kakaoAccount.birthyear) : null,
      phoneNumber: kakaoAccount.has_phone_number === true ? kakaoAccount.phone_number : null,
      isSubscribed: true,
      role: 'user' // 일반 사용자 역할 부여
    };
    
    console.log('신규 사용자 생성 데이터:', userData);
    
    // 사용자 생성
    user = await prisma.user.create({
      data: userData
    });
    
    console.log('신규 카카오 사용자 생성 완료:', user.id);
  } else {
    console.log('기존 카카오 사용자 발견:', user.id);
    
    // 기존 사용자 정보 업데이트 (선택 사항)
    // 프로필 이미지, 이메일 등이 변경되었을 수 있으므로 업데이트
    const updateData = {};
    
    if (kakaoAccount.profile?.thumbnail_image_url) {
      updateData.profileImage = kakaoAccount.profile.thumbnail_image_url;
    }
    
    if (kakaoAccount.has_email === true && kakaoAccount.email && !user.email) {
      updateData.email = kakaoAccount.email;
    }
    
    // 업데이트할 내용이 있는 경우에만 업데이트 수행
    if (Object.keys(updateData).length > 0) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: updateData
      });
      console.log('카카오 사용자 정보 업데이트 완료:', user.id);
    }
  }
  
  // JWT 토큰 생성
  const token = generateToken({ userId: user.id });
  
  return {
    token,
    user,
    access_token, // 카카오 access_token
    refresh_token, // 카카오 refresh_token
  };
};

/**
 * 사용자 프리미엄 상태 업데이트
 * @param {number} userId - 사용자 ID
 * @param {boolean} isPremium - 프리미엄 여부
 * @param {string} premiumPlan - 프리미엄 플랜 (1개월, 6개월, 12개월)
 * @returns {Promise<Object>} 업데이트된 사용자 정보
 */
const updateUserPremium = async (userId, isPremium, premiumPlan) => {
  // 사용자 존재 여부 확인
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  
  if (!user) {
    throw createError(404, '사용자를 찾을 수 없습니다.');
  }
  
  // 프리미엄 종료 날짜 계산
  let premiumUntil = null;
  if (isPremium && premiumPlan) {
    let months = 0;
    switch (premiumPlan) {
      case '1개월':
        months = 1;
        break;
      case '6개월':
        months = 6;
        break;
      case '12개월':
      case '1년':
        months = 12;
        break;
      default:
        months = 1;
    }
    
    premiumUntil = new Date();
    premiumUntil.setMonth(premiumUntil.getMonth() + months);
  }
  
  // 사용자 정보 업데이트
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      isPremium,
      premiumUntil
    }
  });
  
  // 비밀번호 필드 제외하고 응답
  const { password: _, ...userWithoutPassword } = updatedUser;
  
  return userWithoutPassword;
};


/**
 * 카카오 사용자 정보로 회원 찾거나 생성
 * @param {object} userInfo - 카카오 사용자 정보
 * @returns {Promise<object>} 사용자 정보
 */
async function findOrCreateKakaoUser(userInfo) {
  const kakaoId = userInfo.id.toString();
  
  // 기존 사용자 찾기
  let user = await prisma.user.findFirst({
    where: { kakaoId }
  });
  
  if (!user) {
    const kakaoAccount = userResponse.data.kakao_account;
    
    // 생일 처리 (MMDD 형식을 Date 객체로 변환)
    let birthDate = null;
    if (kakaoAccount.birthday) {
      const month = kakaoAccount.birthday.substring(0, 2);
      const day = kakaoAccount.birthday.substring(2, 4);
      const year = kakaoAccount.birthyear || new Date().getFullYear();
      birthDate = new Date(year, month - 1, day);
    }
    
    user = await prisma.user.create({
      data: {
        kakaoId: kakaoId.toString(),
        nickname: kakaoAccount.profile?.nickname || `사용자${Math.floor(1000 + Math.random() * 9000)}`,
        profileImage: kakaoAccount.profile?.thumbnail_image_url,
        email: kakaoAccount.email,
        gender: kakaoAccount.gender,
        ageGroup: kakaoAccount.age_range,
        birthDate: birthDate,
        birthYear: kakaoAccount.birthyear ? parseInt(kakaoAccount.birthyear) : null,
        phoneNumber: kakaoAccount.phone_number,
        isSubscribed: true,
        role: 'user'
      }
    });
    
    console.log('카카오 사용자 신규 생성:', user.id);
  } else {
    console.log('기존 카카오 사용자 발견:', user.id);
  }
  
  return user;
}

module.exports = {
  login,
  processKakaoLogin,
  register,
  updateUserPremium,
  findOrCreateKakaoUser
};