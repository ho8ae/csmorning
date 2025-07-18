// constants/chatbot.js 파일에 다음 내용 추가
const RESPONSE_MESSAGES = {
  INVALID_REQUEST: '유효하지 않은 요청입니다.',
  WELCOME: '안녕하세요! CS Morning 챗봇입니다.🤖\n\n다음 명령어를 사용할 수 있어요🤔:\n\n- 오늘의 질문: 오늘의 CS 질문을 받아볼 수 있어요.\n- 주간 퀴즈: 주간 모드 사용자는 일요일에 주간 퀴즈를 풀 수 있어요.\n- 학습 모드 변경: 매일 모드와 주간 모드 중 선택할 수 있습니다.\n- 구독하기: CS Morning을 구독합니다.\n- 계정 연동: CS Morning 웹사이트와 계정을 연동합니다.\n- 기능 맛보기: CS Morning의 다양한 기능을 확인해보세요.\n\n원하는 명령어를 입력해보세요!\n\n또는\n\n "안녕"을 입력하면 처음으로 돌아갑니다.',
  NO_QUESTION: '오늘의 질문이 아직 준비되지 않았습니다. 잠시 후 다시 시도해주세요!',
  INVALID_OPTIONS: '선택지 형식이 올바르지 않습니다.',
  NO_ACTIVE_QUESTION: "현재 답변할 수 있는 질문이 없습니다. '오늘의 질문'을 먼저 요청해주세요.",
  ANSWER_OUT_OF_RANGE: (length) => `1부터 ${length} 사이의 번호로 답변해주세요.`,
  CORRECT_ANSWER: (explanation) => `정답입니다! 👏\n\n[설명💡]\n\n${explanation}`,
  WRONG_ANSWER: (correctIndex, explanation) => `아쉽게도 오답입니다. 😢\n\n정답은 ${correctIndex + 1}번입니다.\n\n[설명💡]\n\n${explanation}`,
  SUBSCRIBE_SUCCESS: 'CS Morning을 구독해주셔서 감사합니다! 매일 아침 8시에 CS 지식을 보내드립니다.',
  UNSUBSCRIBE_SUCCESS: 'CS Morning 구독이 취소되었습니다. 언제든지 다시 구독하실 수 있습니다.',
  UNKNOWN_COMMAND: "죄송합니다. 이해하지 못했어요. '도움말'을 입력하시면 사용 가능한 명령어를 확인할 수 있습니다.\n\n 또는 '안녕'을 입력하면 처음으로 돌아갑니다.",
  ACCOUNT_LINKED: '이미 계정이 연동되어 있습니다. CS Morning 웹사이트에서 동일한 계정으로 서비스를 이용하실 수 있습니다.',
  LINK_CODE_GENERATED: (linkCode) => `계정 연동 코드가 생성되었습니다.\n\n코드: ${linkCode}\n\n아래 '계정 연동하기' 버튼을 클릭하면 자동으로 연동됩니다. 또는 CS Morning 웹사이트에서 계정 연동 메뉴를 선택한 후 이 코드를 입력해주세요. 연동 코드는 10분간 유효합니다.`,
  ERROR: '요청 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  LINKING_ERROR: '계정 연동 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  LINK_CODE_ERROR: '계정 연동 코드 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  TEST: '테스트 응답입니다.',
  WELCOME: '안녕하세요! CS Morning 챗봇입니다.🤖\n\n다음 명령어를 사용할 수 있어요🤔:\n\n- 오늘의 질문: 오늘의 CS 질문을 받아볼 수 있어요.\n- 주간 퀴즈: 주간 모드 사용자는 일요일에 주간 퀴즈를 풀 수 있어요.\n- 학습 모드 변경: 매일 모드와 주간 모드 중 선택할 수 있습니다.\n- 구독하기: CS Morning을 구독합니다.\n- 계정 연동: CS Morning 웹사이트와 계정을 연동합니다.\n- 기능 맛보기: CS Morning의 다양한 기능을 확인해보세요.\n\n원하는 명령어를 입력해보세요!',
  
  STUDY_MODE_INFO: '학습 모드에는 두 가지가 있습니다:\n\n1️⃣ 매일 모드: 매일 하나의 CS 문제가 제공됩니다.\n2️⃣ 주간 모드: 매일 CS 지식이 제공되고, 주말에 해당 주제의 문제 7개를 풀 수 있습니다.\n\n현재 모드를 변경하려면 "학습 모드 변경"을 입력하세요.',

  MODE_CHANGED_DAILY: '학습 모드가 매일 모드로 변경되었습니다. 매일 8시에 오늘의 질문이 전송됩니다.',
  
  MODE_CHANGED_WEEKLY: '학습 모드가 주간 모드로 변경되었습니다. 매일 8시에 CS 지식이 전송되며, 일요일에는 주간 퀴즈가 제공됩니다.',
  
  WEEKLY_QUIZ_NOT_AVAILABLE: '주간 퀴즈는 주간 모드에서만 사용할 수 있습니다. "학습 모드 변경"을 입력하여 모드를 변경할 수 있습니다.',
  
  WEEKLY_QUIZ_COMPLETED: (week, correct, total) => `🎉 ${week}주차 주간 퀴즈를 모두 완료했습니다!\n\n정답 수: ${correct}/${total}\n정답률: ${((correct/total)*100).toFixed(1)}%\n\n다음 주차의 퀴즈를 기대해주세요!`,
  
  WEEKLY_QUIZ_PROGRESS: (answered) => `현재 ${answered}개의 문제를 풀었습니다. 나머지 문제는 아직 준비 중입니다.`,
  
  WEEKLY_QUIZ_FORMAT_ERROR: "올바른 답변 형식이 아닙니다. '주간 퀴즈'를 입력하여 다시 시도해주세요.",
  
  WEEKLY_QUIZ_NOT_FOUND: "해당 번호의 퀴즈를 찾을 수 없습니다. '주간 퀴즈'를 입력하여 다시 시도해주세요.",
  
  WEEKLY_QUIZ_ALREADY_ANSWERED: "이미 답변한 문제입니다. '주간 퀴즈'를 입력하여 다음 문제로 진행해주세요.",
  
  TODAY_CS_CONTENT: (title, content) => `오늘의 CS 지식입니다!\n\n[${title}]\n\n${content.substring(0, 200)}...\n\n자세한 내용은 웹사이트에서 확인하세요. 매주 일요일 주간 퀴즈에서 이번 주 배운 내용을 테스트합니다!`,
  
  NO_CS_CONTENT: '오늘의 CS 지식이 아직 준비되지 않았습니다. 잠시 후 다시 시도해주세요!',


  // 기능 맛보기 관련 메시지 추가
  FEATURE_PREVIEW: '🔍 CS Morning의 다양한 기능을 확인해보세요!\n\n아래 버튼을 통해 원하는 기능을 선택할 수 있습니다:\n\n• 내 정답률 확인하기\n• 카테고리별 성과 확인하기\n• 내 활동 캘린더 보기\n• 오늘의 질문 정답률 보기\n• 최신 토론 확인하기\n\n원하는 기능을 선택해주세요!',
  
  // 내 정답률 확인 메시지
  MY_ACCURACY: (totalAnswered, correctAnswers, accuracy) => 
    `📊 내 정답률 통계\n\n총 응답 수: ${totalAnswered}개\n정답 수: ${correctAnswers}개\n정답률: ${accuracy}%\n\n꾸준한 학습으로 정답률을 높여보세요! 매일 아침 오늘의 질문에 답하면 CS 지식이 쌓입니다.`,
  
  // 카테고리별 성과
  CATEGORY_PERFORMANCE: (categoryStats) => {
    let message = '📚 카테고리별 성과\n\n';
    
    // 카테고리별 성과가 없는 경우
    if (Object.keys(categoryStats).length === 0) {
      return message + '아직 카테고리별 성과 데이터가 없습니다. 더 많은 질문에 답변해보세요!';
    }
    
    for (const [category, stats] of Object.entries(categoryStats)) {
      message += `${category}: ${stats.correctRate}% (${stats.correctAnswers}/${stats.totalAnswered})\n`;
    }
    
    message += '\n어떤 카테고리가 약한지 확인하고 집중적으로 학습해보세요!';
    return message;
  },
  
  // 내 활동 캘린더
  ACTIVITY_CALENDAR: (totalDays, longestStreak, currentStreak) => 
    `🗓️ 내 활동 캘린더\n\n참여일: 총 ${totalDays}일\n최장 연속일: ${longestStreak}일\n현재 연속일: ${currentStreak}일\n\n웹사이트(https://csmorning.co.kr)에서 더 자세한 활동 기록(잔디)을 확인할 수 있습니다.\n\n꾸준한 학습이 실력 향상의 비결입니다!`,
  
  // 오늘의 질문 정답률
  TODAY_QUESTION_STATS: (totalResponses, correctResponses, accuracy, mostCommonWrong) => 
    `📝 오늘의 질문 통계\n\n응답자 수: ${totalResponses}명\n정답자 수: ${correctResponses}명\n전체 정답률: ${accuracy}%\n\n${mostCommonWrong ? `가장 많이 선택한 오답: ${mostCommonWrong}번` : ''}\n\n다른 사용자들과 함께 CS 지식을 쌓아가세요!`,
  
  // 최신 토론
  LATEST_DISCUSSIONS: (discussions) => {
    let message = '💬 최신 토론 주제\n\n';
    
    if (discussions.length === 0) {
      return message + '현재 진행 중인 토론이 없습니다. 웹사이트에서 새 토론을 시작해보세요!';
    }
    
    discussions.forEach((discussion, index) => {
      message += `${index + 1}. ${discussion.title}\n`;
      if (index < discussions.length - 1) {
        message += '\n';
      }
    });
    
    message += '\n웹사이트(https://csmorning.co.kr)에서 토론에 참여해보세요!';
    return message;
  },
  
  // 계정 연동 필요 메시지
  ACCOUNT_LINKING_REQUIRED: '이 기능을 사용하려면 계정 연동이 필요합니다. "계정 연동" 명령어를 입력하여 연동을 진행해주세요.'
};

