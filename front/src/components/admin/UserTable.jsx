import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import UserTableRow from './UserTableRow';

/**
 * 사용자 테이블 컴포넌트
 * 사용자 목록을 테이블 형태로 표시
 */
const UsersTable = ({ 
  users = [], 
  onToggleSubscription, 
  onTogglePremium, 
  onUnlinkKakao, 
  onToggleAccountStatus,
  onSelectUser
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      {users.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  사용자 정보
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  계정 정보
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  통계
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
              {users.map((user) => (
                <UserTableRow 
                  key={user.id}
                  user={user}
                  onToggleSubscription={onToggleSubscription}
                  onTogglePremium={onTogglePremium}
                  onUnlinkKakao={onUnlinkKakao}
                  onToggleAccountStatus={onToggleAccountStatus}
                  onSelectUser={onSelectUser}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-6 text-center text-gray-500">
          사용자 정보가 없습니다.
        </div>
      )}
    </motion.div>
  );
};

export default UsersTable;