/**
 * 사용자 찾기 또는 생성 (수정된 버전)
 */
const findOrCreateUser = async (prisma, kakaoChannelId) => {
  try {
    // 채널 ID로 매핑 테이블에서 검색
    const mapping = await prisma.userKakaoMapping.findUnique({
      where: { kakaoChannelId },
      include: { user: true }
    });
    
    if (mapping) {
      return mapping.user;
    }
    
    // 매핑이 없으면 새 사용자 생성
    const user = await prisma.user.create({
      data: {
        nickname: `사용자_${kakaoChannelId.substring(0, 5)}`,
        isTemporary: true // 임시 사용자 표시 (스키마에 필드 추가 필요)
      }
    });
    
    // 매핑 테이블에 채널 ID 추가
    await prisma.userKakaoMapping.create({
      data: {
        userId: user.id,
        kakaoChannelId
      }
    });
    
    return user;
  } catch (error) {
    console.error('사용자 찾기 또는 생성 중 오류 발생:', error);
    throw error;
  }
};

/**
 * 오늘의 질문 가져오기
 */
const getTodayQuestion = async (prisma) => {
  return await prisma.dailyQuestion.findFirst({
    orderBy: { sentDate: 'desc' },
    include: { question: true }
  });
};

/**
 * 특정 질문에 대한 사용자의 응답 확인
 */
const getUserResponseForQuestion = async (prisma, userId, dailyQuestionId) => {
  return await prisma.response.findFirst({
    where: {
      userId,
      dailyQuestionId
    }
  });
};

/**
 * 사용자 응답 생성
 */
const createResponse = async (prisma, userId, dailyQuestionId, answer, isCorrect) => {
  // 응답 생성
  const response = await prisma.response.create({
    data: {
      userId,
      dailyQuestionId,
      answer,
      isCorrect
    }
  });
  
  // 활동 기록 업데이트 (잔디 기능)
  try {
    const premiumService = require('../premium/premium.service');
    await premiumService.updateActivityOnAnswer(prisma, userId);
  } catch (error) {
    console.error('활동 기록 업데이트 중 오류:', error);
    // 메인 기능에 영향을 주지 않도록 오류를 무시
  }
  
  return response;
};

/**
 * 사용자 통계 업데이트
 */
const updateUserStats = async (prisma, userId, isCorrect) => {
  const updateData = {
    totalAnswered: { increment: 1 }
  };
  
  if (isCorrect) {
    updateData.correctAnswers = { increment: 1 };
  }
  
  return await prisma.user.update({
    where: { id: userId },
    data: updateData
  });
};

/**
 * 사용자에게 챗봇 메시지 전송
 * @param {object} prisma - Prisma 클라이언트
 * @param {string} userId - 사용자 ID
 * @param {string} message - 전송할 메시지
 * @returns {Promise<object>} 전송 결과
 */
const sendChatbotMessage = async (prisma, userId, message) => {
  try {
    // 사용자 정보 가져오기
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user || !user.kakaoId) {
      throw new Error('유효한 카카오 ID를 가진 사용자를 찾을 수 없습니다.');
    }
    
    // 실제 구현에서는 카카오에서 제공하는 API를 사용해야 함
    // 이 샘플 코드는 카카오 i 오픈빌더 API 연동이 필요
    console.log(`사용자 ${user.kakaoId}에게 챗봇 메시지를 전송합니다: "${message}"`);
    
    // 메시지 전송 로그 저장 (옵션)
    await prisma.messageLog.create({
      data: {
        userId: user.id,
        message,
        type: 'CHATBOT',
        status: 'SENT',
        sentAt: new Date()
      }
    }).catch(err => {
      // 로그 테이블이 없을 경우 무시 (옵션)
      console.warn('메시지 로그 저장 실패 (테이블이 없을 수 있음):', err.message);
    });
    
    return {
      success: true,
      userId: user.id,
      kakaoId: user.kakaoId,
      message,
      sentAt: new Date()
    };
  } catch (error) {
    console.error('챗봇 메시지 전송 중 오류 발생:', error);
    throw error;
  }
};

/**
 * 모든 구독자에게 챗봇 메시지 전송
 * @param {object} prisma - Prisma 클라이언트
 * @param {string} message - 전송할 메시지
 * @returns {Promise<object>} 전송 결과
 */
const sendMessageToAllSubscribers = async (prisma, message) => {
  try {
    // 모든 구독자 가져오기
    const subscribers = await prisma.user.findMany({
      where: { isSubscribed: true }
    });
    
    if (subscribers.length === 0) {
      return {
        success: true,
        message: '구독자가 없습니다.',
        sentCount: 0
      };
    }
    
    let sentCount = 0;
    let failedCount = 0;
    
    // 각 구독자에게 메시지 전송
    for (const user of subscribers) {
      try {
        if (user.kakaoId) {
          // 실제 메시지 전송 로직 구현 필요
          await sendChatbotMessage(prisma, user.id, message);
          sentCount++;
        }
        
        // 너무 많은 요청을 한 번에 보내지 않도록 잠시 대기
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`사용자 ${user.id}에게 메시지 전송 실패:`, error.message);
        failedCount++;
      }
    }
    
    return {
      success: true,
      message: `${sentCount}명의 사용자에게 메시지를 전송했습니다.`,
      sentCount,
      failedCount,
      totalSubscribers: subscribers.length
    };
  } catch (error) {
    console.error('구독자에게 메시지 전송 중 오류 발생:', error);
    throw error;
  }
};

