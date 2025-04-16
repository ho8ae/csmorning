// src/api/test/test.routes.js
const express = require('express');
const router = express.Router();
const testController = require('./test.controller');
const  validateRequest  = require('../../middleware/validation.middleware');
const { isAuthenticated, isAdmin } = require('../../middleware/auth.middleware');
const testValidation = require('./test.validation');

router.post('/send', 
  isAuthenticated, 
  isAdmin,
  validateRequest(testValidation.sendMessage), 
  testController.sendTestMessage
);

router.post('/cron', 
  isAuthenticated, 
  isAdmin,
  validateRequest(testValidation.runCron), 
  testController.runScheduler
);


router.post('/chatbot', 
  isAuthenticated, 
  isAdmin,
  validateRequest(testValidation.sendMessage), 
  testController.sendChatbotMessage
);


router.post('/broadcast', 
  isAuthenticated, 
  isAdmin,
  validateRequest(testValidation.broadcastMessage), 
  testController.sendMessageToAllSubscribers
);

module.exports = router;