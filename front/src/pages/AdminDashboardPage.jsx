import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { statsAPI, usersAPI, questionsAPI } from '../services/api';
import Sidebar from '../components/admin/Sidebar';

// Admin 컴포넌트들
import DashboardHeader from '../components/admin/DashboardHeader';
import StatsCard from '../components/admin/StatsCard';
import UsersTable from '../components/admin/UsersTable';
import QuestionsTable from '../components/admin/QuestionsTable';
import LogoutButton from '../components/admin/LogoutButton';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout, checkAuth } = useAuthStore();
  const [stats, setStats] = useState({
    responses: null,
    donations: null
  });
  const [users, setUsers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // 사용자 인증 확인
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const currentUser = await checkAuth();
        if (!currentUser) {
          navigate('/login');
          return;
        }
        
        if (currentUser.role !== 'admin') {
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('인증 확인 오류:', error);
        navigate('/login');
      }
    };
    
    verifyAuth();
  }, [checkAuth, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // 각 API 호출을 개별적으로 실행하고 에러 처리
        try {
          const questionsData = await questionsAPI.getAll();
          setQuestions(questionsData);
        } catch (err) {
          console.error('질문 데이터 로딩 중 오류:', err);
        }
        
        try {
          const usersData = await usersAPI.getAll();
          setUsers(usersData);
        } catch (err) {
          console.error('사용자 데이터 로딩 중 오류:', err);
        }
        
        try {
          const responseStats = await statsAPI.getResponseStats();
          setStats(prev => ({ ...prev, responses: responseStats }));
        } catch (err) {
          console.error('응답 통계 로딩 중 오류:', err);
          setStats(prev => ({ ...prev, responses: null }));
        }
        
        try {
          const donationStats = await statsAPI.getDonationStats();
          setStats(prev => ({ ...prev, donations: donationStats }));
        } catch (err) {
          console.error('기부 통계 로딩 중 오류:', err);
          setStats(prev => ({ ...prev, donations: null }));
        }
        
      } catch (error) {
        console.error('대시보드 데이터 로딩 중 오류:', error);
        setError('일부 데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="ml-4 text-lg font-medium text-blue-800">데이터를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar onToggle={(collapsed) => setSidebarCollapsed(collapsed)} />
      
      <div className={`flex-1 p-6 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        {/* 헤더 */}
        <DashboardHeader user={user} error={error} />
        
        {/* 통계 카드 */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <StatsCard title="응답 통계" stats={stats.responses} delay={0.2} />
          <StatsCard title="기부 통계" stats={stats.donations} delay={0.3} />
        </div>
        
        {/* 사용자 목록 */}
        <UsersTable users={users} />
        
        {/* 질문 목록 */}
        <QuestionsTable questions={questions} />
        
        {/* 로그아웃 버튼 */}
        <LogoutButton onLogout={logout} />
      </div>
    </div>
  );
};

export default AdminDashboardPage;