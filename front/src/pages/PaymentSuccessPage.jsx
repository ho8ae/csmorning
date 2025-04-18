import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'; // eslint-disable-line
import Navbar from '../components/common/Navbar';
import Footer from '../components/landing/Footer';

const PaymentSuccessPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      
      <main className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-8 border-2 border-yellow-400"
          >
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-blue-900 mb-4">결제가 완료되었습니다!</h1>
            <p className="text-xl text-gray-600 mb-8">
              CS Morning 프리미엄 구독이 성공적으로 활성화되었습니다. 이제 모든 프리미엄 기능을 이용하실 수 있습니다.
            </p>
            
            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-medium text-blue-900 mb-2">결제 정보</h3>
              <div className="grid grid-cols-2 gap-2 text-left">
                <div className="text-gray-600">결제일</div>
                <div className="font-medium">{new Date().toLocaleDateString()}</div>
                <div className="text-gray-600">결제 방법</div>
                <div className="font-medium">카카오페이</div>
                <div className="text-gray-600">구독 기간</div>
                <div className="font-medium">6개월</div>
                <div className="text-gray-600">결제 금액</div>
                <div className="font-medium">29,900원</div>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6">
              영수증이 귀하의 이메일로 발송되었습니다.<br />
              구독 관리는 마이페이지에서 할 수 있습니다.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/dashboard" 
                className="px-6 py-3 bg-blue-800 hover:bg-blue-900 text-white font-medium rounded-md transition-colors duration-200"
              >
                대시보드로 이동
              </Link>
              <Link 
                to="/premium-features" 
                className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-medium rounded-md transition-colors duration-200"
              >
                프리미엄 기능 둘러보기
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PaymentSuccessPage;