import { Link } from 'react-router-dom';

const DebateListItem = ({ discussion }) => {
  const {
    id,
    title,
    description,
    type,
    createdAt,
    _count = { comments: 0, reactions: 0 }
  } = discussion;
  
  // 날짜 포맷팅
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return '오늘';
    } else if (diffDays === 1) {
      return '어제';
    } else if (diffDays < 7) {
      return `${diffDays}일 전`;
    } else {
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };
  
  // 설명 텍스트 줄임표 처리
  const truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };
  
  return (
    <Link to={`/premium/discussions/${id}`} className="block">
      <div className="p-4 transition-shadow bg-white rounded-lg hover:shadow-md">
        <div className="flex items-center justify-between mb-2">
          {/* 토론 유형 */}
          <span className={`px-2 py-1 text-xs rounded-full ${
            type === 'debate' 
              ? 'bg-purple-100 text-purple-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            {type === 'debate' ? '찬반 토론' : '자유 토론'}
          </span>
          
          {/* 생성 날짜 */}
          <span className="text-xs text-gray-500">
            {formatDate(createdAt)}
          </span>
        </div>
        
        {/* 제목 */}
        <h3 className="mb-2 text-lg font-bold text-gray-900">{title}</h3>
        
        {/* 설명 (축약) */}
        <p className="mb-3 text-sm text-gray-700">
          {truncateText(description)}
        </p>
        
        {/* 활동 정보 */}
        <div className="flex text-xs text-gray-500">
          <span className="flex items-center mr-3">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            {_count.comments}
          </span>
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {_count.reactions}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default DebateListItem;