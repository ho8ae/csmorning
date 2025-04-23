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

  // 매일 아침 8시에 오늘의 질문 알림톡 전송 (한국 시간)
  cron.schedule(
    '00 08 * * *',
    async () => {
      try {
        console.log('오늘의 질문 알림톡 전송 시작...');
        const result = await bizgoService.sendDailyQuestionToAllSubscribers(
          prisma,
        );
        console.log(
          `오늘의 질문 알림톡 전송 결과: ${result.sentCount}명 발송, ${result.failedCount}명 실패`,
        );
      } catch (error) {
        console.error('오늘의 질문 알림톡 전송 중 오류 발생:', error);
      }
    },
    {
      timezone: 'Asia/Seoul',
    },
  );

  // 매일 오전 0시에 새로운 일일 질문 설정 (한국 시간)
  cron.schedule('00 0 * * *', createDailyQuestion, {
    timezone: 'Asia/Seoul',
  });

  console.log('스케줄러가 초기화되었습니다.');
}


/**
 * 오늘의 질문 생성 및 설정 (중복 방지 기능 추가)
 */
async function createDailyQuestion() {
  try {
    console.log('오늘의 질문 설정 시작...');
    
    // 1. 이미 DailyQuestion에 있는 questionId 목록 가져오기
    const existingDailyQuestions = await prisma.dailyQuestion.findMany({
      select: {
        questionId: true,
      },
    });
    
    // 이미 사용된 questionId 배열 생성
    const usedQuestionIds = existingDailyQuestions.map(dq => dq.questionId);
    
    // 2. 아직 사용되지 않은 활성화된 질문들 찾기
    const unusedQuestions = await prisma.question.findMany({
      where: { 
        active: true,
        id: { notIn: usedQuestionIds },
      },
    });

    // 3-1. 사용되지 않은 질문이 있는 경우
    if (unusedQuestions.length > 0) {
      // 랜덤하게 질문 선택
      const randomIndex = Math.floor(Math.random() * unusedQuestions.length);
      const selectedQuestion = unusedQuestions[randomIndex];
      
      // 오늘의 질문으로 설정
      await prisma.dailyQuestion.create({
        data: {
          questionId: selectedQuestion.id,
          sentDate: new Date(),
        },
      });
      
      console.log(`새로운 오늘의 질문이 설정되었습니다: ${selectedQuestion.text}`);
    } 
    // 3-2. 모든 질문이 이미 사용된 경우, 다시 처음부터 시작 (가장 오래된 것부터 재사용)
    else {
      console.log('모든 질문이 이미 사용되었습니다. 가장 오래된 질문부터 재사용합니다.');
      
      // 가장 오래 전에 사용된 질문 찾기
      const oldestUsedQuestion = await prisma.dailyQuestion.findFirst({
        orderBy: { sentDate: 'asc' },
        include: { question: true },
      });
      
      if (!oldestUsedQuestion) {
        console.log('질문 데이터베이스에 문제가 있습니다.');
        return;
      }
      
      // 오늘의 질문으로 설정
      await prisma.dailyQuestion.create({
        data: {
          questionId: oldestUsedQuestion.questionId,
          sentDate: new Date(),
        },
      });
      
      console.log(`재사용된 오늘의 질문이 설정되었습니다: ${oldestUsedQuestion.question.text}`);
    }
  } catch (error) {
    console.error('오늘의 질문 설정 중 오류 발생:', error);
  }
}

/**
 * 테스트용 오늘의 질문 알림톡 발송
 */
async function testSendDailyQuestionAlimTalk(userId) {
  try {
    console.log('테스트 오늘의 질문 알림톡 전송 시작...');

    // 테스트 ID를 가진 사용자 찾기
    let testUser;
    if (userId) {
      testUser = await prisma.user.findUnique({
        where: { id: userId },
      });
    } else {
      testUser = await prisma.user.findFirst({
        where: { phoneNumber: { not: null } },
      });
    }

    if (!testUser || !testUser.phoneNumber) {
      console.log('유효한 전화번호를 가진 테스트 사용자가 없습니다.');
      return { success: false, message: '유효한 전화번호를 찾을 수 없습니다.' };
    }

    // 오늘의 질문 가져오기
    const todayQuestion = await prisma.dailyQuestion.findFirst({
      orderBy: { sentDate: 'desc' },
      include: { question: true },
    });

    if (!todayQuestion || !todayQuestion.question) {
      console.log('오늘의 질문이 없습니다.');
      return { success: false, message: '오늘의 질문이 설정되지 않았습니다.' };
    }

    // 전화번호 형식 정리
    const phoneNumber = testUser.phoneNumber.replace(/-/g, '');
    const userName = testUser.name || '고객';

    // bizgoService의 sendDailyQuestionAlimTalk 함수 사용
    const result = await bizgoService.sendDailyQuestionAlimTalk(
      todayQuestion,
      phoneNumber,
      userName,
    );

    console.log(
      `테스트 사용자 ${testUser.id}(${phoneNumber})에게 오늘의 질문 알림톡 전송 성공`,
    );

    return {
      success: true,
      userId: testUser.id,
      phoneNumber: phoneNumber,
      sentAt: new Date(),
      data: result,
    };
  } catch (error) {
    console.error('테스트 오늘의 질문 알림톡 전송 중 오류 발생:', error);
    return { success: false, message: error.message };
  }
}

module.exports = {
  scheduleDailyQuestion,
  createDailyQuestion,
  testSendDailyQuestionAlimTalk,
};
