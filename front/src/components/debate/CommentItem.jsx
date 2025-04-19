import { useState } from 'react';
import CommentForm from './CommentForm';
import EmojiReaction from './EmojiReaction';

const CommentItem = ({ 
  comment, 
  onCommentSubmit, 
  onReactionAdd, 
  onReactionRemove,
  isDebate = false 
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  
  const { 
    id, 
    userId, 
    content, 
    stance,
    createdAt, 
    user, 
    replies = [], 
    reactions = [],
    _count = { replies: 0 }
  } = comment;
  
  // 댓글 작성 시간 포맷팅
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // stance에 따른 스타일 결정
  const getStanceStyle = () => {
    if (!stance) return {};
    
    switch(stance) {
      case 'for':
        return { badgeColor: 'bg-green-100 text-green-800' };
      case 'against':
        return { badgeColor: 'bg-red-100 text-red-800' };
      case 'neutral':
        return { badgeColor: 'bg-blue-100 text-blue-800' };
      default:
        return {};
    }
  };
  
  const { badgeColor } = getStanceStyle();
  
  // 대댓글 토글
  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };
  
  return (
    <div className="pt-4 pb-2">
      <div className="flex">
        {/* 프로필 이미지 */}
        <div className="flex-shrink-0 mr-3">
          <div className="w-10 h-10 overflow-hidden bg-gray-200 rounded-full">
            {user?.profileImage ? (
              <img src={user.profileImage} alt={user?.nickname || '사용자'} className="object-cover w-full h-full" />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-xl font-bold text-gray-500">
                {(user?.nickname || '?')[0].toUpperCase()}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center mb-1">
            {/* 사용자 닉네임 */}
            <span className="font-medium text-gray-900">{user?.nickname || '익명 사용자'}</span>
            
            {/* 찬반 뱃지 */}
            {stance && (
              <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${badgeColor}`}>
                {stance === 'for' ? '찬성' : stance === 'against' ? '반대' : '중립'}
              </span>
            )}
            
            {/* 작성 시간 */}
            <span className="ml-2 text-xs text-gray-500">{formatDate(createdAt)}</span>
          </div>
          
          {/* 댓글 내용 */}
          <div className="text-gray-800 whitespace-pre-line">
            {content}
          </div>
          
          {/* 이모지 반응 */}
          <EmojiReaction
            discussionId={comment.discussionId}
            commentId={id}
            reactions={reactions}
            onReactionAdd={onReactionAdd}
            onReactionRemove={onReactionRemove}
          />
          
          {/* 액션 버튼 */}
          <div className="flex mt-2 space-x-2 text-xs text-gray-500">
            <button 
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="hover:text-blue-700"
            >
              답글
            </button>
            
            {/* 대댓글이 있는 경우에만 표시 */}
            {_count.replies > 0 && (
              <button 
                onClick={toggleReplies}
                className="hover:text-blue-700"
              >
                {showReplies ? '답글 숨기기' : `답글 ${_count.replies}개 보기`}
              </button>
            )}
          </div>
          
          {/* 답글 폼 */}
          {showReplyForm && (
            <div className="mt-3 ml-3">
              <CommentForm
                discussionId={comment.discussionId}
                parentId={id}
                onCommentSubmit={onCommentSubmit}
                isDebate={isDebate}
              />
            </div>
          )}
          
          {/* 대댓글 목록 */}
          {showReplies && replies.length > 0 && (
            <div className="mt-3 ml-3 space-y-3 border-l-2 border-gray-100 pl-3">
              {replies.map(reply => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  onCommentSubmit={onCommentSubmit}
                  onReactionAdd={onReactionAdd}
                  onReactionRemove={onReactionRemove}
                  isDebate={isDebate}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;