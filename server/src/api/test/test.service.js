// src/api/test/test.service.js
const { prisma } = require('../../config/db');
const kakaoService = require('../../services/kakao.service');
const scheduler = require('../../utils/scheduler');

/**
 * 테스트용 카카오톡 메시지 전송
 * @param {string} userId - 메시지를 받을 사용자 ID (없으면 첫 번째 사용자에게 전송)
 * @param {string} message - 전송할 메시지 내용
 * @returns {Promise<object>} 전송 결과
 */
async function sendTestMessage(userId, message) {
  try {
    let targetUser;
    
    // userId가 제공되면 해당 사용자 찾기, 아니면 첫 번째 사용자 사용
    if (userId) {
      targetUser = await prisma.user.findUnique({
        where: { id: userId }
      });
      
      if (!targetUser) {
        throw new Error(`사용자 ID ${userId}를 찾을 수 없습니다.`);
      }
    } else {
      // 카카오 ID가 있는 첫 번째 사용자 찾기
      targetUser = await prisma.user.findFirst({
        where: { kakaoId: { not: null } }
      });
      
      if (!targetUser) {
        throw new Error('카카오 연동된 사용자가 없습니다.');
      }
    }
    
    if (!targetUser.kakaoId) {
      throw new Error('선택된 사용자에게 카카오 ID가 없습니다.');
    }
    
    // 메시지 내용이 없으면 기본 메시지 사용
    const messageText = message || `[CS Morning 테스트]\n\n이것은 테스트 메시지입니다.\n${new Date().toLocaleString('ko-KR')}`;
    
    // 메시지 템플릿 생성
    const template = {
      object_type: 'text',
      text: messageText,
      link: {
        web_url: process.env.SERVICE_URL || 'https://csmorning.co.kr',
        mobile_web_url: process.env.SERVICE_URL || 'https://csmorning.co.kr'
      },
      button_title: '웹사이트 방문하기'
    };
    
    // 메시지 전송
    const result = await kakaoService.sendMessage(targetUser.kakaoId, template);
    
    return {
      userId: targetUser.id,
      kakaoId: targetUser.kakaoId,
      message: messageText,
      sentAt: new Date(),
      kakaoResponse: result
    };
  } catch (error) {
    console.error('테스트 메시지 전송 중 오류:', error);
    throw error;
  }
}

/**
 * 테스트용 스케줄러 실행
 * @param {string} action - 실행할 스케줄러 함수 이름
 * @returns {Promise<object>} 실행 결과
 */
async function runScheduler(action) {
  try {
    let result;
    
    // 요청된 스케줄러 함수 실행
    switch (action) {
      case 'sendDailyContent':
        result = await scheduler.sendDailyContent();
        break;
      case 'createDailyQuestion':
        result = await scheduler.createDailyQuestion();
        break;
      default:
        throw new Error(`알 수 없는 스케줄러 액션: ${action}`);
    }
    
    return {
      action,
      executedAt: new Date(),
      result
    };
  } catch (error) {
    console.error('스케줄러 실행 중 오류:', error);
    throw error;
  }
}

module.exports = {
  sendTestMessage,
  runScheduler
};