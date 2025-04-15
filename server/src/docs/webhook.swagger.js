/**
 * @swagger
 * tags:
 *   name: Webhook
 *   description: 외부 서비스 연동 API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     KakaoMessage:
 *       type: object
 *       required:
 *         - user_key
 *         - type
 *         - content
 *       properties:
 *         user_key:
 *           type: string
 *           description: 카카오톡 사용자 식별키
 *         type:
 *           type: string
 *           enum: [text]
 *           description: 메시지 타입
 *         content:
 *           type: string
 *           description: 메시지 내용
 *       example:
 *         user_key: "kakao_123456789"
 *         type: "text"
 *         content: "1"
 *     
 *     KakaoResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: object
 *           properties:
 *             text:
 *               type: string
 *               description: 응답 메시지
 *         keyboard:
 *           type: object
 *           properties:
 *             type:
 *               type: string
 *               enum: [text, buttons]
 *               description: 키보드 타입
 *             buttons:
 *               type: array
 *               items:
 *                 type: string
 *               description: 버튼 목록 (buttons 타입인 경우)
 *       example:
 *         message:
 *           text: "답변이 기록되었습니다. 정답은 1번입니다. 수고하셨습니다."
 *         keyboard:
 *           type: "text"
 */

/**
 * @swagger
 * /webhook/message:
 *   post:
 *     summary: 카카오톡 메시지 웹훅 처리
 *     description: 카카오톡 챗봇으로부터 받은 메시지를 처리합니다.
 *     tags: [Webhook]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/KakaoMessage'
 *     responses:
 *       200:
 *         description: 메시지 처리 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/KakaoResponse'
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
 *                   example: "유효하지 않은 메시지 형식입니다"
 */