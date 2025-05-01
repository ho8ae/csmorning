// src/api/bizgo/bizgo.validation.js
const Joi = require('joi');

const sendAlimTalk = Joi.object({
  phoneNumber: Joi.string().pattern(/^01[0-9]{8,9}$/).required().messages({
    'string.pattern.base': '전화번호는 01로 시작하는 10-11자리 숫자여야 합니다. (예: 01012345678)',
    'any.required': '전화번호는 필수 입력 항목입니다.'
  }),
  content: Joi.string().required().messages({
    'string.empty': '내용을 입력해주세요.',
    'any.required': '내용은 필수 입력 항목입니다.'
  }),
  title: Joi.string().optional(),
  subtitle: Joi.string().optional(),
  buttons: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      type: Joi.string().valid('WL', 'AL', 'DS', 'BK', 'MD', 'BC', 'BT', 'AC', 'POLL').required(),
      urlMobile: Joi.string().when('type', { is: 'WL', then: Joi.required(), otherwise: Joi.optional() }),
      urlPc: Joi.string().when('type', { is: 'WL', then: Joi.optional(), otherwise: Joi.optional() }),
      url: Joi.string().optional(),
      phoneNumber: Joi.string().when('type', { is: 'AL', then: Joi.required(), otherwise: Joi.optional() })
    })
  ).max(5).optional(),
  quickReplies: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      type: Joi.string().valid('BK', 'MD', 'BC', 'BT', 'AC').required()
    })
  ).max(10).optional()
});

// 친구톡 전송 유효성 검사
const sendFriendTalk = Joi.object({
  phoneNumber: Joi.string().pattern(/^01[0-9]{8,9}$/).required().messages({
    'string.pattern.base': '전화번호는 01로 시작하는 10-11자리 숫자여야 합니다. (예: 01012345678)',
    'any.required': '전화번호는 필수 입력 항목입니다.'
  }),
  content: Joi.string().required().messages({
    'string.empty': '내용을 입력해주세요.',
    'any.required': '내용은 필수 입력 항목입니다.'
  }),
  buttons: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      type: Joi.string().valid('WL', 'AL', 'DS', 'BK', 'MD', 'BC', 'BT', 'AC', 'POLL').required(),
      urlMobile: Joi.string().when('type', { is: 'WL', then: Joi.required(), otherwise: Joi.optional() }),
      urlPc: Joi.string().when('type', { is: 'WL', then: Joi.optional(), otherwise: Joi.optional() }),
      url: Joi.string().optional(),
      phoneNumber: Joi.string().when('type', { is: 'AL', then: Joi.required(), otherwise: Joi.optional() })
    })
  ).max(5).optional()
});

// 전체 메시지 전송 유효성 검사
const broadcastMessage = Joi.object({
  content: Joi.string().required().messages({
    'string.empty': '내용을 입력해주세요.',
    'any.required': '내용은 필수 입력 항목입니다.'
  }),
  title: Joi.string().optional(),
  subtitle: Joi.string().optional(),
  buttons: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      type: Joi.string().valid('WL', 'AL', 'DS', 'BK', 'MD', 'BC', 'BT', 'AC', 'POLL').required(),
      urlMobile: Joi.string().when('type', { is: 'WL', then: Joi.required(), otherwise: Joi.optional() }),
      urlPc: Joi.string().when('type', { is: 'WL', then: Joi.optional(), otherwise: Joi.optional() }),
      url: Joi.string().optional(),
      phoneNumber: Joi.string().when('type', { is: 'AL', then: Joi.required(), otherwise: Joi.optional() })
    })
  ).max(5).optional()
});

