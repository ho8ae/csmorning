const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const { setupSwagger } = require('./config/swagger');
const kakaoService = require('./services/kakao.service');

// 미들웨어 임포트
const prismaMiddleware = require('./middleware/prisma.middleware');
const { notFoundMiddleware, errorHandlerMiddleware } = require('./middleware/error.middleware');

// 라우터 임포트
const questionRoutes = require('./api/question/question.routes');
const webhookRoutes = require('./api/webhook/webhook.routes');
const donationRoutes = require('./api/donation/donation.routes');
const adminRoutes = require('./api/admin/admin.routes');
const authRoutes = require('./api/auth/auth.routes');
const testRoutes = require('./api/test/test.routes');
const bizgoRoutes = require('./api/bizgo/bizgo.routes');
const premiumRoutes = require('./api/premium/premium.routes');

// Express 앱 초기화
const app = express();

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Swagger 설정
setupSwagger(app);

// 정적 파일 서빙
app.use(express.static(path.join(__dirname, '../public')));

// Prisma 클라이언트를 요청 객체에 추가
app.use(prismaMiddleware);

// 라우트 설정
app.use('/api/questions', questionRoutes);
app.use('/api/webhook', webhookRoutes);
app.use('/api/donation', donationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);
app.use('/api/bizgo', bizgoRoutes);
app.use('/api/premium', premiumRoutes);

// 기본 경로
app.get('/', (req, res) => {
  res.json({ message: 'CS Interview Bot API is running' });
});

// 서버 시작 시 카카오 토큰 초기화
(async function initializeKakaoToken() {
  try {
    await kakaoService.initializeToken();
    console.log('카카오 토큰이 초기화되었습니다.');
  } catch (error) {
    console.error('카카오 토큰 초기화 실패:', error.message);
  }
})();

// 에러 핸들링 미들웨어
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

module.exports = app;