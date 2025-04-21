const authService = require('./auth.service');
const webhookService = require('../webhook/webhook.service');

/**
 * 관리자 로그인 처리
 */
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const result = await authService.login(username, password);
    
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 일반 회원가입 처리
 */
const register = async (req, res, next) => {
  try {
    const { 
      email, 
      password, 
      nickname, 
      name, 
      gender, 
      ageGroup, 
      birthDate, 
      birthYear, 
      phoneNumber 
    } = req.body;
    
    const result = await authService.register(
      email, 
      password, 
      nickname, 
      name, 
      gender, 
      ageGroup, 
      birthDate, 
      birthYear, 
      phoneNumber
    );
    
    return res.status(201).json({
      success: true,
      data: result,
      message: '회원가입이 완료되었습니다.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 카카오 로그인 처리
 */
const kakaoLogin = async (req, res, next) => {
    console.log('카카오 로그인 요청 받음:', req.query);
    try {
      const code = req.query.code;
      if (!code) {
        console.log('코드 누락됨');
        return res.status(400).json({
          success: false,
          message: '인증 코드가 필요합니다.'
        });
      }
      
      console.log('인증 코드로 처리 시작:', code);
      const result = await authService.processKakaoLogin(code);
      
      console.log('카카오 로그인 성공:', result);
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('카카오 로그인 처리 에러:', error);
      next(error);
    }
  };

/**
 * 카카오 로그인 리다이렉트 처리
 */
const redirectToFrontendCallback = async (req, res) => {
    const { code } = req.query;
  
    if (!code) {
      return res.status(400).send('Missing code');
    }
  
    const redirectUrl = `${process.env.SERVICE_URL}/kakao/callback?code=${code}`;
    return res.redirect(redirectUrl);
  };
  

/**
 * 현재 인증된 사용자 정보 조회
 */
const getMe = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      data: {
        user: req.user
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 로그아웃 처리
 * (클라이언트 측에서 토큰 삭제 필요)
 */
const logout = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: '로그아웃되었습니다.'
  });
};


/**
 * 카카오 챗봇 계정 연동
 */
const linkKakaoChannel = async (req, res) => {
  try {
    const { linkCode } = req.body;
    const userId = req.user.id; // 현재 로그인한 사용자 ID
    
    if (!linkCode) {
      return res.status(400).json({
        success: false,
        message: '연동 코드가 제공되지 않았습니다.'
      });
    }
    
    // 계정 연동 수행
    const result = await webhookService.linkUserAccounts(req.prisma, linkCode, userId);
    
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error('카카오 챗봇 계정 연동 중 오류 발생:', error);
    return res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다.'
    });
  }
};

/**
 * 사용자 프리미엄 상태 업데이트
 */
const updatePremium = async (req, res, next) => {
  try {
    const userId = req.user.id; // 현재 로그인한 사용자 ID
    const { isPremium, premiumPlan } = req.body;
    
    // 프리미엄 상태 업데이트
    const updatedUser = await authService.updateUserPremium(userId, isPremium, premiumPlan);
    
    return res.status(200).json({
      success: true,
      data: { user: updatedUser },
      message: '프리미엄 상태가 업데이트되었습니다.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  kakaoLogin,
  getMe,
  logout,
  redirectToFrontendCallback,
  linkKakaoChannel,
  register,
  updatePremium
};