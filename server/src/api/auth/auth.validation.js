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

const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': '유효한 이메일 주소를 입력해주세요.',
    'string.empty': '이메일을 입력해주세요.',
    'any.required': '이메일을 입력해주세요.'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': '비밀번호는 최소 6자 이상이어야 합니다.',
    'string.empty': '비밀번호를 입력해주세요.',
    'any.required': '비밀번호를 입력해주세요.'
  }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': '비밀번호가 일치하지 않습니다.',
    'any.required': '비밀번호 확인을 입력해주세요.'
  }),
  nickname: Joi.string().min(2).max(20).required().messages({
    'string.min': '닉네임은 최소 2자 이상이어야 합니다.',
    'string.max': '닉네임은 최대 20자까지 가능합니다.',
    'string.empty': '닉네임을 입력해주세요.',
    'any.required': '닉네임을 입력해주세요.'
  }),
  name: Joi.string().required().messages({
    'string.empty': '이름을 입력해주세요.',
    'any.required': '이름을 입력해주세요.'
  }),
  gender: Joi.string().valid('male', 'female').required().messages({
    'any.only': '성별은 male 또는 female 중 하나여야 합니다.',
    'string.empty': '성별을 선택해주세요.',
    'any.required': '성별을 선택해주세요.'
  }),
  ageGroup: Joi.string().required().messages({
    'string.empty': '연령대를 선택해주세요.',
    'any.required': '연령대를 선택해주세요.'
  }),
  birthDate: Joi.date().required().messages({
    'date.base': '올바른 생일 형식이 아닙니다.',
    'any.required': '생일을 입력해주세요.'
  }),
  birthYear: Joi.number().integer().min(1900).max(new Date().getFullYear()).required().messages({
    'number.base': '출생연도는 숫자여야 합니다.',
    'number.integer': '출생연도는 정수여야 합니다.',
    'number.min': '올바른 출생연도를 입력해주세요.',
    'number.max': '올바른 출생연도를 입력해주세요.',
    'any.required': '출생연도를 입력해주세요.'
  }),
  phoneNumber: Joi.string().pattern(/^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/).required().messages({
    'string.pattern.base': '올바른 전화번호 형식이 아닙니다. (01X-XXXX-XXXX)',
    'string.empty': '전화번호를 입력해주세요.',
    'any.required': '전화번호를 입력해주세요.'
  })
});

module.exports = {
  loginSchema,
  kakaoLoginSchema,
  registerSchema
};