/**
 * 사용자 찾기 또는 생성 (수정된 버전)
 */
const findOrCreateUser = async (prisma, kakaoChannelId) => {
  try {
    // 채널 ID로 매핑 테이블에서 검색
    const mapping = await prisma.userKakaoMapping.findUnique({
      where: { kakaoChannelId },
      include: { user: true }
    });
    
    if (mapping) {
      return mapping.user;
    }
    
    // 매핑이 없으면 새 사용자 생성
    const user = await prisma.user.create({
      data: {
        nickname: `사용자_${kakaoChannelId.substring(0, 5)}`,
        isTemporary: true // 임시 사용자 표시 (스키마에 필드 추가 필요)
      }
    });
    
    // 매핑 테이블에 채널 ID 추가
    await prisma.userKakaoMapping.create({
      data: {
        userId: user.id,
        kakaoChannelId
      }
    });
    
    return user;
  } catch (error) {
    console.error('사용자 찾기 또는 생성 중 오류 발생:', error);
    throw error;
  }
};

/**
 * 오늘의 질문 가져오기
 */
const getTodayQuestion = async (prisma) => {
  return await prisma.dailyQuestion.findFirst({
    orderBy: { sentDate: 'desc' },
    include: { question: true }
  });
};

/**
 * 특정 질문에 대한 사용자의 응답 확인
 */
const getUserResponseForQuestion = async (prisma, userId, dailyQuestionId) => {
  return await prisma.response.findFirst({
    where: {
      userId,
      dailyQuestionId
    }
  });
};

/**
 * 사용자 응답 생성
 */
const createResponse = async (prisma, userId, dailyQuestionId, answer, isCorrect) => {
  // 응답 생성
  const response = await prisma.response.create({
    data: {
      userId,
      dailyQuestionId,
      answer,
      isCorrect
    }
  });
  
  // 활동 기록 업데이트 (잔디 기능)
  try {
    const premiumService = require('../premium/premium.service');
    await premiumService.updateActivityOnAnswer(prisma, userId);
  } catch (error) {
    console.error('활동 기록 업데이트 중 오류:', error);
    // 메인 기능에 영향을 주지 않도록 오류를 무시
  }
  
  return response;
};

/**
 * 사용자 통계 업데이트
 */
const updateUserStats = async (prisma, userId, isCorrect) => {
  const updateData = {
    totalAnswered: { increment: 1 }
  };
  
  if (isCorrect) {
    updateData.correctAnswers = { increment: 1 };
  }
  
  return await prisma.user.update({
    where: { id: userId },
    data: updateData
  });
};

/**
 * 사용자에게 챗봇 메시지 전송
 * @param {object} prisma - Prisma 클라이언트
 * @param {string} userId - 사용자 ID
 * @param {string} message - 전송할 메시지
 * @returns {Promise<object>} 전송 결과
 */
const sendChatbotMessage = async (prisma, userId, message) => {
  try {
    // 사용자 정보 가져오기
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user || !user.kakaoId) {
      throw new Error('유효한 카카오 ID를 가진 사용자를 찾을 수 없습니다.');
    }
    
    // 실제 구현에서는 카카오에서 제공하는 API를 사용해야 함
    // 이 샘플 코드는 카카오 i 오픈빌더 API 연동이 필요
    console.log(`사용자 ${user.kakaoId}에게 챗봇 메시지를 전송합니다: "${message}"`);
    
    // 메시지 전송 로그 저장 (옵션)
    await prisma.messageLog.create({
      data: {
        userId: user.id,
        message,
        type: 'CHATBOT',
        status: 'SENT',
        sentAt: new Date()
      }
    }).catch(err => {
      // 로그 테이블이 없을 경우 무시 (옵션)
      console.warn('메시지 로그 저장 실패 (테이블이 없을 수 있음):', err.message);
    });
    
    return {
      success: true,
      userId: user.id,
      kakaoId: user.kakaoId,
      message,
      sentAt: new Date()
    };
  } catch (error) {
    console.error('챗봇 메시지 전송 중 오류 발생:', error);
    throw error;
  }
};

