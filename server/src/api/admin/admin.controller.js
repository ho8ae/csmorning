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

module.exports = {
  getAllUsers,
  getResponseStats,
  getDonationStats,
  sendQuestion
};