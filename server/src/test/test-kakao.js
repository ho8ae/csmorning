// test-kakao.js
require('dotenv').config();
const kakaoService = require('../services/kakaoService.js');

async function testSendMessage() {
  try {
    const template = {
      object_type: 'text',
      text: '테스트 메시지입니다. 이 메시지가 보이면 API 연동이 정상적으로 작동하는 것입니다.',
      link: {
        web_url: 'https://csmorning.co.kr',
        mobile_web_url: 'https://csmorning.co.kr'
      }
    };
    
    // 여기에 본인의 카카오 계정 ID를 넣어야 합니다
    const result = await kakaoService.sendMessage('ho8ae', template);
    console.log('메시지 전송 결과:', result);
  } catch (error) {
    console.error('테스트 실패:', error);
  }
}

testSendMessage();