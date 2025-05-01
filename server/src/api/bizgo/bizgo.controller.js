// src/api/bizgo/bizgo.controller.js
const bizgoService = require('./bizgo.service');

/**
 * 테스트용 알림톡 단일 사용자에게 발송
 */
async function sendTestAlimTalk(req, res, next) {
  try {
    const { phoneNumber, content, buttons, title, subtitle, quickReplies } = req.body;
    
    const result = await bizgoService.sendAlimTalk(phoneNumber, content, buttons, title, subtitle, quickReplies);
    
    return res.status(200).json({
      success: true,
      message: '알림톡이 성공적으로 전송되었습니다.',
      data: result
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 테스트용 친구톡 단일 사용자에게 발송
 */
async function sendTestFriendTalk(req, res, next) {
  try {
    const { phoneNumber, content, buttons } = req.body;
    
    const result = await bizgoService.sendFriendTalk(phoneNumber, content, buttons);
    
    return res.status(200).json({
      success: true,
      message: '친구톡이 성공적으로 전송되었습니다.',
      data: result
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 모든 구독자에게 알림톡 발송
 */
async function sendAlimTalkToAll(req, res, next) {
  try {
    const { content, buttons, title, subtitle } = req.body;
    
    const result = await bizgoService.sendAlimTalkToAllSubscribers(content, buttons, title, subtitle);
    
    return res.status(200).json({
      success: true,
      message: `${result.sentCount}명의 사용자에게 알림톡이 전송되었습니다.`,
      data: result
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 토큰 상태 확인
 */
async function checkTokenStatus(req, res, next) {
  try {
    const token = await bizgoService.getToken();
    
    return res.status(200).json({
      success: true,
      message: 'Bizgo API 토큰이 정상적으로 발급되었습니다.',
      data: {
        token: token ? '**********' + token.substring(token.length - 5) : null, // 토큰 일부만 표시
        hasToken: !!token
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 테스트용 통합메시지 알림톡 발송
 */
async function sendTestOmniMessage(req, res, next) {
  try {
    const { phoneNumber, content, buttons, title, subtitle, quickReplies, enableFallback, fallbackText } = req.body;
    
    const messageOptions = {
      content,
      buttons,
      title,
      subtitle,
      quickReplies,
      enableFallback,
      fallbackText
    };
    
    const result = await bizgoService.sendOmniMessage(phoneNumber, messageOptions);
    
    return res.status(200).json({
      success: true,
      message: '통합메시지가 성공적으로 전송되었습니다.',
      data: result
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 테스트용 오늘의 질문 알림톡 발송
 */
async function sendTestDailyQuestion(req, res, next) {
  try {
    const { phoneNumber, userName } = req.body;
    
    // 오늘의 질문 데이터를 직접 데이터베이스에서 가져오기
    const questionService = require('../question/question.service');
    const questionData = await questionService.getTodayQuestion(req.prisma);
    
    if (!questionData) {
      return res.status(404).json({
        success: false,
        message: '오늘의 질문 데이터가 없습니다.'
      });
    }
    
    // 알림톡 전송
    const result = await bizgoService.sendDailyQuestionAlimTalk(
      questionData, 
      phoneNumber, 
      nincName || '고객'
    );
    
    return res.status(200).json({
      success: true,
      message: '오늘의 질문 알림톡이 성공적으로 전송되었습니다.',
      data: result
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 모든 구독자에게 오늘의 질문 알림톡 발송
 */
async function sendDailyQuestionToAll(req, res, next) {
  try {
    const result = await bizgoService.sendDailyQuestionToAllSubscribers(req.prisma);
    
    return res.status(200).json({
      success: true,
      message: `${result.sentCount}명의 사용자에게 오늘의 질문 알림톡이 전송되었습니다.`,
      data: result
    });
  } catch (error) {
    next(error);
  }
}


/**
 * 테스트용 주간 퀴즈 알림톡 발송
 */
async function sendTestWeeklyQuiz(req, res, next) {
  try {
    const { phoneNumber, userName, weekNumber } = req.body;
    
    const week = weekNumber || getCurrentWeekNumber();
    
    // 알림톡 전송
    const result = await bizgoService.sendWeeklyQuizAlimTalk(
      week, 
      phoneNumber, 
      userName || '고객'
    );
    
    return res.status(200).json({
      success: true,
      message: '주간 퀴즈 알림톡이 성공적으로 전송되었습니다.',
      data: result
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 테스트용 CS 지식 알림톡 발송
 */
async function sendTestCSContent(req, res, next) {
  try {
    const { phoneNumber, userName, csContentId } = req.body;
    
    // CS 컨텐츠 가져오기
    let csContent;
    if (csContentId) {
      csContent = await req.prisma.cSContent.findUnique({
        where: { id: csContentId }
      });
    } else {
      csContent = await req.prisma.cSContent.findFirst({
        orderBy: { sendDate: 'desc' }
      });
    }
    
    if (!csContent) {
      return res.status(404).json({
        success: false,
        message: 'CS 컨텐츠를 찾을 수 없습니다.'
      });
    }
    
    // 알림톡 전송
    const result = await bizgoService.sendDailyCSContentAlimTalk(
      csContent, 
      phoneNumber, 
      userName || '고객'
    );
    
    return res.status(200).json({
      success: true,
      message: 'CS 지식 알림톡이 성공적으로 전송되었습니다.',
      data: result
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 모든 구독자에게 CS 지식 알림톡 발송
 */
async function sendCSContentToAll(req, res, next) {
  try {
    const { mode, csContentId } = req.body;
    
    // 모드 기본값 설정
    const studyMode = mode || 'weekly';
    
    // CS 컨텐츠 가져오기
    let csContent;
    if (csContentId) {
      csContent = await req.prisma.cSContent.findUnique({
        where: { id: csContentId }
      });
    } else {
      csContent = await req.prisma.cSContent.findFirst({
        orderBy: { sendDate: 'desc' }
      });
    }
    
    if (!csContent) {
      return res.status(404).json({
        success: false,
        message: 'CS 컨텐츠를 찾을 수 없습니다.'
      });
    }
    
    // 알림톡 전송
    const result = await bizgoService.sendDailyCSContentToSubscribers(
      req.prisma,
      studyMode,
      csContent
    );
    
    return res.status(200).json({
      success: true,
      message: `${result.sentCount}명의 ${studyMode} 모드 사용자에게 CS 지식 알림톡이 전송되었습니다.`,
      data: result
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 모든 구독자에게 주간 퀴즈 알림톡 발송
 */
async function sendWeeklyQuizToAll(req, res, next) {
  try {
    const { mode } = req.body;
    
    // 모드 기본값 설정
    const studyMode = mode || 'weekly';
    
    // 알림톡 전송
    const result = await bizgoService.sendWeeklyQuizToSubscribers(
      req.prisma,
      studyMode
    );
    
    return res.status(200).json({
      success: true,
      message: `${result.sentCount}명의 ${studyMode} 모드 사용자에게 주간 퀴즈 알림톡이 전송되었습니다.`,
      data: result
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 현재 주차 계산
 */
function getCurrentWeekNumber() {
  const startDate = new Date(2023, 0, 1);
  const currentDate = new Date();
  const diffTime = Math.abs(currentDate - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const currentWeek = Math.ceil(diffDays / 7);
  return currentWeek;
}

module.exports = {
  sendTestAlimTalk,
  sendTestFriendTalk,
  sendAlimTalkToAll,
  checkTokenStatus,
  sendTestOmniMessage,
  sendTestDailyQuestion,
  sendDailyQuestionToAll,
  sendTestWeeklyQuiz,
  sendWeeklyQuizToAll,
  sendTestCSContent,
  sendCSContentToAll
};