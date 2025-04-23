import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { useNavigate } from 'react-router-dom';

const UsersTable = ({ users = [] }) => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="p-6 mt-6 bg-white rounded-lg shadow-md"
    >
      <h2 className="mb-4 text-xl font-semibold text-blue-800">최근 사용자 ({users.length})</h2>
      {users.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-3">닉네임</th>
                <th className="p-3">카카오 ID</th>
                <th className="p-3">구독 상태</th>
                <th className="p-3">가입일</th>
              </tr>
            </thead>
            <tbody>
              {users.slice(0, 5).map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{user.nickname || '이름 없음'}</td>
                  <td className="p-3">{user.kakaoId}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.isSubscribed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {user.isSubscribed ? '구독중' : '구독취소'}
                    </span>
                  </td>
                  <td className="p-3">{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length > 5 && (
            <div className="flex justify-end p-3">
              <button
                onClick={() => navigate('/admin/users')}
                className="px-4 py-2 text-sm text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200"
              >
                모든 사용자 보기
              </button>
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-500">등록된 사용자가 없습니다.</p>
      )}
    </motion.div>
  );
};

export default UsersTable;