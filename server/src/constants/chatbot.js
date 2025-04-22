const RESPONSE_MESSAGES = {
    INVALID_REQUEST: '유효하지 않은 요청입니다.',
    WELCOME: '안녕하세요! CS Morning 챗봇입니다.🤖\n\n다음 명령어를 사용할 수 있어요🤔:\n\n- 오늘의 질문: 오늘의 CS 질문을 받아볼 수 있어요.\n- 구독하기: CS Morning을 구독합니다.\n- 도움말: CS Morning의 사용법을 안내합니다.\n- 계정 연동: CS Morning 웹사이트와 계정을 연동합니다.\n\n원하는 명령어를 입력해보세요!',
    NO_QUESTION: '오늘의 질문이 아직 준비되지 않았습니다. 잠시 후 다시 시도해주세요!',
    INVALID_OPTIONS: '선택지 형식이 올바르지 않습니다.',
    NO_ACTIVE_QUESTION: "현재 답변할 수 있는 질문이 없습니다. '오늘의 질문'을 먼저 요청해주세요.",
    ANSWER_OUT_OF_RANGE: (length) => `1부터 ${length} 사이의 번호로 답변해주세요.`,
    CORRECT_ANSWER: (explanation) => `정답입니다! 👏\n\n[설명💡]\n\n${explanation}`,
    WRONG_ANSWER: (correctIndex, explanation) => `아쉽게도 오답입니다. 😢\n\n정답은 ${correctIndex + 1}번입니다.\n\n[설명💡]\n\n${explanation}`,
    SUBSCRIBE_SUCCESS: 'CS Morning을 구독해주셔서 감사합니다! 매일 아침 8시에 CS 지식을 보내드립니다.',
    UNSUBSCRIBE_SUCCESS: 'CS Morning 구독이 취소되었습니다. 언제든지 다시 구독하실 수 있습니다.',
    UNKNOWN_COMMAND: "죄송합니다. 이해하지 못했어요. '도움말'을 입력하시면 사용 가능한 명령어를 확인할 수 있습니다.",
    ACCOUNT_LINKED: '이미 계정이 연동되어 있습니다. CS Morning 웹사이트에서 동일한 계정으로 서비스를 이용하실 수 있습니다.',
    LINK_CODE_GENERATED: (linkCode) => `계정 연동 코드가 생성되었습니다.\n\n코드: ${linkCode}\n\n아래 '계정 연동하기' 버튼을 클릭하면 자동으로 연동됩니다. 또는 CS Morning 웹사이트에서 계정 연동 메뉴를 선택한 후 이 코드를 입력해주세요. 연동 코드는 10분간 유효합니다.`,
    ERROR: '요청 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    LINKING_ERROR: '계정 연동 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    LINK_CODE_ERROR: '계정 연동 코드 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    TEST: '테스트 응답입니다.'
  };
  
  const QUICK_REPLIES = {
    DEFAULT: [
      {
        label: '오늘의 질문',
        action: 'message',
        messageText: '오늘의 질문',
      },
      {
        label: '구독하기',
        action: 'message',
        messageText: '구독',
      },
      {
        label: '도움말',
        action: 'message',
        messageText: '도움말',
      },
      {
        label: '계정 연동',
        action: 'message',
        messageText: '계정 연동',
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
        label: '구독하기',
        action: 'message',
        messageText: '구독',
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
        label: '도움말',
        action: 'message',
        messageText: '도움말',
      }
    ]
  };