import React, { useState } from 'react';
import AccountLinkingModal from '../common/AccountLinkingModal';
import { PiPlugsConnectedFill } from "react-icons/pi";

const AccountLinkButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center justify-center w-full md:w-auto h-12 px-4 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
      >
        <PiPlugsConnectedFill className="flex-shrink-0" />
        <p className="text-sm whitespace-nowrap ml-2">카카오톡 채널 연동</p>
      </button>

      <AccountLinkingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default AccountLinkButton;