/**
 * 임시 연동 코드 생성
 * @param {object} prisma - Prisma 클라이언트
 * @param {string} kakaoChannelId - 카카오 채널 사용자 ID
 * @returns {Promise<string>} 생성된 연동 코드
 */
const generateLinkCode = async (prisma, kakaoChannelId) => {
  try {
    // 6자리 랜덤 코드 생성
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 10); // 10분 후 만료
    
    // 기존 매핑 정보 조회
    let mapping = await prisma.userKakaoMapping.findUnique({
      where: { kakaoChannelId }
    });
    
    if (mapping) {
      // 기존 매핑이 있으면 연동 코드 업데이트
      await prisma.userKakaoMapping.update({
        where: { id: mapping.id },
        data: {
          linkCode: code,
          linkCodeExpiry: expiry
        }
      });
    } else {
      // 기존 매핑이 없는 경우, 임시 사용자 생성 후 매핑 추가
      const tempUser = await findOrCreateUser(prisma, kakaoChannelId);
      
      await prisma.userKakaoMapping.create({
        data: {
          userId: tempUser.id,
          kakaoChannelId,
          linkCode: code,
          linkCodeExpiry: expiry
        }
      });
    }
    
    return code;
  } catch (error) {
    console.error('연동 코드 생성 중 오류 발생:', error);
    throw error;
  }
};

/**
 * 연동 코드로 카카오 채널 ID 조회
 * @param {object} prisma - Prisma 클라이언트
 * @param {string} linkCode - 연동 코드
 * @returns {Promise<object|null>} 매핑 정보
 */
const getChannelMappingByCode = async (prisma, linkCode) => {
  try {
    const now = new Date();
    
    // 유효한 연동 코드 조회
    const mapping = await prisma.userKakaoMapping.findFirst({
      where: {
        linkCode,
        linkCodeExpiry: {
          gt: now // 만료 시간이 현재보다 큰 경우만
        }
      }
    });
    
    return mapping;
  } catch (error) {
    console.error('연동 코드 조회 중 오류 발생:', error);
    throw error;
  }
};

/**
 * 연동 코드 확인 및 사용자 계정 병합
 * @param {object} prisma - Prisma 클라이언트
 * @param {string} linkCode - 연동 코드
 * @param {number} userId - 웹사이트 사용자 ID
 * @returns {Promise<object>} 연동 결과
 */
const linkUserAccounts = async (prisma, linkCode, userId) => {
  try {
    // 유효한 연동 코드 조회
    const mapping = await getChannelMappingByCode(prisma, linkCode);
    
    if (!mapping) {
      return {
        success: false,
        message: '유효하지 않거나 만료된 연동 코드입니다.'
      };
    }
    
    // 채널 사용자와 웹사이트 사용자가 동일한 경우
    if (mapping.userId === userId) {
      return {
        success: true,
        message: '이미 연동된 계정입니다.',
        isAlreadyLinked: true
      };
    }
    
    // 채널 사용자의 응답 기록을 웹사이트 사용자에게 이관
    await Promise.all([
      // 응답 기록 이관
      prisma.response.updateMany({
        where: { userId: mapping.userId },
        data: { userId }
      }),
      
      // 매핑 정보 업데이트
      prisma.userKakaoMapping.update({
        where: { id: mapping.id },
        data: {
          userId,
          linkCode: null,
          linkCodeExpiry: null
        }
      })
    ]);
    
    // 이전 임시 사용자 정보 조회 (통계 병합을 위해)
    const tempUser = await prisma.user.findUnique({
      where: { id: mapping.userId },
      select: {
        totalAnswered: true,
        correctAnswers: true
      }
    });
    
    if (tempUser) {
      // 웹사이트 사용자 통계 업데이트 (병합)
      await prisma.user.update({
        where: { id: userId },
        data: {
          totalAnswered: { increment: tempUser.totalAnswered },
          correctAnswers: { increment: tempUser.correctAnswers }
        }
      });
      
      // 임시 사용자 삭제
      // await prisma.user.delete({
      //   where: { id: mapping.userId }
      // });
      
      // 참고: 실제 구현 시 임시 사용자 삭제는 신중하게 해야 함
      // 외래 키 제약 조건 때문에 관련 데이터를 모두 이관한 후에 삭제 필요
    }
    
    return {
      success: true,
      message: '계정이 성공적으로 연동되었습니다.',
      kakaoChannelId: mapping.kakaoChannelId
    };
  } catch (error) {
    console.error('계정 연동 중 오류 발생:', error);
    throw error;
  }
};





module.exports = {
  findOrCreateUser,
  getTodayQuestion,
  getUserResponseForQuestion,
  createResponse,
  updateUserStats,
  sendChatbotMessage,
  sendMessageToAllSubscribers,
  generateLinkCode,
  getChannelMappingByCode,
  linkUserAccounts
};