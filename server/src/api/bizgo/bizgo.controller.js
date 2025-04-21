// src/api/bizgo/bizgo.controller.js
const bizgoService = require('./bizgo.service');

/**
 * 테스트용 알림톡 단일 사용자에게 발송
 */
async function sendTestAlimTalk(req, res, next) {
  try {
    const { phoneNumber, content, buttons, title, subtitle } = req.body;
    
    const result = await bizgoService.sendAlimTalk(phoneNumber, content, buttons, title, subtitle);
    
    return res.status(200).json({
      success: true,
      message: '알림톡이 성공적으로 전송되었습니다.',
      data: result
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 테스트용 친구톡 단일 사용자에게 발송
 */
async function sendTestFriendTalk(req, res, next) {
  try {
    const { phoneNumber, content, buttons } = req.body;
    
    const result = await bizgoService.sendFriendTalk(phoneNumber, content, buttons);
    
    return res.status(200).json({
      success: true,
      message: '친구톡이 성공적으로 전송되었습니다.',
      data: result
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 모든 구독자에게 알림톡 발송
 */
async function sendAlimTalkToAll(req, res, next) {
  try {
    const { content, buttons, title, subtitle } = req.body;
    
    const result = await bizgoService.sendAlimTalkToAllSubscribers(content, buttons, title, subtitle);
    
    return res.status(200).json({
      success: true,
      message: `${result.sentCount}명의 사용자에게 알림톡이 전송되었습니다.`,
      data: result
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 토큰 상태 확인
 */
async function checkTokenStatus(req, res, next) {
  try {
    const token = await bizgoService.getToken();
    
    return res.status(200).json({
      success: true,
      message: 'Bizgo API 토큰이 정상적으로 발급되었습니다.',
      data: {
        token: token ? '**********' + token.substring(token.length - 5) : null, // 토큰 일부만 표시
        hasToken: !!token
      }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  sendTestAlimTalk,
  sendTestFriendTalk,
  sendAlimTalkToAll,
  checkTokenStatus
};