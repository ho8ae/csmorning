// src/api/test/test.validation.js
const Joi = require('joi');

// 테스트 메시지 전송 유효성 검사
const sendMessage = Joi.object({
  userId: Joi.string().uuid().optional(),
  message: Joi.string().optional()
});

// 스케줄러 실행 유효성 검사
const runCron = Joi.object({
  action: Joi.string().valid('sendDailyContent', 'createDailyQuestion').required()
});

module.exports = {
  sendMessage,
  runCron
};