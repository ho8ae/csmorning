import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars

const CTA = () => {
  return (
    <div className="relative">
      {/* 상단 물결 파도 효과 */}
      <div className="absolute top-0 left-0 right-0 w-full overflow-hidden" style={{ transform: 'translateY(-99%)' }}>
        <svg
          className="relative block w-full"
          height="70"
          preserveAspectRatio="none"
          viewBox="0 0 1440 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,60 C240,100 480,0 720,60 C960,120 1200,20 1440,60 L1440,100 L0,100 Z"
            fill="#70a5ff"  // 물결 색상을 CTA의 시작 색상(from-blue-500)과 비슷하게 설정
          ></path>
        </svg>
      </div>

      {/* 기존 CTA 섹션 */}
      <section className="py-20 bg-gradient-to-b from-blue-500/70 to-blue-950">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-white mb-6 font-['nanumBarunpen']"
            >
              매일 아침 <span className="text-yellow-300">CS</span> 지식으로 
              <br className="hidden sm:block" /> 당신의 개발 커리어를 성장시키세요
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-lg text-blue-100 mb-10 font-['chosunGu']"
            >
              지금 카카오톡 채널을 구독하고 매일 아침 8시에 
              <br className="hidden sm:block" /> 
              핵심 CS 지식과 면접 팁을 받아보세요.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <a 
                href="https://pf.kakao.com/_Sxkswn" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 transform hover:scale-105 w-full sm:w-auto text-center font-['ChosunGu']"
              >
                카카오톡 채널 구독하기
              </a>
              <a 
                href="#features" 
                className="bg-transparent border-2 border-white hover:bg-white/10 text-white font-bold py-3 px-8 rounded-full transition duration-300 w-full sm:w-auto text-center font-['ChosunGu']"
              >
                서비스 더 알아보기
              </a>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-12 flex justify-center"
            >
              <div className="flex items-center space-x-2 text-sm text-blue-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>언제든지 구독 취소 가능</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CTA;