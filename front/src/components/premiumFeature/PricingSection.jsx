import React from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line
import PricingCard from './PricingCard';

const PricingSection = () => {
  const pricingPlans = [
    {
      period: '1개월',
      price: '2,900',
      features: [
        '모든 프리미엄 기능 이용',
        '출석 잔디 기능',
        '사용자 통계 확인',
        '토론하기 기능'
      ],
      recommended: false
    },
    {
      period: '6개월',
      price: '2,900',
      features: [
        '모든 프리미엄 기능 이용',
        '출석 잔디 기능',
        '사용자 통계 확인',
        '토론하기 기능',
        '심화 문제 모드',
        '1개월 구독 대비 15% 할인'
      ],
      recommended: true
    },
    {
      period: '12개월',
      price: '2,900',
      features: [
        '모든 프리미엄 기능 이용',
        '출석 잔디 기능',
        '사용자 통계 확인',
        '토론하기 기능',
        '심화 문제 모드',
        '1개월 구독 대비 25% 할인',
        'CS 도서 PDF 3권 제공'
      ],
      recommended: false
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl font-bold text-blue-900 mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            구독 플랜
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            당신에게 맞는 플랜을 선택하여 CS Morning의 모든 기능을 이용해보세요
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <PricingCard
              key={index}
              period={plan.period}
              price={plan.price}
              features={plan.features}
              recommended={plan.recommended}
            />
          ))}
        </div>
        
        <motion.div 
          className="mt-12 text-center text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p>모든 결제는 카카오페이를 통해 안전하게 처리됩니다.</p>
          <p className="mt-2">언제든지 구독을 취소할 수 있으며, 환불 정책은 <a href="#" className="text-blue-800 underline">이용약관</a>을 참고해주세요.</p>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;