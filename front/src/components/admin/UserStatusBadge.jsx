/**
 * 사용자 상태 배지 컴포넌트
 * 활성화 상태, 구독 상태, 프리미엄 상태 등을 표시
 */
const UserStatusBadge = ({ type, value, expiryDate }) => {
    const getBadgeClasses = () => {
      const baseClasses = "px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ";
      
      switch (type) {
        case 'active':
          return baseClasses + (value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800');
        case 'subscription':
          return baseClasses + (value ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800');
        case 'premium':
          return baseClasses + (value ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800');
        case 'role':
          return baseClasses + 'bg-purple-100 text-purple-800';
        default:
          return baseClasses + 'bg-gray-100 text-gray-800';
      }
    };
  
    const getBadgeText = () => {
      switch (type) {
        case 'active':
          return value ? '활성화' : '비활성화';
        case 'subscription':
          return value ? '구독중' : '구독취소';
        case 'premium':
          return value ? '프리미엄' : '일반';
        case 'role':
          return value === 'admin' ? '관리자' : '일반회원';
        default:
          return value ? '활성화' : '비활성화';
      }
    };
  
    return (
      <span className={getBadgeClasses()}>
        {getBadgeText()}
        {type === 'premium' && value && expiryDate && (
          <span className="ml-1 text-xs">
            (~{new Date(expiryDate).toLocaleDateString()})
          </span>
        )}
      </span>
    );
  };
  
  export default UserStatusBadge;