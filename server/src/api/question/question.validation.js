const Joi = require('joi');

// 기존 스키마
const createQuestionSchema = Joi.object({
  text: Joi.string().required().messages({
    'string.empty': '질문 내용을 입력해주세요.',
    'any.required': '질문 내용은 필수 입력 항목입니다.'
  }),
  options: Joi.array().min(2).required().messages({
    'array.min': '최소 2개 이상의 옵션이 필요합니다.',
    'any.required': '옵션은 필수 입력 항목입니다.'
  }),
  correctOption: Joi.number().integer().min(0).required().messages({
    'number.base': '정답 옵션은 숫자여야 합니다.',
    'number.integer': '정답 옵션은 정수여야 합니다.',
    'number.min': '정답 옵션은 0 이상이어야 합니다.',
    'any.required': '정답 옵션은 필수 입력 항목입니다.'
  }),
  explanation: Joi.string().required().messages({
    'string.empty': '설명을 입력해주세요.',
    'any.required': '설명은 필수 입력 항목입니다.'
  }),
  category: Joi.string().required().messages({
    'string.empty': '카테고리를 입력해주세요.',
    'any.required': '카테고리는 필수 입력 항목입니다.'
  }),
  difficulty: Joi.string().valid('easy', 'medium', 'hard').default('medium').messages({
    'any.only': '난이도는 easy, medium, hard 중 하나여야 합니다.'
  }),
  description: Joi.string().allow('', null)
});

const updateQuestionSchema = Joi.object({
  text: Joi.string().messages({
    'string.empty': '질문 내용을 입력해주세요.'
  }),
  options: Joi.array().min(2).messages({
    'array.min': '최소 2개 이상의 옵션이 필요합니다.'
  }),
  correctOption: Joi.number().integer().min(0).messages({
    'number.base': '정답 옵션은 숫자여야 합니다.',
    'number.integer': '정답 옵션은 정수여야 합니다.',
    'number.min': '정답 옵션은 0 이상이어야 합니다.'
  }),
  explanation: Joi.string().messages({
    'string.empty': '설명을 입력해주세요.'
  }),
  category: Joi.string().messages({
    'string.empty': '카테고리를 입력해주세요.'
  }),
  difficulty: Joi.string().valid('easy', 'medium', 'hard').messages({
    'any.only': '난이도는 easy, medium, hard 중 하나여야 합니다.'
  }),
  active: Joi.boolean().messages({
    'boolean.base': '활성 상태는 불리언 값이어야 합니다.'
  }),
  description: Joi.string().allow('', null)
});

// 추가: 주간 퀴즈 응답 제출 스키마
const submitWeeklyQuizResponseSchema = {
  body: Joi.object({
    weeklyQuizId: Joi.number().required().messages({
      'number.base': '퀴즈 ID는 숫자여야 합니다.',
      'any.required': '퀴즈 ID는 필수 입력 항목입니다.'
    }),
    answer: Joi.number().min(0).required().messages({
      'number.base': '답변은 숫자여야 합니다.',
      'number.min': '답변은 0 이상이어야 합니다.',
      'any.required': '답변은 필수 입력 항목입니다.'
    })
  })
};

// 추가: 주간 퀴즈 목록 조회 스키마
const getWeeklyQuizzesSchema = {
  query: Joi.object({
    week: Joi.number().min(1).messages({
      'number.base': '주차는 숫자여야 합니다.',
      'number.min': '주차는 1 이상이어야 합니다.'
    })
  }).unknown(true)
};

// 추가: 사용자 주간 퀴즈 응답 현황 조회 스키마
const getUserWeeklyResponsesSchema = {
  query: Joi.object({
    week: Joi.number().min(1).messages({
      'number.base': '주차는 숫자여야 합니다.',
      'number.min': '주차는 1 이상이어야 합니다.'
    })
  }).unknown(true)
};

// 추가: CS 컨텐츠 생성 스키마
const createCSContentSchema = {
  body: Joi.object({
    title: Joi.string().required().messages({
      'string.empty': '제목을 입력해주세요.',
      'any.required': '제목은 필수 입력 항목입니다.'
    }),
    content: Joi.string().required().messages({
      'string.empty': '내용을 입력해주세요.',
      'any.required': '내용은 필수 입력 항목입니다.'
    }),
    category: Joi.string().required().messages({
      'string.empty': '카테고리를 입력해주세요.',
      'any.required': '카테고리는 필수 입력 항목입니다.'
    })
  })
};

// 추가: 주간 퀴즈 생성 스키마
const createWeeklyQuizSchema = {
  body: Joi.object({
    csContentId: Joi.number().required().messages({
      'number.base': 'CS 컨텐츠 ID는 숫자여야 합니다.',
      'any.required': 'CS 컨텐츠 ID는 필수 입력 항목입니다.'
    }),
    quizText: Joi.string().required().messages({
      'string.empty': '퀴즈 내용을 입력해주세요.',
      'any.required': '퀴즈 내용은 필수 입력 항목입니다.'
    }),
    options: Joi.array().min(2).required().messages({
      'array.min': '최소 2개 이상의 옵션이 필요합니다.',
      'any.required': '옵션은 필수 입력 항목입니다.'
    }),
    correctOption: Joi.number().integer().min(0).required().messages({
      'number.base': '정답 옵션은 숫자여야 합니다.',
      'number.integer': '정답 옵션은 정수여야 합니다.',
      'number.min': '정답 옵션은 0 이상이어야 합니다.',
      'any.required': '정답 옵션은 필수 입력 항목입니다.'
    }),
    explanation: Joi.string().required().messages({
      'string.empty': '설명을 입력해주세요.',
      'any.required': '설명은 필수 입력 항목입니다.'
    }),
    quizNumber: Joi.number().integer().min(1).max(7).required().messages({
      'number.base': '퀴즈 번호는 숫자여야 합니다.',
      'number.integer': '퀴즈 번호는 정수여야 합니다.',
      'number.min': '퀴즈 번호는 1 이상이어야 합니다.',
      'number.max': '퀴즈 번호는 7 이하여야 합니다.',
      'any.required': '퀴즈 번호는 필수 입력 항목입니다.'
    }),
    weekNumber: Joi.number().integer().min(1).required().messages({
      'number.base': '주차는 숫자여야 합니다.',
      'number.integer': '주차는 정수여야 합니다.',
      'number.min': '주차는 1 이상이어야 합니다.',
      'any.required': '주차는 필수 입력 항목입니다.'
    })
  })
};

module.exports = {
  createQuestionSchema,
  updateQuestionSchema,
  // 추가
  submitWeeklyQuizResponseSchema,
  getWeeklyQuizzesSchema,
  getUserWeeklyResponsesSchema,
  createCSContentSchema,
  createWeeklyQuizSchema
};