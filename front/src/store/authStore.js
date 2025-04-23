import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '../services/api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      token: localStorage.getItem('auth_token') || null,
      user: null,
      isAuthenticated: !!localStorage.getItem('auth_token'),
      isLoading: false,
      error: null,
      
      // 회원가입
      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          // authAPI에 register 함수 추가 필요
          const { token, user } = await authAPI.register(userData);
          
          localStorage.setItem('auth_token', token);
          
          set({ 
            token,
            user, 
            isAuthenticated: true, 
            isLoading: false 
          });
          
          return { token, user };
        } catch (error) {
          const errorMessage = error.response?.data?.message || '회원가입에 실패했습니다.';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },
      
      // 일반 로그인 (관리자용)
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const { token, user } = await authAPI.login(credentials);

          console.log('로그인 성공:', { token, user });
          
          localStorage.setItem('auth_token', token);
          
          set({ 
            token,
            user, 
            isAuthenticated: true, 
            isLoading: false 
          });
          
          return { token, user };
        } catch (error) {
          const errorMessage = error.response?.data?.message || '로그인에 실패했습니다.';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },
      
      // 카카오 로그인
      loginWithKakao: async (code) => {
        set({ isLoading: true, error: null });
        try {
          const { token, user } = await authAPI.kakaoLogin(code);
          
          localStorage.setItem('auth_token', token);
          
          set({ 
            token,
            user, 
            isAuthenticated: true, 
            isLoading: false 
          });
          
          return { token, user };
        } catch (error) {
          const errorMessage = error.response?.data?.message || '카카오 로그인에 실패했습니다.';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },
      
      // 로그아웃
      logout: async () => {
        try {
          await authAPI.logout();
        } catch (error) {
          console.error('로그아웃 API 오류:', error);
        }
        
        localStorage.removeItem('auth_token');
        
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          error: null
        });
      },
      
      // 현재 인증 상태 확인
      checkAuth: async () => {
        const { token } = get();
        
        if (!token) return null;
        
        set({ isLoading: true });
        
        try {
          const { user } = await authAPI.getMe();
          
          set({
            user,
            isAuthenticated: true,
            isLoading: false
          });
          
          return user;
        } catch (error) {
          console.error('인증 확인 실패:', error);
          
          localStorage.removeItem('auth_token');
          
          set({ 
            token: null,
            user: null, 
            isAuthenticated: false, 
            isLoading: false 
          });
          
          return null;
        }
      }
    }),
    {
      name: 'auth-storage',
      // persist에는 token만 저장
      partialize: (state) => ({ token: state.token })
    }
  )
);

export default useAuthStore;