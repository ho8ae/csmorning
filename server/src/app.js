const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// 미들웨어 임포트
const prismaMiddleware = require('./middleware/prisma.middleware');
const { notFoundMiddleware, errorHandlerMiddleware } = require('./middleware/error.middleware');

// 라우터 임포트
const questionRoutes = require('./api/question/question.routes');
const webhookRoutes = require('./api/webhook/webhook.routes');
const donationRoutes = require('./api/donation/donation.routes');
const adminRoutes = require('./api/admin/admin.routes');

// Express 앱 초기화
const app = express();

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// 정적 파일 서빙
app.use(express.static(path.join(__dirname, '../public')));

// Prisma 클라이언트를 요청 객체에 추가
app.use(prismaMiddleware);

// 라우트 설정
app.use('/api/questions', questionRoutes);
app.use('/webhook', webhookRoutes);
app.use('/api/donation', donationRoutes);
app.use('/api/admin', adminRoutes);

// 기본 경로
app.get('/', (req, res) => {
  res.json({ message: 'CS Interview Bot API is running' });
});

// 에러 핸들링 미들웨어
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

module.exports = app;