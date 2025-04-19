/**
 * @swagger
 * tags:
 *   name: Premium
 *   description: 프리미엄 기능 API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ActivityData:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 활동 ID
 *         userId:
 *           type: integer
 *           description: 사용자 ID
 *         date:
 *           type: string
 *           format: date
 *           description: 활동 날짜
 *         count:
 *           type: integer
 *           description: 활동 횟수
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 생성 시간
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: 수정 시간
 * 
 *     GenderStatistics:
 *       type: object
 *       properties:
 *         totalUsers:
 *           type: integer
 *           description: 전체 사용자 수
 *         genderDistribution:
 *           type: object
 *           properties:
 *             male:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: 남성 사용자 수
 *                 percentage:
 *                   type: string
 *                   description: 남성 사용자 비율 (%)
 *                 totalAnswered:
 *                   type: integer
 *                   description: 총 응답 수
 *                 correctAnswers:
 *                   type: integer
 *                   description: 정답 수
 *                 correctRate:
 *                   type: string
 *                   description: 정답률 (%)
 *             female:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: 여성 사용자 수
 *                 percentage:
 *                   type: string
 *                   description: 여성 사용자 비율 (%)
 *                 totalAnswered:
 *                   type: integer
 *                   description: 총 응답 수
 *                 correctAnswers:
 *                   type: integer
 *                   description: 정답 수
 *                 correctRate:
 *                   type: string
 *                   description: 정답률 (%)
 * 
 *     AgeGroupStatistics:
 *       type: object
 *       properties:
 *         byAgeGroup:
 *           type: object
 *           additionalProperties:
 *             type: object
 *             properties:
 *               count:
 *                 type: integer
 *                 description: 사용자 수
 *               totalAnswered:
 *                 type: integer
 *                 description: 총 응답 수
 *               correctAnswers:
 *                 type: integer
 *                 description: 정답 수
 *               correctRate:
 *                 type: string
 *                 description: 정답률 (%)
 * 
 *     TopPerformer:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 사용자 ID
 *         nickname:
 *           type: string
 *           description: 닉네임
 *         totalAnswered:
 *           type: integer
 *           description: 총 응답 수
 *         correctAnswers:
 *           type: integer
 *           description: 정답 수
 *         correctRate:
 *           type: string
 *           description: 정답률 (%)
 *         gender:
 *           type: string
 *           description: 성별
 *         ageGroup:
 *           type: string
 *           description: 연령대
 * 
 *     CategoryPerformance:
 *       type: object
 *       additionalProperties:
 *         type: object
 *         properties:
 *           totalAnswered:
 *             type: integer
 *             description: 총 응답 수
 *           correctAnswers:
 *             type: integer
 *             description: 정답 수
 *           correctRate:
 *             type: string
 *             description: 정답률 (%)
 * 
 *     Discussion:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 토론 ID
 *         title:
 *           type: string
 *           description: 토론 제목
 *         description:
 *           type: string
 *           description: 토론 설명
 *         type:
 *           type: string
 *           enum: [debate, free]
 *           description: 토론 유형 
 *           example: debate 찬반 토론 , free 자유 토론
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 생성 시간
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: 수정 시간
 *         _count:
 *           type: object
 *           properties:
 *             comments:
 *               type: integer
 *               description: 댓글 수
 *             reactions:
 *               type: integer
 *               description: 반응 수
 * 
 *     DiscussionDetail:
 *       allOf:
 *         - $ref: '#/components/schemas/Discussion'
 *         - type: object
 *           properties:
 *             comments:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *             reactions:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reaction'
 *             debateStats:
 *               type: object
 *               properties:
 *                 forCount:
 *                   type: integer
 *                   description: 찬성 수
 *                 againstCount:
 *                   type: integer
 *                   description: 반대 수
 *                 forPercentage:
 *                   type: string
 *                   description: 찬성 비율 (%)
 *                 againstPercentage:
 *                   type: string
 *                   description: 반대 비율 (%)
 *             emojiStats:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   emoji:
 *                     type: string
 *                     description: 이모지
 *                   count:
 *                     type: integer
 *                     description: 개수
 * 
 *     Comment:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 댓글 ID
 *         discussionId:
 *           type: integer
 *           description: 토론 ID
 *         userId:
 *           type: integer
 *           description: 사용자 ID
 *         content:
 *           type: string
 *           description: 댓글 내용
 *         stance:
 *           type: string
 *           enum: [for, against, neutral]
 *           description: 의견 (찬성/반대/중립)
 *         parentId:
 *           type: integer
 *           nullable: true
 *           description: 부모 댓글 ID (대댓글인 경우)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 생성 시간
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: 수정 시간
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               description: 사용자 ID
 *             nickname:
 *               type: string
 *               description: 닉네임
 *             profileImage:
 *               type: string
 *               nullable: true
 *               description: 프로필 이미지 URL
 *         replies:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Comment'
 *           description: 대댓글
 *         _count:
 *           type: object
 *           properties:
 *             replies:
 *               type: integer
 *               description: 대댓글 수
 * 
 *     Reaction:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 반응 ID
 *         discussionId:
 *           type: integer
 *           description: 토론 ID
 *         userId:
 *           type: integer
 *           description: 사용자 ID
 *         commentId:
 *           type: integer
 *           nullable: true
 *           description: 댓글 ID (댓글에 대한 반응인 경우)
 *         emoji:
 *           type: string
 *           description: 이모지
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 생성 시간
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               description: 사용자 ID
 *             nickname:
 *               type: string
 *               description: 닉네임
 * 
 *     CreateDiscussionRequest:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - type
 *       properties:
 *         title:
 *           type: string
 *           description: 토론 제목
 *         description:
 *           type: string
 *           description: 토론 설명
 *         type:
 *           type: string
 *           enum: [debate, free]
 *           description: 토론 유형 
 *           example: debate 찬반 토론 , free 자유 토론
 * 
 *     CreateCommentRequest:
 *       type: object
 *       required:
 *         - content
 *       properties:
 *         content:
 *           type: string
 *           description: 댓글 내용
 *         stance:
 *           type: string
 *           enum: [for, against, neutral]
 *           description: 의견 (찬성/반대/중립)
 *         parentId:
 *           type: integer
 *           nullable: true
 *           description: 부모 댓글 ID (대댓글인 경우)
 * 
 *     AddReactionRequest:
 *       type: object
 *       required:
 *         - emoji
 *       properties:
 *         emoji:
 *           type: string
 *           description: 이모지
 *         commentId:
 *           type: integer
 *           nullable: true
 *           description: 댓글 ID (댓글에 대한 반응인 경우)
 * 
 *     ApiResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: 요청 성공 여부
 *         data:
 *           type: object
 *           description: 응답 데이터
 *         message:
 *           type: string
 *           description: 응답 메시지
 */

