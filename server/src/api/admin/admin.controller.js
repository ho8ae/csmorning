const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const adminService = require('./admin.service');

/**
 * 모든 사용자 조회
 */
const getAllUsers = async (req, res, next) => {
  try {
    const users = await adminService.getAllUsers(req.prisma);
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

/**
 * 응답 통계 조회
 */
const getResponseStats = async (req, res, next) => {
  try {
    const stats = await adminService.getResponseStats(req.prisma);
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

/**
 * 기부 통계 조회
 */
const getDonationStats = async (req, res, next) => {
  try {
    const stats = await adminService.getDonationStats(req.prisma);
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

/**
 * 질문 전송 (수동)
 */
const sendQuestion = async (req, res, next) => {
  try {
    const { questionId } = req.body;
    
    if (!questionId) {
      return res.status(400).json({
        success: false,
        message: '질문 ID가 필요합니다'
      });
    }
    
    const dailyQuestion = await adminService.sendQuestion(req.prisma, questionId);
    
    res.json({
      success: true,
      message: '질문이 성공적으로 생성되었습니다',
      data: dailyQuestion
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 카카오 토큰 설정 (관리자 전용)
 */
const setKakaoTokens = async (req, res, next) => {
  try {
    const { access_token, refresh_token } = req.body;
    
    if (!access_token || !refresh_token) {
      return res.status(400).json({
        success: false,
        message: '액세스 토큰과 리프레시 토큰이 모두 필요합니다.'
      });
    }
    
    // 현재 시간 + 6시간으로 임시 만료시간 설정 (실제 토큰 만료시간을 알 수 없음)
    const expires_at = Date.now() + (6 * 60 * 60 * 1000);
    
    // DB에 토큰 정보 저장
    await prisma.appConfig.upsert({
      where: { key: 'kakao_tokens' },
      update: { 
        value: JSON.stringify({
          access_token,
          refresh_token,
          expires_at
        })
      },
      create: {
        key: 'kakao_tokens',
        value: JSON.stringify({
          access_token,
          refresh_token,
          expires_at
        })
      }
    });
    
    return res.status(200).json({
      success: true,
      message: '카카오 토큰이 성공적으로 설정되었습니다.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 특정 사용자 정보 조회
 */
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const user = await adminService.getUserById(req.prisma, parseInt(id));
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '사용자를 찾을 수 없습니다.'
      });
    }
    
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

/**
 * 사용자 정보 업데이트
 */
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userData = req.body;
    
    const updatedUser = await adminService.updateUser(req.prisma, parseInt(id), userData);
    
    res.json({ 
      success: true, 
      message: '사용자 정보가 성공적으로 업데이트되었습니다.',
      data: updatedUser 
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 사용자 구독 상태 변경
 */
const toggleUserSubscription = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isSubscribed } = req.body;
    
    if (isSubscribed === undefined) {
      return res.status(400).json({
        success: false,
        message: 'isSubscribed 필드가 필요합니다.'
      });
    }
    
    const updatedUser = await adminService.updateUserSubscription(
      req.prisma, 
      parseInt(id), 
      isSubscribed
    );
    
    res.json({ 
      success: true, 
      message: `사용자 구독 상태가 ${isSubscribed ? '활성화' : '비활성화'}되었습니다.`,
      data: updatedUser 
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 사용자 프리미엄 상태 변경
 */
const updateUserPremium = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isPremium, durationMonths } = req.body;
    
    if (isPremium === undefined) {
      return res.status(400).json({
        success: false,
        message: 'isPremium 필드가 필요합니다.'
      });
    }
    
    const duration = parseInt(durationMonths) || 1;
    
    const updatedUser = await adminService.updateUserPremiumStatus(
      req.prisma, 
      parseInt(id), 
      isPremium,
      duration
    );
    
    res.json({ 
      success: true, 
      message: `사용자 프리미엄 상태가 ${isPremium ? '활성화' : '비활성화'}되었습니다.`,
      data: updatedUser 
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 사용자 계정 상태 변경 (활성화/비활성화)
 */
const toggleUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    
    if (isActive === undefined) {
      return res.status(400).json({
        success: false,
        message: 'isActive 필드가 필요합니다.'
      });
    }
    
    const updatedUser = await adminService.updateUserStatus(
      req.prisma, 
      parseInt(id), 
      isActive
    );
    
    res.json({ 
      success: true, 
      message: `사용자 계정이 ${isActive ? '활성화' : '비활성화'}되었습니다.`,
      data: updatedUser 
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 사용자 카카오 연결 해제
 */
const unlinkUserKakao = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const result = await adminService.unlinkUserKakao(req.prisma, parseInt(id));
    
    res.json({ 
      success: true, 
      message: '사용자의 카카오 계정 연결이 해제되었습니다.',
      data: result 
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getResponseStats,
  getDonationStats,
  sendQuestion,
  setKakaoTokens,
  getUserById,
  updateUser,
  toggleUserSubscription,
  updateUserPremium,
  toggleUserStatus,
  unlinkUserKakao
};