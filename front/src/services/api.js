import axios from 'axios';

// API 기본 URL 설정
const API_URL = import.meta.env.REACT_APP_API_URL || 'https://csmorning.co.kr/api';

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
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers['x-api-key'] = token;
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
      localStorage.removeItem('admin_token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// 인증 관련 API
export const authAPI = {
  login: async (credentials) => {
    const response = await apiClient.post('/admin/login', credentials);
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('admin_token');
  },
  checkAuth: async () => {
    const response = await apiClient.get('/admin/check-auth');
    return response.data;
  },
};

// 질문 관련 API
export const questionsAPI = {
  getAll: async (filters = {}) => {
    const response = await apiClient.get('/questions', { params: filters });
    return response.data;
  },
  getById: async (id) => {
    const response = await apiClient.get(`/questions/${id}`);
    return response.data;
  },
  create: async (questionData) => {
    const response = await apiClient.post('/questions', questionData);
    return response.data;
  },
  update: async (id, questionData) => {
    const response = await apiClient.put(`/questions/${id}`, questionData);
    return response.data;
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
    return response.data;
  },
};

// 사용자 관련 API
export const usersAPI = {
  getAll: async () => {
    const response = await apiClient.get('/admin/users');
    return response.data;
  },
  getById: async (id) => {
    const response = await apiClient.get(`/admin/users/${id}`);
    return response.data;
  },
  update: async (id, userData) => {
    const response = await apiClient.put(`/admin/users/${id}`, userData);
    return response.data;
  },
};

// 기부 관련 API
export const donationsAPI = {
  getAll: async () => {
    const response = await apiClient.get('/admin/donations');
    return response.data;
  },
  getStats: async () => {
    const response = await apiClient.get('/admin/stats/donations');
    return response.data;
  },
};

// 대시보드 관련 API
export const statsAPI = {
  getResponseStats: async () => {
    const response = await apiClient.get('/admin/stats/responses');
    return response.data;
  },
  getDonationStats: async () => {
    const response = await apiClient.get('/admin/stats/donations');
    return response.data;
  },
};

export default {
  auth: authAPI,
  questions: questionsAPI,
  users: usersAPI,
  donations: donationsAPI,
  stats: statsAPI,
};