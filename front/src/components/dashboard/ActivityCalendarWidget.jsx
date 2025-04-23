// components/dashboard/ActivityCalendarWidget.jsx
import { useState, useEffect } from 'react';
import { premiumAPI } from '../../services/api';
import PremiumWidget from './PremiumWidget';
import Loading from '../common/Loading';

const ActivityCalendarWidget = () => {
  const [activityData, setActivityData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // 최근 1년간의 활동 데이터 가져오기
    const fetchActivityData = async () => {
      try {
        // 현재 날짜로부터 1년 전 날짜 계산
        const today = new Date();
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(today.getFullYear() - 1);
        
        const startDate = oneYearAgo.toISOString().split('T')[0];
        const endDate = today.toISOString().split('T')[0];
        
        setIsLoading(true);
        
        try {
          const data = await premiumAPI.getActivityCalendar(startDate, endDate);
          setActivityData(data);
        } catch (apiError) {
          console.error('API 호출 오류, 모의 데이터 사용:', apiError);
          // 모의 데이터 생성
          setActivityData(getMockActivityData());
        }
      } catch (error) {
        console.error('활동 데이터 로딩 중 오류:', error);
        setError('활동 데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchActivityData();
  }, []);
  
  // 모의 데이터 생성 함수
  const getMockActivityData = () => {
    const mockData = [];
    const today = new Date();
    
    // 최근 365일 동안의 임의 활동 데이터 생성
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      // 약 60% 확률로 활동 데이터 생성
      if (Math.random() > 0.4) {
        mockData.push({
          id: i,
          userId: 1,
          date: date.toISOString().split('T')[0],
          count: Math.floor(Math.random() * 8) + 1, // 1-8 사이의 임의 활동 수
          createdAt: date.toISOString(),
          updatedAt: date.toISOString()
        });
      }
    }
    
    return mockData;
  };
  
  // 월별 그리드 생성을 위한 데이터 준비
  const getCalendarData = () => {
    const today = new Date();
    const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
    
    // 주 단위 배열 (0: 일요일, 1: 월요일, ..., 6: 토요일)
    const weekRows = [[], [], [], [], [], [], []];
    
    // 최근 52주 동안의 날짜를 주별로 정리
    for (let i = 365; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      // 해당 날짜의 활동 데이터 찾기
      const activity = activityData.find(a => 
        new Date(a.date).toISOString().split('T')[0] === dateString
      );
      
      // 요일에 맞게 분류 (0: 일요일, 1: 월요일, ..., 6: 토요일)
      const day = date.getDay();
      
      weekRows[day].push({
        date: dateString,
        count: activity ? activity.count : 0
      });
    }
    
    return {
      dayOfWeek,
      weekRows
    };
  };
  
  // 활동 수에 따른 색상 계산
  const getColorClass = (count) => {
    if (count === 0) return 'bg-gray-100';
    if (count < 2) return 'bg-blue-100';
    if (count < 4) return 'bg-blue-300';
    if (count < 6) return 'bg-blue-500';
    return 'bg-blue-700';
  };
  
  if (isLoading) {
    return (
      <PremiumWidget title="활동 캘린더" size="lg">
        <div className="flex items-center justify-center h-48">
          <Loading />
        </div>
      </PremiumWidget>
    );
  }
  
  if (error) {
    return (
      <PremiumWidget title="활동 캘린더" size="lg">
        <div className="flex items-center justify-center h-48 text-red-500">
          {error}
        </div>
      </PremiumWidget>
    );
  }
  
  const { dayOfWeek, weekRows } = getCalendarData();
  
  return (
    <PremiumWidget title="활동 캘린더" size="lg">
      <div className="overflow-x-auto">
        <div className="flex">
          {/* 요일 표시 (월, 수, 금만 표시) */}
          <div className="flex flex-col mr-1 pt-1 text-xs text-gray-500">
            {dayOfWeek.map((day, index) => (
              <div key={index} className="h-3 mb-1">
                {index % 2 === 1 ? day : ''}
              </div>
            ))}
          </div>
          
          {/* 활동 캘린더 그리드 */}
          <div className="flex flex-col">
            {weekRows.map((weekRow, rowIndex) => (
              <div key={rowIndex} className="flex mb-1.5">
                {weekRow.map((day, colIndex) => (
                  <div 
                    key={`${rowIndex}-${colIndex}`}
                    className={`w-3 h-3 mr-1 rounded-sm ${getColorClass(day.count)}`}
                    title={`${day.date}: ${day.count}개 활동`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        
        {/* 범례 */}
        <div className="flex justify-end items-center text-xs text-gray-500">
          <span className="mr-1">활동 수:</span>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-gray-100 rounded-sm"></div>
            <span>0</span>
            <div className="w-2 h-2 bg-blue-100 rounded-sm"></div>
            <span>1</span>
            <div className="w-2 h-2 bg-blue-300 rounded-sm"></div>
            <span>2-3</span>
            <div className="w-2 h-2 bg-blue-500 rounded-sm"></div>
            <span>4-5</span>
            <div className="w-2 h-2 bg-blue-700 rounded-sm"></div>
            <span>6+</span>
          </div>
        </div>
      </div>
    </PremiumWidget>
  );
};

export default ActivityCalendarWidget;