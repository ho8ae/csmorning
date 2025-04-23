import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { premiumAPI } from '../../services/api';
import DebateListItem from './DebateListItem';
import Loading from '../common/Loading';

const DebateList = () => {
  const [discussions, setDiscussions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeType, setActiveType] = useState('all'); // 'all', 'debate', 'free'
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        setIsLoading(true);
        
        // API 호출이 실패하면 모의 데이터 사용
        try {
          const type = activeType === 'all' ? null : activeType;
          const response = await premiumAPI.getDiscussions(type, page, 10);
          
          if (page === 1) {
            setDiscussions(response.discussions);
          } else {
            setDiscussions(prev => [...prev, ...response.discussions]);
          }
          
          // 더 불러올 데이터가 있는지 확인
          setHasMore(page < response.pagination.totalPages);
        } catch (apiError) {
          console.error('API 호출 오류, 모의 데이터 사용:', apiError);
          
          // 모의 데이터 생성
          const mockData = getMockDiscussions(activeType, page);
          
          if (page === 1) {
            setDiscussions(mockData);
          } else {
            setDiscussions(prev => [...prev, ...mockData]);
          }
          
          // 페이지가 3보다 크면 더 이상 데이터가 없는 것으로 가정
          setHasMore(page < 3);
        }
      } catch (error) {
        console.error('토론 목록 로딩 중 오류:', error);
        setError('토론 목록을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDiscussions();
  }, [activeType, page]);
  
  // 모의 데이터 생성 함수
  const getMockDiscussions = (type, page) => {
    const debateTopics = [
      {
        id: 1,
        title: '인공지능이 개발자의 일자리를 대체할까요?',
        description: '최근 Chat GPT, Claude 등 생성형 AI의 발전으로 프로그래밍 코드 생성도 가능해졌습니다. 인공지능이 개발자의 일자리를 대체할지에 대한 의견을 나눠봅시다.',
        type: 'debate',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2일 전
        _count: { comments: 15, reactions: 8 }
      },
      {
        id: 2,
        title: '기술 면접에서 알고리즘 테스트는 필수인가요?',
        description: '개발자 채용 과정에서 알고리즘 테스트의 필요성에 대해 의견을 나눠보세요. 실무와 관련이 적다는 의견과 기본기를 평가하기 위해 필요하다는 의견이 있습니다.',
        type: 'debate',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5일 전
        _count: { comments: 28, reactions: 14 }
      }
    ];
    
    const freeTopics = [
      {
        id: 3,
        title: '당신이 사용하는 개발 환경을 공유해주세요',
        description: '어떤 IDE, 에디터, 테마, 플러그인, 단축키 등을 사용하고 있나요? 개발 생산성을 높이는 당신만의 팁을 공유해주세요.',
        type: 'free',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), // 1일 전
        _count: { comments: 22, reactions: 10 }
      },
      {
        id: 4,
        title: '주니어 개발자가 성장하기 위한 조언',
        description: '경력이 적은 개발자들이 빠르게 성장하기 위해 어떤 공부와 경험을 쌓아야 할까요? 선배 개발자들의 조언과 경험담을 들려주세요.',
        type: 'free',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7일 전
        _count: { comments: 35, reactions: 20 }
      }
    ];
    
    if (type === 'debate') {
      return debateTopics.slice((page - 1) * 5, page * 5);
    } else if (type === 'free') {
      return freeTopics.slice((page - 1) * 5, page * 5);
    } else {
      // all
      const allTopics = [...debateTopics, ...freeTopics].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      return allTopics.slice((page - 1) * 5, page * 5);
    }
  };
  
  // 토론 유형 필터 변경
  const handleTypeChange = (type) => {
    if (type !== activeType) {
      setActiveType(type);
      setPage(1);
      setHasMore(true);
    }
  };
  
  // 더 불러오기
  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      setPage(prev => prev + 1);
    }
  };
  
  return (
    <div className="container max-w-4xl px-4 py-6 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">토론 목록</h1>
        <Link to="/premium/discussions/create" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
          토론 시작하기
        </Link>
      </div>
      
      {/* 필터 */}
      <div className="flex mb-6 space-x-2 overflow-x-auto">
        <button
          onClick={() => handleTypeChange('all')}
          className={`px-4 py-2 text-sm font-medium rounded-full ${
            activeType === 'all'
              ? 'bg-gray-800 text-white'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          전체
        </button>
        <button
          onClick={() => handleTypeChange('debate')}
          className={`px-4 py-2 text-sm font-medium rounded-full ${
            activeType === 'debate'
              ? 'bg-purple-600 text-white'
              : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
          }`}
        >
          찬반 토론
        </button>
        <button
          onClick={() => handleTypeChange('free')}
          className={`px-4 py-2 text-sm font-medium rounded-full ${
            activeType === 'free'
              ? 'bg-blue-600 text-white'
              : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
          }`}
        >
          자유 토론
        </button>
      </div>
      
      {/* 토론 목록 */}
      {isLoading && page === 1 ? (
        <div className="flex items-center justify-center h-64">
          <Loading />
        </div>
      ) : error ? (
        <div className="p-4 bg-red-100 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      ) : discussions.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-lg">
          <p className="mb-4 text-gray-500">아직 토론이 없습니다.</p>
          <Link to="/premium/discussions/create" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            첫 토론 시작하기
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {discussions.map(discussion => (
              <DebateListItem key={discussion.id} discussion={discussion} />
            ))}
          </div>
          
          {/* 더 불러오기 버튼 */}
          {hasMore && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleLoadMore}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
              >
                {isLoading ? '불러오는 중...' : '더 보기'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DebateList;