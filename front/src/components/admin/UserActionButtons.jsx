import { 
    FiMail, 
    FiMusic, 
    FiMinusCircle, 
    FiLink2, 
    FiUserX, 
    FiUserCheck
  } from 'react-icons/fi';
  import { TfiCrown } from "react-icons/tfi";
  
  /**
   * 사용자 관리 액션 버튼 컴포넌트
   * 이메일, 카카오 연결 해제, 구독 상태 변경, 프리미엄 설정, 계정 상태 변경 등
   */
  const UserActionButtons = ({ 
    user, 
    onToggleSubscription, 
    onTogglePremium, 
    onUnlinkKakao, 
    onToggleAccountStatus 
  }) => {
    if (!user) return null;
  
    return (
      <div className="flex flex-col space-y-2">
        {/* 이메일 보내기 */}
        {user.email && (
          <button
            onClick={() => window.open(`mailto:${user.email}`)}
            className="flex items-center justify-end text-blue-600 hover:text-blue-900"
            title="이메일 보내기"
          >
            <FiMail className="mr-1" />
            <span>메일</span>
          </button>
        )}
        
        {/* 카카오 연결 해제 */}
        {user.kakaoId && (
          <button
            onClick={() => onUnlinkKakao(user.id, user.kakaoId)}
            className="flex items-center justify-end text-orange-600 hover:text-orange-900"
            title="카카오 연결 해제"
          >
            <FiLink2 className="mr-1" />
            <span>연결 해제</span>
          </button>
        )}
        
        {/* 구독 상태 변경 */}
        <button
          onClick={() => onToggleSubscription(user.id, user.isSubscribed)}
          className={`flex items-center justify-end ${user.isSubscribed ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
          title={user.isSubscribed ? '구독 취소' : '구독 활성화'}
        >
          {user.isSubscribed ? (
            <>
              <FiMinusCircle className="mr-1" />
              <span>구독 취소</span>
            </>
          ) : (
            <>
              <FiMusic className="mr-1" />
              <span>구독 활성화</span>
            </>
          )}
        </button>
        
        {/* 프리미엄 상태 변경 */}
        <button
          onClick={() => onTogglePremium(user.id, user.isPremium)}
          className={`flex items-center justify-end ${user.isPremium ? 'text-red-600 hover:text-red-900' : 'text-yellow-600 hover:text-yellow-900'}`}
          title={user.isPremium ? '프리미엄 해제' : '프리미엄 설정'}
        >
          <TfiCrown className="mr-1" />
          <span>{user.isPremium ? '프리미엄 해제' : '프리미엄 설정'}</span>
        </button>
        
        {/* 계정 상태 변경 */}
        <button
          onClick={() => onToggleAccountStatus(user.id, user.isActive !== false)}
          className={`flex items-center justify-end ${user.isActive !== false ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
          title={user.isActive !== false ? '계정 비활성화' : '계정 활성화'}
          disabled={user.role === 'admin'} // 관리자 계정은 비활성화 불가
        >
          {user.isActive !== false ? (
            <>
              <FiUserX className="mr-1" />
              <span>계정 비활성화</span>
            </>
          ) : (
            <>
              <FiUserCheck className="mr-1" />
              <span>계정 활성화</span>
            </>
          )}
        </button>
      </div>
    );
  };
  
  export default UserActionButtons;