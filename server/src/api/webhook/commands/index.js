const accountCommands = require('./account.commands');
const questionCommands = require('./question.commands');
const quizCommands = require('./quiz.commands');
const contentCommands = require('./content.commands');
const featuresCommands = require('./features.commands');

// 명령어 핸들러 매핑
const commandHandlers = {
  // 일반 명령어
  '안녕': { handler: accountCommands.handleHelpCommand, category: 'general' },
  '시작': { handler: accountCommands.handleHelpCommand, category: 'general' },
  '도움말': { handler: accountCommands.handleHelpCommand, category: 'general' },
  
  // 질문 관련
  '오늘의 질문': { handler: questionCommands.handleTodayQuestionCommand, category: 'question' },
  '문제': { handler: questionCommands.handleTodayQuestionCommand, category: 'question' },
  
  // CS 지식 관련
  '오늘의 CS 지식': { handler: contentCommands.handleTodayCSContentCommand, category: 'content' },
  'CS 지식': { handler: contentCommands.handleTodayCSContentCommand, category: 'content' },
  
  // 주간 퀴즈 관련
  '주간 퀴즈': { handler: quizCommands.handleWeeklyQuizCommand, category: 'quiz' },
  '주간퀴즈': { handler: quizCommands.handleWeeklyQuizCommand, category: 'quiz' },
  '일요일 퀴즈': { handler: quizCommands.handleWeeklyQuizCommand, category: 'quiz' },
  '주간 모드 퀴즈': { handler: quizCommands.handleWeeklyQuizCommand, category: 'quiz' },
  
  // 계정 관련
  '계정 연동': { handler: accountCommands.handleAccountLinkCommand, category: 'account' },
  '구독': { handler: accountCommands.handleSubscriptionCommand, category: 'account' },
  '구독 취소': { handler: accountCommands.handleSubscriptionCommand, category: 'account' },
  '구독 해지': { handler: accountCommands.handleSubscriptionCommand, category: 'account' },
  
  // 학습 모드
  '학습 모드': { handler: accountCommands.handleStudyModeCommand, category: 'mode' },
  '모드 변경': { handler: accountCommands.handleStudyModeCommand, category: 'mode' },
  '매일 모드': { handler: accountCommands.handleStudyModeCommand, category: 'mode' },
  '주간 모드': { handler: accountCommands.handleStudyModeCommand, category: 'mode' },
  
  // 기능 맛보기
  '기능 맛보기': { handler: featuresCommands.handleFeaturePreviewCommand, category: 'features' },
  '기능맛보기': { handler: featuresCommands.handleFeaturePreviewCommand, category: 'features' },
  '내 정답률': { handler: featuresCommands.handleMyAccuracyCommand, category: 'features' },
  '카테고리별 성과': { handler: featuresCommands.handleCategoryPerformanceCommand, category: 'features' },
  '내 활동 캘린더': { handler: featuresCommands.handleActivityCalendarCommand, category: 'features' },
  '활동 캘린더': { handler: featuresCommands.handleActivityCalendarCommand, category: 'features' },
  '오늘 질문 통계': { handler: featuresCommands.handleTodayQuestionStatsCommand, category: 'features' },
  '질문 통계': { handler: featuresCommands.handleTodayQuestionStatsCommand, category: 'features' },
  '최신 토론': { handler: featuresCommands.handleLatestDiscussionsCommand, category: 'features' },
};

// 특수 패턴 핸들러
const patternHandlers = [
  {
    pattern: /^[1-9]\d*$/,
    handler: questionCommands.handleAnswerCommand,
    category: 'answer',
  },
  {
    pattern: /주간퀴즈답변\s+(\d+)번\s+(\d+)/,
    handler: quizCommands.handleWeeklyQuizAnswerCommand,
    category: 'quiz',
  }
];

/**
 * 입력된 메시지에 맞는 핸들러 찾기
 */
const findCommandHandler = (utterance) => {
  // 정확한 명령어 매칭
  for (const [command, handlerInfo] of Object.entries(commandHandlers)) {
    if (utterance.includes(command)) {
      return {
        handler: handlerInfo.handler,
        command: command,
        category: handlerInfo.category
      };
    }
  }
  
  // 패턴 매칭
  for (const patternHandler of patternHandlers) {
    const match = utterance.match(patternHandler.pattern);
    if (match) {
      return {
        handler: patternHandler.handler,
        match: match,
        category: patternHandler.category
      };
    }
  }
  
  // 매칭되는 명령어가 없음
  return null;
};

module.exports = {
  findCommandHandler
};