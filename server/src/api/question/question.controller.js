const questionService = require('./question.service');
const contentService = require('../../services/content.service');

/**
 * 모든 질문 조회
 */
const getAllQuestions = async (req, res, next) => {
  try {
    const { category, difficulty, active } = req.query;
    
    // 필터 객체 생성
    const filter = {};
    
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (active !== undefined) filter.active = active === 'true';
    
    // 질문 조회
    const questions = await questionService.getAllQuestions(req.prisma, filter);
    
    res.json({ success: true, data: questions });
  } catch (error) {
    next(error);
  }
};

/**
 * 단일 질문 조회
 */
const getQuestionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const question = await questionService.getQuestionById(req.prisma, id);
    
    if (!question) {
      return res.status(404).json({ 
        success: false, 
        message: '질문을 찾을 수 없습니다' 
      });
    }
    
    res.json({ success: true, data: question });
  } catch (error) {
    next(error);
  }
};

/**
 * 질문 생성
 */
const createQuestion = async (req, res, next) => {
  try {
    const { text, options, description, correctOption, explanation, category, difficulty } = req.body;
    
    // 필수 필드 검증
    if (!text || !options || correctOption === undefined || !explanation || !category) {
      return res.status(400).json({
        success: false,
        message: '필수 필드가 누락되었습니다'
      });
    }
    
    // 옵션 형식 검증
    if (!Array.isArray(options) || options.length < 2) {
      return res.status(400).json({
        success: false,
        message: '최소 2개 이상의 옵션이 필요합니다'
      });
    }
    
    // correctOption 검증
    if (correctOption < 0 || correctOption >= options.length) {
      return res.status(400).json({
        success: false,
        message: '유효한 correctOption이 필요합니다'
      });
    }
    
    // 질문 생성
    const newQuestion = await questionService.createQuestion(req.prisma, {
      text,
      description,
      options,
      correctOption,
      explanation,
      category,
      difficulty: difficulty || 'medium',
      active: true
    });
    
    res.status(201).json({ success: true, data: newQuestion });
  } catch (error) {
    next(error);
  }
};

/**
 * 질문 수정
 */
const updateQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text, options, correctOption, explanation, category, difficulty, active } = req.body;
    
    // 기존 질문 확인
    const question = await questionService.getQuestionById(req.prisma, id);
    
    if (!question) {
      return res.status(404).json({ 
        success: false, 
        message: '질문을 찾을 수 없습니다' 
      });
    }
    
    // 업데이트 데이터 객체
    const updateData = {};
    
    if (text !== undefined) updateData.text = text;
    if (explanation !== undefined) updateData.explanation = explanation;
    if (category !== undefined) updateData.category = category;
    if (difficulty !== undefined) updateData.difficulty = difficulty;
    if (active !== undefined) updateData.active = active;
    
    // 옵션 업데이트 관련 검증
    if (options !== undefined) {
      if (!Array.isArray(options) || options.length < 2) {
        return res.status(400).json({
          success: false,
          message: '최소 2개 이상의 옵션이 필요합니다'
        });
      }
      updateData.options = options;
    }
    
    // correctOption 업데이트 관련 검증
    if (correctOption !== undefined) {
      const optionsToCheck = options || question.options;
      if (correctOption < 0 || correctOption >= optionsToCheck.length) {
        return res.status(400).json({
          success: false,
          message: '유효한 correctOption이 필요합니다'
        });
      }
      updateData.correctOption = correctOption;
    }
    
    // 질문 업데이트
    const updatedQuestion = await questionService.updateQuestion(req.prisma, id, updateData);
    
    res.json({ success: true, data: updatedQuestion });
  } catch (error) {
    next(error);
  }
};

/**
 * 질문 삭제
 */
const deleteQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // 질문이 DailyQuestion에서 사용되는지 확인
    const isUsed = await questionService.isQuestionUsed(req.prisma, id);
    
    if (isUsed) {
      // 이미 사용된 질문은 비활성화만 진행
      const updatedQuestion = await questionService.updateQuestion(req.prisma, id, { active: false });
      
      return res.json({
        success: true,
        data: updatedQuestion,
        message: '이미 사용된 질문이므로 비활성화 처리되었습니다'
      });
    }
    
    // 사용되지 않은 질문은 완전 삭제
    await questionService.deleteQuestion(req.prisma, id);
    
    res.json({
      success: true,
      message: '질문이 성공적으로 삭제되었습니다'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 오늘의 질문 조회
 */
const getTodayQuestion = async (req, res, next) => {
  try {
    // 가장 최근 발송된 질문 조회
    const todayQuestion = await questionService.getTodayQuestion(req.prisma);
    
    if (!todayQuestion) {
      return res.status(404).json({
        success: false,
        message: '오늘의 질문이 없습니다'
      });
    }
    
    res.json({ success: true, data: todayQuestion });
  } catch (error) {
    next(error);
  }
};

/**
 * 오늘의 CS 지식 조회
 */
const getTodayCSContent = async (req, res, next) => {
  try {
    // 가장 최신 CS 지식 컨텐츠 조회
    const todayContent = await contentService.getTodayCSContent(req.prisma);
    
    if (!todayContent) {
      return res.status(404).json({
        success: false,
        message: '오늘의 CS 지식이 없습니다.'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: todayContent
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 주간 퀴즈 목록 조회
 */
const getWeeklyQuizzes = async (req, res, next) => {
  try {
    const { week } = req.query;
    let weekNumber = null;
    
    // 주차가 지정되지 않은 경우 현재 주차 사용
    if (!week) {
      const currentWeekData = await contentService.getCurrentWeeklyQuizzes(req.prisma);
      return res.status(200).json({
        success: true,
        data: currentWeekData
      });
    }
    
    // 주차가 지정된 경우
    weekNumber = parseInt(week);
    const quizzes = await contentService.getWeeklyQuizzes(req.prisma, weekNumber);
    
    return res.status(200).json({
      success: true,
      data: {
        currentWeek: weekNumber,
        quizzes
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 주간 퀴즈 응답 제출
 */
const submitWeeklyQuizResponse = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { weeklyQuizId, answer } = req.body;
    
    // 응답 처리
    const result = await contentService.submitWeeklyQuizResponse(
      req.prisma,
      userId,
      weeklyQuizId,
      answer
    );
    
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 사용자의 주간 퀴즈 응답 현황 조회
 */
const getUserWeeklyResponses = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { week } = req.query;
    
    let weekNumber = null;
    
    // 주차가 지정된 경우
    if (week) {
      weekNumber = parseInt(week);
    }
    
    // 사용자 응답 현황 조회
    const responses = await contentService.getUserWeeklyResponses(
      req.prisma,
      userId,
      weekNumber
    );
    
    return res.status(200).json({
      success: true,
      data: responses
    });
  } catch (error) {
    next(error);
  }
};

/**
 * CS 컨텐츠 생성 (관리자)
 */
const createCSContent = async (req, res, next) => {
  try {
    const { title, content, category } = req.body;
    
    // CS 컨텐츠 생성
    const newContent = await contentService.createCSContent(
      req.prisma,
      title,
      content,
      category
    );
    
    return res.status(201).json({
      success: true,
      data: newContent
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 주간 퀴즈 생성 (관리자)
 */
const createWeeklyQuiz = async (req, res, next) => {
  try {
    const {
      csContentId,
      quizText,
      options,
      correctOption,
      explanation,
      quizNumber,
      weekNumber
    } = req.body;
    
    // 주간 퀴즈 생성
    const newQuiz = await contentService.createWeeklyQuiz(
      req.prisma,
      csContentId,
      quizText,
      options,
      correctOption,
      explanation,
      quizNumber,
      weekNumber
    );
    
    return res.status(201).json({
      success: true,
      data: newQuiz
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getTodayQuestion,
  // 추가된 함수들
  getTodayCSContent,
  getWeeklyQuizzes,
  submitWeeklyQuizResponse,
  getUserWeeklyResponses,
  createCSContent,
  createWeeklyQuiz
};