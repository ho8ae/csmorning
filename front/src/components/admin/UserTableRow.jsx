import { FiSmile, FiInfo } from 'react-icons/fi';
import UserStatusBadge from './UserStatusBadge';
import UserActionButtons from './UserActionButtons';

/**
 * 사용자 테이블 행 컴포넌트
 * 각 사용자의 정보를 표시하는 테이블 행
 */
const UserTableRow = ({ 
  user, 
  onToggleSubscription, 
  onTogglePremium, 
  onUnlinkKakao, 
  onToggleAccountStatus,
  onSelectUser
}) => {
  if (!user) return null;

  return (
    <tr 
      className={`hover:bg-gray-50 ${!user.isActive ? 'bg-gray-100 opacity-75' : ''} cursor-pointer`}
      onClick={() => onSelectUser && onSelectUser(user.id)}
    >
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
            <div className="text-sm font-medium text-gray-900 flex items-center">
              {user.nickname || '이름 없음'}
              {user.role === 'admin' && (
                <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                  관리자
                </span>
              )}
              <button 
                className="ml-2 text-blue-500 hover:text-blue-700"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectUser && onSelectUser(user.id);
                }}
                title="사용자 상세 정보"
              >
                <FiInfo />
              </button>
            </div>
            <div className="text-sm text-gray-500">
              {user.name || ''}
              {user.gender && <span className="ml-2">({user.gender === 'male' ? '남' : '여'})</span>}
            </div>
            <div className="text-sm text-gray-500">
              {user.email || '이메일 없음'}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900">
          <div>카카오 ID: {user.kakaoId || '-'}</div>
          {user.phoneNumber && <div>전화번호: {user.phoneNumber}</div>}
          {user.ageGroup && <div>연령대: {user.ageGroup}</div>}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          가입: {new Date(user.createdAt).toLocaleDateString()}
        </div>
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
        <div className="space-y-2">
          <div>
            <UserStatusBadge type="active" value={user.isActive !== false} />
          </div>
          <div>
            <UserStatusBadge type="subscription" value={user.isSubscribed} />
          </div>
          <div>
            <UserStatusBadge type="premium" value={user.isPremium} expiryDate={user.premiumUntil} />
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
        <UserActionButtons 
          user={user} 
          onToggleSubscription={onToggleSubscription}
          onTogglePremium={onTogglePremium}
          onUnlinkKakao={onUnlinkKakao}
          onToggleAccountStatus={onToggleAccountStatus}
        />
      </td>
    </tr>
  );
};

export default UserTableRow;