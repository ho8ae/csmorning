import axios from 'axios';

// API 기본 URL 설정
const isProd = import.meta.env.VITE_MODE === 'production';
const API_URL = isProd ? 'https://csmorning.co.kr/api' : 'http://localhost:3000/api';

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 - 모든 요청에 인증 토큰 추가
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 응답 인터셉터 - 에러 처리
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // 인증 에러 - 로그인 페이지로 리다이렉트
      localStorage.removeItem('auth_token');
      // 관리자 페이지인 경우 관리자 로그인으로, 아니면 기본 로그인으로 리다이렉트
      const isAdminPage = window.location.pathname.startsWith('/admin');
      window.location.href = isAdminPage ? '/login' : '/';
    }
    return Promise.reject(error);
  },
);

// 인증 관련 API
export const authAPI = {
  // 회원가입
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data.data;
  },

  // 일반 로그인 (관리자 및 일반 회원)
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data.data;
  },

  // 카카오 챗봇 계정 연동
  linkKakaoChannel: async (linkCode) => {
    const response = await apiClient.post('/auth/link-kakao-channel', { linkCode });
    return response.data;
  },

  // 카카오 로그인
  kakaoLogin: async (code) => {
    try {
      // GET 방식으로 변경
      const response = await apiClient.get('/auth/kakao', { params: { code } });
      return response.data.data;
    } catch (error) {
      console.error('카카오 API 에러:', error.response?.data || error.message);
      throw error;
    }
  },

  // 로그아웃
  logout: () => {
    localStorage.removeItem('auth_token');
    return apiClient.post('/auth/logout');
  },

  // 현재 사용자 정보 확인
  getMe: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data.data;
  },

  // 프리미엄 상태 업데이트
  updatePremium: async (isPremium, premiumPlan) => {
    const response = await apiClient.post('/auth/update-premium', {
      isPremium,
      premiumPlan
    });
    return response.data.data;
  },
  
  // 카카오 계정 연결 해제 (관리자용)
  unlinkKakaoUser: async (kakaoId) => {
    const response = await apiClient.post('/auth/admin/unlink-kakao-user', { kakaoId });
    return response.data;
  }
};

// 질문 관련 API
export const questionsAPI = {
  getAll: async (filters = {}) => {
    const response = await apiClient.get('/questions', { params: filters });
    return response.data.data;
  },
  getById: async (id) => {
    const response = await apiClient.get(`/questions/${id}`);
    return response.data.data;
  },
  create: async (questionData) => {
    const response = await apiClient.post('/questions', questionData);
    return response.data.data;
  },
  update: async (id, questionData) => {
    const response = await apiClient.put(`/questions/${id}`, questionData);
    return response.data.data;
  },
  delete: async (id) => {
    const response = await apiClient.delete(`/questions/${id}`);
    return response.data;
  },
  sendQuestion: async (questionId) => {
    const response = await apiClient.post('/admin/questions/send', {
      questionId,
    });
    return response.data;
  },
  getTodayQuestion: async () => {
    const response = await apiClient.get('/questions/today/question');
    return response.data.data;
  },
};

// 사용자 관련 API
export const usersAPI = {
  getAll: async () => {
    const response = await apiClient.get('/admin/users');
    return response.data.data;
  },
  getById: async (id) => {
    const response = await apiClient.get(`/admin/users/${id}`);
    return response.data.data;
  },
  update: async (id, userData) => {
    const response = await apiClient.put(`/admin/users/${id}`, userData);
    return response.data.data;
  },
  toggleSubscription: async (id, isSubscribed) => {
    const response = await apiClient.patch(`/admin/users/${id}/subscription`, { 
      isSubscribed: !isSubscribed 
    });
    return response.data.data;
  },
  updatePremium: async (id, isPremium, durationMonths = 1) => {
    const response = await apiClient.patch(`/admin/users/${id}/premium`, { 
      isPremium,
      durationMonths
    });
    return response.data.data;
  },
  unlinkKakao: async (id) => {
    const response = await apiClient.post(`/admin/users/${id}/unlink-kakao`);
    return response.data;
  },
  // 계정 상태 변경 (활성화/비활성화)
  toggleAccountStatus: async (id, isActive) => {
    const response = await apiClient.patch(`/admin/users/${id}/status`, { 
      isActive 
    });
    return response.data.data;
  }
};

// 기부 관련 API
export const donationsAPI = {
  getAll: async () => {
    const response = await apiClient.get('/admin/donations');
    return response.data.data;
  },
  getStats: async () => {
    const response = await apiClient.get('/admin/stats/donations');
    return response.data.data;
  },
};

// 대시보드 관련 API
export const statsAPI = {
  getResponseStats: async () => {
    const response = await apiClient.get('/admin/stats/responses');
    return response.data.data;
  },
  getDonationStats: async () => {
    const response = await apiClient.get('/admin/stats/donations');
    return response.data.data;
  },
};

// 프리미엄 기능 관련 API
export const premiumAPI = {
  // 활동 캘린더(잔디) 데이터 조회
  getActivityCalendar: async (startDate, endDate) => {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    
    const response = await apiClient.get('/premium/activity-calendar', { params });
    return response.data.data;
  },
  
  // 성별 통계 조회
  getStatisticsByGender: async () => {
    const response = await apiClient.get('/premium/statistics/gender');
    return response.data.data;
  },
  
  // 연령대별 통계 조회
  getStatisticsByAgeGroup: async () => {
    const response = await apiClient.get('/premium/statistics/age-group');
    return response.data.data;
  },
  
  // 상위 성과자 조회
  getTopPerformers: async (limit = 10) => {
    const response = await apiClient.get('/premium/statistics/top-performers', { 
      params: { limit } 
    });
    return response.data.data;
  },
  
  // 토론 목록 조회
  getDiscussions: async (type, page = 1, limit = 10) => {
    const params = { page, limit };
    if (type) params.type = type;
    
    const response = await apiClient.get('/premium/discussions', { params });
    return response.data.data;
  },
  
  // 토론 상세 조회
  getDiscussionById: async (id) => {
    const response = await apiClient.get(`/premium/discussions/${id}`);
    return response.data.data;
  },
};

export default {
  auth: authAPI,
  questions: questionsAPI,
  users: usersAPI,
  donations: donationsAPI,
  stats: statsAPI,
  premium: premiumAPI,
};