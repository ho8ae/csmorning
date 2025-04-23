// pages/DashboardPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { questionsAPI } from '../services/api';
import Navbar from '../components/common/Navbar';
import Loading from '../components/common/Loading';

// Dashboard 컴포넌트들
import DashboardHeader from '../components/dashboard/DashboardHeader';
import StatsOverview from '../components/dashboard/StatsOverview';
import QuestionCard from '../components/dashboard/QuestionCard';
import HelpSection from '../components/dashboard/HelpSection';
import Footer from '../components/landing/Footer';

// 프리미엄 위젯 컴포넌트
import ActivityCalendarWidget from '../components/dashboard/ActivityCalendarWidget';
import TopPerformersWidget from '../components/dashboard/TopPerformersWidget';
import DebateWidget from '../components/dashboard/DebateWidget';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [todayQuestion, setTodayQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalAnswered: 0,
    correctAnswers: 0,
    accuracy: 0,
  });

  useEffect(() => {
    const fetchTodayQuestion = async () => {
      try {
        setIsLoading(true);
        const response = await questionsAPI.getTodayQuestion();
        
        setTodayQuestion(response);
        
        // 사용자 통계 설정
        if (user) {
          setStats({
            totalAnswered: user.totalAnswered || 0,
            correctAnswers: user.correctAnswers || 0,
            accuracy: user.totalAnswered
              ? Math.round((user.correctAnswers / user.totalAnswered) * 100)
              : 0,
          });
        }
      } catch (error) {
        console.error('오늘의 질문 로딩 중 오류:', error);
        setError('오늘의 질문을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodayQuestion();
  }, [user]);

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null) return;

    // 정답 확인
    const isAnswerCorrect = selectedAnswer === todayQuestion.question.correctOption;
    setIsCorrect(isAnswerCorrect);
    setIsAnswered(true);
    setShowExplanation(true);

    // 실제 환경에서는 여기서 서버에 응답을 기록하는 API 호출을 해야 합니다
    // 예: responseAPI.submitAnswer(todayQuestion.id, selectedAnswer);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <div className="container flex flex-col flex-grow px-4 py-8 mx-auto md:px-6">
        {/* 헤더 */}
        <DashboardHeader user={user} error={error} />

        {/* 통계 영역 */}
        <StatsOverview stats={stats} />

        {/* 질문 카드 */}
        <QuestionCard
          todayQuestion={todayQuestion}
          selectedAnswer={selectedAnswer}
          setSelectedAnswer={setSelectedAnswer}
          isAnswered={isAnswered}
          isCorrect={isCorrect}
          handleAnswerSubmit={handleAnswerSubmit}
        />

        {/* 프리미엄 위젯 섹션 */}
        <div className="mt-8 mb-8">
          {/* <h2 className="text-2xl font-bold text-gray-800 mb-4">
            프리미엄 기능
          </h2> */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid grid-cols-1 gap-6">
              <ActivityCalendarWidget />
            </div>
            <div className="grid grid-cols-1 gap-6">
              <TopPerformersWidget />
            </div>
            <DebateWidget />
          </div>
        </div>

        {/* 도움말 섹션 */}
        <HelpSection onLogout={logout} />
      </div>

      <Footer />
    </div>
  );
};

export default DashboardPage;
