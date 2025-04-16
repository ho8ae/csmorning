// src/utils/scheduler.js
const cron = require('node-cron');
const { prisma } = require('../config/db');
const { generateCsContent } = require('../services/content.service');
const kakaoService = require('../services/kakao.service');
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
      where: { isSubscribed: true }
    });
    
    if (subscribers.length === 0) {
      console.log('구독자가 없습니다.');
      return;
    }
    
    // CS 컨텐츠 생성
    const content = await generateCsContent();
    
    // 1. 카카오톡 친구에게 메시지 전송 (기존 방식)
    // await sendToKakaoFriends(subscribers, content);
    
    // 2. 챗봇을 통해 메시지 전송 (새로운 방식)
    await sendToChatbot(subscribers, content);
    
    console.log(`${subscribers.length}명의 사용자에게 메시지 전송 완료`);
  } catch (error) {
    console.error('일일 컨텐츠 전송 중 오류 발생:', error);
  }
}

/**
 * 카카오톡 친구에게 메시지 전송 (기존 방식)
 */
async function sendToKakaoFriends(subscribers, content) {
  try {
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
          console.log(`사용자 ${user.kakaoId}에게 친구 메시지 전송 성공`);
        }
        
        // 너무 많은 요청을 한 번에 보내지 않도록 잠시 대기
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`사용자 ${user.kakaoId}에게 친구 메시지 전송 실패:`, error.message);
      }
    }
  } catch (error) {
    console.error('카카오톡 친구 메시지 전송 중 오류 발생:', error);
  }
}

/**
 * 챗봇을 통해 메시지 전송 (새로운 방식)
 */
async function sendToChatbot(subscribers, content) {
  try {
    // 챗봇 응답 포맷
    const responseTemplate = kakaoService.formatSkillResponse(`[오늘의 CS 지식]\n\n${content}\n\n좋은 하루 되세요!`);
    
    // 오늘의 질문 가져오기
    const todayQuestion = await prisma.dailyQuestion.findFirst({
      orderBy: { sentDate: 'desc' },
      include: { question: true }
    });
    
    // 메시지에 오늘의 질문 추가
    if (todayQuestion) {
      responseTemplate.template.outputs.push({
        simpleText: {
          text: `[오늘의 질문]\n\n${todayQuestion.question.content}\n\n챗봇에서 '오늘의 질문'을 입력하시면 답변할 수 있습니다.`
        }
      });
    }
    
    // 웹훅 URL (실제 배포 환경에 맞게 수정 필요)
    const webhookUrl = `${process.env.SERVICE_URL || 'https://csmorning.co.kr'}/api/webhook/message`;
    
    // 각 구독자에게 메시지 전송
    for (const user of subscribers) {
      try {
        if (user.kakaoId) {
          // 여기서는 예시일 뿐, 실제로 챗봇에 직접 메시지를 보내는 API는 카카오에서 제공하지 않을 수 있음
          // 이 경우 카카오 i 오픈빌더 서비스 웹훅 기능을 활용해야 함
          console.log(`사용자 ${user.kakaoId}에게 챗봇 메시지를 전송할 예정입니다 (개발 중)`);
          
          // 실제 구현에서는 이 부분이 카카오에서 제공하는 API로 대체되어야 함
        }
        
        // 너무 많은 요청을 한 번에 보내지 않도록 잠시 대기
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`사용자 ${user.kakaoId}에게 챗봇 메시지 전송 실패:`, error.message);
      }
    }
    
    console.log(`챗봇을 통한 메시지 전송 완료 (개발 중)`);
  } catch (error) {
    console.error('챗봇 메시지 전송 중 오류 발생:', error);
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
 * 스케줄러 테스트 함수 (개발 중에 사용)
 */
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

/**
 * 챗봇을 통한 테스트 메시지 전송
 */
async function testSendChatbotMessage(userId, message) {
  try {
    console.log('챗봇 테스트 메시지 전송 시작...');
    
    // 사용자 찾기
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user || !user.kakaoId) {
      console.log('유효한 카카오 ID를 가진 사용자가 없습니다.');
      return { success: false, message: '유효한 카카오 ID를 찾을 수 없습니다.' };
    }
    
    // 챗봇 응답 포맷 (실제 카카오 i 오픈빌더에서 사용하는 포맷)
    const responseTemplate = kakaoService.formatSkillResponse(message || `[CS Morning 테스트]\n\n이것은 챗봇 테스트 메시지입니다.\n${new Date().toLocaleString('ko-KR')}`);
    
    // 실제 구현에서는 카카오에서 제공하는 API로 대체
    console.log(`사용자 ${user.kakaoId}에게 챗봇 테스트 메시지를 전송합니다.`);
    console.log('메시지 내용:', responseTemplate);
    
    // 성공 응답 반환
    return {
      success: true,
      userId: user.id,
      kakaoId: user.kakaoId,
      message: message || `[CS Morning 테스트] 이것은 챗봇 테스트 메시지입니다.`,
      sentAt: new Date()
    };
    
  } catch (error) {
    console.error('챗봇 테스트 메시지 전송 중 오류 발생:', error);
    return { success: false, message: error.message };
  }
}

module.exports = {
  scheduleDailyQuestion,
  sendDailyContent,
  createDailyQuestion,
  testSendMessage,
  testSendChatbotMessage
};