/**
 * 모든 구독자에게 챗봇 메시지 전송
 * @param {object} prisma - Prisma 클라이언트
 * @param {string} message - 전송할 메시지
 * @returns {Promise<object>} 전송 결과
 */
const sendMessageToAllSubscribers = async (prisma, message) => {
  try {
    // 모든 구독자 가져오기
    const subscribers = await prisma.user.findMany({
      where: { isSubscribed: true }
    });
    
    if (subscribers.length === 0) {
      return {
        success: true,
        message: '구독자가 없습니다.',
        sentCount: 0
      };
    }
    
    let sentCount = 0;
    let failedCount = 0;
    
    // 각 구독자에게 메시지 전송
    for (const user of subscribers) {
      try {
        if (user.kakaoId) {
          // 실제 메시지 전송 로직 구현 필요
          await sendChatbotMessage(prisma, user.id, message);
          sentCount++;
        }
        
        // 너무 많은 요청을 한 번에 보내지 않도록 잠시 대기
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`사용자 ${user.id}에게 메시지 전송 실패:`, error.message);
        failedCount++;
      }
    }
    
    return {
      success: true,
      message: `${sentCount}명의 사용자에게 메시지를 전송했습니다.`,
      sentCount,
      failedCount,
      totalSubscribers: subscribers.length
    };
  } catch (error) {
    console.error('구독자에게 메시지 전송 중 오류 발생:', error);
    throw error;
  }
};

/**
 * 임시 연동 코드 생성
 * @param {object} prisma - Prisma 클라이언트
 * @param {string} kakaoChannelId - 카카오 채널 사용자 ID
 * @returns {Promise<string>} 생성된 연동 코드
 */
const generateLinkCode = async (prisma, kakaoChannelId) => {
  try {
    // 6자리 랜덤 코드 생성
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 10); // 10분 후 만료
    
    // 기존 매핑 정보 조회
    let mapping = await prisma.userKakaoMapping.findUnique({
      where: { kakaoChannelId }
    });
    
    if (mapping) {
      // 기존 매핑이 있으면 연동 코드 업데이트
      await prisma.userKakaoMapping.update({
        where: { id: mapping.id },
        data: {
          linkCode: code,
          linkCodeExpiry: expiry
        }
      });
    } else {
      // 기존 매핑이 없는 경우, 임시 사용자 생성 후 매핑 추가
      const tempUser = await findOrCreateUser(prisma, kakaoChannelId);
      
      await prisma.userKakaoMapping.create({
        data: {
          userId: tempUser.id,
          kakaoChannelId,
          linkCode: code,
          linkCodeExpiry: expiry
        }
      });
    }
    
    return code;
  } catch (error) {
    console.error('연동 코드 생성 중 오류 발생:', error);
    throw error;
  }
};

/**
 * 연동 코드로 카카오 채널 ID 조회
 * @param {object} prisma - Prisma 클라이언트
 * @param {string} linkCode - 연동 코드
 * @returns {Promise<object|null>} 매핑 정보
 */
const getChannelMappingByCode = async (prisma, linkCode) => {
  try {
    const now = new Date();
    
    // 유효한 연동 코드 조회
    const mapping = await prisma.userKakaoMapping.findFirst({
      where: {
        linkCode,
        linkCodeExpiry: {
          gt: now // 만료 시간이 현재보다 큰 경우만
        }
      }
    });
    
    return mapping;
  } catch (error) {
    console.error('연동 코드 조회 중 오류 발생:', error);
    throw error;
  }
};

/**
 * 연동 코드 확인 및 사용자 계정 병합
 * @param {object} prisma - Prisma 클라이언트
 * @param {string} linkCode - 연동 코드
 * @param {number} userId - 웹사이트 사용자 ID
 * @returns {Promise<object>} 연동 결과
 */
