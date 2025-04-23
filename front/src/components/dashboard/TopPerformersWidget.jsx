// components/dashboard/TopPerformersWidget.jsx
import { useState, useEffect } from 'react';
import { premiumAPI } from '../../services/api';
import PremiumWidget from './PremiumWidget';
import Loading from '../common/Loading';

const TopPerformersWidget = () => {
  const [topUsers, setTopUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchTopPerformers = async () => {
      try {
        setIsLoading(true);
        const data = await premiumAPI.getTopPerformers(5); // 상위 5명만 요청
        setTopUsers(data);
      } catch (error) {
        console.error('상위 성과자 데이터 로딩 중 오류:', error);
        setError('순위 데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTopPerformers();
  }, []);
  
  if (isLoading) {
    return (
      <PremiumWidget title="CS 고득점 순위" size="md">
        <div className="flex items-center justify-center h-48">
          <Loading />
        </div>
      </PremiumWidget>
    );
  }
  
  if (error) {
    return (
      <PremiumWidget title="CS 고득점 순위" size="md">
        <div className="flex items-center justify-center h-48 text-red-500">
          {error}
        </div>
      </PremiumWidget>
    );
  }
  
  return (
    <PremiumWidget title="CS 고득점 순위" size="md">
      <div className="overflow-hidden">
        <ul className="space-y-3">
          {topUsers.map((user, index) => (
            <li 
              key={user.id} 
              className="flex items-center p-2 rounded-lg hover:bg-gray-50"
            >
              <div className={`
                w-6 h-6 flex items-center justify-center rounded-full mr-3
                ${index === 0 ? 'bg-yellow-100 text-yellow-600' : 
                  index === 1 ? 'bg-gray-100 text-gray-600' : 
                  index === 2 ? 'bg-amber-100 text-amber-700' : 'bg-blue-50 text-blue-600'}
              `}>
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.nickname || `사용자_${user.id}`}
                </p>
                <p className="text-xs text-gray-500">
                  {user.ageGroup || ''} {user.gender === 'male' ? '남성' : user.gender === 'female' ? '여성' : ''}
                </p>
              </div>
              <div className="inline-flex text-sm font-semibold text-blue-600">
                {user.correctRate}%
                <span className="ml-1 text-xs text-gray-500">
                  ({user.correctAnswers}/{user.totalAnswered})
                </span>
              </div>
            </li>
          ))}
          
          {topUsers.length === 0 && (
            <div className="py-8 text-center text-gray-500">
              순위 데이터가 없습니다.
            </div>
          )}
        </ul>
      </div>
    </PremiumWidget>
  );
};

export default TopPerformersWidget;