/**
 * @swagger
 * /api/premium/activity-calendar:
 *   get:
 *     summary: 사용자의 활동 캘린더(잔디) 데이터 조회
 *     tags: [Premium]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: 시작 날짜 (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: 종료 날짜 (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: 활동 캘린더 데이터 조회 성공
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
 *                     $ref: '#/components/schemas/ActivityData'
 *       401:
 *         description: 인증되지 않은 요청
 *       403:
 *         description: 권한 없음
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /api/premium/statistics/gender:
 *   get:
 *     summary: 성별에 따른 통계 조회
 *     tags: [Premium]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 성별 통계 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/GenderStatistics'
 *       401:
 *         description: 인증되지 않은 요청
 *       403:
 *         description: 권한 없음
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /api/premium/statistics/age-group:
 *   get:
 *     summary: 연령대별 통계 조회
 *     tags: [Premium]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 연령대별 통계 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/AgeGroupStatistics'
 *       401:
 *         description: 인증되지 않은 요청
 *       403:
 *         description: 권한 없음
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /api/premium/statistics/top-performers:
 *   get:
 *     summary: 상위 성과자 조회
 *     tags: [Premium]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 조회할 사용자 수
 *     responses:
 *       200:
 *         description: 상위 성과자 조회 성공
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
 *                     $ref: '#/components/schemas/TopPerformer'
 *       401:
 *         description: 인증되지 않은 요청
 *       403:
 *         description: 권한 없음
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /api/premium/statistics/category-performance:
 *   get:
 *     summary: 사용자의 카테고리별 성과 조회
 *     tags: [Premium]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 카테고리별 성과 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/CategoryPerformance'
 *       401:
 *         description: 인증되지 않은 요청
 *       403:
 *         description: 권한 없음
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /api/premium/discussions:
 *   get:
 *     summary: 토론 목록 조회
 *     tags: [Premium]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [debate, free]
 *         description: 토론 유형 (debate 또는 free)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 페이지 번호
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 페이지당 항목 수
 *     responses:
 *       200:
 *         description: 토론 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     discussions:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Discussion'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         totalCount:
 *                           type: integer
 *                           description: 전체 항목 수
 *                         totalPages:
 *                           type: integer
 *                           description: 전체 페이지 수
 *                         currentPage:
 *                           type: integer
 *                           description: 현재 페이지
 *                         pageSize:
 *                           type: integer
 *                           description: 페이지 크기
 *       401:
 *         description: 인증되지 않은 요청
 *       403:
 *         description: 권한 없음
 *       500:
 *         description: 서버 오류
 *   
 *   post:
 *     summary: 토론 생성
 *     tags: [Premium]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDiscussionRequest'
 *     responses:
 *       201:
 *         description: 토론 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Discussion'
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: 인증되지 않은 요청
 *       403:
 *         description: 권한 없음
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /api/premium/discussions/{id}:
 *   get:
 *     summary: 토론 상세 조회
 *     tags: [Premium]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 토론 ID
 *     responses:
 *       200:
 *         description: 토론 상세 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/DiscussionDetail'
 *       401:
 *         description: 인증되지 않은 요청
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 토론을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /api/premium/discussions/{id}/comments:
 *   post:
 *     summary: 댓글 추가
 *     tags: [Premium]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 토론 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCommentRequest'
 *     responses:
 *       201:
 *         description: 댓글 추가 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Comment'
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: 인증되지 않은 요청
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 토론을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /api/premium/discussions/{id}/reactions:
 *   post:
 *     summary: 반응 추가
 *     tags: [Premium]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 토론 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddReactionRequest'
 *     responses:
 *       201:
 *         description: 반응 추가 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Reaction'
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: 인증되지 않은 요청
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 토론을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 *   
 *   delete:
 *     summary: 반응 삭제
 *     tags: [Premium]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 토론 ID
 *       - in: query
 *         name: emoji
 *         required: true
 *         schema:
 *           type: string
 *         description: 이모지
 *       - in: query
 *         name: commentId
 *         schema:
 *           type: integer
 *         description: 댓글 ID (댓글에 대한 반응인 경우)
 *     responses:
 *       200:
 *         description: 반응 삭제 성공
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
 *                   example: 반응이 삭제되었습니다.
 *       401:
 *         description: 인증되지 않은 요청
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 반응을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */

