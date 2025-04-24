import { useState } from 'react';
import { FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const LogoutButton = ({ onLogout }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      try {
        setIsLoggingOut(true);
        await onLogout();
        navigate('/login');
      } catch (error) {
        console.error('로그아웃 중 오류:', error);
        alert('로그아웃 중 오류가 발생했습니다.');
      } finally {
        setIsLoggingOut(false);
      }
    }
  };

  return (
    <div className="fixed bottom-6 right-6">
      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="flex items-center justify-center px-4 py-2 text-white bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        <FiLogOut className="mr-2" />
        {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
      </button>
    </div>
  );
};

export default LogoutButton;