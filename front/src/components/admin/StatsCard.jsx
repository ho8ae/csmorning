import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars

const StatsCard = ({ title, stats, delay = 0.2 }) => {
  if (!stats) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="p-6 bg-white rounded-lg shadow-md"
      >
        <h2 className="mb-4 text-xl font-semibold text-blue-800">{title}</h2>
        <p className="text-gray-500">{title}을(를) 불러올 수 없습니다.</p>
      </motion.div>
    );
  }

  // 응답 통계 카드
  if (title === "응답 통계") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="p-6 bg-white rounded-lg shadow-md"
      >
        <h2 className="mb-4 text-xl font-semibold text-blue-800">{title}</h2>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">총 응답 수</span>
            <span className="font-medium">{stats.totalResponses}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">일일 평균 응답</span>
            <span className="font-medium">{stats.dailyAverage}</span>
          </div>
          {/* 필요한 경우 추가 통계 */}
        </div>
      </motion.div>
    );
  }

  // 기부 통계 카드
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="p-6 bg-white rounded-lg shadow-md"
    >
      <h2 className="mb-4 text-xl font-semibold text-blue-800">{title}</h2>
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600">총 기부 수</span>
          <span className="font-medium">{stats.totalDonations}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">총 기부 금액</span>
          <span className="font-medium">{(stats.totalAmount || 0).toLocaleString()}원</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">평균 기부 금액</span>
          <span className="font-medium">{(stats.averageAmount|| 0).toLocaleString()}원</span>
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;