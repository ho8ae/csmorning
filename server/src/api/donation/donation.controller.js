const donationService = require('./donation.service');
const kakaoService = require('../../services/kakao.service');

/**
 * 커피값 기부 요청 생성
 */
const createDonation = async (req, res, next) => {
  try {
    const { userId, amount = 3000, message } = req.body;
    
    // 금액 검증
    if (amount < 1000) {
      return res.status(400).json({
        success: false,
        message: '최소 기부 금액은 1,000원입니다'
      });
    }
    
    // 사용자 확인 또는 생성
    const user = await donationService.findOrCreateUser(req.prisma, userId);
    
    // 카카오페이 결제 요청 생성
    const paymentInfo = await kakaoService.createPaymentRequest(
      userId,
      amount,
      '개발자에게 커피 한 잔'
    );
    
    // 기부 정보 저장
    const donation = await donationService.createDonation(
      req.prisma, 
      user.id, 
      amount, 
      paymentInfo.tid, 
      paymentInfo.orderCode, 
      message
    );
    
    // 모바일 환경에서 결제 페이지 URL 전송
    const messageTemplate = {
      object_type: 'text',
      text: `개발자에게 커피값 ${amount.toLocaleString()}원 보내기를 선택해주셔서 감사합니다! 아래 링크를 통해 결제를 진행해주세요.`,
      link: {
        web_url: paymentInfo.next_redirect_pc_url,
        mobile_web_url: paymentInfo.next_redirect_mobile_url
      },
      buttons: [
        {
          title: '결제하기',
          link: {
            web_url: paymentInfo.next_redirect_pc_url,
            mobile_web_url: paymentInfo.next_redirect_mobile_url
          }
        }
      ]
    };
    
    await kakaoService.sendMessage(userId, messageTemplate);
    
    return res.status(200).json({
      success: true,
      data: {
        donationId: donation.id,
        paymentInfo: {
          pc_url: paymentInfo.next_redirect_pc_url,
          mobile_url: paymentInfo.next_redirect_mobile_url
        }
      }
    });
  } catch (error) {
    console.error('커피값 보내기 요청 처리 실패:', error);
    next(error);
  }
};

/**
 * 결제 성공 처리
 */
const handlePaymentSuccess = async (req, res, next) => {
  try {
    const { pg_token, tid, partner_order_id, partner_user_id } = req.query;
    
    // 결제 정보 조회
    const donation = await donationService.getDonationByOrderCode(req.prisma, partner_order_id);
    
    if (!donation) {
      return res.status(404).json({
        success: false,
        message: '해당 주문을 찾을 수 없습니다'
      });
    }
    
    // 결제 승인 처리
    const approvalResult = await kakaoService.approvePayment(
      tid,
      partner_order_id,
      partner_user_id,
      pg_token
    );
    
    // 데이터베이스 업데이트
    await donationService.updateDonationStatus(req.prisma, donation.id, 'approved');
    
    // 사용자에게 감사 메시지 전송
    const thankYouMessage = {
      object_type: 'text',
      text: `커피값 후원이 정상적으로 완료되었습니다! 소중한 후원 감사합니다. 더 나은 서비스를 제공하기 위해 노력하겠습니다. ☕❤️`,
      link: {
        web_url: process.env.SERVICE_URL,
        mobile_web_url: process.env.SERVICE_URL
      }
    };
    
    await kakaoService.sendMessage(partner_user_id, thankYouMessage);
    
    // 성공 페이지로 리다이렉트
    res.redirect(`${process.env.SERVICE_URL}/donation/thank-you`);
  } catch (error) {
    console.error('결제 승인 처리 실패:', error);
    res.redirect(`${process.env.SERVICE_URL}/donation/error`);
  }
};

/**
 * 결제 취소 처리
 */
const handlePaymentCancel = async (req, res, next) => {
  try {
    const { partner_order_id } = req.query;
    
    if (partner_order_id) {
      // 데이터베이스 업데이트
      await donationService.updateDonationStatusByOrderCode(req.prisma, partner_order_id, 'canceled');
    }
    
    // 취소 페이지로 리다이렉트
    res.redirect(`${process.env.SERVICE_URL}/donation/canceled`);
  } catch (error) {
    console.error('결제 취소 처리 실패:', error);
    res.redirect(`${process.env.SERVICE_URL}/donation/error`);
  }
};

/**
 * 결제 실패 처리
 */
const handlePaymentFail = async (req, res, next) => {
  try {
    const { partner_order_id } = req.query;
    
    if (partner_order_id) {
      // 데이터베이스 업데이트
      await donationService.updateDonationStatusByOrderCode(req.prisma, partner_order_id, 'failed');
    }
    
    // 실패 페이지로 리다이렉트
    res.redirect(`${process.env.SERVICE_URL}/donation/failed`);
  } catch (error) {
    console.error('결제 실패 처리 오류:', error);
    res.redirect(`${process.env.SERVICE_URL}/donation/error`);
  }
};

module.exports = {
  createDonation,
  handlePaymentSuccess,
  handlePaymentCancel,
  handlePaymentFail
};