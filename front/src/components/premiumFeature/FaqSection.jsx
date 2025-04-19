import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line

const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex justify-between items-center w-full text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-medium text-blue-900">{question}</h3>
        <svg
          className={`w-5 h-5 text-blue-900 transform ${isOpen ? 'rotate-180' : ''} transition-transform duration-200`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="mt-3 text-gray-600">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FaqSection = () => {
  const faqs = [
    {
      question: '구독은 언제부터 시작되나요?',
      answer: '결제 완료 후 즉시 모든 프리미엄 기능을 이용하실 수 있습니다. 구독 기간은 결제일로부터 선택하신 기간동안 유효합니다.'
    },
    {
      question: '구독을 취소하려면 어떻게 해야 하나요?',
      answer: '마이페이지 > 구독 관리에서 언제든지 구독을 취소할 수 있습니다. 구독 취소 시 다음 결제일부터 요금이 청구되지 않습니다.'
    },
    {
      question: '환불 정책은 어떻게 되나요?',
      answer: '구독 시작 후 7일 이내에 환불 요청 시 전액 환불이 가능합니다. 7일 이후에는 남은 기간에 대한 부분 환불이 적용됩니다. 자세한 내용은 고객센터로 문의해주세요.'
    },
    {
      question: '프리미엄 기능은 언제 업데이트 되나요?',
      answer: '저희는 매달 새로운 기능과 콘텐츠를 추가하고 있습니다. 모든 업데이트는 구독자에게 자동으로 적용됩니다.'
    },
    {
      question: '카카오톡으로 계정 연동은 어떻게 하나요?',
      answer: '웹사이트에서 로그인 후 계정 설정 페이지에서 카카오톡 계정 연동을 선택하시거나, 카카오톡 채널에서 "계정 연동" 명령어를 입력하시면 안내에 따라 연동하실 수 있습니다.'
    }
  ];

  return (
    <section className="py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <motion.h2 
            className="text-3xl font-bold text-blue-900 mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            자주 묻는 질문
          </motion.h2>
        </div>
        
        <div className="space-y-1">
          {faqs.map((faq, index) => (
            <FaqItem 
              key={index} 
              question={faq.question} 
              answer={faq.answer} 
            />
          ))}
        </div>
        
        <motion.div 
          className="mt-10 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-gray-600 mb-4">더 궁금한 점이 있으신가요?</p>
          <a 
            href="mailto:support@csmorning.co.kr" 
            className="inline-flex items-center px-4 py-2 bg-blue-800 hover:bg-blue-900 text-white font-medium rounded-md transition-colors duration-200"
          >
            문의하기
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default FaqSection;