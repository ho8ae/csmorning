/**
 * 사용자 찾기 또는 생성
 */
const findOrCreateUser = async (prisma, kakaoId) => {
    // 사용자 검증
    let user = await prisma.user.findUnique({
      where: { kakaoId }
    });
    
    if (!user) {
      // 새 사용자 생성
      user = await prisma.user.create({
        data: {
          kakaoId,
          nickname: `사용자_${kakaoId.substring(0, 5)}`
        }
      });
    }
    
    return user;
  };
  
  /**
   * 기부 생성
   */
  const createDonation = async (prisma, userId, amount, tid, orderCode, message) => {
    return await prisma.donation.create({
      data: {
        userId,
        amount,
        tid,
        orderCode,
        message,
        status: 'ready'
      }
    });
  };
  
  /**
   * 주문 코드로 기부 조회
   */
  const getDonationByOrderCode = async (prisma, orderCode) => {
    return await prisma.donation.findUnique({
      where: { orderCode },
      include: { user: true }
    });
  };
  
  /**
   * 기부 상태 업데이트
   */
  const updateDonationStatus = async (prisma, id, status) => {
    const updateData = {
      status
    };
    
    // approved 상태인 경우 승인 시간도 업데이트
    if (status === 'approved') {
      updateData.approvedAt = new Date();
    }
    
    return await prisma.donation.update({
      where: { id },
      data: updateData
    });
  };
  
  /**
   * 주문 코드로 기부 상태 업데이트
   */
  const updateDonationStatusByOrderCode = async (prisma, orderCode, status) => {
    const updateData = {
      status
    };
    
    // approved 상태인 경우 승인 시간도 업데이트
    if (status === 'approved') {
      updateData.approvedAt = new Date();
    }
    
    return await prisma.donation.updateMany({
      where: { orderCode },
      data: updateData
    });
  };
  
  /**
   * 모든 기부 내역 조회
   */
  const getAllDonations = async (prisma) => {
    return await prisma.donation.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: true
      }
    });
  };
  
  /**
   * 특정 기부 내역 조회
   */
  const getDonationById = async (prisma, id) => {
    return await prisma.donation.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: true
      }
    });
  };
  
  module.exports = {
    findOrCreateUser,
    createDonation,
    getDonationByOrderCode,
    updateDonationStatus,
    updateDonationStatusByOrderCode,
    getAllDonations,
    getDonationById
  };