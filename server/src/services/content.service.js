// src/services/content.service.js
const prisma = require('../config/db'); // 프로젝트 구조에 맞게 경로 조정 필요

/**
 * CS 컨텐츠 생성
 * @returns {Promise<string>} 생성된 CS 컨텐츠
 */
exports.generateCsContent = async () => {
  try {
    // 가장 최근의 질문 가져오기
    const latestQuestion = await prisma.question.findFirst({
      where: { active: true },
      orderBy: { createdAt: 'desc' }
    });

    if (!latestQuestion) {
      return "오늘의 CS 지식이 준비되지 않았습니다. 관리자에게 문의해주세요.";
    }

    // 카테고리와 내용 포맷팅
    const content = `[${latestQuestion.category}]\n\n${latestQuestion.text}\n\n${latestQuestion.explanation}`;
    
    return content;
  } catch (error) {
    console.error('CS 컨텐츠 생성 중 오류:', error);
    return '오늘의 CS 지식을 생성하는 중 오류가 발생했습니다.';
  }
};

/**
 * 랜덤 CS 질문 가져오기
 * @returns {Promise<object>} 질문 객체
 */
exports.getRandomQuestion = async () => {
  try {
    // 활성화된 질문 수 확인
    const count = await prisma.question.count({
      where: { active: true }
    });

    if (count === 0) {
      return null;
    }

    // 랜덤 인덱스 생성
    const randomIndex = Math.floor(Math.random() * count);

    // 해당 인덱스의 질문 가져오기
    const questions = await prisma.question.findMany({
      where: { active: true },
      skip: randomIndex,
      take: 1
    });

    return questions[0];
  } catch (error) {
    console.error('랜덤 질문 조회 중 오류:', error);
    return null;
  }
};