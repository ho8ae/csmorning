import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars

const StatsOverview = ({ stats }) => {
    if (!stats || Object.keys(stats).length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="p-5 bg-white rounded-lg shadow-md"
      >
        <h3 className="mb-2 text-lg font-semibold text-blue-800">총 응답</h3>
        <p className="text-3xl font-bold text-blue-600">{stats.totalAnswered || 0}</p>
        <p className="text-sm text-gray-500">제출한 답변 수</p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="p-5 bg-white rounded-lg shadow-md"
      >
        <h3 className="mb-2 text-lg font-semibold text-blue-800">정답 수</h3>
        <p className="text-3xl font-bold text-green-600">{stats.correctAnswers}</p>
        <p className="text-sm text-gray-500">맞춘 문제 수</p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="p-5 bg-white rounded-lg shadow-md"
      >
        <h3 className="mb-2 text-lg font-semibold text-blue-800">정확도</h3>
        <p className="text-3xl font-bold text-blue-600">{stats.accuracy}%</p>
        <p className="text-sm text-gray-500">정답률</p>
      </motion.div>
    </div>
  );
};

export default StatsOverview;