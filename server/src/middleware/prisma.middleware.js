const { prisma } = require('../config/db');

// Prisma 클라이언트를 요청 객체에 추가하는 미들웨어
const prismaMiddleware = (req, res, next) => {
  req.prisma = prisma;
  next();
};

module.exports = prismaMiddleware;