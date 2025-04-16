const axios = require('axios');

// 카카오 API 기본 URL
const KAKAO_API_URL = 'https://kapi.kakao.com';

/**
 * 카카오톡 메시지 전송
 * @param {string} userId - 카카오 사용자 ID
 * @param {object} template - 메시지 템플릿 객체
 * @returns {Promise<object>} 응답 데이터
 */
async function sendMessage(userId, template) {
  try {
    // 카카오 채널 메시지 API 호출 - URL 경로 수정
    const response = await axios({
      method: 'post',
      url: `${KAKAO_API_URL}/v1/api/talk/friends/message/default/send`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${process.env.KAKAO_ACCESS_TOKEN}` // KakaoAK에서 Bearer로 변경
      },
      data: {
        receiver_uuids: JSON.stringify([userId]),
        template_object: JSON.stringify(template)
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('카카오톡 메시지 전송 실패:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * 카카오봇 메시지 전송 (챗봇 스킬 응답용)
 * @param {object} responseBody - 카카오 응답 바디
 * @returns {object} 포맷된 응답 객체
 */
function formatSkillResponse(text) {
  return {
    version: "2.0",
    template: {
      outputs: [
        {
          simpleText: {
            text: text
          }
        }
      ]
    }
  };
}

/**
 * 카카오페이 결제 요청 생성
 * @param {string} userId - 카카오 사용자 ID
 * @param {number} amount - 결제 금액
 * @param {string} itemName - 상품명
 * @returns {Promise<object>} 결제 요청 정보
 */
async function createPaymentRequest(userId, amount, itemName) {
  try {
    // 주문 번호 생성
    const orderCode = `COFFEE_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    
    // 카카오페이 준비 API 호출
    const response = await axios({
      method: 'post',
      url: `${KAKAO_API_URL}/v1/payment/ready`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        'Authorization': `KakaoAK ${process.env.KAKAO_ADMIN_KEY}`
      },
      data: {
        cid: process.env.KAKAO_PAY_CID,
        partner_order_id: orderCode,
        partner_user_id: userId,
        item_name: itemName,
        quantity: 1,
        total_amount: amount,
        tax_free_amount: 0,
        approval_url: `${process.env.SERVICE_URL}/api/donation/success`,
        cancel_url: `${process.env.SERVICE_URL}/api/donation/cancel`,
        fail_url: `${process.env.SERVICE_URL}/api/donation/fail`
      }
    });
    
    return {
      tid: response.data.tid,
      orderCode: orderCode,
      next_redirect_pc_url: response.data.next_redirect_pc_url,
      next_redirect_mobile_url: response.data.next_redirect_mobile_url,
      created_at: response.data.created_at
    };
  } catch (error) {
    console.error('카카오페이 결제 요청 생성 실패:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * 카카오페이 결제 승인
 * @param {string} tid - 결제 고유 번호
 * @param {string} orderCode - 주문 코드
 * @param {string} userId - 사용자 ID
 * @param {string} pgToken - 결제 승인 토큰
 * @returns {Promise<object>} 결제 승인 정보
 */
async function approvePayment(tid, orderCode, userId, pgToken) {
  try {
    const response = await axios({
      method: 'post',
      url: `${KAKAO_API_URL}/v1/payment/approve`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        'Authorization': `KakaoAK ${process.env.KAKAO_ADMIN_KEY}`
      },
      data: {
        cid: process.env.KAKAO_PAY_CID,
        tid: tid,
        partner_order_id: orderCode,
        partner_user_id: userId,
        pg_token: pgToken
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('카카오페이 결제 승인 실패:', error.response?.data || error.message);
    throw error;
  }
}

module.exports = {
  sendMessage,
  formatSkillResponse,
  createPaymentRequest,
  approvePayment
};