import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'; 
import useAuthStore from '../store/authStore';
import KakaoLoginButton from '../components/common/KakaoLoginButton';

function LoginPage() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const { isAuthenticated, isLoading, error, login, user } = useAuthStore();
  const navigate = useNavigate();
  const [isLoginMode, setIsLoginMode] = useState(true);
  
  // 입력 값이 변경될 때마다 로그인/회원가입 모드 전환
  useEffect(() => {
    const hasValues = credentials.username.trim() !== '' && credentials.password.trim() !== '';
    setIsLoginMode(hasValues);
  }, [credentials]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLoginMode) {
      // 로그인 모드
      try {
        await login(credentials);
      } catch (err) {
        console.error('로그인 실패:', err);
      }
    } else {
      // 회원가입 페이지로 이동
      navigate('/register');
    }
  };
  
  // 인증 완료 시 리다이렉트
  if (isAuthenticated) {
    // 관리자는 관리자 페이지로, 일반 사용자는 대시보드로 리다이렉트
    const redirectPath = user?.role === 'admin' ? '/admin' : '/dashboard';
    return <Navigate to={redirectPath} replace />;
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-900 to-blue-700">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-xl"
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold text-blue-900">CS Morning</h1>
          <p className="mt-2 text-gray-600">{isLoginMode ? '로그인' : '회원가입'}</p>
        </div>
        
        {error && (
          <div className="p-3 text-red-500 bg-red-100 rounded">
            {error}
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              아이디
            </label>
            <input
              id="username"
              name="username"
              type="text"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={credentials.username}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              비밀번호
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={credentials.password}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <motion.button
              type="submit"
              disabled={isLoading}
              className={`w-full px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 ${
                isLoginMode ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500' : 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? '처리 중...' : isLoginMode ? '로그인' : '회원가입'}
            </motion.button>
          </div>
          
          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate(isLoginMode ? '/register' : '/login')}
              className="text-sm text-blue-600 hover:underline"
            >
              {isLoginMode ? '계정이 없으신가요? 회원가입' : '이미 계정이 있으신가요? 로그인'}
            </button>
          </div>
        </form>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-gray-500 bg-white">또는</span>
            </div>
          </div>
          
          <div className="mt-6">
            <KakaoLoginButton />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default LoginPage;