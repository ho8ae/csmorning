const express = require('express');
const router = express.Router();
const questionController = require('./question.controller');
const validate = require('../../middleware/validation.middleware');
const questionValidation = require('./question.validation');
const { isAuthenticated, authAdmin } = require('../../middleware/auth.middleware');

// 오늘의 질문 조회 (공개 API) - 인증 필요 없음
router.get('/today/question', questionController.getTodayQuestion);

// 추가: 오늘의 CS 지식 조회 (공개 API) - 인증 필요 없음
router.get('/today/cs-content', questionController.getTodayCSContent);

// 추가: 주간 퀴즈 목록 조회
router.get(
  '/weekly-quizzes', 
  isAuthenticated, 
  validate(questionValidation.getWeeklyQuizzesSchema), 
  questionController.getWeeklyQuizzes
);

// 추가: 주간 퀴즈 응답 제출
router.post(
  '/weekly-quiz/response', 
  isAuthenticated, 
  validate(questionValidation.submitWeeklyQuizResponseSchema), 
  questionController.submitWeeklyQuizResponse
);

// 추가: 사용자의 주간 퀴즈 응답 현황 조회
router.get(
  '/weekly-quiz/user-responses', 
  isAuthenticated, 
  validate(questionValidation.getUserWeeklyResponsesSchema), 
  questionController.getUserWeeklyResponses
);

// 추가: CS 컨텐츠 생성 (관리자)
router.post(
  '/cs-content',
  authAdmin,
  validate(questionValidation.createCSContentSchema),
  questionController.createCSContent
);

// 추가: 주간 퀴즈 생성 (관리자)
router.post(
  '/weekly-quiz',
  authAdmin,
  validate(questionValidation.createWeeklyQuizSchema),
  questionController.createWeeklyQuiz
);

// 모든 질문 조회 (관리자용)
router.get('/', authAdmin, questionController.getAllQuestions);

// 단일 질문 조회 (관리자용)
router.get('/:id', authAdmin, questionController.getQuestionById);

// 질문 생성 (관리자용)
router.post(
  '/', 
  authAdmin, 
  validate(questionValidation.createQuestionSchema), 
  questionController.createQuestion
);

// 질문 수정 (관리자용)
router.put(
  '/:id', 
  authAdmin, 
  validate(questionValidation.updateQuestionSchema), 
  questionController.updateQuestion
);

// 질문 삭제 (관리자용)
router.delete('/:id', authAdmin, questionController.deleteQuestion);

module.exports = router;