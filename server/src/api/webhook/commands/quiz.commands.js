const webhookService = require('../services/webhook.service');
const { createKakaoResponse } = require('../services/response.service');
const { RESPONSE_MESSAGES, QUICK_REPLIES } = require('../../../constants/chatbot');

/**
 * 주간 퀴즈 시작 처리
 */
const handleWeeklyQuizCommand = async (req, user) => {
  try {
    // 임시 사용자인 경우 계정 연동 필요
    if (user.isTemporary) {
      return createKakaoResponse(
        RESPONSE_MESSAGES.ACCOUNT_LINKING_REQUIRED,
        QUICK_REPLIES.DEFAULT,
      );
    }

    // 주간 모드 사용자가 아닌 경우
    if (user.studyMode !== 'weekly') {
      return createKakaoResponse(
        "주간 퀴즈 기능은 주간 모드에서만 사용할 수 있습니다. '학습 모드 변경'을 입력하여 모드를 변경해주세요.",
        [
          {
            label: '학습 모드 변경',
            action: 'message',
            messageText: '학습 모드 변경',
          },
          {
            label: '도움말',
            action: 'message',
            messageText: '도움말',
          },
        ],
      );
    }

    // 현재 주차와 응답 현황 조회
    const weekNumber = 1; // 고정값 사용 (임시)
    const { quizzes } = await webhookService.getWeeklyQuizzes(
      req.prisma,
      weekNumber,
    );

    if (quizzes.length === 0) {
      return createKakaoResponse(
        `${weekNumber}주차 주간 퀴즈가 아직 준비되지 않았습니다. 일요일에 다시 시도해주세요.`,
        QUICK_REPLIES.DEFAULT,
      );
    }

    // 사용자 응답 현황 조회
    const userResponses = await webhookService.getUserWeeklyResponses(
      req.prisma,
      user.id,
      weekNumber,
    );

    // 모든 문제를 풀었는지 확인
    if (userResponses.progress.answered >= userResponses.progress.total) {
      const correctCount = userResponses.progress.correct;
      const totalCount = userResponses.progress.total;
      const accuracy = ((correctCount / totalCount) * 100).toFixed(1);

      return createKakaoResponse(
        `🎉 ${weekNumber}주차 주간 퀴즈를 모두 완료했습니다!\n\n정답 수: ${correctCount}/${totalCount}\n정답률: ${accuracy}%\n\n다음 주차의 퀴즈를 기대해주세요!`,
        QUICK_REPLIES.DEFAULT,
      );
    }

    // 다음 풀어야 할 문제 번호 찾기
    let nextQuizNumber = 1;
    for (let i = 1; i <= 7; i++) {
      if (userResponses.responses[i] && !userResponses.responses[i].answered) {
        nextQuizNumber = i;
        break;
      }
    }

    // 다음 문제가 없는 경우
    if (!nextQuizNumber) {
      // 아직 등록되지 않은 문제가 있을 가능성
      return createKakaoResponse(
        `현재 ${userResponses.progress.answered}개의 문제를 풀었습니다. 나머지 문제는 아직 준비 중입니다.`,
        QUICK_REPLIES.DEFAULT,
      );
    }

    // 다음 퀴즈 정보 가져오기
    const nextQuiz = await webhookService.getWeeklyQuizByNumber(
      req.prisma,
      weekNumber,
      nextQuizNumber,
    );

    if (!nextQuiz) {
      return createKakaoResponse(
        `${nextQuizNumber}번 퀴즈를 찾을 수 없습니다. 관리자에게 문의해주세요.`,
        QUICK_REPLIES.DEFAULT,
      );
    }

    // 퀴즈 포맷팅
    let options = '';
    const optionsArray =
      typeof nextQuiz.options === 'string'
        ? JSON.parse(nextQuiz.options)
        : nextQuiz.options;

    // 퀵 리플라이 생성
    let quickReplies = [];

    // 선택지 처리
    if (Array.isArray(optionsArray)) {
      optionsArray.forEach((option, index) => {
        options += `${index + 1}. ${option}\n`;
      });

      // 선택지 수에 맞게 퀵 리플라이 버튼 생성 (수정된 부분)
      for (let i = 0; i < optionsArray.length; i++) {
        quickReplies.push({
          label: `${i + 1}번`,
          action: 'message',
          messageText: `${i + 1}`,
        });
      }
    } else {
      options = '선택지 형식이 올바르지 않습니다.';
    }

    // 진행 상황 표시용 이모지 생성
    let progressEmoji = '';
    for (let i = 1; i <= 7; i++) {
      if (userResponses.responses[i] && userResponses.responses[i].answered) {
        // 이미 푼 문제
        progressEmoji += userResponses.responses[i].isCorrect ? '🟢' : '🔴';
      } else if (i === nextQuizNumber) {
        // 현재 풀고 있는 문제
        progressEmoji += '🔵';
      } else {
        // 아직 풀지 않은 문제
        progressEmoji += '⚪';
      }
    }

    // 안내 사항 추가 (수정된 부분)
    const responseText = `[주간 퀴즈 문제 - ${weekNumber}주차 ${nextQuizNumber}/7]\n\n${progressEmoji}\n\n${nextQuiz.quizText}\n\n${options}\n\n⚠️ 답변을 신중하게 고르세요! 처음 입력한 답변이 기록됩니다.\n\n답변은 번호로 선택해주세요.`;

    return createKakaoResponse(responseText, quickReplies);
  } catch (error) {
    console.error('주간 퀴즈 처리 중 오류:', error);
    return createKakaoResponse(RESPONSE_MESSAGES.ERROR);
  }
};

