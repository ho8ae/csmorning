// scripts/create-admin.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  const email = 'admin@csmorning.com';
  const password = 'admin1234'; // 실제 환경에서는 더 강력한 비밀번호 사용 필요
  
  // 비밀번호 해싱
  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
    // 이미 존재하는 관리자 확인
    const existingAdmin = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingAdmin) {
      console.log('이미 관리자 계정이 존재합니다.');
      return;
    }
    
    // 관리자 계정 생성
    const admin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        nickname: '관리자',
        role: 'admin',
        isSubscribed: true
      }
    });
    
    console.log('관리자 계정이 생성되었습니다:', admin.email);
  } catch (error) {
    console.error('관리자 계정 생성 중 오류 발생:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  });