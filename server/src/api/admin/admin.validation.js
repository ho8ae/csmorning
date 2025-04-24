const Joi = require('joi');

// 질문 전송 유효성 검사 스키마
const sendQuestionSchema = Joi.object({
  questionId: Joi.number().integer().required().messages({
    'number.base': '질문 ID는 숫자여야 합니다',
    'number.integer': '질문 ID는 정수여야 합니다',
    'any.required': '질문 ID는 필수 입력 항목입니다'
  })
});

// 사용자 업데이트 유효성 검사 스키마
const updateUserSchema = Joi.object({
  nickname: Joi.string().min(2).max(30).messages({
    'string.min': '닉네임은 최소 2글자 이상이어야 합니다',
    'string.max': '닉네임은 최대 30글자까지 가능합니다'
  }),
  email: Joi.string().email().messages({
    'string.email': '유효한 이메일 주소를 입력해주세요'
  }),
  password: Joi.string().min(6).messages({
    'string.min': '비밀번호는 최소 6글자 이상이어야 합니다'
  }),
  name: Joi.string(),
  gender: Joi.string().valid('male', 'female').messages({
    'any.only': '성별은 male 또는 female 중 하나여야 합니다'
  }),
  ageGroup: Joi.string(),
  birthDate: Joi.date().messages({
    'date.base': '유효한 날짜를 입력해주세요'
  }),
  birthYear: Joi.number().integer().min(1900).max(new Date().getFullYear()).messages({
    'number.base': '출생연도는 숫자여야 합니다',
    'number.integer': '출생연도는 정수여야 합니다',
    'number.min': '유효한 출생연도를 입력해주세요',
    'number.max': '유효한 출생연도를 입력해주세요'
  }),
  phoneNumber: Joi.string().pattern(/^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/).messages({
    'string.pattern.base': '유효한 전화번호 형식을 입력해주세요 (01X-XXXX-XXXX)'
  }),
  isSubscribed: Joi.boolean().messages({
    'boolean.base': '구독 상태는 true 또는 false 여야 합니다'
  }),
  isPremium: Joi.boolean().messages({
    'boolean.base': '프리미엄 상태는 true 또는 false 여야 합니다'
  }),
  premiumUntil: Joi.date().messages({
    'date.base': '유효한 날짜를 입력해주세요'
  }),
  isActive: Joi.boolean().messages({
    'boolean.base': '계정 상태는 true 또는 false 여야 합니다'
  }),
  role: Joi.string().valid('user', 'admin').messages({
    'any.only': '역할은 user 또는 admin 중 하나여야 합니다'
  })
});

// 구독 상태 변경 유효성 검사 스키마
const toggleSubscriptionSchema = Joi.object({
  isSubscribed: Joi.boolean().required().messages({
    'boolean.base': '구독 상태는 불리언 값이어야 합니다',
    'any.required': '구독 상태(isSubscribed)는 필수 입력 항목입니다'
  })
});

// 프리미엄 상태 변경 유효성 검사 스키마
const updatePremiumSchema = Joi.object({
  isPremium: Joi.boolean().required().messages({
    'boolean.base': '프리미엄 상태는 불리언 값이어야 합니다',
    'any.required': '프리미엄 상태(isPremium)는 필수 입력 항목입니다'
  }),
  durationMonths: Joi.number().integer().min(1).default(1).messages({
    'number.base': '기간은 숫자여야 합니다',
    'number.integer': '기간은 정수여야 합니다',
    'number.min': '기간은 최소 1개월 이상이어야 합니다'
  })
});

// 계정 상태 변경 유효성 검사 스키마
const toggleStatusSchema = Joi.object({
  isActive: Joi.boolean().required().messages({
    'boolean.base': '계정 상태는 불리언 값이어야 합니다',
    'any.required': '계정 상태(isActive)는 필수 입력 항목입니다'
  })
});

module.exports = {
  sendQuestionSchema,
  updateUserSchema,
  toggleSubscriptionSchema,
  updatePremiumSchema,
  toggleStatusSchema
};