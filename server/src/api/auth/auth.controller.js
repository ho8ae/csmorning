const authService = require('./auth.service');
const webhookService = require('../webhook/services/webhook.service');
const kakaoService = require('../../services/kakao.service');
/**
 * 관리자 로그인 처리
 */
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const result = await authService.login(username, password);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 일반 회원가입 처리
 */
const register = async (req, res, next) => {
  try {
    const {
      email,
      password,
      nickname,
      name,
      gender,
      ageGroup,
      birthDate,
      birthYear,
      phoneNumber,
    } = req.body;

    const result = await authService.register(
      email,
      password,
      nickname,
      name,
      gender,
      ageGroup,
      birthDate,
      birthYear,
      phoneNumber,
    );

    return res.status(201).json({
      success: true,
      data: result,
      message: '회원가입이 완료되었습니다.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 카카오 로그인 처리
 */
const kakaoLogin = async (req, res, next) => {
  console.log('카카오 로그인 요청 받음:', req.query);
  try {
    const code = req.query.code;
    if (!code) {
      console.log('코드 누락됨');
      return res.status(400).json({
        success: false,
        message: '인증 코드가 필요합니다.',
      });
    }

    console.log('인증 코드로 처리 시작:', code);
    const result = await authService.processKakaoLogin(code);

    console.log('카카오 로그인 성공:', result);
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('카카오 로그인 처리 에러:', error);
    next(error);
  }
};

/**
 * 카카오 로그인 리다이렉트 처리
 */
const redirectToFrontendCallback = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('Missing code');
  }

  const redirectUrl = `${process.env.SERVICE_URL}/kakao/callback?code=${code}`;
  return res.redirect(redirectUrl);
};

/**
 * 카카오 싱크 콜백 처리
 * (카카오 싱크 플러그인에서 호출됨)
 */
const handleKakaoSyncCallback = async (req, res) => {
  console.log('카카오 싱크 콜백 요청 도착:', req.query);
  try {
    const { code, continue: continueUrl } = req.query;

    if (!code || !continueUrl) {
      return res.status(400).json({ message: 'code 또는 continue URL 누락' });
    }

    // 토큰 받기
    const tokenResponse = await kakaoService.getToken(code);
    console.log('카카오 토큰 응답:', tokenResponse);

    if (!tokenResponse || !tokenResponse.access_token) {
      return res.status(500).json({ message: '카카오 토큰 요청 실패' });
    }

    const { access_token, refresh_token } = tokenResponse;

    // 카카오 사용자 정보 및 동의 항목 가져오기
    const userInfo = await kakaoService.getUserInfo(access_token);
    const agreements = await kakaoService.getAgreements(access_token);
    
    console.log('카카오 싱크 사용자 정보:', {
      id: userInfo.id,
      has_account: !!userInfo.kakao_account,
      connected_at: userInfo.connected_at
    });
    
    console.log('카카오 싱크 동의 항목:', agreements);
    
    // 사용자 찾거나 생성
    const user = await authService.findOrCreateKakaoUser(userInfo);
    
    // JWT 토큰 생성
    const token = generateToken({ userId: user.id });
    
    // 쿠키에 토큰 저장 (선택 사항)
    // res.cookie('auth_token', token, {
    //   httpOnly: true, // 클라이언트 JavaScript에서 접근 불가
    //   secure: process.env.NODE_ENV === 'production', // HTTPS에서만 전송
    //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
    //   sameSite: 'lax' // CSRF 보호
    // });
    
    // 리다이렉트 URL에 토큰 및 사용자 ID 추가 (프론트엔드에서 처리할 수 있도록)
    const redirectWithParams = `${continueUrl}?auth_token=${token}&user_id=${user.id}`;
    
    // 클라이언트로 리다이렉트
    return res.redirect(302, redirectWithParams);
  } catch (error) {
    console.error('카카오 싱크 콜백 처리 실패:', error);
    
    // 에러 로깅 강화
    if (error.response) {
      console.error('에러 응답 데이터:', error.response.data);
      console.error('에러 응답 상태:', error.response.status);
    }
    
    // 에러 발생 시 에러 페이지로 리다이렉트 (선택 사항)
    const errorRedirect = req.query.continue 
      ? `${req.query.continue}?error=auth_failed`
      : '/error?message=kakao_sync_failed';
      
    return res.redirect(302, errorRedirect);
  }
};

/**
 * 현재 인증된 사용자 정보 조회
 */
const getMe = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 로그아웃 처리
 * (클라이언트 측에서 토큰 삭제 필요)
 */
const logout = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: '로그아웃되었습니다.',
  });
};

