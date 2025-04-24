import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars

const StatsCard = ({ title, stats, delay = 0.2 }) => {
  // 통계 데이터가 없는 경우 처리
  if (!stats) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="p-6 bg-white rounded-lg shadow-md"
      >
        <h2 className="mb-4 text-xl font-semibold text-blue-800">{title}</h2>
        <div className="p-4 text-amber-700 bg-amber-100 rounded-md">
          <p>{title}을(를) 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.</p>
        </div>
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
            <span className="font-medium">{stats.totalResponses.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">정답 수</span>
            <span className="font-medium text-green-600">{stats.correctResponses.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">오답 수</span>
            <span className="font-medium text-red-600">{stats.incorrectResponses.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">정답률</span>
            <span className="font-medium">{stats.correctRate}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">일일 평균 응답</span>
            <span className="font-medium">{stats.dailyAverage?.toLocaleString() || '0'}</span>
          </div>
          
          {/* 카테고리별 통계 */}
          {stats.categoryStats && stats.categoryStats.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="mb-2 text-sm font-semibold text-gray-700">카테고리별 통계</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {stats.categoryStats.map((cat, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-600">{cat.category}</span>
                    <span className="font-medium">
                      {cat.correct}/{cat.total} ({cat.total > 0 ? Math.round(cat.correct / cat.total * 100) : 0}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
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
          <span className="font-medium">{stats.totalDonations.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">총 기부 금액</span>
          <span className="font-medium">{(stats.totalAmount || 0).toLocaleString()}원</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">평균 기부 금액</span>
          <span className="font-medium">{(stats.averageAmount || 0).toLocaleString()}원</span>
        </div>
        
        {/* 최근 기부 내역 */}
        {stats.recentDonations && stats.recentDonations.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h3 className="mb-2 text-sm font-semibold text-gray-700">최근 기부 내역</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {stats.recentDonations.map((donation, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {donation.user?.nickname || '익명'} 
                    <span className="text-xs text-gray-500 ml-1">
                      {donation.approvedAt ? new Date(donation.approvedAt).toLocaleDateString() : ''}
                    </span>
                  </span>
                  <span className="font-medium text-green-600">{donation.amount.toLocaleString()}원</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* 월별 기부 통계 */}
        {stats.monthlyStats && stats.monthlyStats.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h3 className="mb-2 text-sm font-semibold text-gray-700">월별 기부 통계</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {stats.monthlyStats.slice(0, 6).map((month, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-gray-600">{month.year}년 {month.month}월</span>
                  <span className="font-medium">
                    {month.count}건 ({month.total.toLocaleString()}원)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatsCard;