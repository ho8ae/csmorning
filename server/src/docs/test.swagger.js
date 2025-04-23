// src/docs/test.swagger.js

/**
 * @swagger
 * tags:
 *   name: Test
 *   description: 테스트 관련 API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     TestMessageRequest:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           format: uuid
 *           description: 메시지를 받을 사용자 ID (없으면 첫 번째 사용자에게 전송)
 *         message:
 *           type: string
 *           description: 전송할 메시지 내용
 *       example:
 *         userId: "550e8400-e29b-41d4-a716-446655440000"
 *         message: "이것은 테스트 메시지입니다."
 * 
 *     TestCronRequest:
 *       type: object
 *       required:
 *         - action
 *       properties:
 *         action:
 *           type: string
 *           enum: [sendDailyContent, createDailyQuestion]
 *           description: 실행할 스케줄러 함수
 *       example:
 *         action: "sendDailyContent"
 */

/**
 * @swagger
 * /api/test/send:
 *   post:
 *     summary: 테스트용 카카오톡 메시지 전송
 *     tags: [Test]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TestMessageRequest'
 *     responses:
 *       200:
 *         description: 메시지 전송 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                     kakaoId:
 *                       type: string
 *                     message:
 *                       type: string
 *                     sentAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 없음
 *       500:
 *         description: 서버 오류
 * 
 * /api/test/cron:
 *   post:
 *     summary: 테스트용 스케줄러 실행
 *     tags: [Test]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TestCronRequest'
 *     responses:
 *       200:
 *         description: 스케줄러 실행 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     action:
 *                       type: string
 *                     executedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 없음
 *       500:
 *         description: 서버 오류
 */