// src/services/content.service.js
const { prisma } = require('../config/db');

// CS 주제 목록 (데이터베이스에 질문이 없을 때 사용)
const CS_TOPICS = [
  { category: '자료구조', topics: ['배열', '연결 리스트', '스택', '큐', '해시 테이블', '트리', '힙', '그래프'] },
  { category: '알고리즘', topics: ['정렬 알고리즘', '탐색 알고리즘', '그리디 알고리즘', '동적 프로그래밍', 'DFS와 BFS', '최단 경로 알고리즘'] },
  { category: '네트워크', topics: ['TCP/IP', 'HTTP/HTTPS', 'REST API', '소켓 프로그래밍', 'OSI 7계층', 'DNS', 'CDN'] },
  { category: '운영체제', topics: ['프로세스와 스레드', '스케줄링', '메모리 관리', '가상 메모리', '동기화', '교착 상태'] },
  { category: '데이터베이스', topics: ['SQL', '인덱스', '트랜잭션', '정규화', 'NoSQL', 'ACID', 'Redis'] },
  { category: '디자인 패턴', topics: ['싱글톤', '팩토리', '옵저버', 'MVC', '의존성 주입', '전략 패턴'] },
  { category: '웹 개발', topics: ['브라우저 렌더링', 'DOM', '이벤트 루프', 'CORS', 'JWT', '인증과 인가', 'SPA'] },
];

/**
 * CS 컨텐츠 생성
 * @returns {Promise<string>} 생성된 CS 컨텐츠
 */
exports.generateCsContent = async () => {
  try {
    // 오늘의 질문 가져오기
    const todayQuestion = await prisma.dailyQuestion.findFirst({
      where: {
        sentDate: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      },
      include: {
        question: true
      },
      orderBy: {
        sentDate: 'desc'
      }
    });

    // 오늘의 질문이 있으면 그 내용을 사용
    if (todayQuestion) {
      const question = todayQuestion.question;
      return `[${question.category}] ${question.text}\n\n${question.explanation}`;
    }

    // 오늘의 질문이 없으면 랜덤 주제 선택
    const randomCategoryIndex = Math.floor(Math.random() * CS_TOPICS.length);
    const selectedCategory = CS_TOPICS[randomCategoryIndex];
    
    const randomTopicIndex = Math.floor(Math.random() * selectedCategory.topics.length);
    const selectedTopic = selectedCategory.topics[randomTopicIndex];
    
    // 간단한 설명 생성
    let content = `[${selectedCategory.category}] ${selectedTopic}\n\n`;
    
    switch (selectedCategory.category) {
      case '자료구조':
        content += `${selectedTopic}은(는) 컴퓨터 과학에서 중요한 자료구조입니다. 이를 활용하면 데이터를 효율적으로 관리하고 처리할 수 있습니다.`;
        break;
      case '알고리즘':
        content += `${selectedTopic}은(는) 효율적인 문제 해결을 위한 알고리즘입니다. 이 알고리즘의 시간 복잡도와 구현 방법을 이해하는 것이 중요합니다.`;
        break;
      case '네트워크':
        content += `${selectedTopic}은(는) 현대 인터넷과 네트워킹의 핵심 개념입니다. 이는 데이터 통신의 신뢰성과 보안을 보장하는 중요한 요소입니다.`;
        break;
      case '운영체제':
        content += `${selectedTopic}은(는) 운영체제의 핵심 기능 중 하나입니다. 이를 통해 시스템 자원을 효율적으로 관리하고 프로그램 실행을 제어합니다.`;
        break;
      case '데이터베이스':
        content += `${selectedTopic}은(는) 데이터베이스 시스템의 중요한 개념입니다. 이를 통해 데이터의 무결성을 보장하고 효율적인 데이터 관리가 가능합니다.`;
        break;
      case '디자인 패턴':
        content += `${selectedTopic} 패턴은 소프트웨어 설계에서 자주 발생하는 문제에 대한 재사용 가능한 해결책입니다. 이 패턴을 사용하면 코드의 유지보수성과 확장성이 향상됩니다.`;
        break;
      case '웹 개발':
        content += `${selectedTopic}은(는) 현대 웹 개발에서 중요한 개념입니다. 이를 이해하면 웹 애플리케이션의 성능과 사용자 경험을 향상시킬 수 있습니다.`;
        break;
      default:
        content += `${selectedTopic}에 대한 기본적인 이해는 개발자로서 필수적입니다. 이 개념을 숙지하고 실제 프로젝트에 적용해 보세요.`;
    }
    
    return content;
  } catch (error) {
    console.error('CS 컨텐츠 생성 중 오류:', error);
    return '오늘의 CS 지식을 생성하는 중 오류가 발생했습니다. 나중에 다시 시도해주세요.';
  }
};

/**
 * 랜덤 면접 질문 가져오기
 * @returns {Promise<string>} 랜덤 면접 질문
 */
exports.getRandomInterviewQuestion = async () => {
  try {
    // 데이터베이스에서 랜덤 질문 가져오기
    const count = await prisma.question.count({
      where: { active: true }
    });
    
    if (count === 0) {
      return "등록된 질문이 없습니다.";
    }
    
    const randomSkip = Math.floor(Math.random() * count);
    const randomQuestion = await prisma.question.findFirst({
      where: { active: true },
      skip: randomSkip
    });
    
    return `[${randomQuestion.category}] ${randomQuestion.text}`;
  } catch (error) {
    console.error('랜덤 면접 질문 가져오기 오류:', error);
    
    // 기본 질문 목록 (데이터베이스 오류 시 대체용)
    const fallbackQuestions = [
      '시간 복잡도와 공간 복잡도에 대해 설명해주세요.',
      '동기와 비동기의 차이점은 무엇인가요?',
      'RESTful API에 대해 설명해주세요.',
      'TCP와 UDP의 차이점은 무엇인가요?',
      '트랜잭션의 ACID 특성에 대해 설명해주세요.'
    ];
    
    const randomIndex = Math.floor(Math.random() * fallbackQuestions.length);
    return fallbackQuestions[randomIndex];
  }
};