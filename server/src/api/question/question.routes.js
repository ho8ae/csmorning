const express = require('express');
const router = express.Router();
const questionController = require('./question.controller');
const validate = require('../../middleware/validation.middleware');
const questionValidation = require('./question.validation');
const { authAdmin } = require('../../middleware/auth.middleware');  // JWT 인증 미들웨어 불러오기

// 오늘의 질문 조회 (공개 API) - 인증 필요 없음
router.get('/today/question', questionController.getTodayQuestion);

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