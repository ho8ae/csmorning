const webhookService = require('./services/webhook.service');
const { validateRequest, createKakaoResponse, createErrorResponse } = require('./services/response.service');
const { processCommand } = require('./services/command.router');
const { RESPONSE_MESSAGES } = require('../../constants/chatbot');

/**
 * 카카오톡 챗봇 스킬 메시지 처리
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
    console.log('받은 메시지:', userRequest.utterance);
    console.log('사용자 ID:', userId);

    // 사용자 확인/생성
    const user = await webhookService.findOrCreateUser(req.prisma, userId);

    // 명령어 처리
    const responseBody = await processCommand(req, user);

    // 카카오 챗봇이 응답을 처리할 때 필요한 헤더
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(200).json(responseBody);
  } catch (error) {
    console.error('웹훅 처리 중 오류 발생:', error);
    return res.status(200).json(createErrorResponse());
  }
};

/**
 * 테스트 엔드포인트
 */
const testEndpoint = (req, res) => {
  const { createKakaoResponse } = require('./services/response.service');
  const { RESPONSE_MESSAGES } = require('../../constants/chatbot');
  
  const responseBody = createKakaoResponse(RESPONSE_MESSAGES.TEST);
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  return res.status(200).json(responseBody);
};

/**
 * 계정 연동 처리
 */
const handleAccountLinking = async (req, res, next) => {
  const { createKakaoResponse } = require('./services/response.service');
  const webhookService = require('./services/webhook.service');
  const { RESPONSE_MESSAGES, QUICK_REPLIES } = require('../../constants/chatbot');
  
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

module.exports = {
  handleKakaoMessage,
  testEndpoint,
  handleAccountLinking
};