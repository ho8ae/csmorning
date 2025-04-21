// src/api/bizgo/bizgo.service.js
const axios = require('axios');
const { prisma } = require('../../config/db');

// 인포뱅크 Bizgo API URL
const BASE_URL = process.env.BIZGO_API_URL || 'https://omni.ibapi.kr';
const CLIENT_ID = process.env.BIZGO_CLIENT_ID;
const CLIENT_PASSWORD = process.env.BIZGO_CLIENT_PASSWORD;
const SENDER_KEY = process.env.BIZGO_SENDER_KEY;
const TEMPLATE_CODE = process.env.BIZGO_TEMPLATE_CODE;

// 토큰 정보
let token = null;
let tokenExpiry = null;

/**
 * Bizgo API 토큰 가져오기 (필요시 자동 갱신)
 */
async function getToken() {
  // 토큰이 없거나 만료되었으면 새로 발급
  if (!token || !tokenExpiry || new Date() >= new Date(tokenExpiry)) {
    try {
      const response = await axios.post(`${BASE_URL}/v1/auth/token`, null, {
        headers: {
          'X-IB-Client-Id': CLIENT_ID,
          'X-IB-Client-Passwd': CLIENT_PASSWORD,
          Accept: 'application/json',
        },
      });

      if (response.data.code === 'A000') {
        token = response.data.data.token;
        tokenExpiry = response.data.data.expired;
        console.log('Bizgo API 토큰이 성공적으로 발급되었습니다.');
      } else {
        throw new Error(`토큰 발급 실패: ${response.data.result}`);
      }
    } catch (error) {
      console.error('Bizgo API 토큰 발급 중 오류 발생:', error.message);
      throw new Error('Bizgo API 인증에 실패했습니다.');
    }
  }

  return token;
}

/**
 * 알림톡 전송
 * @param {string} phoneNumber - 수신자 전화번호 (01012345678 형식)
 * @param {string} content - 알림톡 내용
 * @param {object} buttons - 버튼 정보
 * @param {string} title - 강조표기 타이틀 (선택)
 * @param {string} subtitle - 강조표기 보조문구 (선택)
 * @returns {Promise<object>} 전송 결과
 */
