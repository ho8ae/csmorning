import React, { useState } from 'react';
import { authAPI } from '../../services/api';
import useAuthStore from '../../store/authStore';

const AccountLinking = () => {
  const [linkCode, setLinkCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const { user } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!linkCode || linkCode.length !== 6) {
      setError('연동 코드는 6자리 숫자여야 합니다.');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authAPI.linkKakaoChannel(linkCode);
      
      setResult({
        success: true,
        message: response.message || '계정이 성공적으로 연동되었습니다.'
      });
      
      // 3초 후 모달 닫기 처리를 위한 상태 변경 함수를 props로 받을 수 있음
      setTimeout(() => {
        if (typeof onSuccess === 'function') {
          onSuccess();
        }
      }, 3000);
      
    } catch (error) {
      setError(error.response?.data?.message || '계정 연동에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">카카오톡 채널 계정 연동</h2>
      
      {!result ? (
        <>
          <p className="mb-4 text-gray-600">
            카카오톡 챗봇에서 받은 6자리 연동 코드를 입력해주세요.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="linkCode" className="block text-sm font-medium text-gray-700 mb-1">
                연동 코드
              </label>
              <input
                type="text"
                id="linkCode"
                value={linkCode}
                onChange={(e) => setLinkCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                placeholder="6자리 코드 입력"
                maxLength={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            
            <button
              type="submit"
              disabled={isLoading || linkCode.length !== 6}
              className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                isLoading || linkCode.length !== 6
                  ? 'bg-gray-400'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoading ? '연동 중...' : '계정 연동하기'}
            </button>
          </form>
        </>
      ) : (
        <div className="text-center py-4">
          <div className="mb-4">
            <svg 
              className="w-16 h-16 text-green-500 mx-auto" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">연동 완료!</h3>
          <p className="text-gray-600">{result.message}</p>
          <p className="text-sm text-gray-500 mt-2">잠시 후 자동으로 닫힙니다...</p>
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-2">도움말</h3>
        <ul className="text-xs text-gray-600 space-y-1 list-disc pl-5">
          <li>연동 코드는 카카오톡 CS Morning 채널에서 '계정 연동' 명령어를 입력하면 받을 수 있습니다.</li>
          <li>연동 코드는 발급 후 10분 동안만 유효합니다.</li>
          <li>계정을 연동하면 챗봇에서의 모든 응답 기록이 웹사이트 계정에 통합됩니다.</li>
        </ul>
      </div>
    </div>
  );
};

export default AccountLinking;