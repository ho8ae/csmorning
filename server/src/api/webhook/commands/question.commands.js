const webhookService = require('../services/webhook.service');
const { createKakaoResponse } = require('../services/response.service');
const { RESPONSE_MESSAGES, QUICK_REPLIES } = require('../../../constants/chatbot');

/**
 * 오늘의 질문 처리
 */
const handleTodayQuestionCommand = async (req, user) => {
  // 주간 모드 사용자의 경우 오늘의 질문 차단
  if (user.studyMode === 'weekly') {
    return createKakaoResponse(
      "주간 모드 사용자시군요! 오늘의 질문을 사용하시려면 학습 모드를 변경해주세요. 주간 모드에서는 '주간 퀴즈' 명령어를 사용해보세요.",
      [
        {
          label: '학습 모드 변경',
          action: 'message',
          messageText: '학습 모드 변경',
        },
        {
          label: '주간 퀴즈',
          action: 'message',
          messageText: '주간 퀴즈',
        },
        {
          label: '도움말',
          action: 'message',
          messageText: '도움말',
        },
      ]
    );
  }

  // 매일 모드 사용자만 이 부분 실행
  const todayQuestion = await webhookService.getTodayQuestion(req.prisma);

  if (!todayQuestion) {
    return createKakaoResponse(RESPONSE_MESSAGES.NO_QUESTION);
  }

  // 질문 포맷팅
  const question = todayQuestion.question;
  let options = '';

  // options가 문자열인 경우 JSON 파싱
  const optionsArray =
    typeof question.options === 'string'
      ? JSON.parse(question.options)
      : question.options;

  // 퀵 리플라이 생성
  let quickReplies = [];

  // 이제 배열로 처리
  if (Array.isArray(optionsArray)) {
    optionsArray.forEach((option, index) => {
      options += `${index + 1}. ${option}\n`;
    });

    // 선택지 수에 맞게 퀵 리플라이 버튼 생성
    for (let i = 0; i < optionsArray.length; i++) {
      quickReplies.push({
        label: `${i + 1}번`,
        action: 'message',
        messageText: `${i + 1}`,
      });
    }

    // 기존 메뉴도 추가
    quickReplies.push({
      label: '도움말',
      action: 'message',
      messageText: '도움말',
    });
  } else {
    console.log('Parsed question options is not an array:', optionsArray);
    options = RESPONSE_MESSAGES.INVALID_OPTIONS;
  }

  const responseText = `[오늘의 CS 질문😎]\n\n카테고리 : ${question.category}\n난이도 : ${question.difficulty}\n\n[오늘의 질문🔎]\n${question.text}\n\n${options}\n\n답변은 번호로 입력해주세요 (예: 1) \n\n[안내☑️]\n계정 연동을 해야 기록이 됩니다\n'안녕'을 입력하면 처음으로 돌아갑니다\n처음 입력이 답으로 기록됩니다`;

  return createKakaoResponse(responseText, quickReplies);
};

/**
 * 답변 처리
 */
const handleAnswerCommand = async (req, user, utterance) => {
  // 주간 모드 사용자의 경우 오늘의 질문 답변 차단
  if (user.studyMode === 'weekly') {
    return createKakaoResponse(
      "주간 모드 사용자시군요! 오늘의 질문을 사용하시려면 학습 모드를 변경해주세요. 주간 모드에서는 '주간 퀴즈' 명령어를 사용해보세요.",
      [
        {
          label: '학습 모드 변경',
          action: 'message',
          messageText: '학습 모드 변경',
        },
        {
          label: '주간 퀴즈',
          action: 'message',
          messageText: '주간 퀴즈',
        },
        {
          label: '도움말',
          action: 'message',
          messageText: '도움말',
        },
      ]
    );
  }

  const todayQuestion = await webhookService.getTodayQuestion(req.prisma);

  if (!todayQuestion) {
    return createKakaoResponse(RESPONSE_MESSAGES.NO_ACTIVE_QUESTION);
  }

  // 사용자 답변 처리
  const answerIndex = parseInt(utterance.trim()) - 1;
  const options = todayQuestion.question.options;

  // 옵션 범위 확인
  if (answerIndex < 0 || answerIndex >= options.length) {
    return createKakaoResponse(
      RESPONSE_MESSAGES.ANSWER_OUT_OF_RANGE(options.length),
    );
  }

  // 정답 확인
  const isCorrect = answerIndex === todayQuestion.question.correctOption;

  // 이미 응답했는지 확인
  const existingResponse = await webhookService.getUserResponseForQuestion(
    req.prisma,
    user.id,
    todayQuestion.id,
  );

  if (!existingResponse) {
    // 새 응답 저장
    await webhookService.createResponse(
      req.prisma,
      user.id,
      todayQuestion.id,
      answerIndex,
      isCorrect,
    );

    // 사용자 통계 업데이트
    await webhookService.updateUserStats(req.prisma, user.id, isCorrect);
  }

  // 응답 메시지 준비
  let responseText;
  if (isCorrect) {
    responseText = RESPONSE_MESSAGES.CORRECT_ANSWER(
      todayQuestion.question.explanation,
    );
  } else {
    const correctOptionIndex = todayQuestion.question.correctOption;
    responseText = RESPONSE_MESSAGES.WRONG_ANSWER(
      correctOptionIndex,
      todayQuestion.question.explanation,
    );
  }

  return createKakaoResponse(responseText, QUICK_REPLIES.AFTER_ANSWER);
};

module.exports = {
  handleTodayQuestionCommand,
  handleAnswerCommand
};