const linkUserAccounts = async (prisma, linkCode, userId) => {
  try {
    // 유효한 연동 코드 조회
    const mapping = await getChannelMappingByCode(prisma, linkCode);
    
    if (!mapping) {
      return {
        success: false,
        message: '유효하지 않거나 만료된 연동 코드입니다.'
      };
    }
    
    // 채널 사용자와 웹사이트 사용자가 동일한 경우
    if (mapping.userId === userId) {
      return {
        success: true,
        message: '이미 연동된 계정입니다.',
        isAlreadyLinked: true
      };
    }
    
    // 채널 사용자의 응답 기록을 웹사이트 사용자에게 이관
    await Promise.all([
      // 응답 기록 이관
      prisma.response.updateMany({
        where: { userId: mapping.userId },
        data: { userId }
      }),
      
      // 매핑 정보 업데이트
      prisma.userKakaoMapping.update({
        where: { id: mapping.id },
        data: {
          userId,
          linkCode: null,
          linkCodeExpiry: null
        }
      })
    ]);
    
    // 이전 임시 사용자 정보 조회 (통계 병합을 위해)
    const tempUser = await prisma.user.findUnique({
      where: { id: mapping.userId },
      select: {
        totalAnswered: true,
        correctAnswers: true
      }
    });
    
    if (tempUser) {
      // 웹사이트 사용자 통계 업데이트 (병합)
      await prisma.user.update({
        where: { id: userId },
        data: {
          totalAnswered: { increment: tempUser.totalAnswered },
          correctAnswers: { increment: tempUser.correctAnswers }
        }
      });
      
      // 임시 사용자 삭제
      // await prisma.user.delete({
      //   where: { id: mapping.userId }
      // });
      
      // 참고: 실제 구현 시 임시 사용자 삭제는 신중하게 해야 함
      // 외래 키 제약 조건 때문에 관련 데이터를 모두 이관한 후에 삭제 필요
    }
    
    return {
      success: true,
      message: '계정이 성공적으로 연동되었습니다.',
      kakaoChannelId: mapping.kakaoChannelId
    };
  } catch (error) {
    console.error('계정 연동 중 오류 발생:', error);
    throw error;
  }
};

/**
 * 사용자의 정답률 통계 조회
 * @param {object} prisma - Prisma 클라이언트
 * @param {number} userId - 사용자 ID
 * @returns {Promise<Object>} 정답률 통계
 */
const getUserAccuracyStats = async (prisma, userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        totalAnswered: true,
        correctAnswers: true
      }
    });
    
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }
    
    const totalAnswered = user.totalAnswered || 0;
    const correctAnswers = user.correctAnswers || 0;
    const accuracy = totalAnswered > 0 
      ? ((correctAnswers / totalAnswered) * 100).toFixed(1) 
      : '0.0';
    
    return {
      totalAnswered,
      correctAnswers,
      accuracy
    };
  } catch (error) {
    console.error('사용자 정답률 통계 조회 중 오류:', error);
    throw error;
  }
};

/**
 * 사용자의 카테고리별 성과 조회
 * @param {object} prisma - Prisma 클라이언트
 * @param {number} userId - 사용자 ID
 * @returns {Promise<Object>} 카테고리별 성과 데이터
 */
