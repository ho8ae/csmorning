const express = require('express');
const router = express.Router();
const adminController = require('./admin.controller');
const validate = require('../../middleware/validation.middleware');
const adminValidation = require('./admin.validation');
const { authAdmin, isAuthenticated, isAdmin } = require('../../middleware/auth.middleware');  // JWT 인증 미들웨어 불러오기

// 모든 라우트에 JWT 인증 미들웨어 적용
router.use(authAdmin);  // isAuthenticated와 isAdmin을 함께 체크하는 미들웨어

// 사용자 관리
router.get('/users', adminController.getAllUsers);

//
router.post('/kakao-tokens',isAuthenticated,isAdmin, adminController.setKakaoTokens);

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