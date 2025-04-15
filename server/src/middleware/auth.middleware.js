const jwt = require('jsonwebtoken');
const { prisma } = require('../config/db');

/**
 * JWT 토큰 생성
 * @param {Object} payload - 토큰에 저장할 데이터
 * @returns {string} JWT 토큰
 */
const generateToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: '7d' } // 토큰 유효기간 7일
  );
};

/**
 * 인증 미들웨어
 * 요청 헤더의 Authorization 토큰을 검증하고 사용자 정보를 req.user에 추가
 */
const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: '인증이 필요합니다.'
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '사용자를 찾을 수 없습니다.'
      });
    }
    
    // 요청 객체에 사용자 정보 추가
    req.user = user;
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: '토큰이 만료되었습니다.'
      });
    }
    
    return res.status(401).json({
      success: false,
      message: '인증에 실패했습니다.'
    });
  }
};

/**
 * 관리자 권한 확인 미들웨어
 * 사용자가 관리자 역할을 가지고 있는지 확인
 */
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: '인증이 필요합니다.'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: '관리자 권한이 필요합니다.'
    });
  }

  next();
};

/**
 * 미들웨어 체인을 만들어 인증과 권한 검사를 순차적으로 수행
 */
const authAdmin = [isAuthenticated, isAdmin];

module.exports = {
  generateToken,
  isAuthenticated,
  isAdmin,
  authAdmin
};