/**
 * 카카오 챗봇 계정 연동
 */
const linkKakaoChannel = async (req, res) => {
  try {
    const { linkCode } = req.body;
    const userId = req.user.id; // 현재 로그인한 사용자 ID

    if (!linkCode) {
      return res.status(400).json({
        success: false,
        message: '연동 코드가 제공되지 않았습니다.',
      });
    }

    // 계정 연동 수행
    const result = await webhookService.linkUserAccounts(
      req.prisma,
      linkCode,
      userId,
    );

    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error('카카오 챗봇 계정 연동 중 오류 발생:', error);
    return res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다.',
    });
  }
};

/**
 * 사용자 프리미엄 상태 업데이트
 */
const updatePremium = async (req, res, next) => {
  try {
    const userId = req.user.id; // 현재 로그인한 사용자 ID
    const { isPremium, premiumPlan } = req.body;

    // 프리미엄 상태 업데이트
    const updatedUser = await authService.updateUserPremium(
      userId,
      isPremium,
      premiumPlan,
    );

    return res.status(200).json({
      success: true,
      data: { user: updatedUser },
      message: '프리미엄 상태가 업데이트되었습니다.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 카카오 통합 웹훅 처리
 * 연결 끊기 및 계정 상태 변경 이벤트 모두 처리
 */
const handleKakaoWebhook = async (req, res) => {
  try {
    console.log('카카오 웹훅 수신:', req.body);

    // Content-Type 확인
    const contentType = req.headers['content-type'] || '';

    // 연결 끊기 웹훅 처리 (application/x-www-form-urlencoded)
    if (
      contentType.includes('application/x-www-form-urlencoded') ||
      (req.body.app_id && req.body.user_id && req.body.referrer_type)
    ) {
      return handleUnlinkWebhook(req, res);
    }

    // 계정 상태 변경 웹훅 처리 (application/secevent+jwt)
    if (
      contentType.includes('application/secevent+jwt') ||
      typeof req.body === 'string'
    ) {
      return handleAccountStatusWebhook(req, res);
    }

    // 기타 웹훅 이벤트 (JSON 형식)
    if (contentType.includes('application/json')) {
      // 이벤트 유형에 따른 처리
      const eventType = req.body.type || '';

      switch (eventType) {
        case 'user.linked':
          return handleUserLinked(req, res);

        case 'user.unlinked':
          return handleUserUnlinked(req, res);

        case 'user.scope.consent':
          return handleUserScopeConsent(req, res);

        case 'user.scope.withdraw':
          return handleUserScopeWithdraw(req, res);

        default:
          console.log(`지원하지 않는 이벤트 타입: ${eventType}`);
      }
    }

    // 알 수 없는 웹훅 형식
    console.log('알 수 없는 웹훅 형식:', req.body);
    return res.status(200).end(); // 카카오 웹훅은 200 응답을 기대함
  } catch (error) {
    console.error('카카오 웹훅 처리 오류:', error);
    // 오류가 발생해도 200 OK 응답을 보내야 함 (카카오 웹훅 요구사항)
    return res.status(200).end();
  }
};

// 연결 끊기 웹훅 처리
const handleUnlinkWebhook = async (req, res) => {
  try {
    console.log('카카오 연결 끊기 웹훅 처리:', req.body);

    // 어드민 키 검증
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('KakaoAK ')) {
      console.error('어드민 키 인증 실패');
      return res.status(401).json({ message: '인증 실패' });
    }

    const adminKey = authHeader.replace('KakaoAK ', '');
    if (adminKey !== process.env.KAKAO_ADMIN_KEY) {
      console.error('잘못된 어드민 키');
      return res.status(401).json({ message: '인증 실패' });
    }

    // 필수 파라미터 검증
    const { app_id, user_id, referrer_type } = req.body;
    if (!app_id || !user_id || !referrer_type) {
      console.error('필수 파라미터 누락');
      return res.status(400).json({ message: '필수 파라미터 누락' });
    }

    // 앱 ID 확인
    if (app_id !== process.env.KAKAO_APP_ID) {
      console.error('앱 ID 불일치');
      return res.status(400).json({ message: '앱 ID 불일치' });
    }

    // 사용자 연결 끊기 처리
    const kakaoId = user_id.toString();
    const user = await prisma.user.findFirst({
      where: { kakaoId },
    });

    if (user) {
      console.log(
        `사용자 ${user.id}(${
          user.nickname || user.email || kakaoId
        }) 연결 끊기 처리 시작`,
      );

      // 연결 끊기 처리 방식에 따라 구현
      // 여기서는 카카오 ID만 제거하고 계정 유지
      await prisma.user.update({
        where: { id: user.id },
        data: { kakaoId: null },
      });

      console.log(`사용자 ${user.id} 연결 끊기 처리 완료`);
    } else {
      console.log(`카카오 ID ${kakaoId}와 연결된 사용자를 찾을 수 없음`);
    }

    // 카카오는 3초 이내 200 OK 응답을 기대함
    return res.status(200).end();
  } catch (error) {
    console.error('카카오 연결 끊기 웹훅 처리 오류:', error);
    return res.status(200).end();
  }
};

// 사용자 연결됨 이벤트 처리
const handleUserLinked = async (req, res) => {
  const { user_id } = req.body;
  console.log(`사용자 ${user_id} 연결됨`);
  // 여기에 연결됨 처리 로직 구현
  return res.status(200).end();
};

// 사용자 연결 끊김 이벤트 처리
const handleUserUnlinked = async (req, res) => {
  const { user_id, reason } = req.body;
  console.log(`사용자 ${user_id} 연결 끊김 (이유: ${reason})`);

  const kakaoId = user_id.toString();
  const user = await prisma.user.findFirst({
    where: { kakaoId },
  });

  if (user) {
    // 연결 끊김 처리
    await prisma.user.update({
      where: { id: user.id },
      data: { kakaoId: null },
    });
  }

  return res.status(200).end();
};

// 사용자 동의항목 동의 이벤트 처리
const handleUserScopeConsent = async (req, res) => {
  const { user_id, scope } = req.body;
  console.log(`사용자 ${user_id} 동의항목 동의: ${scope}`);
  // 여기에 동의항목 동의 처리 로직 구현
  return res.status(200).end();
};

// 사용자 동의항목 철회 이벤트 처리
const handleUserScopeWithdraw = async (req, res) => {
  const { user_id, scope } = req.body;
  console.log(`사용자 ${user_id} 동의항목 철회: ${scope}`);
  // 여기에 동의항목 철회 처리 로직 구현
  return res.status(200).end();
};

/**
 * 카카오 사용자 연결 끊기 (관리자용)
 */
const unlinkKakaoUser = async (req, res, next) => {
  try {
    const { kakaoId } = req.body;
    
    if (!kakaoId) {
      return res.status(400).json({
        success: false,
        message: 'kakaoId 파라미터가 필요합니다.'
      });
    }
    
    const result = await kakaoService.unlinkKakaoUser(kakaoId);
    
    return res.status(200).json({
      success: true,
      message: '카카오 연결이 성공적으로 해제되었습니다.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 사용자 학습 모드 업데이트
 */
const updateStudyMode = async (req, res, next) => {
  try {
    const userId = req.user.id; // 현재 로그인한 사용자 ID
    const { studyMode } = req.body;

    // 학습 모드 업데이트
    const updatedUser = await authService.updateUserStudyMode(
      userId,
      studyMode,
    );

    return res.status(200).json({
      success: true,
      data: { user: updatedUser },
      message: '학습 모드가 업데이트되었습니다.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  kakaoLogin,
  getMe,
  logout,
  redirectToFrontendCallback,
  linkKakaoChannel,
  register,
  updatePremium,
  handleKakaoSyncCallback,
  handleUnlinkWebhook,
  handleKakaoWebhook,
  unlinkKakaoUser,
  updateStudyMode
};
