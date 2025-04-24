import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const Hero = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <section className="relative h-screen flex items-center overflow-hidden bg-gradient-to-b from-blue-300 to-blue-900">
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
            className="text-4xl md:text-6xl font-bold text-white mb-4 font-['SBAggroB']"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            CS Morning
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-yellow-300 font-medium mb-8 font-['NanumBarunpen']"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            "아침에 제일 먼저 정보를 얻는 것이 기억에 오래 머무른다" -{' '}
            <em>CS Morning</em>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {isAuthenticated ? (
              <Link
                to={'/login'}
                className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 transform hover:scale-105 font-['ChosunGu'] "
              >
                대시보드
              </Link>
            ) : (
              <Link
                to={'/login'}
                className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 transform hover:scale-105 font-['ChosunGu'] "
              >
                시작하기
              </Link>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* 모바일 메시지 미리보기 */}
      <motion.div
        className="absolute right-0 bottom-0 md:right-36 w-64 md:w-80 hidden md:block"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 1, type: 'spring' }}
      >
        <div>
          <img
            src="/assets/landing/img_02.png"
            alt="KakaoTalk"
            className="w-full h-full rounded-t-2xl rounded-l-2xl shadow-xl"
          />
        </div>
      </motion.div>

      {/* 물결 파도 효과 */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg
          className="relative block w-full"
          height="70"
          preserveAspectRatio="none"
          viewBox="0 0 1440 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            transition={{ delay: 1, duration: 1 }}
            d="M0,40 C180,100 360,0 540,60 C720,120 900,30 1080,70 C1260,100 1440,60 1440,60 L1440,100 L0,100 Z"
            fill="#ffffff" // 다음 섹션 배경색에 맞게 조정 (bg-white 또는 다음 섹션의 색상)
          ></motion.path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
