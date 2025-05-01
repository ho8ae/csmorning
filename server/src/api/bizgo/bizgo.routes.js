// src/api/bizgo/bizgo.routes.js
const express = require('express');
const router = express.Router();
const bizgoController = require('./bizgo.controller');
const validate = require('../../middleware/validation.middleware');
const { isAuthenticated, isAdmin } = require('../../middleware/auth.middleware');
const bizgoValidation = require('./bizgo.validation');

// 토큰 상태 확인
router.get('/token', 
  isAuthenticated, 
  isAdmin, 
  bizgoController.checkTokenStatus
);

// 테스트용 알림톡 단일 발송
router.post('/alimtalk', 
  isAuthenticated, 
  isAdmin, 
  validate(bizgoValidation.sendAlimTalk), 
  bizgoController.sendTestAlimTalk
);

// 테스트용 친구톡 단일 발송
router.post('/friendtalk', 
  isAuthenticated, 
  isAdmin, 
  validate(bizgoValidation.sendFriendTalk), 
  bizgoController.sendTestFriendTalk
);

// 테스트용 통합메시지 알림톡 발송
router.post('/omni', 
  isAuthenticated, 
  isAdmin,
  validate(bizgoValidation.sendOmniMessage),
  bizgoController.sendTestOmniMessage
);

// 모든 구독자에게 알림톡 발송
router.post('/broadcast', 
  isAuthenticated, 
  isAdmin, 
  validate(bizgoValidation.broadcastMessage), 
  bizgoController.sendAlimTalkToAll
);

// 테스트용 오늘의 질문 알림톡 발송
router.post('/daily-question', 
  isAuthenticated, 
  isAdmin, 
  validate(bizgoValidation.sendDailyQuestion), 
  bizgoController.sendTestDailyQuestion
);

// 모든 구독자에게 오늘의 질문 알림톡 발송
router.post('/broadcast-daily-question', 
  isAuthenticated, 
  isAdmin,
  bizgoController.sendDailyQuestionToAll
);

// 추가: 테스트용 CS 지식 알림톡 발송
router.post('/cs-content',
  isAuthenticated,
  isAdmin,
  bizgoController.sendTestCSContent
);

// 추가: 모든 구독자에게 CS 지식 알림톡 발송
router.post('/broadcast-cs-content',
  isAuthenticated,
  isAdmin,
  bizgoController.sendCSContentToAll
);

// 추가: 테스트용 주간 퀴즈 알림톡 발송
router.post('/weekly-quiz',
  isAuthenticated,
  isAdmin,
  bizgoController.sendTestWeeklyQuiz
);

// 추가: 모든 구독자에게 주간 퀴즈 알림톡 발송
router.post('/broadcast-weekly-quiz',
  isAuthenticated,
  isAdmin,
  bizgoController.sendWeeklyQuizToAll
);

module.exports = router;