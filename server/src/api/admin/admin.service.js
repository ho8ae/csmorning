
/**
 * 모든 사용자 조회
 */
const getAllUsers = async (prisma) => {
    return await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    });
  };
  
  /**
   * 응답 통계 조회
   */
  const getResponseStats = async (prisma) => {
    // 전체 응답 수
    const totalResponses = await prisma.response.count();
    
    // 정답 응답 수
    const correctResponses = await prisma.response.count({
      where: { isCorrect: true }
    });
    
    // 오답 응답 수
    const incorrectResponses = totalResponses - correctResponses;
    
    // 정답률
    const correctRate = totalResponses > 0 
      ? (correctResponses / totalResponses * 100).toFixed(2) 
      : 0;
    
    // 최근 7일간 일별 응답 수
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const dailyResponses = await prisma.$queryRaw`
      SELECT DATE(r."respondedAt") as date, COUNT(*) as count
      FROM "Response" r
      WHERE r."respondedAt" >= ${sevenDaysAgo}
      GROUP BY DATE(r."respondedAt")
      ORDER BY date ASC
    `;
    
    // 카테고리별 통계
    const categoryStats = await prisma.$queryRaw`
      SELECT q.category, COUNT(*) as total, 
        SUM(CASE WHEN r."isCorrect" = true THEN 1 ELSE 0 END) as correct
      FROM "Response" r
      JOIN "DailyQuestion" dq ON r."dailyQuestionId" = dq.id
      JOIN "Question" q ON dq."questionId" = q.id
      GROUP BY q.category
    `;
    
    return {
      totalResponses,
      correctResponses,
      incorrectResponses,
      correctRate,
      dailyResponses,
      categoryStats
    };
  };
  
  /**
   * 기부 통계 조회
   */
  const getDonationStats = async (prisma) => {
    // 전체 기부 수
    const totalDonations = await prisma.donation.count({
      where: { status: 'approved' }
    });
    
    // 총 기부 금액
    const totalAmount = await prisma.donation.aggregate({
      where: { status: 'approved' },
      _sum: { amount: true }
    });
    
    // 최근 5개 기부 내역
    const recentDonations = await prisma.donation.findMany({
      where: { status: 'approved' },
      include: { user: true },
      orderBy: { approvedAt: 'desc' },
      take: 5
    });
    
    // 월별 기부 통계
    const monthlyStats = await prisma.$queryRaw`
      SELECT 
        EXTRACT(YEAR FROM d."approvedAt") as year,
        EXTRACT(MONTH FROM d."approvedAt") as month,
        COUNT(*) as count,
        SUM(d.amount) as total
      FROM "Donation" d
      WHERE d.status = 'approved'
      GROUP BY year, month
      ORDER BY year DESC, month DESC
    `;
    
    return {
      totalDonations,
      totalAmount: totalAmount._sum.amount || 0,
      recentDonations,
      monthlyStats
    };
  };
  
  /**
   * 질문 전송 (수동)
   */
  const sendQuestion = async (prisma, questionId) => {
    // 질문 존재 확인
    const question = await prisma.question.findUnique({
      where: { id: parseInt(questionId) }
    });
    
    if (!question) {
      const error = new Error('질문을 찾을 수 없습니다');
      error.status = 404;
      throw error;
    }
    
    // DailyQuestion 생성
    return await prisma.dailyQuestion.create({
      data: {
        questionId: question.id
      },
      include: {
        question: true
      }
    });
  };
  
  module.exports = {
    getAllUsers,
    getResponseStats,
    getDonationStats,
    sendQuestion
  };