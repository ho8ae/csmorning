const Joi = require('joi');

// 기부 생성 유효성 검사 스키마
const createDonationSchema = Joi.object({
  userId: Joi.string().required().messages({
    'string.empty': '사용자 ID는 필수 입력 항목입니다',
    'any.required': '사용자 ID는 필수 입력 항목입니다'
  }),
  
  amount: Joi.number().integer().min(1000).default(3000).messages({
    'number.base': '금액은 숫자여야 합니다',
    'number.integer': '금액은 정수여야 합니다',
    'number.min': '최소 기부 금액은 1,000원입니다'
  }),
  
  message: Joi.string().allow('', null)
});

module.exports = {
  createDonationSchema
};