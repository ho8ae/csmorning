const premiumService = require('./premium.service');

// 잔디 기능
const getActivityCalendar = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;
    
    const activityData = await premiumService.getActivityCalendar(
      req.prisma,
      userId,
      startDate,
      endDate
    );
    
    return res.status(200).json({
      success: true,
      data: activityData
    });
  } catch (error) {
    next(error);
  }
};

// 통계 API
const getStatisticsByGender = async (req, res, next) => {
  try {
    const statistics = await premiumService.getStatisticsByGender(req.prisma);
    
    return res.status(200).json({
      success: true,
      data: statistics
    });
  } catch (error) {
    next(error);
  }
};

const getStatisticsByAgeGroup = async (req, res, next) => {
  try {
    const statistics = await premiumService.getStatisticsByAgeGroup(req.prisma);
    
    return res.status(200).json({
      success: true,
      data: statistics
    });
  } catch (error) {
    next(error);
  }
};

const getTopPerformers = async (req, res, next) => {
  try {
    const { limit } = req.query;
    const topUsers = await premiumService.getTopPerformers(req.prisma, limit || 10);
    
    return res.status(200).json({
      success: true,
      data: topUsers
    });
  } catch (error) {
    next(error);
  }
};

const getCategoryPerformance = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const categoryStats = await premiumService.getCategoryPerformance(req.prisma, userId);
    
    return res.status(200).json({
      success: true,
      data: categoryStats
    });
  } catch (error) {
    next(error);
  }
};

// 토론 기능
const getDiscussions = async (req, res, next) => {
  try {
    const { type, page, limit } = req.query;
    const discussions = await premiumService.getDiscussions(
      req.prisma,
      type,
      parseInt(page) || 1,
      parseInt(limit) || 10
    );
    
    return res.status(200).json({
      success: true,
      data: discussions
    });
  } catch (error) {
    next(error);
  }
};

const createDiscussion = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { title, description, type } = req.body;
    
    const discussion = await premiumService.createDiscussion(
      req.prisma,
      userId,
      title,
      description,
      type
    );
    
    return res.status(201).json({
      success: true,
      data: discussion
    });
  } catch (error) {
    next(error);
  }
};

const getDiscussionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const discussion = await premiumService.getDiscussionById(req.prisma, parseInt(id));
    
    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: '존재하지 않는 토론입니다.'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: discussion
    });
  } catch (error) {
    next(error);
  }
};

const addComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { content, stance, parentId } = req.body;
    
    const comment = await premiumService.addComment(
      req.prisma,
      parseInt(id),
      userId,
      content,
      stance,
      parentId
    );
    
    return res.status(201).json({
      success: true,
      data: comment
    });
  } catch (error) {
    next(error);
  }
};

const addReaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { emoji, commentId } = req.body;
    
    const reaction = await premiumService.addReaction(
      req.prisma,
      parseInt(id),
      userId,
      emoji,
      commentId
    );
    
    return res.status(201).json({
      success: true,
      data: reaction
    });
  } catch (error) {
    next(error);
  }
};

const removeReaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { emoji, commentId } = req.query;
    
    await premiumService.removeReaction(
      req.prisma,
      parseInt(id),
      userId,
      emoji,
      commentId ? parseInt(commentId) : null
    );
    
    return res.status(200).json({
      success: true,
      message: '반응이 삭제되었습니다.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getActivityCalendar,
  getStatisticsByGender,
  getStatisticsByAgeGroup,
  getTopPerformers,
  getCategoryPerformance,
  getDiscussions,
  createDiscussion,
  getDiscussionById,
  addComment,
  addReaction,
  removeReaction
};