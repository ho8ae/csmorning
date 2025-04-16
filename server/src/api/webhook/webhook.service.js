/**
 * 사용자 찾기 또는 생성
 */
const findOrCreateUser = async (prisma, kakaoId) => {
  // 사용자 검증
  let user = await prisma.user.findUnique({
    where: { kakaoId }
  });
  
  if (!user) {
    // 새 사용자 생성
    user = await prisma.user.create({
      data: {
        kakaoId,
        nickname: `사용자_${kakaoId.substring(0, 5)}`
      }
    });
  }
  
  return user;
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
  return await prisma.response.create({
    data: {
      userId,
      dailyQuestionId,
      answer,
      isCorrect
    }
  });
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

module.exports = {
  findOrCreateUser,
  getTodayQuestion,
  getUserResponseForQuestion,
  createResponse,
  updateUserStats,
  sendChatbotMessage,
  sendMessageToAllSubscribers
};