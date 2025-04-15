/**
 * @swagger
 * tags:
 *   name: Question
 *   description: 질문 관리 및 조회 API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Question:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: 질문 고유 ID
 *         text:
 *           type: string
 *           description: 질문 내용
 *         description:
 *           type: string
 *           description: 질문 설명
 *         options:
 *           type: array
 *           items:
 *             type: string
 *           description: 선택 항목 목록
 *         correctOption:
 *           type: integer
 *           description: 정답 인덱스 (0부터 시작)
 *         explanation:
 *           type: string
 *           description: 정답 설명
 *         category:
 *           type: string
 *           description: 질문 카테고리
 *         difficulty:
 *           type: string
 *           enum: [easy, medium, hard]
 *           description: 난이도
 *         active:
 *           type: boolean
 *           description: 활성화 여부
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
 *         text: "OSI 7계층에 대해 설명해주세요."
 *         description: "OSI 7계층은 네트워크 통신이 일어나는 과정을 7단계로 나눈 것입니다."
 *         options:
 *           - "물리, 데이터링크, 네트워크, 전송, 세션, 표현, 응용"
 *           - "응용, 표현, 세션, 전송, 네트워크, 데이터링크, 물리"
 *           - "물리, 링크, 네트워크, 인터넷, 전송, 응용, 표현"
 *           - "세션, 물리, 데이터, 네트워크, 전송, 표현, 응용"
 *         correctOption: 0
 *         explanation: "OSI 7계층은 하위 계층부터 물리(1), 데이터링크(2), 네트워크(3), 전송(4), 세션(5), 표현(6), 응용(7) 계층으로 구성됩니다."
 *         category: "네트워크"
 *         difficulty: "medium"
 *         active: true
 *         createdAt: "2023-09-30T15:30:00Z"
 *         updatedAt: "2023-09-30T15:30:00Z"
 *     
 *     CreateQuestionRequest:
 *       type: object
 *       required:
 *         - text
 *         - options
 *         - correctOption
 *       properties:
 *         text:
 *           type: string
 *           description: 질문 내용
 *         description:
 *           type: string
 *           description: 질문 설명
 *         options:
 *           type: array
 *           items:
 *             type: string
 *           description: 선택 항목 목록
 *         correctOption:
 *           type: integer
 *           minimum: 0
 *           description: 정답 인덱스 (0부터 시작)
 *         explanation:
 *           type: string
 *           description: 정답 설명
 *         category:
 *           type: string
 *           description: 질문 카테고리
 *         difficulty:
 *           type: string
 *           enum: [easy, medium, hard]
 *           description: 난이도
 *         active:
 *           type: boolean
 *           default: true
 *           description: 활성화 여부
 *       example:
 *         text: "OSI 7계층에 대해 설명해주세요."
 *         description: "OSI 7계층은 네트워크 통신이 일어나는 과정을 7단계로 나눈 것입니다."
 *         options:
 *           - "물리, 데이터링크, 네트워크, 전송, 세션, 표현, 응용"
 *           - "응용, 표현, 세션, 전송, 네트워크, 데이터링크, 물리"
 *           - "물리, 링크, 네트워크, 인터넷, 전송, 응용, 표현"
 *           - "세션, 물리, 데이터, 네트워크, 전송, 표현, 응용"
 *         correctOption: 0
 *         explanation: "OSI 7계층은 하위 계층부터 물리(1), 데이터링크(2), 네트워크(3), 전송(4), 세션(5), 표현(6), 응용(7) 계층으로 구성됩니다."
 *         category: "네트워크"
 *         difficulty: "medium"
 *         active: true
 *     
 *     UpdateQuestionRequest:
 *       type: object
 *       properties:
 *         text:
 *           type: string
 *           description: 질문 내용
 *         description:
 *           type: string
 *           description: 질문 설명
 *         options:
 *           type: array
 *           items:
 *             type: string
 *           description: 선택 항목 목록
 *         correctOption:
 *           type: integer
 *           minimum: 0
 *           description: 정답 인덱스 (0부터 시작)
 *         explanation:
 *           type: string
 *           description: 정답 설명
 *         category:
 *           type: string
 *           description: 질문 카테고리
 *         difficulty:
 *           type: string
 *           enum: [easy, medium, hard]
 *           description: 난이도
 *         active:
 *           type: boolean
 *           description: 활성화 여부
 *       example:
 *         text: "OSI 7계층에 대해 설명해주세요. (수정)"
 *         explanation: "OSI 7계층은 하위 계층부터 물리(1), 데이터링크(2), 네트워크(3), 전송(4), 세션(5), 표현(6), 응용(7) 계층으로 구성됩니다. (수정)"
 *         active: false
 *     
 *     TodayQuestion:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: 질문 고유 ID
 *         text:
 *           type: string
 *           description: 질문 내용
 *         options:
 *           type: array
 *           items:
 *             type: string
 *           description: 선택 항목 목록
 *         category:
 *           type: string
 *           description: 질문 카테고리
 *         difficulty:
 *           type: string
 *           enum: [easy, medium, hard]
 *           description: 난이도
 *       example:
 *         id: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
 *         text: "OSI 7계층에 대해 설명해주세요."
 *         options:
 *           - "물리, 데이터링크, 네트워크, 전송, 세션, 표현, 응용"
 *           - "응용, 표현, 세션, 전송, 네트워크, 데이터링크, 물리"
 *           - "물리, 링크, 네트워크, 인터넷, 전송, 응용, 표현"
 *           - "세션, 물리, 데이터, 네트워크, 전송, 표현, 응용"
 *         category: "네트워크"
 *         difficulty: "medium"
 */

