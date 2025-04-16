const authService = require('./auth.service');

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

module.exports = {
  login,
  kakaoLogin,
  getMe,
  logout,
  redirectToFrontendCallback
};