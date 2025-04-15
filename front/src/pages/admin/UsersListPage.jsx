import { useState, useEffect } from 'react';
import { usersAPI } from '../../services/api';
import Sidebar from '../../components/admin/Sidebar';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { FiSearch, FiMail, FiSmile, FiMusic, FiMinusCircle} from 'react-icons/fi';

const UsersListPage = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState({
    isSubscribed: ''
  });
  
  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const data = await usersAPI.getAll();
        setUsers(data);
      } catch (error) {
        console.error('사용자 목록 로딩 중 오류:', error);
        setError('사용자 목록을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  // 필터링된 사용자 목록
  const filteredUsers = users.filter(user => {
    const searchFields = [
      user.nickname || '',
      user.kakaoId || '',
      user.email || ''
    ].map(field => field.toLowerCase());
    
    return (
      searchFields.some(field => field.includes(searchTerm.toLowerCase())) &&
      (filter.isSubscribed === '' || user.isSubscribed.toString() === filter.isSubscribed)
    );
  });

  // 페이지네이션
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleToggleSubscription = async (userId, isCurrentlySubscribed) => {
    try {
      // 실제 환경에서는 API 호출을 통해 구독 상태를 변경
      await usersAPI.update(userId, { isSubscribed: !isCurrentlySubscribed });
      
      // 사용자 목록 갱신
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, isSubscribed: !isCurrentlySubscribed } 
          : user
      ));
    } catch (error) {
      console.error('구독 상태 변경 중 오류:', error);
      alert('구독 상태를 변경하는 중 오류가 발생했습니다.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-6 ml-64">
          <div className="flex justify-center items-center h-full">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="ml-4 text-lg font-medium text-blue-800">사용자 목록을 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 p-6 ml-64">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-blue-900">사용자 관리</h1>
          <p className="text-gray-600">총 {filteredUsers.length}명의 사용자가 있습니다.</p>
        </motion.div>
        
        {error && (
          <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}
        
        {/* 검색 및 필터 */}
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
                  placeholder="사용자 검색 (닉네임, 카카오 ID, 이메일)..."
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
          </div>
        </motion.div>
        
        {/* 사용자 목록 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          {currentUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      닉네임
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      카카오 ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      통계
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      구독 상태
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      가입일
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      작업
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                            {user.profileImage ? (
                              <img src={user.profileImage} alt={user.nickname} className="h-10 w-10 rounded-full" />
                            ) : (
                              <FiSmile className="h-6 w-6 text-gray-500" />
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.nickname || '이름 없음'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.email || '이메일 없음'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{user.kakaoId || '-'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          답변: {user.totalAnswered || 0}
                        </div>
                        <div className="text-sm text-gray-900">
                          정답: {user.correctAnswers || 0}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.totalAnswered > 0 
                            ? `정확도: ${Math.round((user.correctAnswers / user.totalAnswered) * 100)}%` 
                            : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isSubscribed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {user.isSubscribed ? '구독중' : '구독취소'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <button
                          onClick={() => window.confirm(`${user.nickname || '이 사용자'}에게 이메일을 보내시겠습니까?`)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                          title="이메일 보내기"
                          disabled={!user.email}
                        >
                          <FiMail />
                        </button>
                        <button
                          onClick={() => handleToggleSubscription(user.id, user.isSubscribed)}
                          className={`${user.isSubscribed ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                          title={user.isSubscribed ? '구독 취소' : '구독 활성화'}
                        >
                          {user.isSubscribed ? <FiMinusCircle /> : <FiMusic />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              {filteredUsers.length === 0 && users.length > 0 ? 
                '검색 조건에 맞는 사용자가 없습니다.' : 
                '등록된 사용자가 없습니다.'}
            </div>
          )}
        </motion.div>
        
        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <nav className="flex items-center">
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 mr-2 disabled:opacity-50"
              >
                이전
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`px-3 py-1 mx-1 rounded-md ${currentPage === number ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  {number}
                </button>
              ))}
              
              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 ml-2 disabled:opacity-50"
              >
                다음
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersListPage;