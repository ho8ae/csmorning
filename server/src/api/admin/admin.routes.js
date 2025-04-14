const express = require('express');
const router = express.Router();
const adminController = require('./admin.controller');
const validate = require('../../middleware/validation.middleware');
const adminValidation = require('./admin.validation');

// 관리자 인증 미들웨어
const authenticateAdmin = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  // 개발 환경에서는 인증 통과 (나중에 실제 구현 필요)
  if (process.env.NODE_ENV === 'development' || apiKey === process.env.ADMIN_API_KEY) {
    return next();
  }
  
  return res.status(401).json({
    success: false,
    message: '인증에 실패했습니다'
  });
};

// 모든 라우트에 인증 미들웨어 적용
router.use(authenticateAdmin);

// 사용자 관리
router.get('/users', adminController.getAllUsers);

// 응답 통계
router.get('/stats/responses', adminController.getResponseStats);

// 기부 통계
router.get('/stats/donations', adminController.getDonationStats);

// 질문 수동 전송
router.post(
  '/questions/send', 
  validate(adminValidation.sendQuestionSchema), 
  adminController.sendQuestion
);

module.exports = router;