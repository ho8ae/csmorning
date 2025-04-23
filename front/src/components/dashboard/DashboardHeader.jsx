import React from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import AccountLinkButton from './AccountLinkButton';

const DashboardHeader = () => {
  const { user } = useAuthStore();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 mb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4">
          <div className="flex flex-col md:flex-row w-full gap-4 md:justify-center items-center">
            <AccountLinkButton />

            <Link
              to="/premium-features"
              className="flex items-center justify-center w-full md:w-auto h-12 px-4 bg-blue-800 hover:bg-blue-900 text-white font-medium rounded-md transition-colors duration-200"
            >
              <p className="text-sm whitespace-nowrap">여러가지 기능 맛보기(개발 중)</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-1 flex-shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;