// 통합메시지 전송 유효성 검사
const sendOmniMessage = Joi.object({
  phoneNumber: Joi.string().pattern(/^01[0-9]{8,9}$/).required().messages({
    'string.pattern.base': '전화번호는 01로 시작하는 10-11자리 숫자여야 합니다. (예: 01012345678)',
    'any.required': '전화번호는 필수 입력 항목입니다.'
  }),
  content: Joi.string().required().messages({
    'string.empty': '내용을 입력해주세요.',
    'any.required': '내용은 필수 입력 항목입니다.'
  }),
  title: Joi.string().optional(),
  subtitle: Joi.string().optional(),
  buttons: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      type: Joi.string().valid('WL', 'AL', 'DS', 'BK', 'MD', 'BC', 'BT', 'AC', 'POLL', 'BF').required(),
      urlMobile: Joi.string().when('type', { is: 'WL', then: Joi.required(), otherwise: Joi.optional() }),
      urlPc: Joi.string().when('type', { is: 'WL', then: Joi.optional(), otherwise: Joi.optional() }),
      chatExtra: Joi.string().when('type', { is: Joi.valid('BC', 'BT'), then: Joi.optional() }),
      chatEvent: Joi.string().when('type', { is: 'BT', then: Joi.optional() }),
      bizFormKey: Joi.string().when('type', { is: 'BF', then: Joi.optional() }),
      bizFormId: Joi.string().when('type', { is: 'BF', then: Joi.optional() })
    })
  ).max(5).optional(),
  quickReplies: Joi.array().items(
    Joi.object({
      name: Joi.string().required().max(14),
      type: Joi.string().valid('WL', 'AL', 'BK', 'BC', 'BT', 'BF').required(),
      urlMobile: Joi.string().when('type', { is: 'WL', then: Joi.required(), otherwise: Joi.optional() }),
      urlPc: Joi.string().when('type', { is: 'WL', then: Joi.optional(), otherwise: Joi.optional() }),
      schemeIos: Joi.string().when('type', { is: 'AL', then: Joi.optional() }),
      schemeAndroid: Joi.string().when('type', { is: 'AL', then: Joi.optional() }),
      chatExtra: Joi.string().when('type', { is: Joi.valid('BC', 'BT'), then: Joi.optional() }),
      chatEvent: Joi.string().when('type', { is: 'BT', then: Joi.optional() }),
      bizFormId: Joi.string().when('type', { is: 'BF', then: Joi.required() })
    })
  ).max(10).optional(),
  enableFallback: Joi.boolean().optional(),
  fallbackText: Joi.string().optional()
});

// 오늘의 질문 알림톡 전송 유효성 검사
const sendDailyQuestion = Joi.object({
  phoneNumber: Joi.string().pattern(/^01[0-9]{8,9}$/).required().messages({
    'string.pattern.base': '전화번호는 01로 시작하는 10-11자리 숫자여야 합니다. (예: 01012345678)',
    'any.required': '전화번호는 필수 입력 항목입니다.'
  }),
  userName: Joi.string().optional()
});


// 추가: CS 컨텐츠 알림톡 전송 유효성 검사
const sendCSContentSchema = Joi.object({
  phoneNumber: Joi.string().pattern(/^01[0-9]{8,9}$/).required().messages({
    'string.pattern.base': '전화번호는 01로 시작하는 10-11자리 숫자여야 합니다. (예: 01012345678)',
    'any.required': '전화번호는 필수 입력 항목입니다.'
  }),
  userName: Joi.string().optional(),
  csContentId: Joi.number().integer().optional().messages({
    'number.base': 'CS 컨텐츠 ID는 숫자여야 합니다.'
  })
});

// 추가: 주간 퀴즈 알림톡 전송 유효성 검사
const sendWeeklyQuizSchema = Joi.object({
  phoneNumber: Joi.string().pattern(/^01[0-9]{8,9}$/).required().messages({
    'string.pattern.base': '전화번호는 01로 시작하는 10-11자리 숫자여야 합니다. (예: 01012345678)',
    'any.required': '전화번호는 필수 입력 항목입니다.'
  }),
  userName: Joi.string().optional(),
  weekNumber: Joi.number().integer().min(1).optional().messages({
    'number.base': '주차는 숫자여야 합니다.',
    'number.integer': '주차는 정수여야 합니다.',
    'number.min': '주차는 1 이상이어야 합니다.'
  })
});

// 추가: 모드 지정 요청 유효성 검사
const studyModeSchema = Joi.object({
  mode: Joi.string().valid('daily', 'weekly').messages({
    'any.only': '모드는 daily 또는 weekly 중 하나여야 합니다.'
  }),
  csContentId: Joi.number().integer().optional().messages({
    'number.base': 'CS 컨텐츠 ID는 숫자여야 합니다.'
  })
});

module.exports = {
  sendAlimTalk,
  sendFriendTalk,
  broadcastMessage,
  sendOmniMessage,
  sendDailyQuestion,
  sendCSContentSchema,
  sendWeeklyQuizSchema,
  studyModeSchema
};