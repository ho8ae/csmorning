// services/content.service.js
const { PrismaClient } = require('@prisma/client');

/**
 * CS 컨텐츠 생성 함수
 * @param {string} topic - 주제
 * @returns {Promise<string>} 생성된 CS 컨텐츠
 */
const generateCsContent = (topic) => {
  // 실제 구현에서는 AI를 활용하거나 템플릿 활용
  // 여기서는 샘플 컨텐츠 반환
  const topics = {
    'algorithm': '알고리즘(Algorithm)은 문제를 해결하기 위한 일련의 단계적 절차입니다. 효율적인 알고리즘은 시간 복잡도와 공간 복잡도를 고려하여 설계됩니다. 대표적인 알고리즘으로는 정렬(Sorting), 검색(Searching), 그래프 알고리즘 등이 있습니다.',
    'data_structure': '자료구조(Data Structure)는 데이터를 효율적으로 저장하고 관리하기 위한 방법입니다. 배열, 연결 리스트, 스택, 큐, 트리, 그래프 등 다양한 자료구조가 있으며, 각각의 장단점이 있어 상황에 맞게 선택해야 합니다.',
    'network': '네트워크는 컴퓨터나 디바이스들이 데이터를 주고받을 수 있도록 연결된 시스템입니다. OSI 7계층과 TCP/IP 4계층 모델이 있으며, HTTP, TCP, UDP, IP 등의 프로토콜을 사용합니다.',
    'database': '데이터베이스는 구조화된 데이터를 효율적으로 저장하고 관리하는 시스템입니다. 관계형 데이터베이스(RDBMS)와 NoSQL 데이터베이스로 크게 나뉘며, SQL을 통해 데이터를 조작합니다.',
    'os': '운영체제(OS)는 하드웨어와 소프트웨어 간의 인터페이스 역할을 하며, 시스템 자원을 관리합니다. 프로세스 관리, 메모리 관리, 파일 시스템, 입출력 관리 등의 기능을 제공합니다.'
  };
  
  return topics[topic] || '컴퓨터 과학(CS)은 컴퓨터와 컴퓨팅 시스템의 설계와 개발에 관한 학문입니다. 알고리즘, 자료구조, 네트워크, 데이터베이스, 운영체제, 소프트웨어 공학 등 다양한 분야를 포함합니다.';
};

/**
 * CS 지식 컨텐츠 생성
 * @param {PrismaClient} prisma - Prisma 클라이언트
 * @param {string} title - 제목
 * @param {string} content - 내용
 * @param {string} category - 카테고리
 * @returns {Promise<Object>} 생성된 CS 컨텐츠
 */
const createCSContent = async (prisma, title, content, category) => {
  const csContent = await prisma.cSContent.create({
    data: {
      title,
      content,
      category,
      active: true,
    }
  });
  
  return csContent;
};

/**
 * CS 지식 컨텐츠 목록 조회
 * @param {PrismaClient} prisma - Prisma 클라이언트
 * @param {number} page - 페이지 번호
 * @param {number} pageSize - 페이지 크기
 * @returns {Promise<Object>} CS 컨텐츠 목록
 */
const getCSContents = async (prisma, page = 1, pageSize = 10) => {
  const skip = (page - 1) * pageSize;
  
  const totalCount = await prisma.cSContent.count({
    where: { active: true }
  });
  
  const contents = await prisma.cSContent.findMany({
    where: { active: true },
    orderBy: { sendDate: 'desc' },
    skip,
    take: pageSize,
  });
  
  return {
    contents,
    pagination: {
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      currentPage: page,
      pageSize,
    }
  };
};

/**
 * CS 지식 컨텐츠 상세 조회
 * @param {PrismaClient} prisma - Prisma 클라이언트
 * @param {number} id - CS 컨텐츠 ID
 * @returns {Promise<Object>} CS 컨텐츠
 */
const getCSContentById = async (prisma, id) => {
  const content = await prisma.cSContent.findUnique({
    where: { id },
    include: {
      weeklyQuizzes: {
        orderBy: { quizNumber: 'asc' }
      }
    }
  });
  
  if (!content) {
    throw new Error('CS 컨텐츠를 찾을 수 없습니다.');
  }
  
  return content;
};

/**
 * CS 지식 컨텐츠 업데이트
 * @param {PrismaClient} prisma - Prisma 클라이언트
 * @param {number} id - CS 컨텐츠 ID
 * @param {Object} updateData - 업데이트 데이터
 * @returns {Promise<Object>} 업데이트된 CS 컨텐츠
 */
const updateCSContent = async (prisma, id, updateData) => {
  const content = await prisma.cSContent.findUnique({
    where: { id }
  });
  
  if (!content) {
    throw new Error('CS 컨텐츠를 찾을 수 없습니다.');
  }
  
  const updatedContent = await prisma.cSContent.update({
    where: { id },
    data: updateData
  });
  
  return updatedContent;
};

