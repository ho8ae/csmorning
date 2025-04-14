const express = require('express');
const router = express.Router();
const questionController = require('./question.controller');
const validate = require('../../middleware/validation.middleware');
const questionValidation = require('./question.validation');

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

// 모든 질문 조회 (관리자용)
router.get('/', authenticateAdmin, questionController.getAllQuestions);

// 단일 질문 조회 (관리자용)
router.get('/:id', authenticateAdmin, questionController.getQuestionById);

// 질문 생성 (관리자용)
router.post(
  '/', 
  authenticateAdmin, 
  validate(questionValidation.createQuestionSchema), 
  questionController.createQuestion
);

// 질문 수정 (관리자용)
router.put(
  '/:id', 
  authenticateAdmin, 
  validate(questionValidation.updateQuestionSchema), 
  questionController.updateQuestion
);

// 질문 삭제 (관리자용)
router.delete('/:id', authenticateAdmin, questionController.deleteQuestion);

// 오늘의 질문 조회 (공개 API)
router.get('/today/question', questionController.getTodayQuestion);

module.exports = router;