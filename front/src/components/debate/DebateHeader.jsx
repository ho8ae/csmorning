import EmojiReaction from './EmojiReaction';

const DebateHeader = ({ 
  discussion, 
  onReactionAdd, 
  onReactionRemove 
}) => {
  const {
    id,
    title,
    description,
    type,
    createdAt,
    reactions = [],
    _count = { comments: 0 }
  } = discussion;
  
  // 날짜 포맷팅
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  return (
    <div className="p-4 mb-6 bg-white rounded-lg shadow-sm">
      {/* 토론 유형 표시 */}
      <div className="mb-2">
        <span className={`px-2 py-1 text-xs rounded-full ${
          type === 'debate' 
            ? 'bg-purple-100 text-purple-800' 
            : 'bg-blue-100 text-blue-800'
        }`}>
          {type === 'debate' ? '찬반 토론' : '자유 토론'}
        </span>
        <span className="ml-2 text-sm text-gray-500">
          {formatDate(createdAt)}
        </span>
      </div>
      
      {/* 타이틀 */}
      <h1 className="mb-3 text-2xl font-bold text-gray-900 md:text-3xl">
        {title}
      </h1>
      
      {/* 설명 */}
      <p className="mb-4 text-gray-700 whitespace-pre-line">
        {description}
      </p>
      
      <div className="flex items-center justify-between pt-3 mt-4 border-t border-gray-100">
        {/* 참여 정보 */}
        <div className="text-sm text-gray-500">
          <span>댓글 {_count.comments}개</span>
        </div>
        
        {/* 이모지 반응 */}
        <EmojiReaction
          discussionId={id}
          reactions={reactions}
          onReactionAdd={onReactionAdd}
          onReactionRemove={onReactionRemove}
        />
      </div>
    </div>
  );
};

export default DebateHeader;