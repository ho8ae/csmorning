// components/dashboard/DebateWidget.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { premiumAPI } from '../../services/api';
import PremiumWidget from './PremiumWidget';
import Loading from '../common/Loading';

const DebateWidget = () => {
  const [discussions, setDiscussions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        setIsLoading(true);
        const data = await premiumAPI.getDiscussions('debate', 1, 3); // 찬반토론만 3개 가져오기
        setDiscussions(data.discussions);
      } catch (error) {
        console.error('토론 데이터 로딩 중 오류:', error);
        setError('토론 데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDiscussions();
  }, []);
  
  if (isLoading) {
    return (
      <PremiumWidget title="찬반 토론" size="lg">
        <div className="flex items-center justify-center h-48">
          <Loading />
        </div>
      </PremiumWidget>
    );
  }
  
  if (error) {
    return (
      <PremiumWidget title="찬반 토론" size="lg">
        <div className="flex items-center justify-center h-48 text-red-500">
          {error}
        </div>
      </PremiumWidget>
    );
  }
  
  return (
    <PremiumWidget title="찬반 토론" size="lg">
      <div className="space-y-4">
        {discussions.map(discussion => (
          <div 
            key={discussion.id}
            className="border rounded-lg p-3 hover:bg-gray-50 transition-colors"
          >
            <h4 className="font-medium text-gray-900 mb-1">{discussion.title}</h4>
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {discussion.description}
            </p>
            
            <div className="flex items-center mb-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: '65%' }} // 서버에서 실제 데이터를 받아와야 함
                ></div>
              </div>
              <div className="ml-2 text-xs font-medium">
                <span className="text-green-600">65%</span>
                <span className="mx-1 text-gray-500">vs</span>
                <span className="text-red-600">35%</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center text-xs text-gray-500">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                {discussion._count?.comments || 0}
              </div>
              <Link 
                to={`/premium/discussions/${discussion.id}`} 
                className="text-blue-600 hover:underline"
              >
                참여하기
              </Link>
            </div>
          </div>
        ))}
        
        {discussions.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            현재 진행 중인 토론이 없습니다.
          </div>
        )}
        
        <div className="text-right mt-2">
          <Link 
            to="/premium/discussions" 
            className="text-sm text-blue-600 hover:underline"
          >
            모든 토론 보기 →
          </Link>
        </div>
      </div>
    </PremiumWidget>
  );
};

export default DebateWidget;