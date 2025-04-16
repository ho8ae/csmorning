// 404 에러 처리 미들웨어
const notFoundMiddleware = (req, res, next) => {
    const error = new Error('Not Found');
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
        stack: process.env.NODE_ENV === 'production' ? err.stack : undefined // 스택 트레이스는 프로덕션 환경에서는 숨김
      }
    });
  };
  
  module.exports = {
    notFoundMiddleware,
    errorHandlerMiddleware
  };