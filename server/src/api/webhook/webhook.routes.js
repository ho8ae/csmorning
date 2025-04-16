const express = require('express');
const router = express.Router();
const webhookController = require('./webhook.controller');
const validate = require('../../middleware/validation.middleware');
const webhookValidation = require('./webhook.validation');
const { isAuthenticated } = require('../../middleware/auth.middleware');
// 카카오톡 챗봇 스킬 
router.post('/message', webhookController.handleKakaoMessage);

// 테스트 엔드포인트
router.post('/test', webhookController.testEndpoint);

// 오류 해결을 위한 GET 요청 추가
router.get('/message', (req, res) => {
  return res.status(200).json({
    version: "2.0",
    template: {
      outputs: [
        {
          simpleText: {
            text: "GET 요청 테스트 성공입니다."
          }
        }
      ]
    }
  });
});


router.post('/link-account', isAuthenticated, webhookController.handleAccountLinking);


module.exports = router;