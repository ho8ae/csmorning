// src/utils/scheduler.js
const cron = require('node-cron');
const { prisma } = require('../config/db');
const { generateCsContent } = require('../services/content.service');
const kakaoService = require('../services/kakao.service');

/**
 * 매일 질문 스케줄링
 */
function scheduleDailyQuestion() {
  console.log('스케줄러 초기화 중...');
  
  // 매일 아침 8시에 CS 내용 전송 (한국 시간)
  cron.schedule('53 23 * * *', sendDailyContent, {
    timezone: 'Asia/Seoul'
  });
  
  // 매일 오전 0시에 새로운 일일 질문 설정 (한국 시간)
  cron.schedule('37 19 * * *', createDailyQuestion, {
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
      where: { isSubscribed: true }
    });
    
    if (subscribers.length === 0) {
      console.log('구독자가 없습니다.');
      return;
    }
    
    // CS 컨텐츠 생성
    const content = await generateCsContent();
    
    // 메시지 템플릿 생성
    const template = {
      object_type: 'text',
      text: `[오늘의 CS 지식]\n\n${content}\n\n좋은 하루 되세요!`,
      link: {
        web_url: process.env.SERVICE_URL || 'https://csmorning.co.kr',
        mobile_web_url: process.env.SERVICE_URL || 'https://csmorning.co.kr'
      },
      button_title: '웹사이트 방문하기'
    };
    
    // 각 구독자에게 메시지 전송
    for (const user of subscribers) {
      try {
        if (user.kakaoId) {
          await kakaoService.sendMessage(user.kakaoId, template);
          console.log(`사용자 ${user.kakaoId}에게 메시지 전송 성공`);
        }
        
        // 너무 많은 요청을 한 번에 보내지 않도록 잠시 대기
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`사용자 ${user.kakaoId}에게 메시지 전송 실패:`, error.message);
      }
    }
    
    console.log(`${subscribers.length}명의 사용자에게 메시지 전송 완료`);
  } catch (error) {
    console.error('일일 컨텐츠 전송 중 오류 발생:', error);
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

// 스케줄러 테스트 함수 (개발 중에 사용)
async function testSendMessage() {
  try {
    console.log('테스트 메시지 전송 시작...');
    
    // 테스트 ID를 가진 사용자 찾기
    const testUser = await prisma.user.findFirst({
      where: { kakaoId: { not: null } }
    });
    
    if (!testUser) {
      console.log('테스트 사용자가 없습니다.');
      return;
    }
    
    // 테스트 메시지 템플릿
    const template = {
      object_type: 'text',
      text: `[CS Morning 테스트]\n\n이것은 테스트 메시지입니다.\n${new Date().toLocaleString('ko-KR')}`,
      link: {
        web_url: process.env.SERVICE_URL || 'https://csmorning.co.kr',
        mobile_web_url: process.env.SERVICE_URL || 'https://csmorning.co.kr'
      }
    };
    
    // 메시지 전송
    await kakaoService.sendMessage(testUser.kakaoId, template);
    console.log(`테스트 사용자 ${testUser.kakaoId}에게 메시지 전송 성공`);
    
  } catch (error) {
    console.error('테스트 메시지 전송 중 오류 발생:', error);
  }
}

module.exports = {
  scheduleDailyQuestion,
  sendDailyContent,
  createDailyQuestion,
  testSendMessage
};