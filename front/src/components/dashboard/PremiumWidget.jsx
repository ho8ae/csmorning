// components/dashboard/PremiumWidget.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const PremiumWidget = ({ title, size = "md", children }) => {
  const { user } = useAuthStore();
  const [isHovered, setIsHovered] = useState(false);
  
  const isPremium = user?.isPremium || false;
  
  // 위젯 크기에 따른 클래스 설정
  const sizeClasses = {
    sm: "col-span-1 row-span-1",
    md: "col-span-1 row-span-1 md:col-span-1 md:row-span-1",
    lg: "col-span-1 row-span-1 md:col-span-2 md:row-span-1",
    xl: "col-span-1 row-span-1 md:col-span-2 md:row-span-2"
  };
  
  const widgetClasses = `${sizeClasses[size]} bg-white rounded-lg shadow-md p-4 overflow-hidden relative`;
  
  return (
    <div
      className={widgetClasses}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {isPremium && (
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            Premium
          </span>
        )}
      </div>
      
      {/* 컨텐츠 */}
      <div className={`${isPremium ? '' : 'blur-sm pointer-events-none'}`}>
        {children}
      </div>
      
      {/* 프리미엄 아닌 경우 오버레이 */}
      {!isPremium && (
        <div 
          className={`absolute inset-0 bg-white bg-opacity-80 flex flex-col items-center justify-center p-4 transition-opacity ${
            isHovered ? 'opacity-100' : 'opacity-90'
          }`}
        >
          <svg 
            className="w-8 h-8 text-yellow-500 mb-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
            />
          </svg>
          <p className="text-center text-gray-700 font-medium">이 기능은 프리미엄 회원만 이용할 수 있습니다.</p>
          <Link 
            to="/premium" 
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            프리미엄 가입하기
          </Link>
        </div>
      )}
    </div>
  );
};

export default PremiumWidget;