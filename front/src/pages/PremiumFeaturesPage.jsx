import React, { useEffect } from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line
import FeatureShowcase from '../components/premiumFeature/FeatureShowcase';
import PricingSection from '../components/premiumFeature/PricingSection';
import FaqSection from '../components/premiumFeature/FaqSection';
import Navbar from '../components/common/Navbar';
import Footer from '../components/landing/Footer';

const PremiumFeaturesPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-blue-300 to-blue-500 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <motion.h1 
                className="text-4xl font-bold mb-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                CS Morning 프리미엄
              </motion.h1>
              <motion.p 
                className="text-xl max-w-3xl mx-auto mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                매일 아침 CS 지식을 넘어, 더 심도 있는 공부와 효과적인 학습 관리를 위한 프리미엄 기능을 소개합니다.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <a 
                  href="#pricing" 
                  className="inline-flex items-center px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold rounded-md transition-colors duration-200"
                >
                  지금 시작하기
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </a>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Features */}
        <FeatureShowcase />
        
        {/* Pricing */}
        <div id="pricing">
          <PricingSection />
        </div>
        
        {/* FAQ */}
        <FaqSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default PremiumFeaturesPage;