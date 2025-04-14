const Joi = require('joi');

// 질문 생성 유효성 검사 스키마
const createQuestionSchema = Joi.object({
  text: Joi.string().required().messages({
    'string.empty': '질문 내용은 필수 입력 항목입니다',
    'any.required': '질문 내용은 필수 입력 항목입니다'
  }),
  
  options: Joi.array().items(Joi.string()).min(2).required().messages({
    'array.base': '옵션은 배열 형태여야 합니다',
    'array.min': '최소 2개 이상의 옵션이 필요합니다',
    'any.required': '옵션은 필수 입력 항목입니다'
  }),
  
  correctOption: Joi.number().integer().min(0).required().messages({
    'number.base': '정답 옵션은 숫자여야 합니다',
    'number.integer': '정답 옵션은 정수여야 합니다',
    'number.min': '정답 옵션은 0 이상이어야 합니다',
    'any.required': '정답 옵션은 필수 입력 항목입니다'
  }),
  
  explanation: Joi.string().required().messages({
    'string.empty': '설명은 필수 입력 항목입니다',
    'any.required': '설명은 필수 입력 항목입니다'
  }),
  
  category: Joi.string().required().messages({
    'string.empty': '카테고리는 필수 입력 항목입니다',
    'any.required': '카테고리는 필수 입력 항목입니다'
  }),
  
  difficulty: Joi.string().valid('easy', 'medium', 'hard').default('medium').messages({
    'any.only': '난이도는 easy, medium, hard 중 하나여야 합니다'
  }),
  
  active: Joi.boolean().default(true)
});

// 질문 수정 유효성 검사 스키마
const updateQuestionSchema = Joi.object({
  text: Joi.string().messages({
    'string.empty': '질문 내용이 비어있을 수 없습니다'
  }),
  
  options: Joi.array().items(Joi.string()).min(2).messages({
    'array.base': '옵션은 배열 형태여야 합니다',
    'array.min': '최소 2개 이상의 옵션이 필요합니다'
  }),
  
  correctOption: Joi.number().integer().min(0).messages({
    'number.base': '정답 옵션은 숫자여야 합니다',
    'number.integer': '정답 옵션은 정수여야 합니다',
    'number.min': '정답 옵션은 0 이상이어야 합니다'
  }),
  
  explanation: Joi.string().messages({
    'string.empty': '설명이 비어있을 수 없습니다'
  }),
  
  category: Joi.string().messages({
    'string.empty': '카테고리가 비어있을 수 없습니다'
  }),
  
  difficulty: Joi.string().valid('easy', 'medium', 'hard').messages({
    'any.only': '난이도는 easy, medium, hard 중 하나여야 합니다'
  }),
  
  active: Joi.boolean()
}).min(1); // 최소 하나 이상의 필드가 필요

module.exports = {
  createQuestionSchema,
  updateQuestionSchema
};