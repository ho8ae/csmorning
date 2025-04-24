import { useState, useEffect } from 'react';
import { usersAPI, authAPI } from '../../services/api';
import Sidebar from '../../components/admin/Sidebar';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars

// 분리된 컴포넌트들 가져오기
import UserSearchFilter from '../../components/admin/UserSearchFilter';
import UsersTable from '../../components/admin/UserTable';
import Pagination from '../../components/admin/Pagination';
import UserDetailPanel from '../../components/admin/UserDetailPanel';

const UsersListPage = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState({
    isSubscribed: '',
    isPremium: '',
    isActive: ''
  });
  
  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  
  // 선택된 사용자 (상세 패널에 표시할)
  const [selectedUser, setSelectedUser] = useState(null);

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
      user.email || '',
      user.name || ''
    ].map(field => field.toLowerCase());
    
    return (
      searchFields.some(field => field.includes(searchTerm.toLowerCase())) &&
      (filter.isSubscribed === '' || user.isSubscribed.toString() === filter.isSubscribed) &&
      (filter.isPremium === '' || user.isPremium?.toString() === filter.isPremium) &&
      (filter.isActive === '' || (user.isActive !== undefined ? user.isActive.toString() : 'true') === filter.isActive)
    );
  });

  // 페이지네이션
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 사용자 선택 핸들러
  const handleSelectUser = (userId) => {
    const user = users.find(u => u.id === userId);
    setSelectedUser(user);
  };

  // 사용자 업데이트 핸들러
  const handleUpdateUser = async (userId, userData) => {
    try {
      // API 호출로 사용자 정보 업데이트
      const updatedUser = await usersAPI.update(userId, userData);
      
      // 사용자 목록 갱신
      setUsers(users.map(user => 
        user.id === userId ? { ...user, ...updatedUser } : user
      ));
      
      // 선택된 사용자도 업데이트
      setSelectedUser(prevUser => 
        prevUser && prevUser.id === userId ? { ...prevUser, ...updatedUser } : prevUser
      );
      
      alert('사용자 정보가 성공적으로 업데이트되었습니다.');
    } catch (error) {
      console.error('사용자 정보 업데이트 중 오류:', error);
      alert('사용자 정보 업데이트 중 오류가 발생했습니다: ' + (error.response?.data?.message || error.message));
    }
  };

  // 구독 상태 변경
  const handleToggleSubscription = async (userId, isCurrentlySubscribed) => {
    try {
      if (!window.confirm(`사용자의 구독 상태를 ${isCurrentlySubscribed ? '취소' : '활성화'}로 변경하시겠습니까?`)) {
        return;
      }
      
      // API 호출로 구독 상태 변경
      await usersAPI.toggleSubscription(userId, isCurrentlySubscribed);
      
      // 사용자 목록 갱신
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, isSubscribed: !isCurrentlySubscribed } 
          : user
      ));
      
      // 선택된 사용자도 업데이트
      setSelectedUser(prevUser => 
        prevUser && prevUser.id === userId 
          ? { ...prevUser, isSubscribed: !isCurrentlySubscribed } 
          : prevUser
      );
    } catch (error) {
      console.error('구독 상태 변경 중 오류:', error);
      alert('구독 상태를 변경하는 중 오류가 발생했습니다.');
    }
  };

  // 프리미엄 상태 변경
  const handleTogglePremium = async (userId, isCurrentlyPremium) => {
    try {
      if (!window.confirm(`사용자의 프리미엄 상태를 ${isCurrentlyPremium ? '비활성화' : '활성화'}로 변경하시겠습니까?`)) {
        return;
      }
      
      let durationMonths = 1;
      if (!isCurrentlyPremium) {
        const durationInput = prompt('프리미엄 기간을 개월 수로 입력하세요 (기본: 1개월)', '1');
        durationMonths = parseInt(durationInput) || 1;
        if (durationMonths <= 0) {
          alert('유효한 개월 수를 입력해주세요.');
          return;
        }
      }
      
      // API 호출로 프리미엄 상태 변경
      await usersAPI.updatePremium(userId, !isCurrentlyPremium, durationMonths);
      
      // 현재 날짜에 개월 수를 더한 만료일 계산
      let premiumUntil = null;
      if (!isCurrentlyPremium) {
        premiumUntil = new Date();
        premiumUntil.setMonth(premiumUntil.getMonth() + durationMonths);
      }
      
      // 사용자 목록 갱신
      setUsers(users.map(user => 
        user.id === userId 
          ? { 
              ...user, 
              isPremium: !isCurrentlyPremium,
              premiumUntil: !isCurrentlyPremium ? premiumUntil : null
            } 
          : user
      ));
      
      // 선택된 사용자도 업데이트
      setSelectedUser(prevUser => 
        prevUser && prevUser.id === userId 
          ? { 
              ...prevUser, 
              isPremium: !isCurrentlyPremium,
              premiumUntil: !isCurrentlyPremium ? premiumUntil : null
            } 
          : prevUser
      );
    } catch (error) {
      console.error('프리미엄 상태 변경 중 오류:', error);
      alert('프리미엄 상태를 변경하는 중 오류가 발생했습니다.');
    }
  };

  // 카카오 연결 해제
  const handleUnlinkKakao = async (userId, kakaoId) => {
    try {
      if (!kakaoId) {
        alert('카카오 ID가 없습니다.');
        return;
      }
      
      if (!window.confirm('이 사용자의 카카오 계정 연결을 해제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
        return;
      }
      
      // API 호출로 카카오 연결 해제
      await authAPI.unlinkKakaoUser(kakaoId);
      
      // 사용자 목록 갱신
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, kakaoId: null } 
          : user
      ));
      
      // 선택된 사용자도 업데이트
      setSelectedUser(prevUser => 
        prevUser && prevUser.id === userId 
          ? { ...prevUser, kakaoId: null } 
          : prevUser
      );
      
      alert('카카오 계정 연결이 성공적으로 해제되었습니다.');
    } catch (error) {
      console.error('카카오 연결 해제 중 오류:', error);
      alert('카카오 연결 해제 중 오류가 발생했습니다: ' + (error.response?.data?.message || error.message));
    }
  };

  // 계정 상태 변경 (활성화/비활성화)
  const handleToggleAccountStatus = async (userId, isCurrentlyActive) => {
    try {
      const statusText = isCurrentlyActive ? '비활성화' : '활성화';
      
      if (!window.confirm(`이 사용자의 계정을 ${statusText}하시겠습니까?`)) {
        return;
      }
      
      // API 호출로 계정 상태 변경
      await usersAPI.toggleAccountStatus(userId, !isCurrentlyActive);
      
      // 사용자 목록 갱신
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, isActive: !isCurrentlyActive } 
          : user
      ));
      
      // 선택된 사용자도 업데이트
      setSelectedUser(prevUser => 
        prevUser && prevUser.id === userId 
          ? { ...prevUser, isActive: !isCurrentlyActive } 
          : prevUser
      );
      
      alert(`사용자 계정이 성공적으로 ${statusText}되었습니다.`);
    } catch (error) {
      console.error('계정 상태 변경 중 오류:', error);
      alert('계정 상태 변경 중 오류가 발생했습니다: ' + (error.response?.data?.message || error.message));
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
      
      <div className={`flex-1 p-6 ml-64 ${selectedUser ? 'mr-96' : ''}`}>
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-blue-900">사용자 관리</h1>
          <p className="text-gray-600">총 {filteredUsers.length}명의 사용자가 있습니다.</p>
        </motion.div>
        
        {/* 오류 메시지 */}
        {error && (
          <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}
        
        {/* 검색 및 필터 */}
        <UserSearchFilter 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          filter={filter} 
          setFilter={setFilter}
        />
        
        {/* 사용자 목록 테이블 */}
        <UsersTable 
          users={currentUsers}
          onToggleSubscription={handleToggleSubscription}
          onTogglePremium={handleTogglePremium}
          onUnlinkKakao={handleUnlinkKakao}
          onToggleAccountStatus={handleToggleAccountStatus}
          onSelectUser={handleSelectUser}
        />
        
        {/* 페이지네이션 */}
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
        
        {/* 검색 결과 없음 메시지 */}
        {filteredUsers.length === 0 && users.length > 0 && (
          <div className="mt-6 p-4 text-center text-amber-700 bg-amber-100 rounded-lg">
            검색 조건에 맞는 사용자가 없습니다.
          </div>
        )}
        
        {/* 사용자 상세 패널 */}
        <AnimatePresence>
          {selectedUser && (
            <UserDetailPanel 
              user={selectedUser}
              onClose={() => setSelectedUser(null)}
              onUpdate={handleUpdateUser}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UsersListPage;