/**
 * 주간 퀴즈 답변 처리 (간소화된 버전)
 * @param {Object} req - 요청 객체
 * @param {Object} user - 사용자 정보
 * @param {number} quizNumber - 퀴즈 번호
 * @param {number} answer - 사용자 응답 (0-based index)
 * @returns {Object} 응답 객체
 */
const handleWeeklyQuizAnswerCommand = async (req, user, quizNumber, answer) => {
  try {
    console.log('주간 퀴즈 답변 처리 시작:', quizNumber, answer);
    
    // 임시 사용자인 경우 계정 연동 필요
    if (user.isTemporary) {
      return createKakaoResponse(
        RESPONSE_MESSAGES.ACCOUNT_LINKING_REQUIRED,
        QUICK_REPLIES.DEFAULT,
      );
    }
    
    // 현재 주차 계산 (임시로 항상 1 반환)
    const weekNumber = 1; // 고정값 사용
    console.log('주차:', weekNumber);
    
    // 해당 퀴즈 찾기
    const quiz = await webhookService.getWeeklyQuizByNumber(
      req.prisma,
      weekNumber,
      quizNumber,
    );
    
    if (!quiz) {
      return createKakaoResponse(
        "해당 번호의 퀴즈를 찾을 수 없습니다. '주간 퀴즈'를 입력하여 다시 시도해주세요.",
        QUICK_REPLIES.DEFAULT,
      );
    }
    
    console.log('퀴즈 정보:', quiz.id, quiz.quizText);
    
    // 이미 응답했는지 확인
    const existingResponse = await req.prisma.weeklyResponse.findFirst({
      where: {
        userId: user.id,
        weeklyQuizId: quiz.id
      }
    });
    
    if (existingResponse) {
      console.log('이미 응답한 퀴즈임');
      // 다음 문제로 자동 진행
      return await handleWeeklyQuizCommand(req, user);
    }
    
    // 새 응답 생성
    try {
      console.log('응답 생성 시도:', user.id, quiz.id, answer);
      const result = await webhookService.createWeeklyQuizResponse(
        req.prisma,
        user.id,
        quiz.id,
        answer
      );
      
      console.log('응답 생성 결과:', result.isCorrect);
      
      // 응답 메시지 생성 (수정된 부분)
      let responseText;
      if (result.isCorrect) {
        responseText = `[주간 퀴즈 답변]\n\n정답입니다! 👏\n\n[설명💡]\n\n${quiz.explanation}`;
      } else {
        const correctOptionIndex = quiz.correctOption;
        responseText = `[주간 퀴즈 답변]\n\n아쉽게도 오답입니다. 😢\n\n정답은 ${
          correctOptionIndex + 1
        }번입니다.\n\n[설명💡]\n\n${quiz.explanation}`;
      }
      
      // quickReplies 수정 - '오늘의 질문' 버튼 제거
      return createKakaoResponse(responseText, [
        {
          label: '다음 문제',
          action: 'message',
          messageText: '주간 퀴즈',
        },
        {
          label: '도움말',
          action: 'message',
          messageText: '도움말',
        },
      ]);
    } catch (error) {
      console.error('응답 생성 중 오류:', error);
      return createKakaoResponse(
        "오류가 발생했습니다. '주간 퀴즈'를 입력하여 다시 시도해주세요.",
        QUICK_REPLIES.DEFAULT
      );
    }
  } catch (error) {
    console.error('주간 퀴즈 답변 처리 중 오류:', error);
    return createKakaoResponse(RESPONSE_MESSAGES.ERROR);
  }
};

module.exports = {
  handleWeeklyQuizCommand,
  handleWeeklyQuizAnswerCommand
};