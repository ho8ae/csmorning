const { PrismaClient } = require('@prisma/client');
const createError = require('http-errors');
const kakaoService = require('../../services/kakao.service');

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
  try {
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
    
    // 최근 7일간 일별 응답 수 - Raw 쿼리 대신 Prisma 네이티브 쿼리 사용
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    // GroupBy 대신 날짜별로 응답 가져오기
    const responses = await prisma.response.findMany({
      where: {
        respondedAt: {
          gte: sevenDaysAgo
        }
      },
      select: {
        respondedAt: true
      }
    });
    
    // 날짜별로 그룹화하여 일별 응답 수 계산
    const dailyResponsesMap = responses.reduce((acc, response) => {
      const dateStr = response.respondedAt.toISOString().split('T')[0];
      acc[dateStr] = (acc[dateStr] || 0) + 1;
      return acc;
    }, {});
    
    // 형식에 맞게 변환
    const dailyResponses = Object.entries(dailyResponsesMap).map(([date, count]) => ({
      date,
      count
    })).sort((a, b) => a.date.localeCompare(b.date));
    
    // 카테고리별 통계 - 각 카테고리별로 별도 쿼리 실행
    const categories = await prisma.question.findMany({
      distinct: ['category'],
      select: {
        category: true
      }
    });
    
    const categoryStatsPromises = categories.map(async ({ category }) => {
      // 해당 카테고리의 전체 응답 수
      const total = await prisma.response.count({
        where: {
          dailyQuestion: {
            question: {
              category
            }
          }
        }
      });
      
      // 해당 카테고리의 정답 수
      const correct = await prisma.response.count({
        where: {
          dailyQuestion: {
            question: {
              category
            }
          },
          isCorrect: true
        }
      });
      
      return { category, total, correct };
    });
    
    const categoryStats = await Promise.all(categoryStatsPromises);
    
    // 일일 평균 응답 계산
    const days = Math.max(1, dailyResponses.length);
    const dailyAverage = Math.round(totalResponses / days);
    
    return {
      totalResponses,
      correctResponses,
      incorrectResponses,
      correctRate,
      dailyResponses,
      categoryStats,
      dailyAverage
    };
  } catch (error) {
    console.error("getResponseStats 에러:", error);
    // 기본 안전한 값 반환
    return {
      totalResponses: 0,
      correctResponses: 0,
      incorrectResponses: 0,
      correctRate: 0,
      dailyResponses: [],
      categoryStats: [],
      dailyAverage: 0
    };
  }
};

/**
 * 기부 통계 조회
 */
const getDonationStats = async (prisma) => {
  try {
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
    
    // 평균 기부 금액 계산
    const averageAmount = totalDonations > 0 
      ? Math.round((totalAmount._sum.amount || 0) / totalDonations) 
      : 0;
    
    // 월별 기부 통계 - Raw 쿼리 대신 직접 계산
    const donations = await prisma.donation.findMany({
      where: { 
        status: 'approved',
        approvedAt: { not: null }
      },
      select: {
        approvedAt: true,
        amount: true
      }
    });
    
    // 월별로 그룹화
    const monthlyMap = donations.reduce((acc, donation) => {
      if (!donation.approvedAt) return acc;
      
      const year = donation.approvedAt.getFullYear();
      const month = donation.approvedAt.getMonth() + 1;
      const key = `${year}-${month.toString().padStart(2, '0')}`;
      
      if (!acc[key]) {
        acc[key] = { year, month, count: 0, total: 0 };
      }
      
      acc[key].count += 1;
      acc[key].total += donation.amount;
      
      return acc;
    }, {});
    
    const monthlyStats = Object.values(monthlyMap).sort((a, b) => {
      return b.year - a.year || b.month - a.month;
    });
    
    return {
      totalDonations,
      totalAmount: totalAmount._sum.amount || 0,
      averageAmount,
      recentDonations,
      monthlyStats
    };
  } catch (error) {
    console.error("getDonationStats 에러:", error);
    // 기본 안전한 값 반환
    return {
      totalDonations: 0,
      totalAmount: 0,
      averageAmount: 0,
      recentDonations: [],
      monthlyStats: []
    };
  }
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

/**
 * 특정 사용자 조회
 */
const getUserById = async (prisma, userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  
  if (!user) {
    throw createError(404, '사용자를 찾을 수 없습니다.');
  }
  
  return user;
};

/**
 * 사용자 정보 업데이트
 */
const updateUser = async (prisma, userId, userData) => {
  // 사용자 존재 확인
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  
  if (!user) {
    throw createError(404, '사용자를 찾을 수 없습니다.');
  }
  
  // 비밀번호가 있는 경우 해싱 처리
  if (userData.password) {
    const bcrypt = require('bcrypt');
    userData.password = await bcrypt.hash(userData.password, 10);
  }
  
  // 사용자 정보 업데이트
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: userData
  });
  
  // 비밀번호 필드 제외
  const { password, ...userWithoutPassword } = updatedUser;
  
  return userWithoutPassword;
};

