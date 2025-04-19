import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center overflow-hidden bg-gradient-to-b from-blue-900 to-blue-700">
      {/* 배경 효과 */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-yellow-300"></div>
        <div className="absolute bottom-20 right-10 w-60 h-60 rounded-full bg-yellow-400"></div>
      </div>

      <div className="container mx-auto px-6 z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center md:text-left"
        >
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-white mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            CS Morning
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-yellow-300 font-medium mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            "아침에 제일 먼저 정보를 얻는 것이 기억에 오래 머무른다" - <em>CS Morning</em>
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <button className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 transform hover:scale-105">
              8시 아침 CS 지식 습득하기
            </button>
          </motion.div>
        </motion.div>
      </div>
      
      {/* 모바일 메시지 미리보기 */}
      <motion.div 
        className="absolute right-0 bottom-0 md:right-36 w-64 md:w-80 hidden md:block"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 1, type: "spring" }}
      >
        <div>
            <img src="/assets/landing/img_02.png" alt="KakaoTalk" className="w-full h-full rounded-t-2xl rounded-l-2xl shadow-xl" />
        </div>
        {/* <div className="bg-black rounded-t-2xl rounded-l-2xl p-4 shadow-xl">
          <img src="/assets/landing/img_01.png" alt="KakaoTalk" className="w-full h-full" />
          
        </div> */}
      </motion.div>
    </section>
  );
};

export default Hero;