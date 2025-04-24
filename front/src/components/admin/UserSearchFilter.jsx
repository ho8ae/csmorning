import { FiSearch } from 'react-icons/fi';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars

const UserSearchFilter = ({ searchTerm, setSearchTerm, filter, setFilter, categories }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="mb-6 bg-white p-4 rounded-lg shadow-md"
    >
      <div className="flex flex-wrap gap-4">
        {/* 검색 */}
        <div className="flex-1 min-w-[300px]">
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="사용자 검색 (닉네임, 카카오 ID, 이메일, 이름)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        {/* 구독 상태 필터 */}
        <div className="w-full sm:w-auto">
          <select
            value={filter.isSubscribed}
            onChange={(e) => setFilter({...filter, isSubscribed: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">모든 구독 상태</option>
            <option value="true">구독중</option>
            <option value="false">구독취소</option>
          </select>
        </div>
        
        {/* 프리미엄 상태 필터 */}
        <div className="w-full sm:w-auto">
          <select
            value={filter.isPremium}
            onChange={(e) => setFilter({...filter, isPremium: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">모든 프리미엄 상태</option>
            <option value="true">프리미엄</option>
            <option value="false">일반</option>
          </select>
        </div>
        
        {/* 계정 상태 필터 */}
        <div className="w-full sm:w-auto">
          <select
            value={filter.isActive}
            onChange={(e) => setFilter({...filter, isActive: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">모든 계정 상태</option>
            <option value="true">활성화</option>
            <option value="false">비활성화</option>
          </select>
        </div>
      </div>
    </motion.div>
  );
};

export default UserSearchFilter;