require('dotenv').config();
const app = require('./src/app');
const { prisma, connectDB, disconnectDB } = require('./src/config/db');
const { scheduleDailyQuestion } = require('./src/utils/scheduler');

const PORT = process.env.PORT || 3000;

// 서버 시작 함수
async function startServer() {
  try {
    // 데이터베이스 연결
    await connectDB();
    console.log('데이터베이스 연결 성공');
    
    // 스케줄러 시작
    scheduleDailyQuestion();
    console.log('스케줄러 시작됨');
    
    // 서버 시작
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`서버가 포트 ${PORT}에서 실행 중입니다`);
    });
  } catch (error) {
    console.error('서버 시작 실패:', error);
    process.exit(1);
  }
}

// 서버 시작
startServer();

// 정상 종료 처리
process.on('SIGINT', async () => {
  await disconnectDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnectDB();
  process.exit(0);
});