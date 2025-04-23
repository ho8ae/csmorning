const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('데이터베이스 연결 성공');
    return prisma;
  } catch (error) {
    console.error('데이터베이스 연결 실패:', error);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await prisma.$disconnect();
    console.log('데이터베이스 연결 종료');
  } catch (error) {
    console.error('데이터베이스 연결 종료 실패:', error);
    process.exit(1);
  }
};

module.exports = {
  prisma,
  connectDB,
  disconnectDB
};