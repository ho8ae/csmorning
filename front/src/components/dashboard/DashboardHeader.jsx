import React from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import AccountLinkButton from './AccountLinkButton';

const DashboardHeader = () => {
  const { user, logout } = useAuthStore();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-xl font-semibold text-gray-900">
            안녕하세요, {user?.nickname || '사용자'}님!
          </h1>
          
          <div className="flex items-center space-x-4">
            <AccountLinkButton />
            
            <button
              onClick={logout}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;