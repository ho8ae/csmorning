/**
 * 모든 질문 조회
 */
const getAllQuestions = async (prisma, filter = {}) => {
    return await prisma.question.findMany({
      where: filter,
      orderBy: { id: 'desc' }
    });
  };
  
  /**
   * 특정 질문 조회
   */
  const getQuestionById = async (prisma, id) => {
    return await prisma.question.findUnique({
      where: { id: Number(id) }
    });
  };
  
  /**
   * 질문이 이미 사용되었는지 확인
   */
  const isQuestionUsed = async (prisma, id) => {
    const dailyQuestion = await prisma.dailyQuestion.findFirst({
      where: { questionId: Number(id) }
    });
    
    return !!dailyQuestion;
  };
  
  /**
   * 질문 생성
   */
  const createQuestion = async (prisma, questionData) => {
    return await prisma.question.create({
      data: questionData
    });
  };
  
  /**
   * 질문 수정
   */
  const updateQuestion = async (prisma, id, updateData) => {
    return await prisma.question.update({
      where: { id: Number(id) },
      data: updateData
    });
  };
  
  /**
   * 질문 삭제
   */
  const deleteQuestion = async (prisma, id) => {
    return await prisma.question.delete({
      where: { id: Number(id) }
    });
  };
  
  /**
   * 오늘의 질문 조회
   */
  const getTodayQuestion = async (prisma) => {
    return await prisma.dailyQuestion.findFirst({
      orderBy: { sentDate: 'desc' },
      include: { question: true }
    });
  };
  
  module.exports = {
    getAllQuestions,
    getQuestionById,
    isQuestionUsed,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    getTodayQuestion
  };