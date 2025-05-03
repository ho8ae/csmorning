const webhookService = require('../services/webhook.service');
const { createKakaoResponse, createKakaoCardResponse } = require('../services/response.service');
const { RESPONSE_MESSAGES, QUICK_REPLIES } = require('../../../constants/chatbot');

/**
 * 도움말/시작 메시지 처리
 */
const handleHelpCommand = async (req, user) => {
  return createKakaoResponse(RESPONSE_MESSAGES.WELCOME);
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

module.exports = {
  handleHelpCommand,
  handleAccountLinkCommand,
  handleSubscriptionCommand,
  handleStudyModeCommand
};