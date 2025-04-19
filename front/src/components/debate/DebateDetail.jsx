import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { premiumAPI } from '../../services/api';
import DebateHeader from './DebateHeader';
import CommentList from './CommentList';
import VoteSection from './VoteSection';
import Loading from '../common/Loading';

const DebateDetail = () => {
  const { id } = useParams();
  const [discussion, setDiscussion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStance, setSelectedStance] = useState(null);
  
  useEffect(() => {
    const fetchDiscussion = async () => {
      try {
        setIsLoading(true);
        
        // API 호출이 실패하면 모의 데이터 사용
        try {
          const data = await premiumAPI.getDiscussionById(id);
          setDiscussion(data);
        } catch (apiError) {
          console.error('API 호출 오류, 모의 데이터 사용:', apiError);
          // 모의 데이터 생성
          setDiscussion(getMockDiscussionDetail(id));
        }
      } catch (error) {
        console.error('토론 데이터 로딩 중 오류:', error);
        setError('토론 데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDiscussion();
  }, [id]);
  
  // 모의 데이터 생성 함수
  const getMockDiscussionDetail = (id) => {
    return {
      id: parseInt(id),
      title: '인공지능이 개발자의 일자리를 대체할까요?',
      description: '최근 Chat GPT, Claude 등 생성형 AI의 발전으로 프로그래밍 코드 생성도 가능해졌습니다. 인공지능이 개발자의 일자리를 대체할지에 대한 의견을 나눠봅시다.',
      type: 'debate',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [
        {
          id: 1,
          discussionId: parseInt(id),
          userId: 1,
          content: '인공지능은 단순 반복적인 코딩 작업은 대체할 수 있겠지만, 비즈니스 문제를 이해하고 창의적인 해결책을 제시하는 개발자의 역할은 대체하기 어려울 것입니다.',
          stance: 'against',
          parentId: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          user: {
            id: 1,
            nickname: '테크마스터',
            profileImage: null
          },
          replies: [],
          reactions: [],
          _count: { replies: 0 }
        },
        {
          id: 2,
          discussionId: parseInt(id),
          userId: 2,
          content: '이미 AI가 간단한 앱을 처음부터 끝까지 만들 수 있는 수준에 도달했습니다. 앞으로 몇 년 안에 초급 개발자의 일자리는 크게 줄어들 것입니다.',
          stance: 'for',
          parentId: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          user: {
            id: 2,
            nickname: 'AI전문가',
            profileImage: null
          },
          replies: [],
          reactions: [],
          _count: { replies: 0 }
        }
      ],
      reactions: [],
      _count: { comments: 2 },
      debateStats: {
        forCount: 1,
        againstCount: 1,
        forPercentage: '50.0',
        againstPercentage: '50.0'
      },
      emojiStats: []
    };
  };
  
  // 댓글 제출 처리
  const handleCommentSubmit = async (commentData) => {
    try {
      // API 호출
      // const response = await premiumAPI.addComment(id, commentData);
      
      // 모의 응답
      const newComment = {
        id: Math.floor(Math.random() * 1000),
        discussionId: parseInt(id),
        userId: 3,
        content: commentData.content,
        stance: commentData.stance,
        parentId: commentData.parentId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        user: {
          id: 3,
          nickname: '현재사용자',
          profileImage: null
        },
        replies: [],
        reactions: [],
        _count: { replies: 0 }
      };
      
      // 상태 업데이트
      setDiscussion(prev => {
        // 새 댓글 목록 생성
        let updatedComments = [...prev.comments];
        
        if (commentData.parentId) {
          // 대댓글인 경우
          updatedComments = updatedComments.map(comment => {
            if (comment.id === commentData.parentId) {
              return {
                ...comment,
                replies: [...(comment.replies || []), newComment],
                _count: {
                  ...comment._count,
                  replies: (comment._count?.replies || 0) + 1
                }
              };
            }
            return comment;
          });
        } else {
          // 최상위 댓글인 경우
          updatedComments.push(newComment);
          
          // 찬반 토론인 경우 통계 업데이트
          if (prev.type === 'debate' && commentData.stance) {
            const { debateStats } = prev;
            const updatedStats = { ...debateStats };
            
            if (commentData.stance === 'for') {
              updatedStats.forCount = (debateStats.forCount || 0) + 1;
            } else if (commentData.stance === 'against') {
              updatedStats.againstCount = (debateStats.againstCount || 0) + 1;
            }
            
            // 백분율 다시 계산
            const total = updatedStats.forCount + updatedStats.againstCount;
            updatedStats.forPercentage = ((updatedStats.forCount / total) * 100).toFixed(1);
            updatedStats.againstPercentage = ((updatedStats.againstCount / total) * 100).toFixed(1);
            
            return {
              ...prev,
              comments: updatedComments,
              debateStats: updatedStats,
              _count: {
                ...prev._count,
                comments: (prev._count?.comments || 0) + 1
              }
            };
          }
        }
        
        return {
          ...prev,
          comments: updatedComments,
          _count: {
            ...prev._count,
            comments: (prev._count?.comments || 0) + 1
          }
        };
      });
      
      return newComment;
    } catch (error) {
      console.error('댓글 등록 중 오류:', error);
      throw error;
    }
  };
  
  const handleReactionAdd = async (emoji, commentId) => {
    try {
      // API 호출
      // const response = await premiumAPI.addReaction(id, emoji, commentId);
      
      // 모의 응답
      const newReaction = {
        id: Math.floor(Math.random() * 1000),
        discussionId: parseInt(id),
        userId: 3,
        commentId: commentId,
        emoji,
        createdAt: new Date().toISOString(),
        user: {
          id: 3,
          nickname: '현재사용자'
        }
      };
      
      // 상태 업데이트
      setDiscussion(prev => {
        if (commentId) {
          // 댓글에 대한 반응인 경우
          const updatedComments = prev.comments.map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                reactions: [...(comment.reactions || []), newReaction]
              };
            }
            
            // 대댓글 확인
            if (comment.replies && comment.replies.length > 0) {
              const updatedReplies = comment.replies.map(reply => {
                if (reply.id === commentId) {
                  return {
                    ...reply,
                    reactions: [...(reply.reactions || []), newReaction]
                  };
                }
                return reply;
              });
              
              return {
                ...comment,
                replies: updatedReplies
              };
            }
            
            return comment;
          });
          
          return {
            ...prev,
            comments: updatedComments
          };
        } else {
          // 토론 자체에 대한 반응인 경우
          return {
            ...prev,
            reactions: [...(prev.reactions || []), newReaction]
          };
        }
      });
      
      return newReaction;
    } catch (error) {
      console.error('반응 추가 중 오류:', error);
      throw error;
    }
  };
  
  // 이모지 반응 제거
  const handleReactionRemove = async (emoji, commentId) => {
    try {
      // API 호출
      // await premiumAPI.removeReaction(id, emoji, commentId);
      
      // 상태 업데이트
      setDiscussion(prev => {
        if (commentId) {
          // 댓글에 대한 반응인 경우
          const updatedComments = prev.comments.map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                reactions: comment.reactions.filter(r => 
                  !(r.emoji === emoji && r.user?.id === 3) // 현재 사용자의 반응만 제거
                )
              };
            }
            
            // 대댓글 확인
            if (comment.replies && comment.replies.length > 0) {
              const updatedReplies = comment.replies.map(reply => {
                if (reply.id === commentId) {
                  return {
                    ...reply,
                    reactions: reply.reactions.filter(r => 
                      !(r.emoji === emoji && r.user?.id === 3)
                    )
                  };
                }
                return reply;
              });
              
              return {
                ...comment,
                replies: updatedReplies
              };
            }
            
            return comment;
          });
          
          return {
            ...prev,
            comments: updatedComments
          };
        } else {
          // 토론 자체에 대한 반응인 경우
          return {
            ...prev,
            reactions: prev.reactions.filter(r => 
              !(r.emoji === emoji && r.user?.id === 3)
            )
          };
        }
      });
      
      return true;
    } catch (error) {
      console.error('반응 제거 중 오류:', error);
      throw error;
    }
  };
  
  // 찬반 선택 처리
  const handleStanceSelect = (stance) => {
    setSelectedStance(stance);
    // 실제로는 이 시점에서 새 댓글 작성 폼으로 스크롤하거나 포커스를 줄 수 있음
  };
  
  if (isLoading) {
    return (
      <div className="container max-w-4xl px-4 py-6 mx-auto">
        <div className="flex items-center justify-center h-64">
          <Loading />
        </div>
      </div>
    );
  }
  
  if (error || !discussion) {
    return (
      <div className="container max-w-4xl px-4 py-6 mx-auto">
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h1 className="mb-4 text-xl font-bold text-red-600">오류 발생</h1>
          <p className="text-gray-700">{error || '토론을 찾을 수 없습니다.'}</p>
          <Link to="/premium/discussions" className="inline-block px-4 py-2 mt-4 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            토론 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }
  
  const { type, comments = [] } = discussion;
  const isDebate = type === 'debate';
  
  return (
    <div className="container max-w-4xl px-4 py-6 mx-auto">
      {/* 상단 네비게이션 */}
      <div className="mb-4">
        <Link to="/premium/discussions" className="flex items-center text-sm text-gray-600 hover:text-blue-600">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          토론 목록으로 돌아가기
        </Link>
      </div>
      
      {/* 토론 헤더 */}
      <DebateHeader
        discussion={discussion}
        onReactionAdd={handleReactionAdd}
        onReactionRemove={handleReactionRemove}
      />
      
      <div className="flex flex-col-reverse md:flex-row md:space-x-6">
        <div className="flex-grow mt-6 md:mt-0">
          {/* 댓글 목록 */}
          <CommentList
            discussionId={discussion.id}
            comments={comments}
            onCommentSubmit={handleCommentSubmit}
            onReactionAdd={handleReactionAdd}
            onReactionRemove={handleReactionRemove}
            isDebate={isDebate}
          />
        </div>
        
        {/* 찬반 토론인 경우 투표 섹션 표시 */}
        {isDebate && (
          <div className="md:w-64 md:flex-shrink-0">
            <VoteSection
              debateStats={discussion.debateStats}
              onStanceSelect={handleStanceSelect}
              selectedStance={selectedStance}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DebateDetail;