async function sendAlimTalk(
  phoneNumber,
  content,
  buttons = [],
  title = null,
  subtitle = null,
  quickReplies = [],
) {
  try {
    const accessToken = await getToken();

    const data = {
      senderKey: SENDER_KEY,
      msgType: 'AT', // 알림톡 타입
      to: phoneNumber,
      templateCode: TEMPLATE_CODE,
      text: content,
      ref: `CS_Morning_${Date.now()}`, // 참조 필드 (추적용)
    };

    if (title) {
      data.title = title;
    }

    if (subtitle) {
      data.subtitle = subtitle;
    }

    // 버튼이 있으면 추가
    if (buttons && buttons.length > 0) {
      data.button = buttons;
    }

    // 퀵 리플라이가 있으면 추가
    if (quickReplies && quickReplies.length > 0) {
      data.quickReplies = quickReplies;
    }

    // // 실패 시 SMS로 전환 설정 (옵션)
    // data.fallback = {
    //   type: 'SMS',
    //   from: process.env.BIZGO_FALLBACK_SENDER, // SMS 발신번호
    //   text: 'CS Morning 입니다(오늘의 질문을 눌러주세요)!'  // SMS 내용 (30자 제한)
    // };

    const response = await axios.post(`${BASE_URL}/v1/send/alimtalk`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (response.data.code === 'A000') {
      console.log(`알림톡 전송 성공: ${phoneNumber}`);
      return {
        success: true,
        msgKey: response.data.msgKey,
        ref: response.data.ref,
      };
    } else {
      throw new Error(`알림톡 전송 실패: ${response.data.result}`);
    }
  } catch (error) {
    console.error('알림톡 전송 중 오류 발생:', error.message);
    throw error;
  }
}

/**
 * 친구톡 텍스트 전송 (카카오 채널 친구인 경우만 가능)
 * @param {string} phoneNumber - 수신자 전화번호 (01012345678 형식)
 * @param {string} content - 친구톡 내용
 * @param {object} buttons - 버튼 정보
 * @returns {Promise<object>} 전송 결과
 */
async function sendFriendTalk(phoneNumber, content, buttons = []) {
  try {
    const accessToken = await getToken();

    const data = {
      senderKey: SENDER_KEY,
      msgType: 'FT', // 친구톡 텍스트 타입
      to: phoneNumber,
      text: content,
      ref: `CS_Morning_${Date.now()}`, // 참조 필드 (추적용)
    };

    // 버튼이 있으면 추가
    if (buttons && buttons.length > 0) {
      data.button = buttons;
    }

    // 실패 시 SMS로 전환 설정 (옵션)
    // data.fallback = {
    //   type: 'SMS',
    //   from: process.env.BIZGO_FALLBACK_SENDER, // SMS 발신번호
    //   text: '안녕하세요 CS Morning 입니다.(오늘의 질문을 확인해주세요)' // SMS 내용 (90자 제한)
    // };

    const response = await axios.post(`${BASE_URL}/v1/send/friendtalk`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (response.data.code === 'A000') {
      console.log(`친구톡 전송 성공: ${phoneNumber}`);
      return {
        success: true,
        msgKey: response.data.msgKey,
        ref: response.data.ref,
      };
    } else {
      throw new Error(`친구톡 전송 실패: ${response.data.result}`);
    }
  } catch (error) {
    console.error('친구톡 전송 중 오류 발생:', error.message);
    throw error;
  }
}

/**
 * 모든 구독자에게 알림톡 전송
 * @param {string} content - 알림톡 내용
 * @param {object} buttons - 버튼 정보 (선택)
 * @returns {Promise<object>} 전송 결과
 */
async function sendAlimTalkToAllSubscribers(
  content,
  buttons = [],
  title = null,
  subtitle = null,
  quickReplies = [],
) {
  try {
    // 구독 중인 사용자 찾기
    const subscribers = await prisma.user.findMany({
      where: {
        isSubscribed: true,
        phoneNumber: { not: null }, // 전화번호가 있는 사용자만
      },
    });

    if (subscribers.length === 0) {
      return {
        success: true,
        message: '전화번호가 등록된 구독자가 없습니다.',
        sentCount: 0,
      };
    }

    let sentCount = 0;
    let failedCount = 0;
    const resultDetails = [];

    // 각 구독자에게 메시지 전송
    for (const user of subscribers) {
      try {
        if (user.phoneNumber) {
          // 전화번호 형식 정리 (하이픈 제거)
          const phoneNumber = user.phoneNumber.replace(/-/g, '');

          // 알림톡 전송
          const result = await sendAlimTalk(
            phoneNumber,
            content,
            buttons,
            title,
            subtitle,
            quickReplies,
          );

          sentCount++;
          resultDetails.push({
            userId: user.id,
            phoneNumber: phoneNumber,
            success: true,
            msgKey: result.msgKey,
          });

          console.log(`사용자 ${user.id}(${phoneNumber})에게 알림톡 전송 성공`);
        }

        // 너무 많은 요청을 한 번에 보내지 않도록 잠시 대기
        await new Promise((resolve) => setTimeout(resolve, 300));
      } catch (error) {
        console.error(`사용자 ${user.id}에게 알림톡 전송 실패:`, error.message);
        failedCount++;
        resultDetails.push({
          userId: user.id,
          phoneNumber: user.phoneNumber,
          success: false,
          error: error.message,
        });
      }
    }

    return {
      success: true,
      message: `${sentCount}명의 사용자에게 알림톡을 전송했습니다.`,
      totalSubscribers: subscribers.length,
      sentCount,
      failedCount,
      details: resultDetails,
    };
  } catch (error) {
    console.error('전체 알림톡 전송 중 오류 발생:', error);
    throw error;
  }
}

/**
 * 통합메시지 알림톡 전송
 * @param {string} phoneNumber - 수신자 전화번호 (01012345678 형식)
 * @param {object} messageOptions - 메시지 옵션 (내용, 버튼, 타이틀 등)
 * @returns {Promise<object>} 전송 결과
 */
async function sendOmniMessage(phoneNumber, messageOptions) {
  try {
    const accessToken = await getToken();

    // 통합메시지 요청 데이터 구성
    const data = {
      destinations: [
        {
          to: phoneNumber,
        },
      ],
      messageFlow: [
        {
          alimtalk: {
            senderKey: SENDER_KEY,
            msgType: messageOptions.msgType || 'AT',
            templateCode: TEMPLATE_CODE,
            text: messageOptions.content,
            ref: `CS_Morning_${Date.now()}`,
          },
        },
      ],
    };

    // 타이틀 추가 (강조표기형 템플릿용)
    if (messageOptions.title) {
      data.messageFlow[0].alimtalk.title = messageOptions.title;
    }

    // 서브타이틀/헤더 추가
    if (messageOptions.subtitle) {
      data.messageFlow[0].alimtalk.header = messageOptions.subtitle;
    }

    // 버튼 추가
    if (messageOptions.buttons && messageOptions.buttons.length > 0) {
      if (!data.messageFlow[0].alimtalk.attachment) {
        data.messageFlow[0].alimtalk.attachment = {};
      }
      data.messageFlow[0].alimtalk.attachment.button = messageOptions.buttons;
    }

    // 퀵 리플라이 추가
    if (messageOptions.quickReplies && messageOptions.quickReplies.length > 0) {
      if (!data.messageFlow[0].alimtalk.supplement) {
        data.messageFlow[0].alimtalk.supplement = {};
      }
      data.messageFlow[0].alimtalk.supplement.quickReply =
        messageOptions.quickReplies;
    }

    // Fallback SMS 설정 (옵션)
    if (messageOptions.enableFallback) {
      data.messageFlow.push({
        sms: {
          from: process.env.BIZGO_FALLBACK_SENDER,
          text:
            messageOptions.fallbackText ||
            messageOptions.content.substring(0, 80) + '...',
        },
      });
    }

    const response = await axios.post(`${BASE_URL}/v1/send/omni`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (response.data.code === 'A000') {
      console.log(`통합메시지 전송 성공: ${phoneNumber}`);
      return {
        success: true,
        data: response.data.data,
        ref: response.data.ref,
      };
    } else {
      throw new Error(`통합메시지 전송 실패: ${response.data.result}`);
    }
  } catch (error) {
    console.error('통합메시지 전송 중 오류 발생:', error.message);
    throw error;
  }
}

/**
 * 오늘의 질문으로 알림톡 전송
 * @param {object} questionData - 오늘의 질문 데이터
 * @param {string} phoneNumber - 수신자 전화번호 (01012345678 형식)
 * @param {string} userName - 수신자 이름
 * @returns {Promise<object>} 전송 결과
 */
async function sendDailyQuestionAlimTalk(questionData, phoneNumber, userName) {
  try {
    const accessToken = await getToken();

    // 질문 정보 추출
    const question = questionData.question;
    const category = question.category || '알고리즘';
    const questionText = question.text || '오늘의 문제를 확인해보세요';

    // 옵션을 문자열로 변환
    let optionsText = '';
    if (question.options && Array.isArray(question.options)) {
      optionsText = question.options
        .map((opt, idx) => `${idx + 1}. ${opt}`)
        .join(' ');
    }

    // 알림톡 내용 구성 (템플릿 변수 치환)
    const contentTemplate =
      '#{이름} 님 좋은 아침입니다😁\n\n오늘의 질문입니다\n\n#{카테고리}\n#{질문}\n\n#{옵션}\n\n오늘의 질문을 풀어보고 간단하게 문제를 맞춰보아요 !\n\n아침에 제일 먼저 확인하면 오늘 하루 중 첫 번째 기억이 되는거에요.\n\n오늘 하루도 파이팅 입니다 😎\n\n[안내] 해당 오늘의 질문 안내 메시지는 고객님께서 신청하신 구독으로, 매일 오전에 발송됩니다.';

    // 변수 치환
    const content = contentTemplate
      .replace('#{이름}', userName)
      .replace('#{카테고리}', category)
      .replace('#{질문}', questionText)
      .replace('#{옵션}', '(오늘의 질문을 누르면 보기가 나와요 !)');

    // 통합메시지 요청 데이터 구성
    const data = {
      destinations: [
        {
          to: phoneNumber,
        },
      ],
      messageFlow: [
        {
          alimtalk: {
            senderKey: SENDER_KEY,
            msgType: 'AT',
            templateCode: TEMPLATE_CODE,
            text: content,
            ref: `CS_Morning_${Date.now()}`,
            attachment: {
              button: [
                {
                  name: '챗봇으로 변환 !',
                  type: 'BT',
                },
                {
                  name: 'CSmorning 바로가기',
                  type: 'WL',
                  urlMobile: 'https://csmorning.co.kr',
                  urlPc: 'https://csmorning.co.kr',
                },
              ],
            },
            supplement: {
              quickReply: [
                {
                  name: '오늘의 질문',
                  type: 'BK',
                },
              ],
            },
          },
        },
      ],
    };

    const response = await axios.post(`${BASE_URL}/v1/send/omni`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (response.data.code === 'A000') {
      console.log(`오늘의 질문 알림톡 전송 성공: ${phoneNumber}`);
      return {
        success: true,
        data: response.data.data,
        ref: response.data.ref,
      };
    } else {
      throw new Error(`알림톡 전송 실패: ${response.data.result}`);
    }
  } catch (error) {
    console.error('오늘의 질문 알림톡 전송 중 오류 발생:', error.message);
    throw error;
  }
}

/**
 * 모든 구독자에게 오늘의 질문 알림톡 전송
 * @param {object} prisma - Prisma 클라이언트 인스턴스
 * @returns {Promise<object>} 전송 결과
 */
async function sendDailyQuestionToAllSubscribers(prisma) {
  try {
    // 1. 오늘의 질문 데이터 가져오기
    const questionService = require('../question/question.service');
    const questionData = await questionService.getTodayQuestion(prisma);

    if (!questionData) {
      throw new Error('오늘의 질문 데이터가 없습니다.');
    }

    // 2. 구독 중인 사용자 찾기
    const subscribers = await prisma.user.findMany({
      where: {
        isSubscribed: true,
        phoneNumber: { not: null }, // 전화번호가 있는 사용자만
      },
    });

    if (subscribers.length === 0) {
      return {
        success: true,
        message: '전화번호가 등록된 구독자가 없습니다.',
        sentCount: 0,
      };
    }

    let sentCount = 0;
    let failedCount = 0;
    const resultDetails = [];

    // 3. 각 구독자에게 메시지 전송
    for (const user of subscribers) {
      try {
        if (user.phoneNumber) {
          // 전화번호 형식 정리 (하이픈 제거)
          const phoneNumber = user.phoneNumber.replace(/-/g, '');
          const userName = user.name || '고객';

          // 알림톡 전송
          const result = await sendDailyQuestionAlimTalk(
            questionData,
            phoneNumber,
            userName,
          );
          sentCount++;
          resultDetails.push({
            userId: user.id,
            phoneNumber: phoneNumber,
            success: true,
            msgKey: result.data?.destinations?.[0]?.msgKey,
          });

          console.log(
            `사용자 ${user.id}(${phoneNumber})에게 오늘의 질문 알림톡 전송 성공`,
          );
        }

        // 너무 많은 요청을 한 번에 보내지 않도록 잠시 대기
        await new Promise((resolve) => setTimeout(resolve, 300));
      } catch (error) {
        console.error(
          `사용자 ${user.id}에게 오늘의 질문 알림톡 전송 실패:`,
          error.message,
        );
        failedCount++;
        resultDetails.push({
          userId: user.id,
          phoneNumber: user.phoneNumber,
          success: false,
          error: error.message,
        });
      }
    }

    return {
      success: true,
      message: `${sentCount}명의 사용자에게 오늘의 질문 알림톡을 전송했습니다.`,
      totalSubscribers: subscribers.length,
      sentCount,
      failedCount,
      details: resultDetails,
    };
  } catch (error) {
    console.error('전체 오늘의 질문 알림톡 전송 중 오류 발생:', error);
    throw error;
  }
}

module.exports = {
  getToken,
  sendAlimTalk,
  sendFriendTalk,
  sendAlimTalkToAllSubscribers,
  sendOmniMessage,
  sendDailyQuestionAlimTalk,
  sendDailyQuestionToAllSubscribers,
};
