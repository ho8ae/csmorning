const Joi = require('joi');

// 토론 생성 스키마
const createDiscussionSchema = Joi.object({
  title: Joi.string().required().min(5).max(100).messages({
    'string.empty': '토론 제목을 입력해주세요.',
    'string.min': '토론 제목은 최소 5자 이상이어야 합니다.',
    'string.max': '토론 제목은 최대 100자까지 가능합니다.',
    'any.required': '토론 제목을 입력해주세요.'
  }),
  description: Joi.string().required().min(10).max(1000).messages({
    'string.empty': '토론 내용을 입력해주세요.',
    'string.min': '토론 내용은 최소 10자 이상이어야 합니다.',
    'string.max': '토론 내용은 최대 1000자까지 가능합니다.',
    'any.required': '토론 내용을 입력해주세요.'
  }),
  type: Joi.string().valid('debate', 'free').required().messages({
    'any.only': '토론 형식은 debate 또는 free 중 하나여야 합니다.',
    'any.required': '토론 형식을 선택해주세요.'
  })
});

// 댓글 작성 스키마
const createCommentSchema = Joi.object({
  content: Joi.string().required().min(2).max(500).messages({
    'string.empty': '댓글 내용을 입력해주세요.',
    'string.min': '댓글 내용은 최소 2자 이상이어야 합니다.',
    'string.max': '댓글 내용은 최대 500자까지 가능합니다.',
    'any.required': '댓글 내용을 입력해주세요.'
  }),
  stance: Joi.string().valid('for', 'against', 'neutral').messages({
    'any.only': '의견은 for, against, neutral 중 하나여야 합니다.'
  }),
  parentId: Joi.number().integer().positive().allow(null)
});

// 반응 추가 스키마
const addReactionSchema = Joi.object({
  emoji: Joi.string().required().messages({
    'string.empty': '이모지를 선택해주세요.',
    'any.required': '이모지를 선택해주세요.'
  }),
  commentId: Joi.number().integer().positive().allow(null)
});

module.exports = {
  createDiscussionSchema,
  createCommentSchema,
  addReactionSchema
};