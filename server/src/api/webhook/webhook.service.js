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
  
  module.exports = {
    findOrCreateUser,
    getTodayQuestion,
    getUserResponseForQuestion,
    createResponse,
    updateUserStats
  };