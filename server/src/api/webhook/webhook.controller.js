const webhookService = require('./webhook.service');
const kakaoService = require('../../services/kakao.service');

/**
 * 카카오톡 메시지 웹훅 처리
 */
const handleKakaoMessage = async (req, res, next) => {
  try {
    const { user_id, content, type } = req.body;
    
    // 텍스트 메시지만 처리
    if (type !== 'text') {
      return res.status(200).json({ 
        success: true, 
        message: '텍스트 메시지만 처리합니다' 
      });
    }
    
    // 사용자 확인/생성
    const user = await webhookService.findOrCreateUser(req.prisma, user_id);
    
    // 오늘의 질문 가져오기
    const todayQuestion = await webhookService.getTodayQuestion(req.prisma);
    
    if (!todayQuestion) {
      // 오늘의 질문이 없는 경우
      await sendMessage(user_id, '오늘의 질문이 아직 준비되지 않았습니다. 내일 다시 시도해주세요!');
      return res.status(200).json({ success: true });
    }
    
    // 사용자 답변 처리
    const userAnswer = content.trim();
    
    // 숫자 형식인지 확인
    if (!/^[1-9]\d*$/.test(userAnswer)) {
      await sendMessage(user_id, '답변은 번호로 입력해주세요 (예: 1)');
      return res.status(200).json({ success: true });
    }
    
    // 답변 인덱스로 변환 (1-based -> 0-based)
    const answerIndex = parseInt(userAnswer) - 1;
    
    // 옵션 범위 확인
    const options = todayQuestion.question.options;
    if (answerIndex < 0 || answerIndex >= options.length) {
      await sendMessage(user_id, `1부터 ${options.length} 사이의 번호로 답변해주세요.`);
      return res.status(200).json({ success: true });
    }
    
    // 정답 확인
    const isCorrect = answerIndex === todayQuestion.question.correctOption;
    
    // 이미 응답했는지 확인
    const existingResponse = await webhookService.getUserResponseForQuestion(
      req.prisma,
      user.id,
      todayQuestion.id
    );
    
    if (!existingResponse) {
      // 새 응답 저장
      await webhookService.createResponse(
        req.prisma,
        user.id,
        todayQuestion.id,
        answerIndex,
        isCorrect
      );
      
      // 사용자 통계 업데이트
      await webhookService.updateUserStats(
        req.prisma,
        user.id,
        isCorrect
      );
    }
    
    // 응답 메시지 전송
    let responseMessage;
    
    if (isCorrect) {
      responseMessage = `정답입니다! 👏\n\n[설명]\n${todayQuestion.question.explanation}`;
    } else {
      const correctOptionIndex = todayQuestion.question.correctOption;
      responseMessage = `아쉽게도 오답입니다. 😢\n\n정답은 ${correctOptionIndex + 1}번입니다.\n\n[설명]\n${todayQuestion.question.explanation}`;
    }
    
    // 메시지에 커피 보내기 버튼 추가
    const template = {
      object_type: 'text',
      text: responseMessage,
      link: {
        web_url: process.env.SERVICE_URL || 'https://your-service.com',
        mobile_web_url: process.env.SERVICE_URL || 'https://your-service.com'
      },
      buttons: [
        {
          title: '개발자에게 커피 보내기 ☕',
          link: {
            web_url: `${process.env.SERVICE_URL}/donation?userId=${user_id}`,
            mobile_web_url: `${process.env.SERVICE_URL}/donation?userId=${user_id}`
          }
        }
      ]
    };
    
    await kakaoService.sendMessage(user_id, template);
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('웹훅 처리 중 오류 발생:', error);
    return res.status(500).json({ 
      success: false, 
      message: '서버 오류' 
    });
  }
};

/**
 * 메시지 전송 헬퍼 함수
 */
const sendMessage = async (userId, text) => {
  const template = {
    object_type: 'text',
    text: text,
    link: {
      web_url: process.env.SERVICE_URL || 'https://your-service.com',
      mobile_web_url: process.env.SERVICE_URL || 'https://your-service.com'
    }
  };
  
  return kakaoService.sendMessage(userId, template);
};

const testEndpoint = (req, res) => {
  const responseBody = {
    version: "2.0",
    template: {
      outputs: [
        {
          simpleText: {
            text: "테스트 응답입니다."
          }
        }
      ]
    }
  };
  
  return res.status(200).json(responseBody);
};

module.exports = {
  handleKakaoMessage,
  testEndpoint
};