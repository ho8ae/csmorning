const axios = require('axios');
const { prisma } = require('../config/db');
const qs = require('qs');

// 카카오 API 기본 URL
const KAKAO_API_URL = 'https://kapi.kakao.com';
const KAKAO_AUTH_URL = 'https://kauth.kakao.com';

// 토큰 정보 저장 객체
let tokenInfo = {
  access_token: process.env.KAKAO_ACCESS_TOKEN,
  refresh_token: process.env.KAKAO_REFRESH_TOKEN,
  expires_at: null // 토큰 만료 시간
};

/**
 * 토큰 갱신하기
 * @returns {Promise<string>} 새로운 액세스 토큰
 */
async function refreshToken() {
  try {
    console.log('카카오 액세스 토큰 갱신 시도...');

    // 환경에서 리프레시 토큰이 없다면 DB에서 가져오기 시도
    if (!tokenInfo.refresh_token) {
      const tokenRecord = await prisma.appConfig.findUnique({
        where: { key: 'kakao_tokens' }
      });

      if (tokenRecord) {
        const tokens = JSON.parse(tokenRecord.value);
        tokenInfo = {
          ...tokenInfo,
          ...tokens
        };
      }
    }

    if (!tokenInfo.refresh_token) {
      throw new Error('리프레시 토큰이 없습니다. 관리자 페이지에서 카카오 계정을 다시 연결해주세요.');
    }

    // 토큰 갱신 요청
    const response = await axios({
      method: 'post',
      url: `${KAKAO_AUTH_URL}/oauth/token`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: qs.stringify({
        grant_type: 'refresh_token',
        client_id: process.env.KAKAO_REST_API_TEST_KEY,
        refresh_token: tokenInfo.refresh_token
      })
    });

    // 새 토큰 정보 저장
    const newTokenInfo = response.data;
    
    // 응답에 액세스 토큰이 있는지 확인
    if (!newTokenInfo.access_token) {
      throw new Error('액세스 토큰 갱신 실패: 응답에 액세스 토큰이 없습니다.');
    }
    
    // 토큰 정보 업데이트
    tokenInfo.access_token = newTokenInfo.access_token;
    
    // 새 리프레시 토큰이 제공된 경우에만 업데이트
    if (newTokenInfo.refresh_token) {
      tokenInfo.refresh_token = newTokenInfo.refresh_token;
    }
    
    // 만료 시간 계산 (초 단위를 밀리초로 변환하여 현재 시간에 더함)
    tokenInfo.expires_at = Date.now() + (newTokenInfo.expires_in * 1000);

    // DB에 토큰 정보 저장
    await prisma.appConfig.upsert({
      where: { key: 'kakao_tokens' },
      update: { 
        value: JSON.stringify({
          access_token: tokenInfo.access_token,
          refresh_token: tokenInfo.refresh_token,
          expires_at: tokenInfo.expires_at
        })
      },
      create: {
        key: 'kakao_tokens',
        value: JSON.stringify({
          access_token: tokenInfo.access_token,
          refresh_token: tokenInfo.refresh_token,
          expires_at: tokenInfo.expires_at
        })
      }
    });

    console.log('카카오 액세스 토큰 갱신 성공');
    return tokenInfo.access_token;
  } catch (error) {
    console.error('카카오 토큰 갱신 실패:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * 유효한 액세스 토큰 가져오기
 * @returns {Promise<string>} 유효한 액세스 토큰
 */
async function getValidAccessToken() {
  try {
    // DB에서 토큰 정보 가져오기 (토큰이 아직 메모리에 없는 경우)
    if (!tokenInfo.access_token) {
      const tokenRecord = await prisma.appConfig.findUnique({
        where: { key: 'kakao_tokens' }
      });

      if (tokenRecord) {
        const tokens = JSON.parse(tokenRecord.value);
        tokenInfo = {
          ...tokenInfo,
          ...tokens
        };
      }
    }

    // 토큰 만료 확인 (만료 10분 전에 갱신)
    const isExpired = tokenInfo.expires_at && (Date.now() > (tokenInfo.expires_at - 600000));
    
    if (!tokenInfo.access_token || isExpired) {
      return await refreshToken();
    }
    
    return tokenInfo.access_token;
  } catch (error) {
    console.error('토큰 가져오기 실패:', error);
    throw error;
  }
}

/**
 * 카카오톡 메시지 전송
 * @param {string} userId - 카카오 사용자 ID
 * @param {object} template - 메시지 템플릿 객체
 * @returns {Promise<object>} 응답 데이터
 */
async function sendMessage(userId, template) {
  try {
    // 유효한 액세스 토큰 가져오기
    const accessToken = await getValidAccessToken();
    
    // 카카오 채널 메시지 API 호출
    const response = await axios({
      method: 'post',
      url: `${KAKAO_API_URL}/v1/api/talk/friends/message/default/send`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${accessToken}`
      },
      data: {
        receiver_uuids: JSON.stringify([userId]),
        template_object: JSON.stringify(template)
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('카카오톡 메시지 전송 실패:', error.response?.data || error.message);
    
    // 토큰 만료 오류인 경우 토큰 갱신 후 재시도
    if (error.response?.data?.code === -401) {
      try {
        console.log('토큰 만료로 인한 재시도...');
        await refreshToken();
        return await sendMessage(userId, template); // 재귀적으로 다시 시도
      } catch (refreshError) {
        console.error('토큰 갱신 후 재시도 실패:', refreshError.message);
        throw refreshError;
      }
    }
    
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

/**
 * 서버 시작 시 토큰 초기화
 */
async function initializeToken() {
  try {
    // DB에서 토큰 정보 가져오기
    const tokenRecord = await prisma.appConfig.findUnique({
      where: { key: 'kakao_tokens' }
    });

    if (tokenRecord) {
      const tokens = JSON.parse(tokenRecord.value);
      tokenInfo = {
        ...tokenInfo,
        ...tokens
      };
      console.log('DB에서 카카오 토큰 정보를 불러왔습니다.');
    } else {
      console.log('DB에 저장된 카카오 토큰 정보가 없습니다.');
    }
  } catch (error) {
    console.error('토큰 초기화 중 오류:', error);
  }
}


/**
 * 인가 코드로 토큰 받기
 * @param {string} code - 인가 코드
 * @param {string} redirectUri - 리다이렉트 URI (선택적)
 * @returns {Promise<object>} 토큰 정보
 */
async function getToken(code, redirectUri = null) {
  try {
    // 리다이렉트 URI 설정
    const redirect = redirectUri || `${process.env.SERVICE_URL}/api/auth/kakao/sync-callback`;
    
    console.log('카카오 토큰 요청:', { 
      code: code.substring(0, 10) + '...',
      redirect_uri: redirect 
    });
    
    const response = await axios({
      method: 'post',
      url: `${KAKAO_AUTH_URL}/oauth/token`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: qs.stringify({
        grant_type: 'authorization_code',
        client_id: process.env.KAKAO_REST_API_KEY,
        redirect_uri: redirect,
        code: code
      })
    });
    
    console.log('카카오 토큰 응답 성공:', {
      access_token: response.data.access_token ? '발급됨' : '실패',
      expires_in: response.data.expires_in,
      token_type: response.data.token_type
    });
    
    return response.data;
  } catch (error) {
    console.error('카카오 토큰 받기 실패:', error.message);
    
    // 자세한 에러 로깅
    if (error.response) {
      console.error('에러 응답 데이터:', error.response.data);
      console.error('에러 응답 상태:', error.response.status);
      console.error('에러 응답 헤더:', error.response.headers);
    } else if (error.request) {
      console.error('요청이 전송되었지만 응답이 없음:', error.request);
    }
    
    throw error;
  }
}

/**
 * 액세스 토큰으로 사용자 정보 가져오기
 * @param {string} accessToken - 액세스 토큰
 * @returns {Promise<object>} 사용자 정보
 */
async function getUserInfo(accessToken) {
  try {
    const response = await axios({
      method: 'get',
      url: `${KAKAO_API_URL}/v2/user/me`,
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('카카오 사용자 정보 가져오기 실패:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * 서비스 약관 동의 내역 확인
 * @param {string} accessToken - 액세스 토큰
 * @returns {Promise<object>} 동의 내역 정보
 */
async function getAgreements(accessToken) {
  try {
    const response = await axios({
      method: 'get',
      url: `${KAKAO_API_URL}/v2/user/scopes`,
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('카카오 서비스 약관 동의 내역 확인 실패:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * 카카오 사용자 연결 끊기 (관리자용)
 * @param {string} kakaoId - 연결 끊기할 카카오 사용자 ID
 * @returns {Promise<object>} 응답 데이터
 */
async function unlinkKakaoUser(kakaoId) {
  try {
    console.log(`카카오 사용자 ID ${kakaoId} 연결 끊기 시도...`);
    
    // 카카오 API 호출
    const response = await axios({
      method: 'post',
      url: 'https://kapi.kakao.com/v1/user/unlink',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `KakaoAK ${process.env.KAKAO_ADMIN_KEY}`
      },
      data: qs.stringify({
        target_id_type: 'user_id',
        target_id: kakaoId
      })
    });
    
    console.log('카카오 API 응답:', response.data);
    
    // 데이터베이스 업데이트
    const user = await prisma.user.findFirst({
      where: { kakaoId: kakaoId.toString() }
    });
    
    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { kakaoId: null }
      });
      
      console.log(`사용자 ${user.id}의 카카오 연결이 성공적으로 해제되었습니다.`);
    } else {
      console.log(`카카오 ID ${kakaoId}와 매칭되는 사용자가 데이터베이스에 없습니다.`);
    }
    
    return {
      success: true,
      message: '카카오 연결이 성공적으로 해제되었습니다.',
      data: response.data
    };
  } catch (error) {
    console.error('카카오 사용자 연결 끊기 실패:', error.response?.data || error.message);
    throw error;
  }
}
module.exports = {
  sendMessage,
  formatSkillResponse,
  createPaymentRequest,
  approvePayment,
  initializeToken,
  getValidAccessToken,
  getToken,
  getUserInfo,
  getAgreements,
  unlinkKakaoUser,
};