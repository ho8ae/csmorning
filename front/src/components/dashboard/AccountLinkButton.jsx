import React, { useState } from 'react';
import AccountLinkingModal from '../common/AccountLinkingModal';
import { PiPlugsConnectedFill } from "react-icons/pi";
const AccountLinkButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center md:px-4 md:py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
      >
        <PiPlugsConnectedFill className='m-2'/>
        <p className='text-sm p-0.5 m-2'>카카오톡 채널 연동</p>
      </button>

      <AccountLinkingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default AccountLinkButton;