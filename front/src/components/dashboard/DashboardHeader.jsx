import React from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import AccountLinkButton from './AccountLinkButton';

const DashboardHeader = () => {
  const { user } = useAuthStore();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 mb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <h1 className="md:text-xl text-smfont-semibold text-gray-900">
            안녕하세요, {user?.nickname || '사용자'}님!
          </h1>
          
          <div className="flex items-center space-x-4">
            <AccountLinkButton />

            <Link 
              to="/premium-features" 
              className="inline-flex items-center md:px-4 md:py-2 bg-blue-800 hover:bg-blue-900 text-white font-medium rounded-md transition-colors duration-200"
            >
              {/* 들여쓰기 p */}
              <p className='text-sm p-0.5'>더 많은 기능 이용하기</p>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;