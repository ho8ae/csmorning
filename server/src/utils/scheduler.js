// src/utils/scheduler.js
const cron = require('node-cron');
const { prisma } = require('../config/db');
const { generateCsContent } = require('../services/content.service');
const bizgoService = require('../api/bizgo/bizgo.service');
const axios = require('axios');

/**
 * 매일 질문 스케줄링
 */
function scheduleDailyQuestion() {
  console.log('스케줄러 초기화 중...');
  
  // 매일 아침 8시에 CS 내용 전송 (한국 시간)
  cron.schedule('00 8 * * *', sendDailyContent, {
    timezone: 'Asia/Seoul'
  });
  
  // 매일 오전 0시에 새로운 일일 질문 설정 (한국 시간)
  cron.schedule('00 0 * * *', createDailyQuestion, {
    timezone: 'Asia/Seoul'
  });
  
  console.log('스케줄러가 초기화되었습니다.');
}

/**
 * 데일리 CS 컨텐츠 전송
 */
async function sendDailyContent() {
  try {
    console.log('일일 CS 컨텐츠 전송 시작...');
    
    // 구독 중인 사용자 찾기
    const subscribers = await prisma.user.findMany({
      where: { 
        isSubscribed: true,
        phoneNumber: { not: null } // 전화번호가 있는 사용자만
      }
    });
    
    if (subscribers.length === 0) {
      console.log('구독자가 없습니다.');
      return;
    }
    
    // CS 컨텐츠 생성
    const content = await generateCsContent();
    
    // 오늘의 질문 가져오기
    const todayQuestion = await prisma.dailyQuestion.findFirst({
      orderBy: { sentDate: 'desc' },
      include: { question: true }
    });
    
    // 알림톡 본문 내용 생성
    let messageContent = `[오늘의 CS 지식]\n\n${content}\n\n좋은 하루 되세요!`;
    
    // 오늘의 질문이 있으면 추가
    if (todayQuestion && todayQuestion.question) {
      messageContent += `\n\n[오늘의 질문]\n\n${todayQuestion.question.text}`;
    }
    
    // 버튼 추가
    const buttons = [
      {
        name: "웹사이트 방문하기",
        type: "WL",
        urlMobile: process.env.SERVICE_URL || 'https://csmorning.co.kr'
      }
    ];
    
    // Bizgo API를 통해 알림톡 전송
    const result = await sendToBizgoAlimTalk(subscribers, messageContent, buttons);
    
    console.log(`${result.sentCount}명의 사용자에게 알림톡 전송 완료`);
    return result;
  } catch (error) {
    console.error('일일 컨텐츠 전송 중 오류 발생:', error);
  }
}

/**
 * Bizgo API를 통해 알림톡 전송
 * @param {Array} subscribers - 구독자 목록
 * @param {string} content - 알림톡 내용
 * @param {Array} buttons - 버튼 정보
 * @returns {Object} 전송 결과
 */
async function sendToBizgoAlimTalk(subscribers, content, buttons = []) {
  try {
    let sentCount = 0;
    let failedCount = 0;
    const resultDetails = [];
    
    // 각 구독자에게 알림톡 전송
    for (const user of subscribers) {
      try {
        if (user.phoneNumber) {
          // 전화번호 형식 정리 (하이픈 제거)
          const phoneNumber = user.phoneNumber.replace(/-/g, '');
          
          // 알림톡 전송
          const result = await bizgoService.sendAlimTalk(phoneNumber, content, buttons);
          sentCount++;
          resultDetails.push({
            userId: user.id,
            phoneNumber: phoneNumber,
            success: true,
            msgKey: result.msgKey
          });
          
          console.log(`사용자 ${user.id}(${phoneNumber})에게 알림톡 전송 성공`);
        }
        
        // 너무 많은 요청을 한 번에 보내지 않도록 잠시 대기
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (error) {
        console.error(`사용자 ${user.id}에게 알림톡 전송 실패:`, error.message);
        failedCount++;
        resultDetails.push({
          userId: user.id,
          phoneNumber: user.phoneNumber,
          success: false,
          error: error.message
        });
      }
    }
    
    return {
      success: true,
      totalSubscribers: subscribers.length,
      sentCount,
      failedCount,
      details: resultDetails
    };
  } catch (error) {
    console.error('Bizgo 알림톡 전송 중 오류 발생:', error);
    throw error;
  }
}

/**
 * 오늘의 질문 생성 및 설정
 */
async function createDailyQuestion() {
  try {
    console.log('오늘의 질문 설정 시작...');
    
    // 랜덤 질문 선택
    const questions = await prisma.question.findMany({
      where: { active: true }
    });
    
    if (questions.length === 0) {
      console.log('활성화된 질문이 없습니다.');
      return;
    }
    
    const randomIndex = Math.floor(Math.random() * questions.length);
    const selectedQuestion = questions[randomIndex];
    
    // 오늘의 질문으로 설정
    await prisma.dailyQuestion.create({
      data: {
        questionId: selectedQuestion.id,
        sentDate: new Date()
      }
    });
    
    console.log(`오늘의 질문이 설정되었습니다: ${selectedQuestion.text}`);
  } catch (error) {
    console.error('오늘의 질문 설정 중 오류 발생:', error);
  }
}

/**
 * 테스트용 알림톡 전송
 */
async function testSendAlimTalk(userId, message) {
  try {
    console.log('테스트 알림톡 전송 시작...');
    
    // 테스트 ID를 가진 사용자 찾기
    let testUser;
    if (userId) {
      testUser = await prisma.user.findUnique({
        where: { id: userId }
      });
    } else {
      testUser = await prisma.user.findFirst({
        where: { phoneNumber: { not: null } }
      });
    }
    
    if (!testUser || !testUser.phoneNumber) {
      console.log('유효한 전화번호를 가진 테스트 사용자가 없습니다.');
      return { success: false, message: '유효한 전화번호를 찾을 수 없습니다.' };
    }
    
    // 전화번호 형식 정리 (하이픈 제거)
    const phoneNumber = testUser.phoneNumber.replace(/-/g, '');
    
    // 테스트 메시지 내용
    const messageContent = message || `[CS Morning 테스트]\n\n이것은 테스트 알림톡입니다.\n${new Date().toLocaleString('ko-KR')}`;
    
    // 버튼 추가
    const buttons = [
      {
        name: "웹사이트 방문하기",
        type: "WL",
        urlMobile: process.env.SERVICE_URL || 'https://csmorning.co.kr'
      }
    ];
    
    // 알림톡 전송
    const result = await bizgoService.sendAlimTalk(phoneNumber, messageContent, buttons);
    
    console.log(`테스트 사용자 ${testUser.id}(${phoneNumber})에게 알림톡 전송 성공`);
    
    return {
      success: true,
      userId: testUser.id,
      phoneNumber: phoneNumber,
      message: messageContent,
      sentAt: new Date(),
      msgKey: result.msgKey
    };
  } catch (error) {
    console.error('테스트 알림톡 전송 중 오류 발생:', error);
    return { success: false, message: error.message };
  }
}

module.exports = {
  scheduleDailyQuestion,
  sendDailyContent,
  createDailyQuestion,
  testSendAlimTalk,
  sendToBizgoAlimTalk
};