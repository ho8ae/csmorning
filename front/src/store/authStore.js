import { create } from 'zustand';
import { authAPI } from '../services/api';

const useAuthStore = create((set) => ({
  isAuthenticated: !!localStorage.getItem('admin_token'),
  user: null,
  isLoading: false,
  error: null,
  
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authAPI.login(credentials);
      localStorage.setItem('admin_token', data.token);
      set({ isAuthenticated: true, user: data.user, isLoading: false });
      return data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || '로그인에 실패했습니다', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  logout: () => {
    authAPI.logout();
    set({ isAuthenticated: false, user: null });
  },
  
  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const data = await authAPI.checkAuth();
      set({ isAuthenticated: true, user: data.user, isLoading: false });
      return data;
    } catch (error) {
      authAPI.logout();
      set({ isAuthenticated: false, user: null, isLoading: false });
      throw error;
    }
  }
}));

export default useAuthStore;