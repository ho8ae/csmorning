import React, { useState } from 'react';
import AccountLinkingModal from '../common/AccountLinkingModal';

const AccountLinkButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center md:px-4 md:py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
      >
        <svg 
          className="w-5 h-5 mr-2" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M13 10V3L4 14h7v7l9-11h-7z"
          ></path>
        </svg>
        <p className='text-sm p-0.5'>카카오톡 채널 연동</p>
      </button>

      <AccountLinkingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default AccountLinkButton;