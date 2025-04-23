import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { questionsAPI } from '../../services/api';
import Sidebar from '../../components/admin/Sidebar';
import { motion } from 'framer-motion';
import { FiEdit, FiTrash2, FiSend, FiPlus, FiSearch } from 'react-icons/fi';

const QuestionsListPage = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState({
    category: '',
    difficulty: '',
    active: ''
  });
  
  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 10;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        const data = await questionsAPI.getAll();
        setQuestions(data);
      } catch (error) {
        console.error('질문 목록 로딩 중 오류:', error);
        setError('질문 목록을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchQuestions();
  }, []);

  const handleDeleteQuestion = async (id) => {
    if (window.confirm('이 질문을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      try {
        await questionsAPI.delete(id);
        setQuestions(questions.filter(question => question.id !== id));
      } catch (error) {
        console.error('질문 삭제 중 오류:', error);
        alert('질문을 삭제하는 중 오류가 발생했습니다.');
      }
    }
  };

  const handleSendQuestion = async (id) => {
    if (window.confirm('이 질문을 지금 전송하시겠습니까?')) {
      try {
        await questionsAPI.sendQuestion(id);
        alert('질문이 성공적으로 전송되었습니다.');
      } catch (error) {
        console.error('질문 전송 중 오류:', error);
        alert('질문을 전송하는 중 오류가 발생했습니다.');
      }
    }
  };

  // 필터링된 질문 목록
  const filteredQuestions = questions.filter(question => {
    return (
      question.text.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filter.category === '' || question.category === filter.category) &&
      (filter.difficulty === '' || question.difficulty === filter.difficulty) &&
      (filter.active === '' || question.active.toString() === filter.active)
    );
  });

  // 고유한 카테고리 목록
  const categories = [...new Set(questions.map(q => q.category))];

  // 페이지네이션
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = filteredQuestions.slice(indexOfFirstQuestion, indexOfLastQuestion);
  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-6 ml-64">
          <div className="flex justify-center items-center h-full">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="ml-4 text-lg font-medium text-blue-800">질문 목록을 불러오는 중...</p>
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
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-blue-900">질문 관리</h1>
            <button
              onClick={() => navigate('/admin/questions/new')}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <FiPlus className="mr-2" /> 새 질문 등록
            </button>
          </div>
          <p className="text-gray-600">총 {filteredQuestions.length}개의 질문이 있습니다.</p>
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
                  placeholder="질문 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            {/* 카테고리 필터 */}
            <div className="w-full sm:w-auto">
              <select
                value={filter.category}
                onChange={(e) => setFilter({...filter, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">모든 카테고리</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            {/* 난이도 필터 */}
            <div className="w-full sm:w-auto">
              <select
                value={filter.difficulty}
                onChange={(e) => setFilter({...filter, difficulty: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">모든 난이도</option>
                <option value="easy">쉬움</option>
                <option value="medium">보통</option>
                <option value="hard">어려움</option>
              </select>
            </div>
            
            {/* 상태 필터 */}
            <div className="w-full sm:w-auto">
              <select
                value={filter.active}
                onChange={(e) => setFilter({...filter, active: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">모든 상태</option>
                <option value="true">활성화</option>
                <option value="false">비활성화</option>
              </select>
            </div>
          </div>
        </motion.div>
        
        {/* 질문 목록 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          {currentQuestions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      질문
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      카테고리
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      난이도
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      상태
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      작업
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentQuestions.map((question) => (
                    <tr key={question.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="max-w-xs truncate">{question.text}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {question.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${question.difficulty === 'easy' ? 'bg-green-100 text-green-800' : 
                            question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'}`}>
                          {question.difficulty === 'easy' ? '쉬움' : 
                           question.difficulty === 'medium' ? '보통' : '어려움'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${question.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {question.active ? '활성화' : '비활성화'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <button
                          onClick={() => navigate(`/admin/questions/${question.id}`)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                          title="수정"
                        >
                          <FiEdit />
                        </button>
                        <button
                          onClick={() => handleSendQuestion(question.id)}
                          className="text-green-600 hover:text-green-900 mr-3"
                          title="전송"
                        >
                          <FiSend />
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(question.id)}
                          className="text-red-600 hover:text-red-900"
                          title="삭제"
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              {filteredQuestions.length === 0 && questions.length > 0 ? 
                '검색 조건에 맞는 질문이 없습니다.' : 
                '등록된 질문이 없습니다. 새 질문을 추가해주세요.'}
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

export default QuestionsListPage;