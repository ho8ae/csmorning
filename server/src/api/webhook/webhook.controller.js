const webhookService = require('./webhook.service');
const kakaoService = require('../../services/kakao.service');
const { RESPONSE_MESSAGES, QUICK_REPLIES } = require('../../constants/chatbot');

/**
 * 카카오 응답 객체 생성
 */
const createKakaoResponse = (text, quickReplies = QUICK_REPLIES.DEFAULT) => {
  return {
    version: '2.0',
    template: {
      outputs: [
        {
          simpleText: {
            text,
          },
        },
      ],
      quickReplies,
    },
  };
};

/**
 * 카카오 카드 응답 객체 생성
 */
const createKakaoCardResponse = (
  title,
  description,
  buttons,
  quickReplies = QUICK_REPLIES.AFTER_LINK,
) => {
  return {
    version: '2.0',
    template: {
      outputs: [
        {
          textCard: {
            title,
            description,
            buttons,
          },
        },
      ],
      quickReplies,
    },
  };
};

/**
 * 요청 유효성 검사
 */
const validateRequest = (req) => {
  const { userRequest, action } = req.body;
  if (!userRequest || !action) {
    return false;
  }
  return true;
};

/**
 * 도움말/시작 메시지 처리
 */
const handleHelpCommand = async (req, user) => {
  return createKakaoResponse(RESPONSE_MESSAGES.WELCOME);
};

/**
 * 오늘의 질문 처리
 */
