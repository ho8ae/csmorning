// src/api/test/test.service.js
const { prisma } = require('../../config/db');
const scheduler = require('../../utils/scheduler');
const bizgoService = require('../bizgo/bizgo.service');
const webhookService = require('../webhook/webhook.service');

/**
 * 테스트용 알림톡 메시지 전송
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
      // 전화번호가 있는 첫 번째 사용자 찾기
      targetUser = await prisma.user.findFirst({
        where: { phoneNumber: { not: null } }
      });
      
      if (!targetUser) {
        throw new Error('전화번호가 등록된 사용자가 없습니다.');
      }
    }
    
    if (!targetUser.phoneNumber) {
      throw new Error('선택된 사용자에게 전화번호가 없습니다.');
    }
    
    // 메시지 내용이 없으면 기본 메시지 사용
    const messageText = message || `[CS Morning 테스트]\n\n이것은 테스트 메시지입니다.\n${new Date().toLocaleString('ko-KR')}`;
    
    // 버튼 추가
    const buttons = [
      {
        name: "웹사이트 방문하기",
        type: "WL",
        urlMobile: process.env.SERVICE_URL || 'https://csmorning.co.kr'
      }
    ];
    
    // 전화번호 형식 정리 (하이픈 제거)
    const phoneNumber = targetUser.phoneNumber.replace(/-/g, '');
    
    // 알림톡 전송
    const result = await bizgoService.sendAlimTalk(phoneNumber, messageText, buttons);
    
    return {
      userId: targetUser.id,
      phoneNumber: phoneNumber,
      message: messageText,
      sentAt: new Date(),
      bizgoResponse: result
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
 * 테스트용 친구톡 메시지 전송
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
      // 전화번호가 있는 첫 번째 사용자 찾기
      targetUser = await prisma.user.findFirst({
        where: { phoneNumber: { not: null } }
      });
      
      if (!targetUser) {
        throw new Error('전화번호가 등록된 사용자가 없습니다.');
      }
    }
    
    if (!targetUser.phoneNumber) {
      throw new Error('선택된 사용자에게 전화번호가 없습니다.');
    }
    
    // 메시지 내용이 없으면 기본 메시지 사용
    const messageText = message || `[CS Morning 친구톡 테스트]\n\n이것은 친구톡 테스트 메시지입니다.\n${new Date().toLocaleString('ko-KR')}`;
    
    // 버튼 추가
    const buttons = [
      {
        name: "웹사이트 방문하기",
        type: "WL",
        urlMobile: process.env.SERVICE_URL || 'https://csmorning.co.kr'
      }
    ];
    
    // 전화번호 형식 정리 (하이픈 제거)
    const phoneNumber = targetUser.phoneNumber.replace(/-/g, '');
    
    // 친구톡 전송
    const result = await bizgoService.sendFriendTalk(phoneNumber, messageText, buttons);
    
    return {
      userId: targetUser.id,
      phoneNumber: phoneNumber,
      message: messageText,
      sentAt: new Date(),
      bizgoResponse: result
    };
  } catch (error) {
    console.error('친구톡 테스트 메시지 전송 중 오류:', error);
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
    // 메시지 내용이 없으면 기본 메시지 사용
    const messageText = message || `[CS Morning 공지]\n\n모든 구독자에게 보내는 테스트 메시지입니다.\n${new Date().toLocaleString('ko-KR')}`;
    
    // 버튼 추가
    const buttons = [
      {
        name: "웹사이트 방문하기",
        type: "WL",
        urlMobile: process.env.SERVICE_URL || 'https://csmorning.co.kr'
      }
    ];
    
    // 알림톡 전송
    const result = await bizgoService.sendAlimTalkToAllSubscribers(messageText, buttons);
    
    return result;
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