/**
 * CS 지식 컨텐츠 삭제 (비활성화)
 * @param {PrismaClient} prisma - Prisma 클라이언트
 * @param {number} id - CS 컨텐츠 ID
 * @returns {Promise<Object>} 비활성화된 CS 컨텐츠
 */
const deleteCSContent = async (prisma, id) => {
  const content = await prisma.cSContent.findUnique({
    where: { id }
  });
  
  if (!content) {
    throw new Error('CS 컨텐츠를 찾을 수 없습니다.');
  }
  
  const updatedContent = await prisma.cSContent.update({
    where: { id },
    data: { active: false }
  });
  
  return updatedContent;
};

/**
 * 오늘의 CS 지식 컨텐츠 생성 (자동 발송용)
 * @param {PrismaClient} prisma - Prisma 클라이언트
 * @returns {Promise<Object>} 오늘의 CS 컨텐츠
 */
const generateTodayCSContent = async (prisma) => {
  // 아직 발송되지 않은 가장 오래된 컨텐츠 찾기
  const nextContent = await prisma.cSContent.findFirst({
    where: { 
      active: true,
      sendDate: { equals: null }
    },
    orderBy: { createdAt: 'asc' }
  });
  
  // 없으면 이미 발송된 컨텐츠 중 가장 오래된 것 재사용
  if (!nextContent) {
    const oldestContent = await prisma.cSContent.findFirst({
      where: { active: true },
      orderBy: { sendDate: 'asc' }
    });
    
    if (!oldestContent) {
      throw new Error('발송할 CS 컨텐츠가 없습니다.');
    }
    
    // 발송 날짜 업데이트
    const updatedContent = await prisma.cSContent.update({
      where: { id: oldestContent.id },
      data: { sendDate: new Date() }
    });
    
    return updatedContent;
  }
  
  // 발송 날짜 업데이트
  const todayContent = await prisma.cSContent.update({
    where: { id: nextContent.id },
    data: { sendDate: new Date() }
  });
  
  return todayContent;
};

/**
 * 주간 퀴즈 생성
 * @param {PrismaClient} prisma - Prisma 클라이언트
 * @param {number} csContentId - CS 컨텐츠 ID
 * @param {string} quizText - 문제 내용
 * @param {Array} options - 선택지 배열
 * @param {number} correctOption - 정답 번호
 * @param {string} explanation - 설명
 * @param {number} quizNumber - 문제 번호 (1~7)
 * @param {number} weekNumber - 주차 번호
 * @returns {Promise<Object>} 생성된 주간 퀴즈
 */
const createWeeklyQuiz = async (prisma, csContentId, quizText, options, correctOption, explanation, quizNumber, weekNumber) => {
  // CS 컨텐츠 존재 확인
  const csContent = await prisma.cSContent.findUnique({
    where: { id: csContentId }
  });
  
  if (!csContent) {
    throw new Error('CS 컨텐츠를 찾을 수 없습니다.');
  }
  
  // 이미 해당 주차와 문제 번호에 퀴즈가 있는지 확인
  const existingQuiz = await prisma.weeklyQuiz.findFirst({
    where: {
      weekNumber,
      quizNumber
    }
  });
  
  if (existingQuiz) {
    throw new Error(`이미 주차 ${weekNumber}, 문제 번호 ${quizNumber}에 퀴즈가 존재합니다.`);
  }
  
  // 주간 퀴즈 생성
  const weeklyQuiz = await prisma.weeklyQuiz.create({
    data: {
      csContentId,
      quizText,
      options,
      correctOption,
      explanation,
      quizNumber,
      weekNumber,
      active: true
    }
  });
  
  return weeklyQuiz;
};

/**
 * 주간 퀴즈 응답 처리
 * @param {PrismaClient} prisma - Prisma 클라이언트
 * @param {number} userId - 사용자 ID
 * @param {number} weeklyQuizId - 주간 퀴즈 ID
 * @param {number} answer - 사용자 응답
 * @returns {Promise<Object>} 응답 결과
 */
