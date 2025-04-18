// src/api/bizgo/bizgo.validation.js
const Joi = require('joi');

// 알림톡 전송 유효성 검사
const sendAlimTalk = Joi.object({
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
      url: Joi.string().optional(),
      phoneNumber: Joi.string().when('type', { is: 'AL', then: Joi.required(), otherwise: Joi.optional() })
    })
  ).max(5).optional()
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
  buttons: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      type: Joi.string().valid('WL', 'AL', 'DS', 'BK', 'MD', 'BC', 'BT', 'AC', 'POLL').required(),
      urlMobile: Joi.string().when('type', { is: 'WL', then: Joi.required(), otherwise: Joi.optional() }),
      url: Joi.string().optional(),
      phoneNumber: Joi.string().when('type', { is: 'AL', then: Joi.required(), otherwise: Joi.optional() })
    })
  ).max(5).optional()
});

module.exports = {
  sendAlimTalk,
  sendFriendTalk,
  broadcastMessage
};