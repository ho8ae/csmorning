const webhookService = require('../services/webhook.service');
const { createKakaoResponse } = require('../services/response.service');
const { RESPONSE_MESSAGES, QUICK_REPLIES } = require('../../../constants/chatbot');

/**
 * 기능 맛보기 처리
 */
const handleFeaturePreviewCommand = async (req, user) => {
  try {
    return createKakaoResponse(
      RESPONSE_MESSAGES.FEATURE_PREVIEW,
      QUICK_REPLIES.FEATURE_PREVIEW,
    );
  } catch (error) {
    console.error('기능 맛보기 처리 중 오류:', error);
    return createKakaoResponse(RESPONSE_MESSAGES.ERROR);
  }
};

/**
 * 내 정답률 확인 처리
 */
const handleMyAccuracyCommand = async (req, user) => {
  try {
    // 임시 사용자인 경우 계정 연동 필요
    if (user.isTemporary) {
      return createKakaoResponse(
        RESPONSE_MESSAGES.ACCOUNT_LINKING_REQUIRED,
        QUICK_REPLIES.DEFAULT,
      );
    }

    const stats = await webhookService.getUserAccuracyStats(
      req.prisma,
      user.id,
    );

    return createKakaoResponse(
      RESPONSE_MESSAGES.MY_ACCURACY(
        stats.totalAnswered,
        stats.correctAnswers,
        stats.accuracy,
      ),
      QUICK_REPLIES.AFTER_FEATURE,
    );
  } catch (error) {
    console.error('내 정답률 확인 처리 중 오류:', error);
    return createKakaoResponse(RESPONSE_MESSAGES.ERROR);
  }
};

/**
 * 카테고리별 성과 확인 처리
 */
const handleCategoryPerformanceCommand = async (req, user) => {
  try {
    // 임시 사용자인 경우 계정 연동 필요
    if (user.isTemporary) {
      return createKakaoResponse(
        RESPONSE_MESSAGES.ACCOUNT_LINKING_REQUIRED,
        QUICK_REPLIES.DEFAULT,
      );
    }

    const categoryStats = await webhookService.getUserCategoryPerformance(
      req.prisma,
      user.id,
    );

    return createKakaoResponse(
      RESPONSE_MESSAGES.CATEGORY_PERFORMANCE(categoryStats),
      QUICK_REPLIES.AFTER_FEATURE,
    );
  } catch (error) {
    console.error('카테고리별 성과 확인 처리 중 오류:', error);
    return createKakaoResponse(RESPONSE_MESSAGES.ERROR);
  }
};

/**
 * 내 활동 캘린더 확인 처리
 */
const handleActivityCalendarCommand = async (req, user) => {
  try {
    // 임시 사용자인 경우 계정 연동 필요
    if (user.isTemporary) {
      return createKakaoResponse(
        RESPONSE_MESSAGES.ACCOUNT_LINKING_REQUIRED,
        QUICK_REPLIES.DEFAULT,
      );
    }

    const activityStats = await webhookService.getUserActivityStats(
      req.prisma,
      user.id,
    );

    return createKakaoResponse(
      RESPONSE_MESSAGES.ACTIVITY_CALENDAR(
        activityStats.totalDays,
        activityStats.longestStreak,
        activityStats.currentStreak,
      ),
      QUICK_REPLIES.AFTER_FEATURE,
    );
  } catch (error) {
    console.error('내 활동 캘린더 확인 처리 중 오류:', error);
    return createKakaoResponse(RESPONSE_MESSAGES.ERROR);
  }
};

/**
 * 오늘의 질문 통계 확인 처리
 */
const handleTodayQuestionStatsCommand = async (req, user) => {
  try {
    const questionStats = await webhookService.getTodayQuestionStats(
      req.prisma,
    );

    return createKakaoResponse(
      RESPONSE_MESSAGES.TODAY_QUESTION_STATS(
        questionStats.totalResponses,
        questionStats.correctResponses,
        questionStats.accuracy,
        questionStats.mostCommonWrong,
      ),
      QUICK_REPLIES.AFTER_FEATURE,
    );
  } catch (error) {
    console.error('오늘의 질문 통계 확인 처리 중 오류:', error);
    return createKakaoResponse(RESPONSE_MESSAGES.ERROR);
  }
};

/**
 * 최신 토론 확인 처리
 */
const handleLatestDiscussionsCommand = async (req, user) => {
  try {
    const discussions = await webhookService.getLatestDiscussions(req.prisma);

    return createKakaoResponse(
      RESPONSE_MESSAGES.LATEST_DISCUSSIONS(discussions),
      QUICK_REPLIES.AFTER_FEATURE,
    );
  } catch (error) {
    console.error('최신 토론 확인 처리 중 오류:', error);
    return createKakaoResponse(RESPONSE_MESSAGES.ERROR);
  }
};

module.exports = {
  handleFeaturePreviewCommand,
  handleMyAccuracyCommand,
  handleCategoryPerformanceCommand,
  handleActivityCalendarCommand,
  handleTodayQuestionStatsCommand,
  handleLatestDiscussionsCommand
};