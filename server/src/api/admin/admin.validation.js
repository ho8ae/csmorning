const Joi = require('joi');

// 질문 전송 유효성 검사 스키마
const sendQuestionSchema = Joi.object({
  questionId: Joi.number().integer().required().messages({
    'number.base': '질문 ID는 숫자여야 합니다',
    'number.integer': '질문 ID는 정수여야 합니다',
    'any.required': '질문 ID는 필수 입력 항목입니다'
  })
});

module.exports = {
  sendQuestionSchema
};