const Joi = require('joi');

// 메시지 웹훅 유효성 검사 스키마
const messageSchema = Joi.object({
  user_id: Joi.string().required().messages({
    'string.empty': '사용자 ID는 필수 입력 항목입니다',
    'any.required': '사용자 ID는 필수 입력 항목입니다'
  }),
  
  content: Joi.string().allow('', null),
  
  type: Joi.string().required().messages({
    'string.empty': '메시지 타입은 필수 입력 항목입니다',
    'any.required': '메시지 타입은 필수 입력 항목입니다'
  })
});

module.exports = {
  messageSchema
};