const getUserCategoryPerformance = async (prisma, userId) => {
  try {
    // 카테고리 목록 조회
    const categories = await prisma.question.groupBy({
      by: ['category'],
      _count: {
        id: true
      }
    });
    
    // 사용자의 카테고리별 성과 계산
    const result = {};
    
    for (const { category } of categories) {
      // 특정 카테고리에 대한 사용자의 응답 조회
      const userResponses = await prisma.response.findMany({
        where: {
          userId,
          dailyQuestion: {
            question: {
              category
            }
          }
        },
        include: {
          dailyQuestion: {
            include: {
              question: true
            }
          }
        }
      });
      
      const totalAnswered = userResponses.length;
      const correctAnswers = userResponses.filter(r => r.isCorrect).length;
      
      if (totalAnswered > 0) {
        result[category] = {
          totalAnswered,
          correctAnswers,
          correctRate: totalAnswered > 0 
            ? ((correctAnswers / totalAnswered) * 100).toFixed(1) 
            : '0.0'
        };
      }
    }
    
    return result;
  } catch (error) {
    console.error('사용자 카테고리 성과 조회 중 오류:', error);
    throw error;
  }
};

/**
 * 사용자의 활동 캘린더(잔디) 통계 조회
 * @param {object} prisma - Prisma 클라이언트
 * @param {number} userId - 사용자 ID
 * @returns {Promise<Object>} 활동 캘린더 통계
 */
const getUserActivityStats = async (prisma, userId) => {
  try {
    // 전체 참여일 조회
    const activities = await prisma.activityCalendar.findMany({
      where: { userId },
      orderBy: { date: 'asc' }
    });
    
    const totalDays = activities.length;
    
    // 최장 연속일 및 현재 연속일 계산
    let longestStreak = 0;
    let currentStreak = 0;
    let lastDate = null;
    
    activities.forEach((activity, index) => {
      const currentDate = new Date(activity.date);
      
      // 첫 번째 기록이거나 직전 날짜와 연속적인 경우
      if (index === 0 || isConsecutiveDay(lastDate, currentDate)) {
        currentStreak++;
      } else {
        // 연속이 끊긴 경우
        currentStreak = 1;
      }
      
      // 최장 연속일 업데이트
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
      }
      
      lastDate = currentDate;
    });
    
    // 현재 연속일 계산 (오늘 기준)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (lastDate && isConsecutiveDay(lastDate, today)) {
      // 마지막 활동이 어제라면 연속 중
      // 현재 연속일은 그대로 유지
    } else if (lastDate && isSameDay(lastDate, today)) {
      // 마지막 활동이 오늘이라면 현재 연속일 유지
    } else {
      // 마지막 활동이 어제도 오늘도 아니라면 연속 끊김
      currentStreak = 0;
    }
    
    return {
      totalDays,
      longestStreak,
      currentStreak
    };
  } catch (error) {
    console.error('사용자 활동 통계 조회 중 오류:', error);
    throw error;
  }
};

/**
 * 두 날짜가 연속된 날인지 확인
 * @param {Date} date1 - 첫 번째 날짜
 * @param {Date} date2 - 두 번째 날짜
 * @returns {boolean} 연속된 날인지 여부
 */
const isConsecutiveDay = (date1, date2) => {
  if (!date1 || !date2) return false;
  
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  
  // 하루 차이 (86400000 밀리초 = 24시간)
  const diffDays = Math.round((d2 - d1) / 86400000);
  return diffDays === 1;
};

/**
 * 두 날짜가 같은 날인지 확인
 * @param {Date} date1 - 첫 번째 날짜
 * @param {Date} date2 - 두 번째 날짜
 * @returns {boolean} 같은 날인지 여부
 */
const isSameDay = (date1, date2) => {
  if (!date1 || !date2) return false;
  
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
};

/**
 * 오늘의 질문 통계 조회
 * @param {object} prisma - Prisma 클라이언트
 * @returns {Promise<Object>} 오늘의 질문 통계
 */
