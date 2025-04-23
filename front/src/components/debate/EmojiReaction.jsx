import { useState } from 'react';

const emojis = ['👍', '👎', '😄', '😮', '😢', '❤️', '🚀', '👏'];

const EmojiReaction = ({ discussionId, commentId = null, reactions = [], onReactionAdd, onReactionRemove }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  // 이모지별 카운트 계산
  const emojiCounts = {};
  reactions.forEach(reaction => {
    const { emoji } = reaction;
    emojiCounts[emoji] = (emojiCounts[emoji] || 0) + 1;
  });
  
  // 사용자 반응 확인 (이미 표시한 반응인지)
  const userReactions = new Set();
  reactions.forEach(reaction => {
    if (reaction.user?.id === localStorage.getItem('user_id')) {
      userReactions.add(reaction.emoji);
    }
  });
  
  const handleReactionClick = async (emoji) => {
    try {
      if (userReactions.has(emoji)) {
        await onReactionRemove(emoji, commentId);
      } else {
        await onReactionAdd(emoji, commentId);
      }
    } catch (error) {
      console.error('반응 처리 중 오류:', error);
    }
  };
  
  return (
    <div className="mt-2">
      <div className="flex flex-wrap items-center gap-1">
        {/* 반응 표시 */}
        {Object.entries(emojiCounts).map(([emoji, count]) => (
          <button
            key={emoji}
            onClick={() => handleReactionClick(emoji)}
            className={`inline-flex items-center px-2 py-1 text-sm rounded-full ${
              userReactions.has(emoji) 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <span className="mr-1">{emoji}</span>
            <span>{count}</span>
          </button>
        ))}
        
        {/* 반응 추가 버튼 */}
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="inline-flex items-center px-2 py-1 text-sm bg-gray-100 rounded-full hover:bg-gray-200"
        >
          <span className="mr-1">😀</span>
          <span>추가</span>
        </button>
      </div>
      
      {/* 이모지 선택기 */}
      {showEmojiPicker && (
        <div className="flex flex-wrap p-2 mt-2 bg-white border rounded-lg shadow-sm">
          {emojis.map(emoji => (
            <button
              key={emoji}
              onClick={() => {
                handleReactionClick(emoji);
                setShowEmojiPicker(false);
              }}
              className="p-1 text-xl hover:bg-gray-100 rounded-md"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmojiReaction;