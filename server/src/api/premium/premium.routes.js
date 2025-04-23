const express = require('express');
const router = express.Router();
const premiumController = require('./premium.controller');
const { isAuthenticated } = require('../../middleware/auth.middleware');
const validate = require('../../middleware/validation.middleware');
const premiumValidation = require('./premium.validation');

// 잔디 기능 관련 API
router.get('/activity-calendar', isAuthenticated, premiumController.getActivityCalendar);

// 통계 API
router.get('/statistics/gender', isAuthenticated, premiumController.getStatisticsByGender);
router.get('/statistics/age-group', isAuthenticated, premiumController.getStatisticsByAgeGroup);
router.get('/statistics/top-performers', isAuthenticated, premiumController.getTopPerformers);
router.get('/statistics/category-performance', isAuthenticated, premiumController.getCategoryPerformance);

// 토론 기능 API
router.get('/discussions', isAuthenticated, premiumController.getDiscussions);
router.post(
  '/discussions', 
  isAuthenticated, 
  validate(premiumValidation.createDiscussionSchema), 
  premiumController.createDiscussion
);
router.get('/discussions/:id', isAuthenticated, premiumController.getDiscussionById);
router.post(
  '/discussions/:id/comments', 
  isAuthenticated, 
  validate(premiumValidation.createCommentSchema), 
  premiumController.addComment
);
router.post(
  '/discussions/:id/reactions', 
  isAuthenticated, 
  validate(premiumValidation.addReactionSchema), 
  premiumController.addReaction
);
router.delete('/discussions/:id/reactions', isAuthenticated, premiumController.removeReaction);

module.exports = router;