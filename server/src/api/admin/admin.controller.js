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

module.exports = {
  getAllUsers,
  getResponseStats,
  getDonationStats,
  sendQuestion,
  setKakaoTokens
};