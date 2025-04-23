import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { IoMdMail } from 'react-icons/io';
import { RiLogoutBoxRLine } from 'react-icons/ri';

const HelpSection = ({ onLogout }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="p-6 w-full mx-auto bg-white rounded-lg shadow-md max-w-3xl"
    >
      <h2 className="mb-4 text-xl font-semibold text-blue-800">
        베타테스트 기간입니다.
      </h2>

      <p className="text-gray-600">
        CS Morning과 함께 컴퓨터 사이언스 지식을 매일 조금씩 쌓아가세요.
      </p>
      <p className="text-gray-600 mb-4">
        질문이나 제안사항이 있으시면 언제든지 문의해주세요! 😎
      </p>

      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={() =>
            window.open(
              'https://capable-hydrogen-361.notion.site/1dce7274f15f817d8b03fa46dc92c8c7?pvs=105',
              '_blank',
            )
          }
          className="px-4 py-2 text-black-700 bg-gray-300 rounded-md hover:bg-gray-500"
        >
          <div className="flex items-center gap-2">
            <IoMdMail /> 문의사항
          </div>
        </button>

        <button
          onClick={onLogout}
          className="px-4 py-2 text-red-700 bg-red-100 rounded-md hover:bg-red-200"
        >
          <div className="flex items-center gap-2">
            <RiLogoutBoxRLine /> 로그아웃
            
          </div>
        </button>
      </div>
    </motion.div>
  );
};

export default HelpSection;
