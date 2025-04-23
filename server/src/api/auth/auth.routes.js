const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const { isAuthenticated, isAdmin, authAdmin } = require('../../middleware/auth.middleware');
const validate = require('../../middleware/validation.middleware');
const authValidation = require('./auth.validation');

// 일반 회원가입
router.post('/register', validate(authValidation.registerSchema), authController.register);

// 이메일 로그인 (관리자 및 일반 사용자)
router.post('/login', validate(authValidation.loginSchema), authController.login);

// 카카오 로그인 처리
router.get('/kakao', validate(authValidation.kakaoLoginSchema), authController.kakaoLogin);

// 현재 사용자 정보 조회
router.get('/me', isAuthenticated, authController.getMe);

// 로그아웃
router.post('/logout', authController.logout);

// 카카오 로그인 리다이렉트 처리
router.get('/kakao/callback', authController.redirectToFrontendCallback);

router.get('/kakao/sync-callback', authController.handleKakaoSyncCallback);

// 카카오 채널 연동
router.post('/link-kakao-channel', isAuthenticated, authController.linkKakaoChannel);

// 프리미엄 상태 업데이트
router.post('/update-premium', isAuthenticated, validate(authValidation.updatePremiumSchema), authController.updatePremium);

module.exports = router;