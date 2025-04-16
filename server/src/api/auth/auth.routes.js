const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const { isAuthenticated } = require('../../middleware/auth.middleware');
const validate = require('../../middleware/validation.middleware');
const authValidation = require('./auth.validation');

// 관리자 로그인
router.post('/login', validate(authValidation.loginSchema), authController.login);

// 카카오 로그인 처리
router.get('/kakao', validate(authValidation.kakaoLoginSchema), authController.kakaoLogin);

// 현재 사용자 정보 조회
router.get('/me', isAuthenticated, authController.getMe);

// 로그아웃
router.post('/logout', authController.logout);

// 카카오 로그인 리다이렉트 처리
router.get('/kakao/callback', authController.redirectToFrontendCallback);


module.exports = router;