const submitWeeklyQuizResponse = async (prisma, userId, weeklyQuizId, answer) => {
  // 퀴즈 존재 확인
  const quiz = await prisma.weeklyQuiz.findUnique({
    where: { id: weeklyQuizId }
  });
  
  if (!quiz) {
    throw new Error('퀴즈를 찾을 수 없습니다.');
  }
  
  // 이미 응답했는지 확인
  const existingResponse = await prisma.weeklyResponse.findFirst({
    where: {
      userId,
      weeklyQuizId
    }
  });
  
  if (existingResponse) {
    throw new Error('이미 해당 퀴즈에 응답했습니다.');
  }
  
  // 응답 정답 여부 확인
  const isCorrect = quiz.correctOption === answer;
  
  // 응답 생성
  const response = await prisma.weeklyResponse.create({
    data: {
      userId,
      weeklyQuizId,
      answer,
      isCorrect
    }
  });
  
  // 사용자 통계 업데이트
  await prisma.user.update({
    where: { id: userId },
    data: {
      totalAnswered: { increment: 1 },
      correctAnswers: isCorrect ? { increment: 1 } : undefined
    }
  });
  
  return {
    response,
    isCorrect,
    correctOption: quiz.correctOption,
    explanation: quiz.explanation
  };
};

/**
 * 주차별 퀴즈 목록 조회
 * @param {PrismaClient} prisma - Prisma 클라이언트
 * @param {number} weekNumber - 주차 번호
 * @returns {Promise<Array>} 주차별 퀴즈 목록
 */
const getWeeklyQuizzes = async (prisma, weekNumber) => {
  const quizzes = await prisma.weeklyQuiz.findMany({
    where: {
      weekNumber,
      active: true
    },
    orderBy: { quizNumber: 'asc' },
    include: {
      csContent: true
    }
  });
  
  return quizzes;
};

/**
 * 현재 주차 퀴즈 조회
 * @param {PrismaClient} prisma - Prisma 클라이언트
 * @returns {Promise<Object>} 현재 주차 정보 및 퀴즈 목록
 */
const getCurrentWeeklyQuizzes = async (prisma) => {
  // 현재 주차 계산 (2023년 1월 1일부터 몇 주차인지)
  const startDate = new Date(2023, 0, 1);
  const currentDate = new Date();
  const diffTime = Math.abs(currentDate - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const currentWeek = Math.ceil(diffDays / 7);
  
  // 현재 주차의 퀴즈 목록 조회
  const quizzes = await getWeeklyQuizzes(prisma, currentWeek);
  
  return {
    currentWeek,
    quizzes
  };
};

/**
 * 사용자의 주간 퀴즈 응답 현황 조회
 * @param {PrismaClient} prisma - Prisma 클라이언트
 * @param {number} userId - 사용자 ID
 * @param {number} weekNumber - 주차 번호 (없으면 현재 주차)
 * @returns {Promise<Object>} 응답 현황
 */
const getUserWeeklyResponses = async (prisma, userId, weekNumber = null) => {
  // 주차 설정
  if (!weekNumber) {
    const startDate = new Date(2023, 0, 1);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    weekNumber = Math.ceil(diffDays / 7);
  }
  
  // 해당 주차의 퀴즈 ID 목록 조회
  const weeklyQuizzes = await prisma.weeklyQuiz.findMany({
    where: {
      weekNumber,
      active: true
    },
    select: { id: true, quizNumber: true }
  });
  
  const quizIds = weeklyQuizzes.map(q => q.id);
  
  // 사용자의 응답 조회
  const responses = await prisma.weeklyResponse.findMany({
    where: {
      userId,
      weeklyQuizId: { in: quizIds }
    },
    include: {
      weeklyQuiz: true
    }
  });
  
  // 퀴즈별 응답 현황 매핑
  const responseMap = {};
  weeklyQuizzes.forEach(quiz => {
    responseMap[quiz.quizNumber] = {
      quizId: quiz.id,
      answered: false,
      isCorrect: false,
      answer: null
    };
  });
  
  responses.forEach(resp => {
    const quizNumber = resp.weeklyQuiz.quizNumber;
    responseMap[quizNumber] = {
      quizId: resp.weeklyQuizId,
      answered: true,
      isCorrect: resp.isCorrect,
      answer: resp.answer
    };
  });
  
  return {
    weekNumber,
    responses: responseMap,
    progress: {
      total: quizIds.length,
      answered: responses.length,
      correct: responses.filter(r => r.isCorrect).length
    }
  };
};

/**
 * 오늘의 CS 지식 컨텐츠 조회
 * @param {PrismaClient} prisma - Prisma 클라이언트
 * @returns {Promise<Object>} 최신 CS 컨텐츠
 */
const getTodayCSContent = async (prisma) => {
  // 가장 최신의 CS 지식 컨텐츠 조회
  const todayContent = await prisma.cSContent.findFirst({
    orderBy: { sendDate: 'desc' },
    take: 1
  });
  
  return todayContent;
};

module.exports = {
  generateCsContent,
  createCSContent,
  getCSContents,
  getCSContentById,
  updateCSContent,
  deleteCSContent,
  generateTodayCSContent,
  createWeeklyQuiz,
  submitWeeklyQuizResponse,
  getWeeklyQuizzes,
  getCurrentWeeklyQuizzes,
  getUserWeeklyResponses,
  getTodayCSContent
};