/**
 * 사용자 구독 상태 업데이트
 */
const updateUserSubscription = async (prisma, userId, isSubscribed) => {
  // 사용자 존재 확인
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  
  if (!user) {
    throw createError(404, '사용자를 찾을 수 없습니다.');
  }
  
  // 구독 상태 업데이트
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { isSubscribed }
  });
  
  // 비밀번호 필드 제외
  const { password, ...userWithoutPassword } = updatedUser;
  
  return userWithoutPassword;
};

/**
 * 사용자 프리미엄 상태 업데이트
 */
const updateUserPremiumStatus = async (prisma, userId, isPremium, durationMonths = 1) => {
  // 사용자 존재 확인
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  
  if (!user) {
    throw createError(404, '사용자를 찾을 수 없습니다.');
  }
  
  // 프리미엄 종료 날짜 계산
  let premiumUntil = null;
  if (isPremium) {
    premiumUntil = new Date();
    premiumUntil.setMonth(premiumUntil.getMonth() + durationMonths);
  }
  
  // 프리미엄 상태 업데이트
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { 
      isPremium,
      premiumUntil
    }
  });
  
  // 비밀번호 필드 제외
  const { password, ...userWithoutPassword } = updatedUser;
  
  return userWithoutPassword;
};

/**
 * 사용자 계정 상태 업데이트 (활성화/비활성화)
 */
const updateUserStatus = async (prisma, userId, isActive) => {
  // 사용자 존재 확인
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  
  if (!user) {
    throw createError(404, '사용자를 찾을 수 없습니다.');
  }
  
  // 관리자 계정은 비활성화 불가
  if (user.role === 'admin' && !isActive) {
    throw createError(403, '관리자 계정은 비활성화할 수 없습니다.');
  }
  
  // 계정 상태 업데이트
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { isActive }
  });
  
  // 비밀번호 필드 제외
  const { password, ...userWithoutPassword } = updatedUser;
  
  return userWithoutPassword;
};

/**
 * 사용자 카카오 연결 해제
 */
const unlinkUserKakao = async (prisma, userId) => {
  // 사용자 존재 확인
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  
  if (!user) {
    throw createError(404, '사용자를 찾을 수 없습니다.');
  }
  
  // 카카오 ID가 없는 경우
  if (!user.kakaoId) {
    throw createError(400, '이 사용자는 카카오 계정과 연결되어 있지 않습니다.');
  }
  
  try {
    // 카카오 API를 통해 연결 해제 요청
    await kakaoService.unlinkKakaoUser(user.kakaoId);
    
    // 사용자 정보에서 카카오 ID 제거
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { kakaoId: null }
    });
    
    // 비밀번호 필드 제외
    const { password, ...userWithoutPassword } = updatedUser;
    
    return userWithoutPassword;
  } catch (error) {
    console.error('카카오 연결 해제 오류:', error);
    
    // 카카오 API 오류와 관계없이 DB에서 카카오 ID 제거 진행
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { kakaoId: null }
    });
    
    // 비밀번호 필드 제외
    const { password, ...userWithoutPassword } = updatedUser;
    
    return userWithoutPassword;
  }
};

module.exports = {
  getAllUsers,
  getResponseStats,
  getDonationStats,
  sendQuestion,
  getUserById,
  updateUser,
  updateUserSubscription,
  updateUserPremiumStatus,
  updateUserStatus,
  unlinkUserKakao
};