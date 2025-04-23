// 404 에러 처리 미들웨어
// 404 에러 처리 미들웨어 (디버깅 정보 추가)
const notFoundMiddleware = (req, res, next) => {
  console.log(`404 에러 발생: ${req.method} ${req.originalUrl}`);
  console.log('쿼리 파라미터:', req.query);
  console.log('요청 헤더:', req.headers);

  const error = new Error(`Not Found: ${req.method} ${req.originalUrl}`);
  error.status = 404;
  next(error);
};
// 일반 에러 처리 미들웨어
const errorHandlerMiddleware = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  console.error(err);

  res.status(status).json({
    error: {
      message,
      status,
      stack: process.env.NODE_ENV === 'production' ? err.stack : undefined, // 스택 트레이스는 프로덕션 환경에서는 숨김
    },
  });
};

module.exports = {
  notFoundMiddleware,
  errorHandlerMiddleware,
};
