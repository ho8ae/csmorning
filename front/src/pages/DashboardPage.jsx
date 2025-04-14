import { useQueries } from '@tanstack/react-query';
import { statsAPI, questionsAPI } from '../services/api';

// 대시보드 통계 카드 컴포넌트
const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center">
      <div className={`p-3 rounded-full ${color} text-white mr-4`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-semibold">{value}</p>
      </div>
    </div>
  </div>
);

function DashboardPage() {
  const results = useQueries({
    queries: [
      { 
        queryKey: ['responseStats'], 
        queryFn: statsAPI.getResponseStats 
      },
      { 
        queryKey: ['donationStats'], 
        queryFn: statsAPI.getDonationStats 
      },
      { 
        queryKey: ['todayQuestion'], 
        queryFn: questionsAPI.getTodayQuestion 
      }
    ]
  });
  
  const isLoading = results.some(result => result.isLoading);
  const isError = results.some(result => result.isError);
  
  if (isLoading) {
    return <div className="text-center py-10">로딩 중...</div>;
  }
  
  if (isError) {
    return <div className="text-center py-10 text-red-500">데이터를 불러오는 중 오류가 발생했습니다.</div>;
  }
  
  const [responseStats, donationStats, todayQuestion] = results.map(result => result.data);
  
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">대시보드</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="총 사용자" 
          value={responseStats.data.totalUsers || 0} 
          icon="👥" 
          color="bg-blue-500" 
        />
        <StatCard 
          title="총 응답 수" 
          value={responseStats.data.totalResponses || 0} 
          icon="✅" 
          color="bg-green-500" 
        />
        <StatCard 
          title="총 기부 수" 
          value={donationStats.data.totalDonations || 0} 
          icon="☕" 
          color="bg-yellow-500" 
        />
        <StatCard 
          title="총 기부 금액" 
          value={`${(donationStats.data.totalAmount || 0).toLocaleString()}원`} 
          icon="💰" 
          color="bg-purple-500" 
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">오늘의 질문</h2>
          {todayQuestion.data ? (
            <div>
              <p className="text-lg mb-2">{todayQuestion.data.question.text}</p>
              <div className="ml-4 mt-2">
                {todayQuestion.data.question.options.map((option, index) => (
                  <div key={index} className="mb-1">
                    <span className={index === todayQuestion.data.question.correctOption ? 'font-bold text-green-600' : ''}>
                      {index + 1}. {option}
                    </span>
                    {index === todayQuestion.data.question.correctOption && ' ✓'}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">오늘의 질문이 없습니다.</p>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">최근 기부</h2>
          {donationStats.data.recentDonations && donationStats.data.recentDonations.length > 0 ? (
            <ul>
              {donationStats.data.recentDonations.map((donation) => (
                <li key={donation.id} className="border-b py-2 last:border-0">
                  <div className="flex justify-between">
                    <span>{donation.user.nickname || '익명'}</span>
                    <span className="font-semibold">{donation.amount.toLocaleString()}원</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(donation.approvedAt).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">최근 기부 내역이 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;