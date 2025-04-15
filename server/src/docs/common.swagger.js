/**
 * @swagger
 * components:
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: 요청 성공 여부
 *           example: false
 *         message:
 *           type: string
 *           description: 오류 메시지
 *           example: "요청을 처리할 수 없습니다."
 *     
 *     ValidationError:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: 요청 성공 여부
 *           example: false
 *         message:
 *           type: string
 *           description: 오류 메시지
 *           example: "유효성 검사 실패"
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *                 description: 오류가 발생한 필드
 *               message:
 *                 type: string
 *                 description: 필드별 오류 메시지
 *           example:
 *             - field: "amount"
 *               message: "금액은 최소 1,000원 이상이어야 합니다."
 */