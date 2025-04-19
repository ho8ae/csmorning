import CommentItem from './CommentItem';
import CommentForm from './CommentForm';

const CommentList = ({ 
  discussionId, 
  comments = [], 
  onCommentSubmit, 
  onReactionAdd, 
  onReactionRemove,
  isDebate = false
}) => {
  // 최상위 댓글만 필터링
  const topLevelComments = comments.filter(comment => !comment.parentId);
  
  return (
    <div>
      <h3 className="mb-4 text-xl font-bold">의견 ({comments.length}개)</h3>
      
      {/* 댓글 작성 폼 */}
      <CommentForm 
        discussionId={discussionId} 
        onCommentSubmit={onCommentSubmit}
        isDebate={isDebate}
      />
      
      {/* 댓글 목록 */}
      {topLevelComments.length > 0 ? (
        <div className="space-y-4 divide-y divide-gray-100">
          {topLevelComments.map(comment => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onCommentSubmit={onCommentSubmit}
              onReactionAdd={onReactionAdd}
              onReactionRemove={onReactionRemove}
              isDebate={isDebate}
            />
          ))}
        </div>
      ) : (
        <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
          아직 의견이 없습니다. 첫 번째 의견을 남겨보세요!
        </div>
      )}
    </div>
  );
};

export default CommentList;