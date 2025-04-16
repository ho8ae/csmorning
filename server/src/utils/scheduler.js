const cron = require('node-cron');
const axios = require('axios');
const prisma = require('../config/db');
const { generateCsContent } = require('../services/content.service');
const kakaoService = require('../services/kakao.service');

/**
 * 스케줄러 초기화
 */
const initScheduler = () => {
  console.log('스케줄러 초기화 중...');
  
  // 매일 아침 8시에 CS 내용 전송
  cron.schedule('0 8 * * *', sendDailyContent, {
    timezone: 'Asia/Seoul'
  });
  
  console.log('스케줄러가 초기화되었습니다.');
};

/**
 * 데일리 CS 컨텐츠 전송
 */
const sendDailyContent = async () => {
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
        await kakaoService.sendMessage(user.kakaoId, template);
        console.log(`사용자 ${user.kakaoId}에게 메시지 전송 성공`);
        
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
};

/**
 * 오늘의 질문 생성 및 설정
 */
const createDailyQuestion = async () => {
  try {
    // 랜덤 질문 선택
    const questions = await prisma.question.findMany({
      where: { isActive: true }
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
    
    console.log(`오늘의 질문이 설정되었습니다: ${selectedQuestion.content}`);
  } catch (error) {
    console.error('오늘의 질문 설정 중 오류 발생:', error);
  }
};

module.exports = {
  initScheduler,
  sendDailyContent,
  createDailyQuestion
};