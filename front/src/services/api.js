import axios from 'axios';

// API 기본 URL 설정

const isProd = import.meta.env.MODE === 'production';
const API_URL =
  import.meta.env.VITE_API_URL ||
  (isProd ? 'https://csmorning.co.kr' : 'http://localhost:3000');

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
  }
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
  }
);

// 인증 관련 API
export const authAPI = {
  // 일반 관리자 로그인
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data.data;
  },
  
  // 카카오 로그인 처리
  kakaoLogin: async (code) => {
    const response = await apiClient.post('/auth/kakao', { code });
    return response.data.data;
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
    const response = await apiClient.post('/admin/questions/send', { questionId });
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

export default {
  auth: authAPI,
  questions: questionsAPI,
  users: usersAPI,
  donations: donationsAPI,
  stats: statsAPI,
};