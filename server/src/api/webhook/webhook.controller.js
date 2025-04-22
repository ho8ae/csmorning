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
const createKakaoCardResponse = (title, description, buttons, quickReplies = QUICK_REPLIES.AFTER_LINK) => {
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
    return createKakaoResponse(RESPONSE_MESSAGES.ANSWER_OUT_OF_RANGE(options.length));
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
    await webhookService.updateUserStats(
      req.prisma,
      user.id,
      isCorrect,
    );
  }

  // 응답 메시지 준비
  let responseText;
  if (isCorrect) {
    responseText = RESPONSE_MESSAGES.CORRECT_ANSWER(todayQuestion.question.explanation);
  } else {
    const correctOptionIndex = todayQuestion.question.correctOption;
    responseText = RESPONSE_MESSAGES.WRONG_ANSWER(correctOptionIndex, todayQuestion.question.explanation);
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
        include: { user: true }
      });
      console.log('매핑 조회 결과:', mapping);
    } catch (error) {
      console.error('매핑 조회 중 오류:', error);
    }
    
    // 이미 연동된 계정인지 확인
    if (mapping && mapping.user && mapping.user.isTemporary === false) {
      // 이미 연동된 계정인 경우
      return createKakaoCardResponse(
        "계정 연동 완료",
        "이미 CS Morning 웹사이트와 계정이 연동되어 있습니다.\n웹사이트에서 동일한 계정으로 서비스를 이용하실 수 있습니다.",
        [
          {
            action: "webLink",
            label: "CSMorning 웹사이트",
            webLinkUrl: "https://csmorning.co.kr"
          }
        ]
      );
    } else {
      // 계정 연동 코드 생성
      const linkCode = await webhookService.generateLinkCode(req.prisma, kakaoChannelId);
      
      // 서비스 도메인
      const serviceDomain = process.env.NODE_ENV === 'production'
        ? 'https://csmorning.co.kr'
        : 'http://localhost:5173';
      
      // 계정 연동이 필요한 경우 - textCard 형식으로 응답
      return createKakaoCardResponse(
        "CS Morning 계정 연동",
        `계정 연동 코드가 생성되었습니다.\n\n코드: ${linkCode}\n\n아래 버튼을 통해 CS Morning 웹사이트에서 계정을 연동하세요.\n연동 코드는 10분간 유효합니다.`,
        [
          {
            action: "webLink",
            label: "웹사이트에서 연동하기",
            webLinkUrl: `${serviceDomain}/kakao-link?code=${linkCode}`
          },
          {
            action: "webLink",
            label: "CSMorning 웹사이트",
            webLinkUrl: "https://csmorning.co.kr"
          }
        ]
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
  const isUnsubscribe = utterance.includes('취소') || utterance.includes('해지');
  
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
 * 카카오톡 챗봇 스킬 메시지 처리
 */
const handleKakaoMessage = async (req, res, next) => {
  try {
    // 요청 유효성 검사
    if (!validateRequest(req)) {
      return res.status(400).json(createKakaoResponse(RESPONSE_MESSAGES.INVALID_REQUEST));
    }

    // 사용자 정보 추출
    const { userRequest } = req.body;
    const userId = userRequest.user.id;
    const utterance = userRequest.utterance;

    console.log('받은 메시지:', utterance);
    console.log('사용자 ID:', userId);

    // 사용자 확인/생성
    const user = await webhookService.findOrCreateUser(req.prisma, userId);

    // 메시지 내용에 따른 처리
    let responseBody;

    if (
      utterance.includes('안녕') ||
      utterance.includes('시작') ||
      utterance.includes('도움말')
    ) {
      responseBody = await handleHelpCommand(req, user);
    } else if (
      utterance.includes('오늘의 질문') ||
      utterance.includes('문제')
    ) {
      responseBody = await handleTodayQuestionCommand(req, user);
    } else if (/^[1-9]\d*$/.test(utterance.trim())) {
      responseBody = await handleAnswerCommand(req, user, utterance);
    } else if (utterance.includes('계정 연동')) {
      responseBody = await handleAccountLinkCommand(req, user);
    } else if (utterance.includes('구독')) {
      responseBody = await handleSubscriptionCommand(req, user, utterance);
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
      return res.status(200).json(createKakaoResponse(RESPONSE_MESSAGES.INVALID_REQUEST));
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
      const responseBody = createKakaoResponse(RESPONSE_MESSAGES.ACCOUNT_LINKED, [
        {
          label: '오늘의 질문',
          action: 'message',
          messageText: '오늘의 질문',
        },
      ]);

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
      ]
    );

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(200).json(responseBody);
  } catch (error) {
    console.error('계정 연동 처리 중 오류 발생:', error);

    return res.status(200).json(createKakaoResponse(RESPONSE_MESSAGES.LINK_CODE_ERROR));
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

module.exports = {
  handleKakaoMessage,
  testEndpoint,
  handleAccountLinking,
};