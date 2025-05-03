const { findCommandHandler } = require('../commands');
const { createUnknownCommandResponse, createErrorResponse } = require('./response.service');

/**
 * 카카오톡 명령어 라우팅 및 처리
 */
const processCommand = async (req, user) => {
  try {
    // 사용자 메시지 가져오기
    const utterance = req.body.userRequest.utterance;
    
    // 명령어 핸들러 찾기
    const handlerInfo = findCommandHandler(utterance);
    
    if (!handlerInfo) {
      // 매칭되는 명령어가 없음
      return createUnknownCommandResponse();
    }
    
    // 핸들러 실행
    try {
      if (handlerInfo.category === 'answer') {
        // 일반 답변 처리
        return await handlerInfo.handler(req, user, utterance);
      } else if (handlerInfo.category === 'quiz' && handlerInfo.match) {
        // 주간 퀴즈 답변 특별 처리
        const quizNumber = parseInt(handlerInfo.match[1]);
        const answerNumber = parseInt(handlerInfo.match[2]) - 1;
        return await handlerInfo.handler(req, user, quizNumber, answerNumber);
      } else if (handlerInfo.category === 'account' && handlerInfo.command === '구독') {
        // 구독 명령어 특별 처리
        return await handlerInfo.handler(req, user, utterance);
      } else if (handlerInfo.category === 'mode') {
        // 모드 변경 특별 처리
        return await handlerInfo.handler(req, user, utterance);
      } else {
        // 일반 명령어 처리
        return await handlerInfo.handler(req, user);
      }
    } catch (error) {
      console.error(`명령어 [${handlerInfo.command || utterance}] 처리 중 오류:`, error);
      return createErrorResponse();
    }
  } catch (error) {
    console.error('명령어 라우팅 중 오류:', error);
    return createErrorResponse();
  }
};

module.exports = {
  processCommand
};