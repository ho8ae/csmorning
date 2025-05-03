const { RESPONSE_MESSAGES, QUICK_REPLIES } = require('../../../constants/chatbot');

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
 * 오류 메시지 응답
 */
const createErrorResponse = () => {
  return createKakaoResponse(RESPONSE_MESSAGES.ERROR);
};

/**
 * 알 수 없는 명령어 응답
 */
const createUnknownCommandResponse = () => {
  return createKakaoResponse(RESPONSE_MESSAGES.UNKNOWN_COMMAND);
};

module.exports = {
  createKakaoResponse,
  createKakaoCardResponse,
  validateRequest,
  createErrorResponse,
  createUnknownCommandResponse
};