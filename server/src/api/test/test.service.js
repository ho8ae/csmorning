// src/api/test/test.service.js
const { prisma } = require('../../config/db');
const kakaoService = require('../../services/kakao.service');
const scheduler = require('../../utils/scheduler');
const webhookService = require('../webhook/webhook.service');

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

/**
 * 테스트용 챗봇 메시지 전송
 * @param {string} userId - 메시지를 받을 사용자 ID (없으면 첫 번째 사용자에게 전송)
 * @param {string} message - 전송할 메시지 내용
 * @returns {Promise<object>} 전송 결과
 */
async function sendChatbotMessage(userId, message) {
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
    const messageText = message || `[CS Morning 챗봇 테스트]\n\n이것은 챗봇 테스트 메시지입니다.\n${new Date().toLocaleString('ko-KR')}`;
    
    // 챗봇 메시지 전송 시뮬레이션
    // 실제 구현에서는 웹훅 서비스의 sendChatbotMessage 함수를 호출하거나
    // 스케줄러의 testSendChatbotMessage 함수를 호출할 수 있음
    const result = await scheduler.testSendChatbotMessage(targetUser.id, messageText);
    
    return {
      userId: targetUser.id,
      kakaoId: targetUser.kakaoId,
      message: messageText,
      sentAt: new Date(),
      simulatedResponse: true
    };
  } catch (error) {
    console.error('챗봇 테스트 메시지 전송 중 오류:', error);
    throw error;
  }
}

/**
 * 모든 구독자에게 테스트 메시지 전송
 * @param {string} message - 전송할 메시지 내용
 * @returns {Promise<object>} 전송 결과
 */
async function sendMessageToAllSubscribers(message) {
  try {
    // 구독 중인 사용자 찾기
    const subscribers = await prisma.user.findMany({
      where: { isSubscribed: true }
    });
    
    if (subscribers.length === 0) {
      return {
        success: true,
        message: '구독자가 없습니다.',
        sentCount: 0
      };
    }
    
    // 메시지 내용이 없으면 기본 메시지 사용
    const messageText = message || `[CS Morning 공지]\n\n모든 구독자에게 보내는 테스트 메시지입니다.\n${new Date().toLocaleString('ko-KR')}`;
    
    let sentCount = 0;
    let failedCount = 0;
    
    // 각 구독자에게 메시지 전송
    for (const user of subscribers) {
      try {
        if (user.kakaoId) {
          // 두 가지 방법으로 시도:
          // 1. 일반 카카오톡 메시지 (친구 관계가 있어야 함)
          try {
            const template = {
              object_type: 'text',
              text: messageText,
              link: {
                web_url: process.env.SERVICE_URL || 'https://csmorning.co.kr',
                mobile_web_url: process.env.SERVICE_URL || 'https://csmorning.co.kr'
              },
              button_title: '웹사이트 방문하기'
            };
            
            await kakaoService.sendMessage(user.kakaoId, template);
            sentCount++;
            console.log(`사용자 ${user.kakaoId}에게 친구 메시지 전송 성공`);
          } catch (error) {
            console.warn(`사용자 ${user.kakaoId}에게 친구 메시지 전송 실패 (챗봇으로 시도 중): ${error.message}`);
            
            // 2. 챗봇 메시지 (시뮬레이션)
            await scheduler.testSendChatbotMessage(user.id, messageText);
            sentCount++;
            console.log(`사용자 ${user.kakaoId}에게 챗봇 메시지 전송 성공 (시뮬레이션)`);
          }
        }
        
        // 너무 많은 요청을 한 번에 보내지 않도록 잠시 대기
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`사용자 ${user.kakaoId}에게 메시지 전송 실패:`, error.message);
        failedCount++;
      }
    }
    
    return {
      success: true,
      message: `${sentCount}명의 사용자에게 메시지를 전송했습니다.`,
      totalSubscribers: subscribers.length,
      sentCount,
      failedCount
    };
  } catch (error) {
    console.error('전체 메시지 전송 중 오류:', error);
    throw error;
  }
}

module.exports = {
  sendTestMessage,
  runScheduler,
  sendChatbotMessage,
  sendMessageToAllSubscribers
};