const handleTodayQuestionCommand = async (req, user) => {
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

/**
 * 계정 연동 처리
 */
const handleAccountLinkCommand = async (req, user) => {
  try {
    // 카카오 채널 ID 추출
    const kakaoChannelId = req.body.userRequest.user.id;
    console.log('카카오 채널 ID:', kakaoChannelId);

    // 매핑 조회
    let mapping = null;
    try {
      mapping = await req.prisma.userKakaoMapping.findUnique({
        where: { kakaoChannelId },
        include: { user: true },
      });
      console.log('매핑 조회 결과:', mapping);
    } catch (error) {
      console.error('매핑 조회 중 오류:', error);
    }

    // 이미 연동된 계정인지 확인
    if (mapping && mapping.user && mapping.user.isTemporary === false) {
      // 이미 연동된 계정인 경우
      return createKakaoCardResponse(
        '계정 연동 완료',
        '이미 CS Morning 웹사이트와 계정이 연동되어 있습니다.\n웹사이트에서 동일한 계정으로 서비스를 이용하실 수 있습니다.',
        [
          {
            action: 'webLink',
            label: 'CSMorning 웹사이트',
            webLinkUrl: 'https://csmorning.co.kr',
          },
        ],
      );
    } else {
      // 계정 연동 코드 생성
      const linkCode = await webhookService.generateLinkCode(
        req.prisma,
        kakaoChannelId,
      );

      // 서비스 도메인
      const serviceDomain =
        process.env.NODE_ENV === 'production'
          ? 'https://csmorning.co.kr'
          : 'http://localhost:5173';

      // 계정 연동이 필요한 경우 - textCard 형식으로 응답
      return createKakaoCardResponse(
        'CS Morning 계정 연동',
        `계정 연동 코드가 생성되었습니다.\n\n코드: ${linkCode}\n\n아래 버튼을 통해 CS Morning 웹사이트에서 계정을 연동하세요.\n연동 코드는 10분간 유효합니다.`,
        [
          {
            action: 'webLink',
            label: '웹사이트에서 연동하기',
            webLinkUrl: `${serviceDomain}/kakao-link?code=${linkCode}`,
          },
          {
            action: 'webLink',
            label: 'CSMorning 웹사이트',
            webLinkUrl: 'https://csmorning.co.kr',
          },
        ],
      );
    }
  } catch (error) {
    console.error('계정 연동 처리 중 오류:', error);
    return createKakaoResponse(RESPONSE_MESSAGES.LINKING_ERROR);
  }
};

/**
 * 구독 처리
 */
const handleSubscriptionCommand = async (req, user, utterance) => {
  const isUnsubscribe =
    utterance.includes('취소') || utterance.includes('해지');

  await req.prisma.user.update({
    where: { id: user.id },
    data: { isSubscribed: !isUnsubscribe },
  });

  const responseText = isUnsubscribe
    ? RESPONSE_MESSAGES.UNSUBSCRIBE_SUCCESS
    : RESPONSE_MESSAGES.SUBSCRIBE_SUCCESS;

  return createKakaoResponse(responseText);
};


/**
 * 카카오톡 챗봇 스킬 메시지 처리 (업데이트)
 */
const handleKakaoMessage = async (req, res, next) => {
  try {
    // 요청 유효성 검사
    if (!validateRequest(req)) {
      return res
        .status(400)
        .json(createKakaoResponse(RESPONSE_MESSAGES.INVALID_REQUEST));
    }

    // 사용자 정보 추출
    const { userRequest } = req.body;
    const userId = userRequest.user.id;
    const utterance = userRequest.utterance;

    console.log('받은 메시지:', utterance);
    console.log('사용자 ID:', userId);
    console.log('요청 본문:', JSON.stringify(req.body, null, 2));

    // 사용자 확인/생성
    const user = await webhookService.findOrCreateUser(req.prisma, userId);

    // 메시지 내용에 따른 처리
    let responseBody;

    // 일반 커맨드
    if (
      utterance.includes('안녕') ||
      utterance.includes('시작') ||
      utterance.includes('도움말')
    ) {
      responseBody = await handleHelpCommand(req, user);
    }
    // 오늘의 질문
    else if (utterance.includes('오늘의 질문') || utterance.includes('문제')) {
      responseBody = await handleTodayQuestionCommand(req, user);
    }
    // 오늘의 CS 지식 (추가된 부분)
    else if (
      utterance.includes('오늘의 CS 지식') ||
      utterance.includes('CS 지식')
    ) {
      responseBody = await handleTodayCSContentCommand(req, user);
    }
    // 주간 퀴즈 관련 명령어 (추가된 부분)
    else if (
      utterance.includes('주간 퀴즈') ||
      utterance.includes('주간퀴즈') ||
      utterance.includes('일요일 퀴즈') ||
      utterance.includes('주간 모드 퀴즈')
    ) {
      responseBody = await handleWeeklyQuizCommand(req, user);
    }
    // 주간 퀴즈 답변 처리 (새로운 버전)
    else if (utterance.includes('주간퀴즈답변')) {
      console.log('주간 퀴즈 답변 감지:', utterance);
      
      // 정규 표현식으로 퀴즈번호와 답변번호 추출
      const pattern = /주간퀴즈답변\s+(\d+)번\s+(\d+)/;
      const match = utterance.match(pattern);
      
      if (match && match.length >= 3) {
        const quizNumber = parseInt(match[1]);
        const answerNumber = parseInt(match[2]) - 1; // 0-based 인덱스로 변환
        
        console.log(`추출된 정보: 퀴즈번호=${quizNumber}, 답변번호=${answerNumber}`);
        
        // 주간 퀴즈 답변 함수 호출
        responseBody = await handleWeeklyQuizAnswerCommand(
          req,
          user,
          quizNumber,
          answerNumber
        );
      } else {
        responseBody = createKakaoResponse(
          "올바른 답변 형식이 아닙니다. '주간 퀴즈'를 입력하여 다시 시도해주세요.",
          QUICK_REPLIES.DEFAULT
        );
      }
    }
    // 학습 모드 변경 (추가된 부분)
    else if (
      utterance.includes('학습 모드') ||
      utterance.includes('모드 변경') ||
      utterance.includes('매일 모드') ||
      utterance.includes('주간 모드')
    ) {
      responseBody = await handleStudyModeCommand(req, user, utterance);
    }
    // 일반 번호 답변 (기존 오늘의 질문용)
    else if (/^[1-9]\d*$/.test(utterance.trim())) {
      // 사용자가 현재 주간 퀴즈를 진행 중인지 확인
      const weekNumber = webhookService.getCurrentWeekNumber();
      const userResponses = await webhookService.getUserWeeklyResponses(
        req.prisma,
        user.id,
        weekNumber,
      );

      // 사용자가 주간 모드이고, 다음 문제 번호가 있으면 주간 퀴즈 답변으로 처리
      if (user.studyMode === 'weekly' && userResponses && userResponses.nextQuizNumber) {
        // 단순 숫자 입력을 주간 퀴즈 답변 형식으로 변환
        const answerNumber = parseInt(utterance.trim());
        const quizNumber = userResponses.nextQuizNumber;

        // 주간 퀴즈 답변 처리
        console.log('단순 숫자를 주간 퀴즈 답변으로 변환:', quizNumber, answerNumber);
        
        // 주간 퀴즈 로직
        const quiz = await webhookService.getWeeklyQuizByNumber(
          req.prisma,
          weekNumber,
          quizNumber
        );
        
        if (quiz) {
          try {
            // 0-based 인덱스로 변환 (정답 확인용)
            const answer = answerNumber - 1;
            
            // 이미 응답했는지 확인
            const existingResponse = await req.prisma.weeklyResponse.findFirst({
              where: {
                userId: user.id,
                weeklyQuizId: quiz.id
              }
            });
            
            if (existingResponse) {
              console.log('이미 응답한 퀴즈:', existingResponse);
              // 이미 응답한 경우 다음 문제로 자동 진행
              responseBody = await handleWeeklyQuizCommand(req, user);
            } else {
              // 새 응답 생성
              const result = await webhookService.createWeeklyQuizResponse(
                req.prisma,
                user.id,
                quiz.id,
                answer
              );
              
              // 응답 메시지 생성
              const isCorrect = result.isCorrect;
              let responseText;
              
              if (isCorrect) {
                responseText = `정답입니다! 👏\n\n[설명💡]\n\n${quiz.explanation}`;
              } else {
                const correctOptionIndex = quiz.correctOption;
                responseText = `아쉽게도 오답입니다. 😢\n\n정답은 ${
                  correctOptionIndex + 1
                }번입니다.\n\n[설명💡]\n\n${quiz.explanation}`;
              }
              
              responseBody = createKakaoResponse(responseText, [
                {
                  label: '다음 문제',
                  action: 'message',
                  messageText: '주간 퀴즈',
                },
                {
                  label: '오늘의 질문',
                  action: 'message',
                  messageText: '오늘의 질문',
                },
                {
                  label: '도움말',
                  action: 'message',
                  messageText: '도움말',
                }
              ]);
            }
          } catch (error) {
            console.error('응답 처리 중 오류:', error);
            
            if (error.message && error.message.includes('이미 해당 퀴즈에 응답했습니다')) {
              // 이미 응답한 경우 다음 문제로 자동 진행
              responseBody = await handleWeeklyQuizCommand(req, user);
            } else {
              responseBody = createKakaoResponse(
                '처리 중 오류가 발생했습니다. 다시 시도해주세요.',
                QUICK_REPLIES.DEFAULT
              );
            }
          }
        } else {
          // 일반 오늘의 질문 답변으로 처리
          responseBody = await handleAnswerCommand(req, user, utterance);
        }
      } else {
        // 일반 오늘의 질문 답변으로 처리
        responseBody = await handleAnswerCommand(req, user, utterance);
      }
    }
    // 계정 연동
    else if (utterance.includes('계정 연동')) {
      responseBody = await handleAccountLinkCommand(req, user);
    }
    // 구독 관련
    else if (utterance.includes('구독')) {
      responseBody = await handleSubscriptionCommand(req, user, utterance);
    }
    // 기능 맛보기 관련
    else if (
      utterance.includes('기능 맛보기') ||
      utterance.includes('기능맛보기')
    ) {
      responseBody = await handleFeaturePreviewCommand(req, user);
    } else if (utterance.includes('내 정답률')) {
      responseBody = await handleMyAccuracyCommand(req, user);
    } else if (utterance.includes('카테고리별 성과')) {
      responseBody = await handleCategoryPerformanceCommand(req, user);
    } else if (
      utterance.includes('내 활동 캘린더') ||
      utterance.includes('활동 캘린더')
    ) {
      responseBody = await handleActivityCalendarCommand(req, user);
    } else if (
      utterance.includes('오늘 질문 통계') ||
      utterance.includes('질문 통계')
    ) {
      responseBody = await handleTodayQuestionStatsCommand(req, user);
    } else if (utterance.includes('최신 토론')) {
      responseBody = await handleLatestDiscussionsCommand(req, user);
    } else {
      responseBody = createKakaoResponse(RESPONSE_MESSAGES.UNKNOWN_COMMAND);
    }

    // 카카오 챗봇이 응답을 처리할 때 필요한 헤더
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(200).json(responseBody);
  } catch (error) {
    console.error('웹훅 처리 중 오류 발생:', error);

    // 오류 발생 시에도 챗봇 스킬 응답 형식 유지
    return res.status(200).json(createKakaoResponse(RESPONSE_MESSAGES.ERROR));
  }
};

/**
 * 계정 연동 코드 생성 처리
 */
const handleAccountLinking = async (req, res, next) => {
  try {
    const { userRequest } = req.body;

    if (!userRequest || !userRequest.user || !userRequest.user.id) {
      return res
        .status(200)
        .json(createKakaoResponse(RESPONSE_MESSAGES.INVALID_REQUEST));
    }

    const kakaoChannelId = userRequest.user.id;

    // 이미 연동된 계정인지 확인
    let mapping = null;
    try {
      mapping = await req.prisma.userKakaoMapping.findUnique({
        where: { kakaoChannelId },
        include: { user: true },
      });
      console.log('매핑 조회 결과:', mapping);
    } catch (error) {
      console.error('매핑 조회 중 오류:', error);
    }

    // 이미 연동된 계정인 경우
    if (mapping && mapping.user && mapping.user.isTemporary === false) {
      const responseBody = createKakaoResponse(
        RESPONSE_MESSAGES.ACCOUNT_LINKED,
        [
          {
            label: '오늘의 질문',
            action: 'message',
            messageText: '오늘의 질문',
          },
        ],
      );

      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      return res.status(200).json(responseBody);
    }

    // 연동 코드 생성
    const linkCode = await webhookService.generateLinkCode(
      req.prisma,
      kakaoChannelId,
    );

    // 서비스 도메인
    const serviceDomain =
      process.env.NODE_ENV === 'production'
        ? 'https://csmorning.co.kr'
        : 'http://localhost:5173';

    // 카카오 챗봇 응답
    const responseBody = createKakaoResponse(
      RESPONSE_MESSAGES.LINK_CODE_GENERATED(linkCode),
      [
        {
          label: '계정 연동하기',
          action: 'webLink',
          webLinkUrl: `${serviceDomain}/kakao-link?code=${linkCode}`,
        },
        {
          label: '오늘의 질문',
          action: 'message',
          messageText: '오늘의 질문',
        },
      ],
    );

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(200).json(responseBody);
  } catch (error) {
    console.error('계정 연동 처리 중 오류 발생:', error);

    return res
      .status(200)
      .json(createKakaoResponse(RESPONSE_MESSAGES.LINK_CODE_ERROR));
  }
};

/**
 * 기능 맛보기 처리
 */
const handleFeaturePreviewCommand = async (req, user) => {
  try {
    return createKakaoResponse(
      RESPONSE_MESSAGES.FEATURE_PREVIEW,
      QUICK_REPLIES.FEATURE_PREVIEW,
    );
  } catch (error) {
    console.error('기능 맛보기 처리 중 오류:', error);
    return createKakaoResponse(RESPONSE_MESSAGES.ERROR);
  }
};

/**
 * 내 정답률 확인 처리
 */
const handleMyAccuracyCommand = async (req, user) => {
  try {
    // 임시 사용자인 경우 계정 연동 필요
    if (user.isTemporary) {
      return createKakaoResponse(
        RESPONSE_MESSAGES.ACCOUNT_LINKING_REQUIRED,
        QUICK_REPLIES.DEFAULT,
      );
    }

    const webhookService = require('./webhook.service');
    const stats = await webhookService.getUserAccuracyStats(
      req.prisma,
      user.id,
    );

    return createKakaoResponse(
      RESPONSE_MESSAGES.MY_ACCURACY(
        stats.totalAnswered,
        stats.correctAnswers,
        stats.accuracy,
      ),
      QUICK_REPLIES.AFTER_FEATURE,
    );
  } catch (error) {
    console.error('내 정답률 확인 처리 중 오류:', error);
    return createKakaoResponse(RESPONSE_MESSAGES.ERROR);
  }
};

/**
 * 카테고리별 성과 확인 처리
 */
const handleCategoryPerformanceCommand = async (req, user) => {
  try {
    // 임시 사용자인 경우 계정 연동 필요
    if (user.isTemporary) {
      return createKakaoResponse(
        RESPONSE_MESSAGES.ACCOUNT_LINKING_REQUIRED,
        QUICK_REPLIES.DEFAULT,
      );
    }

    const webhookService = require('./webhook.service');
    const categoryStats = await webhookService.getUserCategoryPerformance(
      req.prisma,
      user.id,
    );

    return createKakaoResponse(
      RESPONSE_MESSAGES.CATEGORY_PERFORMANCE(categoryStats),
      QUICK_REPLIES.AFTER_FEATURE,
    );
  } catch (error) {
    console.error('카테고리별 성과 확인 처리 중 오류:', error);
    return createKakaoResponse(RESPONSE_MESSAGES.ERROR);
  }
};

/**
 * 내 활동 캘린더 확인 처리
 */
const handleActivityCalendarCommand = async (req, user) => {
  try {
    // 임시 사용자인 경우 계정 연동 필요
    if (user.isTemporary) {
      return createKakaoResponse(
        RESPONSE_MESSAGES.ACCOUNT_LINKING_REQUIRED,
        QUICK_REPLIES.DEFAULT,
      );
    }

    const webhookService = require('./webhook.service');
    const activityStats = await webhookService.getUserActivityStats(
      req.prisma,
      user.id,
    );

    return createKakaoResponse(
      RESPONSE_MESSAGES.ACTIVITY_CALENDAR(
        activityStats.totalDays,
        activityStats.longestStreak,
        activityStats.currentStreak,
      ),
      QUICK_REPLIES.AFTER_FEATURE,
    );
  } catch (error) {
    console.error('내 활동 캘린더 확인 처리 중 오류:', error);
    return createKakaoResponse(RESPONSE_MESSAGES.ERROR);
  }
};

/**
 * 오늘의 질문 통계 확인 처리
 */
const handleTodayQuestionStatsCommand = async (req, user) => {
  try {
    const webhookService = require('./webhook.service');
    const questionStats = await webhookService.getTodayQuestionStats(
      req.prisma,
    );

    return createKakaoResponse(
      RESPONSE_MESSAGES.TODAY_QUESTION_STATS(
        questionStats.totalResponses,
        questionStats.correctResponses,
        questionStats.accuracy,
        questionStats.mostCommonWrong,
      ),
      QUICK_REPLIES.AFTER_FEATURE,
    );
  } catch (error) {
    console.error('오늘의 질문 통계 확인 처리 중 오류:', error);
    return createKakaoResponse(RESPONSE_MESSAGES.ERROR);
  }
};

/**
 * 최신 토론 확인 처리
 */
const handleLatestDiscussionsCommand = async (req, user) => {
  try {
    const webhookService = require('./webhook.service');
    const discussions = await webhookService.getLatestDiscussions(req.prisma);

    return createKakaoResponse(
      RESPONSE_MESSAGES.LATEST_DISCUSSIONS(discussions),
      QUICK_REPLIES.AFTER_FEATURE,
    );
  } catch (error) {
    console.error('최신 토론 확인 처리 중 오류:', error);
    return createKakaoResponse(RESPONSE_MESSAGES.ERROR);
  }
};

/**
 * 테스트 엔드포인트
 */
const testEndpoint = (req, res) => {
  const responseBody = createKakaoResponse(RESPONSE_MESSAGES.TEST);
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  return res.status(200).json(responseBody);
};

/**
 * 학습 모드 변경 처리
 */
const handleStudyModeCommand = async (req, user, utterance) => {
  try {
    // 모드 선택
    let newMode = null;

    if (utterance.includes('매일') || utterance.includes('데일리')) {
      newMode = 'daily';
    } else if (utterance.includes('주간') || utterance.includes('위클리')) {
      newMode = 'weekly';
    }

    if (!newMode) {
      return createKakaoCardResponse(
        '학습 모드 선택',
        '원하시는 학습 모드를 선택해주세요.\n\n매일 모드: 매일 하나의 CS 문제가 제공됩니다.\n주간 모드: 매일 CS 지식이 제공되고, 주말에 관련 문제 7개를 풀 수 있습니다.',
        [],
        [
          {
            label: '매일 모드',
            action: 'message',
            messageText: '매일 모드로 변경',
          },
          {
            label: '주간 모드',
            action: 'message',
            messageText: '주간 모드로 변경',
          },
        ],
      );
    }

    // 임시 사용자인 경우 계정 연동 필요
    if (user.isTemporary) {
      return createKakaoResponse(
        RESPONSE_MESSAGES.ACCOUNT_LINKING_REQUIRED,
        QUICK_REPLIES.DEFAULT,
      );
    }

    // 모드 업데이트
    await webhookService.updateUserStudyMode(req.prisma, user.id, newMode);

    const modeText = newMode === 'daily' ? '매일' : '주간';
    const modeDescription =
      newMode === 'daily'
        ? '매일 하나의 CS 문제가 제공됩니다.'
        : '매일 CS 지식이 제공되고, 주말에 관련 문제 7개를 풀 수 있습니다.';

    return createKakaoResponse(
      `학습 모드가 ${modeText} 모드로 변경되었습니다.\n\n${modeText} 모드에서는 ${modeDescription}`,
      QUICK_REPLIES.DEFAULT,
    );
  } catch (error) {
    console.error('학습 모드 변경 중 오류:', error);
    return createKakaoResponse(RESPONSE_MESSAGES.ERROR);
  }
};

/**
 * 오늘의 CS 지식 처리
 */
const handleTodayCSContentCommand = async (req, user) => {
  try {
    const csContent = await webhookService.getTodayCSContent(req.prisma);

    if (!csContent) {
      return createKakaoResponse(
        '오늘의 CS 지식이 아직 준비되지 않았습니다. 잠시 후 다시 시도해주세요!',
      );
    }

    // 컨텐츠 미리보기
    const previewLength = 150;
    const contentPreview =
      csContent.content.length > previewLength
        ? csContent.content.substring(0, previewLength) + '...'
        : csContent.content;

    return createKakaoCardResponse(
      csContent.title,
      `${contentPreview}\n\n자세한 내용은 웹사이트에서 확인하세요. 주간 퀴즈에서 이번 주 배운 내용을 테스트합니다!`,
      [
        {
          action: 'webLink',
          label: '웹사이트에서 보기',
          webLinkUrl: `${process.env.SERVICE_URL}/cs-content/${csContent.id}`,
        },
      ],
      QUICK_REPLIES.DEFAULT,
    );
  } catch (error) {
    console.error('오늘의 CS 지식 처리 중 오류:', error);
    return createKakaoResponse(RESPONSE_MESSAGES.ERROR);
  }
};

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
            label: '오늘의 질문',
            action: 'message',
            messageText: '오늘의 질문',
          },
        ],
      );
    }

    // 현재 주차와 응답 현황 조회
    const weekNumber = webhookService.getCurrentWeekNumber();
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
          messageText: `주간퀴즈답변 ${nextQuizNumber}번 ${i + 1}`, // 퀴즈 번호는 "번"을 붙여서 구분
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

    const responseText = `[${weekNumber}주차 주간 퀴즈 - ${nextQuizNumber}/7]\n\n${progressEmoji}\n\n${nextQuiz.quizText}\n\n${options}\n\n답변은 번호로 선택해주세요.`;

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
      
      // 응답 메시지 생성
      let responseText;
      if (result.isCorrect) {
        responseText = `정답입니다! 👏\n\n[설명💡]\n\n${quiz.explanation}`;
      } else {
        const correctOptionIndex = quiz.correctOption;
        responseText = `아쉽게도 오답입니다. 😢\n\n정답은 ${
          correctOptionIndex + 1
        }번입니다.\n\n[설명💡]\n\n${quiz.explanation}`;
      }
      
      return createKakaoResponse(responseText, [
        {
          label: '다음 문제',
          action: 'message',
          messageText: '주간 퀴즈',
        },
        {
          label: '오늘의 질문',
          action: 'message',
          messageText: '오늘의 질문',
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
  handleKakaoMessage,
  testEndpoint,
  handleAccountLinking,
  handleFeaturePreviewCommand,
  handleMyAccuracyCommand,
  handleCategoryPerformanceCommand,
  handleActivityCalendarCommand,
  handleTodayQuestionStatsCommand,
  handleLatestDiscussionsCommand,
  handleSubscriptionCommand,
  handleStudyModeCommand,
  handleTodayCSContentCommand,
  handleWeeklyQuizCommand,
  handleWeeklyQuizAnswerCommand,
};
