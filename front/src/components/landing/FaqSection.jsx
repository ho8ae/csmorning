import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line
import { Link } from 'react-router-dom';

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
      question: 'CS Morning은 어떤 서비스인가요?',
      answer: '매일 아침 CS 관련 문제를 제공하여, 개발자들이 CS 지식을 쌓을 수 있도록 돕는 서비스입니다. 문제는 매일 업데이트되며, 다양한 난이도와 주제를 포함하고 있습니다. 현재 개발 관련 토론 커뮤니티? 개발자 오늘의 NEWs? 그리고 깃허브의 잔디 기능과 같은 사용자 편의성에 관련된 기능들을 계속해서 구상하고 있습니다. 대시보드를 통해 확인하실 수 있고, 여러 기능 맛 보기를 통해서 체험하실 수 있습니다. :)'
    },
    {
      question: '매일 알림을 받으려면 어떻게 해야 하나요?',
      answer: '채널 추가와 사이트 회원가입 후 계정 연동을 통해 매일 아침 알림을 받을 수 있습니다. 알림톡 서비스는 회원님의 휴대폰 번호로 발송되는 점 참고해주시면 감사하겠습니다 !'
    },
    {
      question: '정식 출시는 언제인가요?',
      answer: '정식 출시는 2025년 하반기로 예정되어 있습니다. 현재는 베타 테스트 중이며, 피드백을 통해 서비스를 개선하고 있습니다.'
    },
    {
      question: '어떻게 이용하나요?',
      answer: '현재는 베타테스트로 구독하기 버튼을 누르면 채널에 등록되고, 채널 챗봇을 통해 매일 새로운 문제를 풀어보실 수 있습니다. 단, 알림톡은 회원가입 후 계정 연동을 하셔야 발송됩니다. 베타 테스트라 서 불편한 점이 있을 수 있지만, 피드백을 주시면 최대한 반영하도록 하겠습니다. '
    },
    {
      question: '만들어진 이유와 앞으로 어떤 서비스가 될까요?',
      answer: '저도 취준생이고, 아직도 학생입니다. 현재 취업률이 낮지만 여전히 개발자를 꿈꾸는 제 지인들, 그리고 저를 포함한 많은 분들이 있다고 생각합니다. CS Morning은 그런 분들을 위해 만들어졌습니다. 매일 아침 간단하게 문제를 풀면서 부담스럽지 않게 CS(Computer Science) 지식을 쌓을 수 있도록 돕고 싶습니다. '
    }
  ];

  return (
    <section className="py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <motion.h2 
            className="text-3xl font-bold text-blue-900 mb-4 font-['chosunGu']"
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
          <button
            onClick={() => window.open('http://pf.kakao.com/_Sxkswn', '_blank')}
            className="inline-flex items-center px-4 py-2 bg-blue-800 hover:bg-blue-900 text-white font-medium rounded-md transition-colors duration-200"
          >
            문의하기
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default FaqSection;