const webhookService = require('../services/webhook.service');
const { createKakaoResponse, createKakaoCardResponse } = require('../services/response.service');
const { RESPONSE_MESSAGES, QUICK_REPLIES } = require('../../../constants/chatbot');

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

    const serviceUrl = process.env.SERVICE_URL || 'https://csmorning.co.kr';

    return createKakaoCardResponse(
      csContent.title,
      `${contentPreview}\n\n자세한 내용은 웹사이트에서 확인하세요. 주간 퀴즈에서 이번 주 배운 내용을 테스트합니다!`,
      [
        {
          action: 'webLink',
          label: '웹사이트에서 보기',
          webLinkUrl: `${serviceUrl}/cs-content/${csContent.id}`,
        },
      ],
      QUICK_REPLIES.DEFAULT,
    );
  } catch (error) {
    console.error('오늘의 CS 지식 처리 중 오류:', error);
    return createKakaoResponse(RESPONSE_MESSAGES.ERROR);
  }
};

module.exports = {
  handleTodayCSContentCommand
};