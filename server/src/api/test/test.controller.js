// src/api/test/test.controller.js
const testService = require('./test.service');

/**
 * 테스트용 카카오톡 메시지 전송
 */
async function sendTestMessage(req, res, next) {
  try {
    const { userId, message } = req.body;
    
    const result = await testService.sendTestMessage(userId, message);
    
    return res.status(200).json({
      success: true,
      message: '테스트 메시지가 성공적으로 전송되었습니다.',
      data: result
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 테스트용 스케줄러 실행
 */
async function runScheduler(req, res, next) {
  try {
    const { action } = req.body;
    
    const result = await testService.runScheduler(action);
    
    return res.status(200).json({
      success: true,
      message: `스케줄러 함수 (${action})가 성공적으로 실행되었습니다.`,
      data: result
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  sendTestMessage,
  runScheduler
};