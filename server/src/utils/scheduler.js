const cron = require('node-cron');
const { prisma } = require('../config/db');
const kakaoService = require('../services/kakao.service');

/**
 * 매일 아침 질문 발송 스케줄러
 */
const scheduleDailyQuestion = () => {
  // 매일 아침 9시에 실행 (서버 시간 기준)
  cron.schedule('0 9 * * *', async () => {
    try {
      console.log('매일 질문 발송 스케줄러 실행...');
      
      // 오늘 이미 발송된 질문이 있는지 확인
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const existingDaily = await prisma.dailyQuestion.findFirst({
        where: {
          sentDate: {
            gte: today
          }
        }
      });
      
      if (existingDaily) {
        console.log('오늘 이미 질문이 발송되었습니다.');
        return;
      }
      
      // 활성 상태인 질문 중 랜덤으로 선택
      // 이전에 사용된 적이 없는 질문 선택을 우선
      const unusedQuestions = await prisma.question.findMany({
        where: {
          active: true,
          dailyQuestions: {
            none: {}
          }
        }
      });
      
      let selectedQuestion;
      
      if (unusedQuestions.length > 0) {
        // 사용되지 않은 질문 중 랜덤 선택
        const randomIndex = Math.floor(Math.random() * unusedQuestions.length);
        selectedQuestion = unusedQuestions[randomIndex];
      } else {
        // 모든 질문이 이미 사용되었다면, 가장 오래 전에 사용된 질문 선택
        const questions = await prisma.question.findMany({
          where: {
            active: true
          },
          include: {
            dailyQuestions: {
              orderBy: {
                sentDate: 'asc'
              },
              take: 1
            }
          },
          orderBy: {
            dailyQuestions: {
              sentDate: 'asc'
            }
          },
          take: 1
        });
        
        if (questions.length === 0) {
          console.error('활성화된 질문이 없습니다.');
          return;
        }
        
        selectedQuestion = questions[0];
      }
      
      // DailyQuestion 생성
      const dailyQuestion = await prisma.dailyQuestion.create({
        data: {
          questionId: selectedQuestion.id
        },
        include: {
          question: true
        }
      });
      
      // 구독자들에게 발송
      const subscribers = await prisma.user.findMany({
        where: {
          isSubscribed: true
        }
      });
      
      console.log(`${subscribers.length}명의 구독자에게 질문 발송 중...`);
      
      // 질문 메시지 템플릿 생성
      const optionsText = selectedQuestion.options
        .map((option, index) => `${index + 1}. ${option}`)
        .join('\n');
      
      const questionText = `📝 오늘의 CS 면접 질문\n\n${selectedQuestion.text}\n\n${optionsText}\n\n답변은 숫자만 입력해주세요. (예: 1)`;
      
      // 사용자별 메시지 발송 (비동기 처리)
      const sendPromises = subscribers.map(user => {
        const template = {
          object_type: 'text',
          text: questionText,
          link: {
            web_url: process.env.SERVICE_URL || 'https://your-service.com',
            mobile_web_url: process.env.SERVICE_URL || 'https://your-service.com'
          }
        };
        
        return kakaoService.sendMessage(user.kakaoId, template);
      });
      
      // 모든 발송 완료 대기
      await Promise.allSettled(sendPromises);
      
      console.log(`오늘의 질문(ID: ${dailyQuestion.id}) 발송 완료`);
    } catch (error) {
      console.error('매일 질문 스케줄러 오류:', error);
    }
  });
  
  console.log('매일 질문 발송 스케줄러가 설정되었습니다.');
};

module.exports = {
  scheduleDailyQuestion
};