/**
 * @swagger
 * /questions:
 *   get:
 *     summary: 모든 질문 조회 (관리자용)
 *     description: 시스템에 등록된 모든 질문 목록을 조회합니다.
 *     tags: [Question]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: 질문 목록 조회 성공
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
 *                     $ref: '#/components/schemas/Question'
 *       401:
 *         description: 인증 실패
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
 *                   example: "인증에 실패했습니다"
 *   post:
 *     summary: 질문 생성 (관리자용)
 *     description: 새로운 질문을 생성합니다.
 *     tags: [Question]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateQuestionRequest'
 *     responses:
 *       201:
 *         description: 질문 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Question'
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
 *                   example: "유효하지 않은 입력 형식입니다"
 *       401:
 *         description: 인증 실패
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
 *                   example: "인증에 실패했습니다"
 */

/**
 * @swagger
 * /questions/{id}:
 *   get:
 *     summary: 단일 질문 조회 (관리자용)
 *     description: 특정 ID의 질문 상세 정보를 조회합니다.
 *     tags: [Question]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 질문 ID
 *     responses:
 *       200:
 *         description: 질문 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Question'
 *       404:
 *         description: 질문을 찾을 수 없음
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
 *                   example: "질문을 찾을 수 없습니다"
 *       401:
 *         description: 인증 실패
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
 *                   example: "인증에 실패했습니다"
 *   put:
 *     summary: 질문 수정 (관리자용)
 *     description: 특정 ID의 질문 정보를 수정합니다.
 *     tags: [Question]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 질문 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateQuestionRequest'
 *     responses:
 *       200:
 *         description: 질문 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Question'
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
 *                   example: "유효하지 않은 입력 형식입니다"
 *       404:
 *         description: 질문을 찾을 수 없음
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
 *                   example: "질문을 찾을 수 없습니다"
 *       401:
 *         description: 인증 실패
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
 *                   example: "인증에 실패했습니다"
 *   delete:
 *     summary: 질문 삭제 (관리자용)
 *     description: 특정 ID의 질문을 삭제합니다.
 *     tags: [Question]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 질문 ID
 *     responses:
 *       200:
 *         description: 질문 삭제 성공
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
 *                   example: "질문이 삭제되었습니다"
 *       404:
 *         description: 질문을 찾을 수 없음
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
 *                   example: "질문을 찾을 수 없습니다"
 *       401:
 *         description: 인증 실패
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
 *                   example: "인증에 실패했습니다"
 */

/**
 * @swagger
 * /questions/today/question:
 *   get:
 *     summary: 오늘의 질문 조회 (공개 API)
 *     description: 오늘의 질문을 조회합니다.
 *     tags: [Question]
 *     responses:
 *       200:
 *         description: 오늘의 질문 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/TodayQuestion'
 *       404:
 *         description: 오늘의 질문이 없음
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
 *                   example: "오늘의 질문이 없습니다"
 */