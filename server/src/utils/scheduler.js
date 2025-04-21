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
    '09 18 * * *',
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
 * 오늘의 질문 생성 및 설정
 */
async function createDailyQuestion() {
  try {
    console.log('오늘의 질문 설정 시작...');

    // 랜덤 질문 선택
    const questions = await prisma.question.findMany({
      where: { active: true },
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
        sentDate: new Date(),
      },
    });

    console.log(`오늘의 질문이 설정되었습니다: ${selectedQuestion.text}`);
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
