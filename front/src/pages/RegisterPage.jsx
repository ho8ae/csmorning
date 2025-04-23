import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import useAuthStore from '../store/authStore';

function RegisterPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, error, user } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    name: '',
    gender: '',
    ageGroup: '',
    birthDate: '',
    birthYear: '',
    phoneNumber: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // 폼 입력 처리
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // 실시간 유효성 검사 (선택적)
    if (name === 'confirmPassword') {
      setFormErrors((prev) => ({
        ...prev,
        confirmPassword: value !== formData.password ? '비밀번호가 일치하지 않습니다.' : null
      }));
    }
  };

  // 회원가입 요청
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    // 기본 유효성 검사
    const errors = {};
    if (!formData.email) errors.email = '이메일을 입력해주세요.';
    if (!formData.password) errors.password = '비밀번호를 입력해주세요.';
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }
    if (!formData.nickname) errors.nickname = '닉네임을 입력해주세요.';
    if (!formData.name) errors.name = '이름을 입력해주세요.';
    if (!formData.gender) errors.gender = '성별을 선택해주세요.';
    if (!formData.ageGroup) errors.ageGroup = '연령대를 선택해주세요.';
    if (!formData.birthDate) errors.birthDate = '생일을 입력해주세요.';
    if (!formData.birthYear) errors.birthYear = '출생연도를 입력해주세요.';
    if (!formData.phoneNumber) errors.phoneNumber = '전화번호를 입력해주세요.';
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setSubmitting(false);
      return;
    }
    
    try {
      // 회원가입 API 호출
      const { register } = useAuthStore.getState();
      await register(formData);
      
      // 성공 시 로그인 페이지 또는 대시보드로 이동
      navigate('/dashboard');
    } catch (error) {
      setFormErrors({ 
        submit: error.response?.data?.message || '회원가입 중 오류가 발생했습니다.' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  // 인증된 사용자는 대시보드로 리다이렉트
  if (isAuthenticated) {
    const redirectPath = user?.role === 'admin' ? '/admin' : '/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen py-12 bg-gradient-to-b from-blue-900 to-blue-700">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-blue-900">CS Morning</h1>
          <p className="mt-2 text-gray-600">회원가입</p>
        </div>

        {(error || formErrors.submit) && (
          <div className="p-3 mb-4 text-red-500 bg-red-100 rounded">
            {error || formErrors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 이메일 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                이메일 <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className={`w-full px-3 py-2 mt-1 border ${
                  formErrors.email ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                value={formData.email}
                onChange={handleChange}
              />
              {formErrors.email && (
                <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
              )}
            </div>

            {/* 닉네임 */}
            <div>
              <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">
                닉네임 <span className="text-red-500">*</span>
              </label>
              <input
                id="nickname"
                name="nickname"
                type="text"
                className={`w-full px-3 py-2 mt-1 border ${
                  formErrors.nickname ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                value={formData.nickname}
                onChange={handleChange}
              />
              {formErrors.nickname && (
                <p className="mt-1 text-sm text-red-500">{formErrors.nickname}</p>
              )}
            </div>

            {/* 비밀번호 */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                비밀번호 <span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className={`w-full px-3 py-2 mt-1 border ${
                  formErrors.password ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                value={formData.password}
                onChange={handleChange}
              />
              {formErrors.password && (
                <p className="mt-1 text-sm text-red-500">{formErrors.password}</p>
              )}
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                비밀번호 확인 <span className="text-red-500">*</span>
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className={`w-full px-3 py-2 mt-1 border ${
                  formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {formErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">{formErrors.confirmPassword}</p>
              )}
            </div>

            {/* 이름 */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                이름 <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className={`w-full px-3 py-2 mt-1 border ${
                  formErrors.name ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                value={formData.name}
                onChange={handleChange}
              />
              {formErrors.name && (
                <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
              )}
            </div>

            {/* 성별 */}
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                성별 <span className="text-red-500">*</span>
              </label>
              <select
                id="gender"
                name="gender"
                className={`w-full px-3 py-2 mt-1 border ${
                  formErrors.gender ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">선택해주세요</option>
                <option value="male">남성</option>
                <option value="female">여성</option>
              </select>
              {formErrors.gender && (
                <p className="mt-1 text-sm text-red-500">{formErrors.gender}</p>
              )}
            </div>

            {/* 연령대 */}
            <div>
              <label htmlFor="ageGroup" className="block text-sm font-medium text-gray-700">
                연령대 <span className="text-red-500">*</span>
              </label>
              <select
                id="ageGroup"
                name="ageGroup"
                className={`w-full px-3 py-2 mt-1 border ${
                  formErrors.ageGroup ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                value={formData.ageGroup}
                onChange={handleChange}
              >
                <option value="">선택해주세요</option>
                <option value="10~19">10~19세</option>
                <option value="20~29">20~29세</option>
                <option value="30~39">30~39세</option>
                <option value="40~49">40~49세</option>
                <option value="50~59">50~59세</option>
                <option value="60~">60세 이상</option>
              </select>
              {formErrors.ageGroup && (
                <p className="mt-1 text-sm text-red-500">{formErrors.ageGroup}</p>
              )}
            </div>

            {/* 출생연도 */}
            <div>
              <label htmlFor="birthYear" className="block text-sm font-medium text-gray-700">
                출생연도 <span className="text-red-500">*</span>
              </label>
              <input
                id="birthYear"
                name="birthYear"
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                className={`w-full px-3 py-2 mt-1 border ${
                  formErrors.birthYear ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                value={formData.birthYear}
                onChange={handleChange}
              />
              {formErrors.birthYear && (
                <p className="mt-1 text-sm text-red-500">{formErrors.birthYear}</p>
              )}
            </div>

            {/* 생일 */}
            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
                생일 <span className="text-red-500">*</span>
              </label>
              <input
                id="birthDate"
                name="birthDate"
                type="date"
                className={`w-full px-3 py-2 mt-1 border ${
                  formErrors.birthDate ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                value={formData.birthDate}
                onChange={handleChange}
              />
              {formErrors.birthDate && (
                <p className="mt-1 text-sm text-red-500">{formErrors.birthDate}</p>
              )}
            </div>

            {/* 전화번호 */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                전화번호 <span className="text-red-500">*</span>
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="010-0000-0000"
                className={`w-full px-3 py-2 mt-1 border ${
                  formErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                value={formData.phoneNumber}
                onChange={handleChange}
              />
              {formErrors.phoneNumber && (
                <p className="mt-1 text-sm text-red-500">{formErrors.phoneNumber}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between mt-6">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-sm text-blue-600 hover:underline"
            >
              이미 계정이 있으신가요? 로그인
            </button>
            
            <motion.button
              type="submit"
              disabled={submitting || isLoading}
              className="px-4 py-2 text-white bg-yellow-500 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {submitting ? '처리 중...' : '회원가입'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default RegisterPage;