const getTodayQuestionStats = async (prisma) => {
  try {
    // 오늘의 질문 가져오기
    const todayQuestion = await getTodayQuestion(prisma);
    
    if (!todayQuestion) {
      throw new Error('오늘의 질문이 없습니다.');
    }
    
    // 응답 통계 조회
    const responses = await prisma.response.findMany({
      where: {
        dailyQuestionId: todayQuestion.id
      }
    });
    
    const totalResponses = responses.length;
    const correctResponses = responses.filter(r => r.isCorrect).length;
    const accuracy = totalResponses > 0 
      ? ((correctResponses / totalResponses) * 100).toFixed(1) 
      : '0.0';
    
    // 가장 많이 선택된 오답 찾기
    if (totalResponses > 0 && correctResponses < totalResponses) {
      // 선택지별 응답 수 집계
      const optionCounts = {};
      
      responses.forEach(response => {
        const optionIndex = response.answer;
        
        if (!response.isCorrect) {
          optionCounts[optionIndex] = (optionCounts[optionIndex] || 0) + 1;
        }
      });
      
      // 가장 많이 선택된 오답 찾기
      let mostCommonWrong = null;
      let maxCount = 0;
      
      Object.entries(optionCounts).forEach(([optionIndex, count]) => {
        if (count > maxCount) {
          mostCommonWrong = parseInt(optionIndex) + 1; // 1 기반 인덱스로 변환
          maxCount = count;
        }
      });
      
      return {
        totalResponses,
        correctResponses,
        accuracy,
        mostCommonWrong
      };
    }
    
    return {
      totalResponses,
      correctResponses,
      accuracy,
      mostCommonWrong: null
    };
  } catch (error) {
    console.error('오늘의 질문 통계 조회 중 오류:', error);
    throw error;
  }
};

/**
 * 최신 토론 목록 조회
 * @param {object} prisma - Prisma 클라이언트
 * @param {number} limit - 조회할 토론 수
 * @returns {Promise<Array>} 최신 토론 목록
 */
const getLatestDiscussions = async (prisma, limit = 5) => {
  try {
    const discussions = await prisma.discussion.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      select: {
        id: true,
        title: true,
        type: true,
        createdAt: true,
        _count: {
          select: {
            comments: true
          }
        }
      }
    });
    
    return discussions;
  } catch (error) {
    console.error('최신 토론 목록 조회 중 오류:', error);
    throw error;
  }
};

/**
 * 사용자 학습 모드 업데이트
 * @param {object} prisma - Prisma 클라이언트
 * @param {number} userId - 사용자 ID
 * @param {string} studyMode - 학습 모드 ('daily' 또는 'weekly')
 * @returns {Promise<Object>} 업데이트된 사용자 정보
 */
const updateUserStudyMode = async (prisma, userId, studyMode) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { studyMode }
    });
    
    return updatedUser;
  } catch (error) {
    console.error('사용자 학습 모드 업데이트 중 오류:', error);
    throw error;
  }
};

/**
 * 현재 주차 계산
 * @returns {number} 현재 주차 번호
 */
