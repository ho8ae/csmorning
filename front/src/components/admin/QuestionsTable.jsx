import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { useNavigate } from 'react-router-dom';
import { questionsAPI } from '../../services/api';

const QuestionsTable = ({ questions = [] }) => {
  const navigate = useNavigate();
  
  const handleSendQuestion = async (questionId) => {
    if (window.confirm('이 질문을 수동으로 전송하시겠습니까?')) {
      try {
        await questionsAPI.sendQuestion(questionId);
        alert('질문이 성공적으로 전송되었습니다.');
      } catch (err) {
        alert('질문 전송 중 오류가 발생했습니다: ' + err.message);
      }
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="p-6 mt-6 bg-white rounded-lg shadow-md"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-blue-800">최근 질문 ({questions.length})</h2>
        <button
          onClick={() => navigate('/admin/questions/new')}
          className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          새 질문 등록
        </button>
      </div>
      
      {questions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-3">질문</th>
                <th className="p-3">카테고리</th>
                <th className="p-3">난이도</th>
                <th className="p-3">상태</th>
                <th className="p-3">작업</th>
              </tr>
            </thead>
            <tbody>
              {questions.slice(0, 5).map((question) => (
                <tr key={question.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 max-w-xs truncate">{question.text}</td>
                  <td className="p-3">{question.category}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full 
                      ${question.difficulty === 'easy' ? 'bg-green-100 text-green-700' : 
                        question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-red-100 text-red-700'}`}>
                      {question.difficulty === 'easy' ? '쉬움' : 
                       question.difficulty === 'medium' ? '보통' : '어려움'}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${question.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {question.active ? '활성화' : '비활성화'}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => navigate(`/admin/questions/${question.id}`)}
                      className="px-3 py-1 text-xs text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 mr-2"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleSendQuestion(question.id)}
                      className="px-3 py-1 text-xs text-green-700 bg-green-100 rounded-md hover:bg-green-200"
                    >
                      전송
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {questions.length > 5 && (
            <div className="flex justify-end p-3">
              <button
                onClick={() => navigate('/admin/questions')}
                className="px-4 py-2 text-sm text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200"
              >
                모든 질문 보기
              </button>
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-500">등록된 질문이 없습니다.</p>
      )}
    </motion.div>
  );
};

export default QuestionsTable;