import React from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line

const PremiumFeatureCard = ({ icon, title, description }) => {
  return (
    <motion.div 
      className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
      whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 text-blue-800 rounded-full mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-blue-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

export default PremiumFeatureCard;