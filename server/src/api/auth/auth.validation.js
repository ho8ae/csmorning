const Joi = require('joi');

// 로그인 요청 스키마
const loginSchema = Joi.object({
  username: Joi.string().required().messages({
    'string.empty': '아이디를 입력해주세요.',
    'any.required': '아이디를 입력해주세요.'
  }),
  password: Joi.string().required().messages({
    'string.empty': '비밀번호를 입력해주세요.',
    'any.required': '비밀번호를 입력해주세요.'
  })
});

// 카카오 로그인 요청 스키마
const kakaoLoginSchema = Joi.object({
  code: Joi.string().required().messages({
    'string.empty': '인증 코드가 없습니다.',
    'any.required': '인증 코드가 없습니다.'
  })
});

module.exports = {
  loginSchema,
  kakaoLoginSchema
};