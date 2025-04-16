/**
 * @swagger
 * tags:
 *   name: Donation
 *   description: 기부/결제 관련 API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateDonationRequest:
 *       type: object
 *       required:
 *         - userId
 *         - amount
 *       properties:
 *         userId:
 *           type: string
 *           description: 카카오 사용자 ID
 *         amount:
 *           type: integer
 *           minimum: 1000
 *           description: 기부 금액 (최소 1,000원)
 *         message:
 *           type: string
 *           description: 기부 메시지 (선택 사항)
 *       example:
 *         userId: "kakao_123456789"
 *         amount: 4000
 *         message: "응원합니다! 좋은 서비스 만들어주세요."
 *     
 *     PaymentResponse:
 *       type: object
 *       properties:
 *         tid:
 *           type: string
 *           description: 결제 고유 번호
 *         orderCode:
 *           type: string
 *           description: 주문 코드
 *         next_redirect_pc_url:
 *           type: string
 *           format: uri
 *           description: PC 환경 결제 페이지 URL
 *         next_redirect_mobile_url:
 *           type: string
 *           format: uri
 *           description: 모바일 환경 결제 페이지 URL
 *       example:
 *         tid: "T1234567890"
 *         orderCode: "COFFEE_1632982583123_456"
 *         next_redirect_pc_url: "https://online-pay.kakao.com/mockup/v1/1d61e5d882c7ada35b274bd56e5cac3b15243d5d3649b7a1d89a8bb0c7a5acd0/info"
 *         next_redirect_mobile_url: "https://online-pay.kakao.com/mockup/v1/1d61e5d882c7ada35b274bd56e5cac3b15243d5d3649b7a1d89a8bb0c7a5acd0/info"
 *     
 *     Donation:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: 기부 고유 ID
 *         userId:
 *           type: string
 *           format: uuid
 *           description: 사용자 고유 ID
 *         amount:
 *           type: integer
 *           description: 기부 금액
 *         message:
 *           type: string
 *           description: 기부 메시지
 *         tid:
 *           type: string
 *           description: 결제 고유 번호
 *         orderCode:
 *           type: string
 *           description: 주문 코드
 *         status:
 *           type: string
 *           enum: [pending, completed, failed, cancelled]
 *           description: 결제 상태
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 생성 일시
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: 수정 일시
 *       example:
 *         id: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
 *         userId: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
 *         amount: 4000
 *         message: "응원합니다! 좋은 서비스 만들어주세요."
 *         tid: "T1234567890"
 *         orderCode: "COFFEE_1632982583123_456"
 *         status: "completed"
 *         createdAt: "2023-09-30T15:30:00Z"
 *         updatedAt: "2023-09-30T15:35:00Z"
 */

/**
 * @swagger
 * /api/donation/coffee:
 *   post:
 *     summary: 커피값 기부 요청
 *     description: 커피값 기부를 위한 카카오페이 결제 요청을 생성합니다.
 *     tags: [Donation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDonationRequest'
 *     responses:
 *       200:
 *         description: 결제 요청 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/PaymentResponse'
 *       400:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "필수 파라미터가 누락되었습니다."
 */

/**
 * @swagger
 * /api/donation/success:
 *   get:
 *     summary: 결제 성공 처리
 *     description: 카카오페이 결제 성공 시 리다이렉트되는 엔드포인트입니다.
 *     tags: [Donation]
 *     parameters:
 *       - name: pg_token
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: 결제 승인 토큰
 *       - name: tid
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: 결제 고유 번호
 *     responses:
 *       302:
 *         description: 결제 성공 후 리다이렉트
 *         headers:
 *           Location:
 *             schema:
 *               type: string
 *               format: uri
 *             description: 감사 페이지로 리다이렉트
 */

/**
 * @swagger
 * /api/donation/cancel:
 *   get:
 *     summary: 결제 취소 처리
 *     description: 카카오페이 결제 취소 시 리다이렉트되는 엔드포인트입니다.
 *     tags: [Donation]
 *     responses:
 *       302:
 *         description: 결제 취소 후 리다이렉트
 *         headers:
 *           Location:
 *             schema:
 *               type: string
 *               format: uri
 *             description: 메인 페이지로 리다이렉트
 */

/**
 * @swagger
 * /api/donation/fail:
 *   get:
 *     summary: 결제 실패 처리
 *     description: 카카오페이 결제 실패 시 리다이렉트되는 엔드포인트입니다.
 *     tags: [Donation]
 *     responses:
 *       302:
 *         description: 결제 실패 후 리다이렉트
 *         headers:
 *           Location:
 *             schema:
 *               type: string
 *               format: uri
 *             description: 오류 페이지로 리다이렉트
 */