const QUICK_REPLIES = {
  DEFAULT: [
    {
      label: '오늘의 질문',
      action: 'message',
      messageText: '오늘의 질문',
    },
    {
      label: '오늘의 CS',
      action: 'message',
      messageText: 'CS 지식',
    },
    {
      label: '구독하기',
      action: 'message',
      messageText: '구독',
    },
    {
      label: '기능 맛보기',
      action: 'message',
      messageText: '기능 맛보기',
    },
    {
      label: '계정 연동',
      action: 'message',
      messageText: '계정 연동',
    },
    {
      label: '주간 퀴즈',
      action: 'message',
      messageText: '주간 퀴즈',
    },
    {
      label: '모드 변경',
      action: 'message',
      messageText: '모드 변경',
    },
  ],
  AFTER_ANSWER: [
    {
      label: '다음 질문(아직 X)',
      action: 'message',
      messageText: '오늘의 질문',
    },
    {
      label: '오늘의 질문',
      action: 'message',
      messageText: '오늘의 질문',
    },
    {
      label: '기능 맛보기',
      action: 'message',
      messageText: '기능 맛보기',
    },
    {
      label: '도움말',
      action: 'message',
      messageText: '도움말',
    },
  ],
  AFTER_LINK: [
    {
      label: '오늘의 질문',
      action: 'message',
      messageText: '오늘의 질문',
    },
    {
      label: '기능 맛보기',
      action: 'message',
      messageText: '기능 맛보기',
    },
    {
      label: '도움말',
      action: 'message',
      messageText: '도움말',
    }
  ],
  // 기능 맛보기 메뉴
  FEATURE_PREVIEW: [
    {
      label: '내 정답률 확인',
      action: 'message',
      messageText: '내 정답률 확인',
    },
    {
      label: '카테고리별 성과',
      action: 'message',
      messageText: '카테고리별 성과',
    },
    {
      label: '내 활동 캘린더',
      action: 'message',
      messageText: '내 활동 캘린더',
    },
    {
      label: '오늘의 질문 통계',
      action: 'message',
      messageText: '질문 통계',
    },
    {
      label: '최신 토론 확인',
      action: 'message',
      messageText: '최신 토론 확인',
    },
  ],
  // 기능 조회 후 버튼
  AFTER_FEATURE: [
    {
      label: '기능 맛보기',
      action: 'message',
      messageText: '기능 맛보기',
    },
    {
      label: '오늘의 질문',
      action: 'message',
      messageText: '오늘의 질문',
    },
    {
      label: '도움말',
      action: 'message',
      messageText: '도움말',
    },
  ],
  STUDY_MODE_SELECT: [
    {
      label: '매일 모드',
      action: 'message',
      messageText: '매일 모드로 변경',
    },
    {
      label: '주간 모드',
      action: 'message',
      messageText: '주간 모드로 변경',
    },
    {
      label: '도움말',
      action: 'message',
      messageText: '도움말',
    }
  ],
  
  WEEKLY_QUIZ: [
    {
      label: '주간 퀴즈',
      action: 'message',
      messageText: '주간 퀴즈',
    },
    {
      label: '오늘의 질문',
      action: 'message', 
      messageText: '오늘의 질문',
    },
    {
      label: '도움말',
      action: 'message',
      messageText: '도움말',
    }
  ],
  
  AFTER_WEEKLY_QUIZ: [
    {
      label: '다음 문제',
      action: 'message',
      messageText: '주간 퀴즈',
    },
    {
      label: '도움말',
      action: 'message',
      messageText: '도움말',
    }
  ]
};

module.exports = {
  RESPONSE_MESSAGES,
  QUICK_REPLIES
};