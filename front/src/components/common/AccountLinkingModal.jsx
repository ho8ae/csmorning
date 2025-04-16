import React from 'react';
import Modal from './Modal';
import AccountLinking from '../auth/AccountLinking';

const AccountLinkingModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <AccountLinking onSuccess={onClose} />
    </Modal>
  );
};

export default AccountLinkingModal;