import { useState } from 'react';

const CommentForm = ({ discussionId, onCommentSubmit, parentId = null, isDebate = false }) => {
  const [content, setContent] = useState('');
  const [stance, setStance] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) return;
    
    // 찬반 토론에서 부모 댓글인 경우 stance 필수
    if (isDebate && !parentId && !stance) {
      alert('찬성/반대 의견을 선택해주세요.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onCommentSubmit({
        content,
        stance,
        parentId
      });
      
      // 폼 초기화
      setContent('');
      if (!parentId) setStance(null);
    } catch (error) {
      console.error('댓글 등록 중 오류:', error);
      alert('댓글 등록 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 mb-6">
      {/* 찬반 토론 & 최상위 댓글일 경우에만 찬반 선택 표시 */}
      {isDebate && !parentId && (
        <div className="flex mb-3 space-x-3">
          <button
            type="button"
            onClick={() => setStance('for')}
            className={`px-4 py-2 text-sm font-medium rounded-full ${
              stance === 'for'
                ? 'bg-green-100 text-green-800 border border-green-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            찬성
          </button>
          <button
            type="button"
            onClick={() => setStance('against')}
            className={`px-4 py-2 text-sm font-medium rounded-full ${
              stance === 'against'
                ? 'bg-red-100 text-red-800 border border-red-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            반대
          </button>
          <button
            type="button"
            onClick={() => setStance('neutral')}
            className={`px-4 py-2 text-sm font-medium rounded-full ${
              stance === 'neutral'
                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            중립
          </button>
        </div>
      )}
      
      <div className="flex flex-col">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={parentId ? "답글을 작성하세요..." : "의견을 작성하세요..."}
          className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          rows={parentId ? 2 : 4}
          required
        />
        
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="px-4 py-2 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '등록 중...' : parentId ? '답글 등록' : '의견 등록'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;