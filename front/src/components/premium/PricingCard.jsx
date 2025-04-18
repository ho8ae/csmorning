import React from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line
import { Link, useNavigate } from 'react-router-dom';

const PricingCard = ({ period, price, features, recommended }) => {
  const navigate = useNavigate();
  
  const handleSelectPlan = () => {
    const planData = {
      period,
      price,
      features,
      originalPrice: period === '1개월' ? '5,900' : 
                     period === '6개월' ? '35,400' : '70,800',
      discount: period === '1개월' ? null : 
                period === '6개월' ? '15%' : '25%'
    };
    
    navigate('/checkout', { state: { plan: planData } });
  };

  return (
    <motion.div 
      className={`rounded-xl shadow-lg p-6 ${recommended ? 'border-2 border-yellow-400 bg-blue-50' : 'border border-gray-200 bg-white'}`}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.3 }}
    >
      {recommended && (
        <div className="bg-yellow-400 text-blue-900 font-bold py-1 px-4 rounded-full text-sm inline-block mb-4">
          추천
        </div>
      )}
      
      <h3 className="text-xl font-bold text-blue-900 mb-2">{period}</h3>
      <div className="flex items-baseline mb-4">
        <span className="text-3xl font-bold text-blue-900">{price}</span>
        <span className="text-gray-500 ml-1">원</span>
      </div>
      
      <ul className="mb-6 space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <svg className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>
      
      <button 
        onClick={handleSelectPlan}
        className={`block w-full py-3 px-4 text-center rounded-md font-medium transition-colors duration-200 ${
          recommended 
            ? 'bg-blue-800 hover:bg-blue-900 text-white' 
            : 'bg-yellow-400 hover:bg-yellow-500 text-blue-900'
        }`}
      >
        구독하기
      </button>
    </motion.div>
  );
};

export default PricingCard;