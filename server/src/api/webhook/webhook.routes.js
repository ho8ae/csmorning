const express = require('express');
const router = express.Router();
const webhookController = require('./webhook.controller');
const validate = require('../../middleware/validation.middleware');
const webhookValidation = require('./webhook.validation');

// 카카오톡 메시지 웹훅 처리
router.post(
  '/message', 
  validate(webhookValidation.messageSchema),
  webhookController.handleKakaoMessage
);

module.exports = router;