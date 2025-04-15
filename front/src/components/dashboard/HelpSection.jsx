import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars

const HelpSection = ({ onLogout }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="p-6 mx-auto bg-white rounded-lg shadow-md max-w-3xl"
    >
      <h2 className="mb-4 text-xl font-semibold text-blue-800">도움이 필요하신가요?</h2>
      <p className="mb-4 text-gray-600">
        CS Morning과 함께 컴퓨터 사이언스 지식을 매일 조금씩 쌓아가세요.
        질문이나 제안사항이 있으시면 언제든지 문의해주세요.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={() => window.open('https://open.kakao.com/o/your_chat_link', '_blank')}
          className="px-4 py-2 text-yellow-700 bg-yellow-100 rounded-md hover:bg-yellow-200"
        >
          카카오톡 문의하기
        </button>
        <button
          onClick={onLogout}
          className="px-4 py-2 text-red-700 bg-red-100 rounded-md hover:bg-red-200"
        >
          로그아웃
        </button>
      </div>
    </motion.div>
  );
};

export default HelpSection;