const getCurrentWeekNumber = () => {
  const startDate = new Date(2025, 4, 1);
  const currentDate = new Date();
  const diffTime = Math.abs(currentDate - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const currentWeek = Math.ceil(diffDays / 7);
  return currentWeek;
};

/**
 * 주간 퀴즈 목록 조회
 * @param {object} prisma - Prisma 클라이언트
 * @param {number} weekNumber - 주차 번호 (없으면 현재 주차)
 * @returns {Promise<Array>} 주간 퀴즈 목록
 */
const getWeeklyQuizzes = async (prisma, weekNumber = null) => {
  // 주차 설정
  const week = weekNumber || getCurrentWeekNumber();
  
  const quizzes = await prisma.weeklyQuiz.findMany({
    where: {
      weekNumber: week,
      active: true
    },
    orderBy: { quizNumber: 'asc' }
  });
  
  return { week, quizzes };
};

/**
 * 특정 주차, 번호의 주간 퀴즈 조회
 * @param {object} prisma - Prisma 클라이언트
 * @param {number} weekNumber - 주차 번호
 * @param {number} quizNumber - 퀴즈 번호
 * @returns {Promise<Object|null>} 주간 퀴즈
 */
const getWeeklyQuizByNumber = async (prisma, weekNumber, quizNumber) => {
  return await prisma.weeklyQuiz.findFirst({
    where: {
      weekNumber,
      quizNumber,
      active: true
    }
  });
};

/**
 * 주간 퀴즈 응답 생성
 * @param {object} prisma - Prisma 클라이언트
 * @param {number} userId - 사용자 ID
 * @param {number} weeklyQuizId - 주간 퀴즈 ID
 * @param {number} answer - 사용자 응답 (0-based index)
 * @returns {Promise<Object>} 응답 정보
 */
const createWeeklyQuizResponse = async (prisma, userId, weeklyQuizId, answer) => {
  // 퀴즈 정보 조회
  const quiz = await prisma.weeklyQuiz.findUnique({
    where: { id: weeklyQuizId }
  });
  
  if (!quiz) {
    throw new Error('해당 퀴즈를 찾을 수 없습니다.');
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
  
  // 정답 여부 확인
  const isCorrect = quiz.correctOption === answer;
  
  // 응답 저장
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
    quiz,
    isCorrect
  };
};

/**
 * 사용자의 주간 퀴즈 응답 현황 조회
 * @param {object} prisma - Prisma 클라이언트
 * @param {number} userId - 사용자 ID
 * @param {number} weekNumber - 주차 번호 (없으면 현재 주차)
 * @returns {Promise<Object>} 응답 현황
 */
const getUserWeeklyResponses = async (prisma, userId, weekNumber = null) => {
  // 주차 설정
  const week = weekNumber || getCurrentWeekNumber();
  
  // 해당 주차의 퀴즈 목록 조회
  const { quizzes } = await getWeeklyQuizzes(prisma, week);
  
  // 사용자 응답 조회
  const responses = await prisma.weeklyResponse.findMany({
    where: {
      userId,
      weeklyQuiz: {
        weekNumber: week
      }
    },
    include: {
      weeklyQuiz: true
    }
  });
  
  // 응답 맵 생성
  const responseMap = {};
  quizzes.forEach(quiz => {
    responseMap[quiz.quizNumber] = {
      quizId: quiz.id,
      answered: false
    };
  });
  
  responses.forEach(resp => {
    responseMap[resp.weeklyQuiz.quizNumber] = {
      quizId: resp.weeklyQuizId,
      answered: true,
      isCorrect: resp.isCorrect,
      answer: resp.answer
    };
  });
  
  // 다음 풀어야 할 문제 번호 찾기
  let nextQuizNumber = null;
  for (let i = 1; i <= 7; i++) {
    if (responseMap[i] && !responseMap[i].answered) {
      nextQuizNumber = i;
      break;
    }
  }
  
  return {
    week,
    responses: responseMap,
    nextQuizNumber,
    progress: {
      total: quizzes.length,
      answered: responses.length,
      correct: responses.filter(r => r.isCorrect).length
    }
  };
};

/**
 * 오늘의 CS 지식 컨텐츠 조회
 * @param {object} prisma - Prisma 클라이언트
 * @returns {Promise<Object|null>} 최신 CS 컨텐츠
 */
const getTodayCSContent = async (prisma) => {
  return await prisma.cSContent.findFirst({
    orderBy: { sendDate: 'desc' },
    take: 1
  });
};



module.exports = {
  findOrCreateUser,
  getTodayQuestion,
  getUserResponseForQuestion,
  createResponse,
  updateUserStats,
  sendChatbotMessage,
  sendMessageToAllSubscribers,
  generateLinkCode,
  getChannelMappingByCode,
  linkUserAccounts,
  getUserAccuracyStats,
  getUserCategoryPerformance,
  getUserActivityStats,
  getTodayQuestionStats,
  getLatestDiscussions,
  updateUserStudyMode,
  getCurrentWeekNumber,
  getWeeklyQuizzes,
  getWeeklyQuizByNumber,
  createWeeklyQuizResponse,
  getUserWeeklyResponses,
  getTodayCSContent
};