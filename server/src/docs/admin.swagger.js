/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: 관리자 전용 API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: 사용자 고유 ID
 *         kakaoId:
 *           type: string
 *           description: 카카오 사용자 ID
 *         nickname:
 *           type: string
 *           description: 사용자 닉네임
 *         isSubscribed:
 *           type: boolean
 *           description: 구독 여부
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
 *         kakaoId: "kakao_123456789"
 *         nickname: "개발자지망생"
 *         isSubscribed: true
 *         createdAt: "2023-09-30T15:30:00Z"
 *         updatedAt: "2023-09-30T15:30:00Z"
 *     
 *     ResponseStats:
 *       type: object
 *       properties:
 *         totalResponses:
 *           type: integer
 *           description: 총 응답 수
 *         dailyAverage:
 *           type: number
 *           format: float
 *           description: 일일 평균 응답 수
 *         responseRateByDay:
 *           type: object
 *           additionalProperties:
 *             type: number
 *             format: float
 *           description: 요일별 응답률
 *       example:
 *         totalResponses: 1205
 *         dailyAverage: 42.3
 *         responseRateByDay:
 *           Monday: 0.75
 *           Tuesday: 0.82
 *     
 *     DonationStats:
 *       type: object
 *       properties:
 *         totalDonations:
 *           type: integer
 *           description: 총 기부 수
 *         totalAmount:
 *           type: integer
 *           description: 총 기부 금액
 *         averageAmount:
 *           type: number
 *           format: float
 *           description: 평균 기부 금액
 *       example:
 *         totalDonations: 127
 *         totalAmount: 635000
 *         averageAmount: 5000.0
 *     
 *     SendQuestionRequest:
 *       type: object
 *       required:
 *         - questionId
 *       properties:
 *         questionId:
 *           type: string
 *           format: uuid
 *           description: 전송할 질문 ID
 *       example:
 *         questionId: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
 *     
 *     Error:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "인증에 실패했습니다"
 */

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: 모든 사용자 조회
 *     description: 시스템에 등록된 모든 사용자 목록을 조회합니다.
 *     tags: [Admin]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: 사용자 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: 인증 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/admin/stats/responses:
 *   get:
 *     summary: 응답 통계 조회
 *     description: 사용자 응답에 대한 통계 정보를 조회합니다.
 *     tags: [Admin]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: 응답 통계 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/ResponseStats'
 *       401:
 *         description: 인증 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/admin/stats/donations:
 *   get:
 *     summary: 기부 통계 조회
 *     description: 사용자 기부에 대한 통계 정보를 조회합니다.
 *     tags: [Admin]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: 기부 통계 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/DonationStats'
 *       401:
 *         description: 인증 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/admin/questions/send:
 *   post:
 *     summary: 질문 수동 전송
 *     description: 선택한 질문을 모든 구독자에게 수동으로 전송합니다.
 *     tags: [Admin]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SendQuestionRequest'
 *     responses:
 *       200:
 *         description: 질문 전송 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: '질문이 성공적으로 전송되었습니다.'
 *       400:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: 인증 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */