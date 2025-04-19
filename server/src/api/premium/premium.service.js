/**
 * 사용자의 활동 캘린더(잔디) 데이터 조회
 * @param {object} prisma - Prisma 클라이언트
 * @param {number} userId - 사용자 ID
 * @param {string} startDate - 시작 날짜 (YYYY-MM-DD)
 * @param {string} endDate - 종료 날짜 (YYYY-MM-DD)
 * @returns {Promise<Array>} 활동 데이터 배열
 */
const getActivityCalendar = async (prisma, userId, startDate, endDate) => {
    // 기본값: 1년치 데이터
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    
    const start = startDate ? new Date(startDate) : oneYearAgo;
    const end = endDate ? new Date(endDate) : today;
    
    // 활동 데이터 조회
    const activityData = await prisma.activityCalendar.findMany({
      where: {
        userId,
        date: {
          gte: start,
          lte: end
        }
      },
      orderBy: {
        date: 'asc'
      }
    });
    
    return activityData;
  };
  
  /**
   * 질문 응답에 대한 성별 통계 조회
   * @param {object} prisma - Prisma 클라이언트
   * @returns {Promise<Object>} 성별 통계 데이터
   */
  const getStatisticsByGender = async (prisma) => {
    // 성별에 따른 정답률 및 참여도 집계
    const maleStats = await prisma.user.aggregate({
      where: {
        gender: 'male'
      },
      _count: {
        id: true
      },
      _sum: {
        totalAnswered: true,
        correctAnswers: true
      }
    });
    
    const femaleStats = await prisma.user.aggregate({
      where: {
        gender: 'female'
      },
      _count: {
        id: true
      },
      _sum: {
        totalAnswered: true,
        correctAnswers: true
      }
    });
    
    // 성별 비율 및 정답률 계산
    const totalUsers = (maleStats._count.id || 0) + (femaleStats._count.id || 0);
    
    const statistics = {
      totalUsers,
      genderDistribution: {
        male: {
          count: maleStats._count.id || 0,
          percentage: totalUsers > 0 ? ((maleStats._count.id || 0) / totalUsers * 100).toFixed(1) : 0,
          totalAnswered: maleStats._sum.totalAnswered || 0,
          correctAnswers: maleStats._sum.correctAnswers || 0,
          correctRate: maleStats._sum.totalAnswered > 0 
            ? ((maleStats._sum.correctAnswers || 0) / (maleStats._sum.totalAnswered || 1) * 100).toFixed(1) 
            : 0
        },
        female: {
          count: femaleStats._count.id || 0,
          percentage: totalUsers > 0 ? ((femaleStats._count.id || 0) / totalUsers * 100).toFixed(1) : 0,
          totalAnswered: femaleStats._sum.totalAnswered || 0,
          correctAnswers: femaleStats._sum.correctAnswers || 0,
          correctRate: femaleStats._sum.totalAnswered > 0 
            ? ((femaleStats._sum.correctAnswers || 0) / (femaleStats._sum.totalAnswered || 1) * 100).toFixed(1) 
            : 0
        }
      }
    };
    
    return statistics;
  };
  
  /**
   * 질문 응답에 대한 연령대별 통계 조회
   * @param {object} prisma - Prisma 클라이언트
   * @returns {Promise<Object>} 연령대별 통계 데이터
   */
  const getStatisticsByAgeGroup = async (prisma) => {
    // 연령대 그룹 정의
    const ageGroups = ['10~19', '20~29', '30~39', '40~49', '50~59', '60~'];
    
    // 각 연령대별 집계
    const result = {};
    
    for (const ageGroup of ageGroups) {
      const stats = await prisma.user.aggregate({
        where: {
          ageGroup
        },
        _count: {
          id: true
        },
        _sum: {
          totalAnswered: true,
          correctAnswers: true
        }
      });
      
      result[ageGroup] = {
        count: stats._count.id || 0,
        totalAnswered: stats._sum.totalAnswered || 0,
        correctAnswers: stats._sum.correctAnswers || 0,
        correctRate: stats._sum.totalAnswered > 0 
          ? ((stats._sum.correctAnswers || 0) / (stats._sum.totalAnswered || 1) * 100).toFixed(1) 
          : 0
      };
    }
    
    return {
      byAgeGroup: result
    };
  };
  
  /**
   * 상위 성과자 조회
   * @param {object} prisma - Prisma 클라이언트
   * @param {number} limit - 조회할 사용자 수
   * @returns {Promise<Array>} 상위 성과자 목록
   */
  const getTopPerformers = async (prisma, limit = 10) => {
    // 정답률 기준 상위 사용자 조회
    const topUsers = await prisma.user.findMany({
      where: {
        totalAnswered: {
          gt: 0 // 최소 1개 이상 응답한 사용자
        }
      },
      select: {
        id: true,
        nickname: true,
        totalAnswered: true,
        correctAnswers: true,
        gender: true,
        ageGroup: true
      },
      orderBy: [
        {
          correctAnswers: 'desc'
        },
        {
          totalAnswered: 'desc'
        }
      ],
      take: parseInt(limit)
    });
    
    // 정답률 계산
    const result = topUsers.map(user => ({
      ...user,
      correctRate: ((user.correctAnswers / user.totalAnswered) * 100).toFixed(1)
    }));
    
    return result;
  };
  
  /**
   * 사용자의 카테고리별 성과 조회
   * @param {object} prisma - Prisma 클라이언트
   * @param {number} userId - 사용자 ID
   * @returns {Promise<Object>} 카테고리별 성과 데이터
   */
  const getCategoryPerformance = async (prisma, userId) => {
    // 카테고리 목록 조회
    const categories = await prisma.question.groupBy({
      by: ['category'],
      _count: {
        id: true
      }
    });
    
    // 사용자의 카테고리별 성과 계산
    const result = {};
    
    for (const { category } of categories) {
      // 특정 카테고리에 대한 사용자의 응답 조회
      const userResponses = await prisma.response.findMany({
        where: {
          userId,
          dailyQuestion: {
            question: {
              category
            }
          }
        },
        include: {
          dailyQuestion: {
            include: {
              question: true
            }
          }
        }
      });
      
      const totalAnswered = userResponses.length;
      const correctAnswers = userResponses.filter(r => r.isCorrect).length;
      
      result[category] = {
        totalAnswered,
        correctAnswers,
        correctRate: totalAnswered > 0 
          ? ((correctAnswers / totalAnswered) * 100).toFixed(1) 
          : '0.0'
      };
    }
    
    return result;
  };
  
  /**
   * 토론 목록 조회
   * @param {object} prisma - Prisma 클라이언트
   * @param {string} type - 토론 유형 (debate 또는 free)
   * @param {number} page - 페이지 번호
   * @param {number} limit - 페이지당 항목 수
   * @returns {Promise<Object>} 토론 목록 및 페이지네이션 정보
   */
  const getDiscussions = async (prisma, type, page = 1, limit = 10) => {
    // 필터 조건 설정
    const where = {};
    if (type) {
      where.type = type;
    }
    
    // 토론 총 개수 조회
    const totalCount = await prisma.discussion.count({ where });
    
    // 페이지네이션 설정
    const skip = (page - 1) * limit;
    const totalPages = Math.ceil(totalCount / limit);
    
    // 토론 목록 조회
    const discussions = await prisma.discussion.findMany({
      where,
      include: {
        _count: {
          select: {
            comments: true,
            reactions: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    });
    
    return {
      discussions,
      pagination: {
        totalCount,
        totalPages,
        currentPage: page,
        pageSize: limit
      }
    };
  };
  
  /**
   * 토론 생성
   * @param {object} prisma - Prisma 클라이언트
   * @param {number} userId - 사용자 ID
   * @param {string} title - 토론 제목
   * @param {string} description - 토론 설명
   * @param {string} type - 토론 유형 (debate 또는 free)
   * @returns {Promise<Object>} 생성된 토론 정보
   */
  const createDiscussion = async (prisma, userId, title, description, type) => {
    return await prisma.discussion.create({
      data: {
        title,
        description,
        type
      }
    });
  };
  
  /**
   * 토론 상세 조회
   * @param {object} prisma - Prisma 클라이언트
   * @param {number} id - 토론 ID
   * @returns {Promise<Object>} 토론 상세 정보
   */
  const getDiscussionById = async (prisma, id) => {
    const discussion = await prisma.discussion.findUnique({
      where: { id },
      include: {
        comments: {
          include: {
            user: {
              select: {
                id: true,
                nickname: true,
                profileImage: true
              }
            },
            replies: {
              include: {
                user: {
                  select: {
                    id: true,
                    nickname: true,
                    profileImage: true
                  }
                },
                _count: {
                  select: {
                    replies: true
                  }
                }
              },
              orderBy: {
                createdAt: 'asc'
              }
            },
            _count: {
              select: {
                replies: true
              }
            }
          },
          where: {
            parentId: null // 최상위 댓글만 가져오기
          },
          orderBy: {
            createdAt: 'asc'
          }
        },
        reactions: {
          include: {
            user: {
              select: {
                id: true,
                nickname: true
              }
            }
          }
        },
        _count: {
          select: {
            comments: true,
            reactions: true
          }
        }
      }
    });
    
    if (!discussion) {
      return null;
    }
    
    // 찬성/반대 집계
    if (discussion.type === 'debate') {
      const forCount = discussion.comments.filter(c => c.stance === 'for').length;
      const againstCount = discussion.comments.filter(c => c.stance === 'against').length;
      
      discussion.debateStats = {
        forCount,
        againstCount,
        forPercentage: discussion.comments.length > 0 
          ? (forCount / discussion.comments.length * 100).toFixed(1) 
          : '0.0',
        againstPercentage: discussion.comments.length > 0 
          ? (againstCount / discussion.comments.length * 100).toFixed(1) 
          : '0.0'
      };
    }
    
    // 이모지 반응 집계
    const emojiCounts = {};
    discussion.reactions.forEach(reaction => {
      const { emoji } = reaction;
      emojiCounts[emoji] = (emojiCounts[emoji] || 0) + 1;
    });
    
    discussion.emojiStats = Object.entries(emojiCounts).map(([emoji, count]) => ({
      emoji,
      count
    })).sort((a, b) => b.count - a.count);
    
    return discussion;
  };
  
  /**
   * 댓글 추가
   * @param {object} prisma - Prisma 클라이언트
   * @param {number} discussionId - 토론 ID
   * @param {number} userId - 사용자 ID
   * @param {string} content - 댓글 내용
   * @param {string} stance - 의견 (찬성/반대)
   * @param {number} parentId - 부모 댓글 ID
   * @returns {Promise<Object>} 생성된 댓글 정보
   */
  const addComment = async (prisma, discussionId, userId, content, stance, parentId) => {
    // 토론 존재 여부 확인
    const discussion = await prisma.discussion.findUnique({
      where: { id: discussionId }
    });
    
    if (!discussion) {
      throw new Error('존재하지 않는 토론입니다.');
    }
    
    // 찬반 토론인 경우 stance 필수
    if (discussion.type === 'debate' && !parentId && !stance) {
      throw new Error('찬반 토론에는 의견(stance)이 필요합니다.');
    }
    
    // 부모 댓글 존재 여부 확인
    if (parentId) {
      const parentComment = await prisma.discussionComment.findUnique({
        where: { id: parentId }
      });
      
      if (!parentComment || parentComment.discussionId !== discussionId) {
        throw new Error('유효하지 않은 부모 댓글입니다.');
      }
    }
    
    // 댓글 생성
    const comment = await prisma.discussionComment.create({
      data: {
        discussionId,
        userId,
        content,
        stance: parentId ? null : stance, // 대댓글은 stance 없음
        parentId
      },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            profileImage: true
          }
        }
      }
    });
    
    // 활동 기록 추가 (잔디 기능)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    await prisma.activityCalendar.upsert({
      where: {
        userId_date: {
          userId,
          date: today
        }
      },
      update: {
        count: {
          increment: 1
        }
      },
      create: {
        userId,
        date: today,
        count: 1
      }
    });
    
    return comment;
  };
  /**
 * 반응 추가
 * @param {object} prisma - Prisma 클라이언트
 * @param {number} discussionId - 토론 ID
 * @param {number} userId - 사용자 ID
 * @param {string} emoji - 이모지 코드
 * @param {number} commentId - 댓글 ID
 * @returns {Promise<Object>} 생성된 반응 정보
 */
const addReaction = async (prisma, discussionId, userId, emoji, commentId) => {
    // 토론 존재 여부 확인
    const discussion = await prisma.discussion.findUnique({
      where: { id: discussionId }
    });
    
    if (!discussion) {
      throw new Error('존재하지 않는 토론입니다.');
    }
    
    // 댓글 존재 여부 확인
    if (commentId) {
      const comment = await prisma.discussionComment.findUnique({
        where: { id: commentId }
      });
      
      if (!comment || comment.discussionId !== discussionId) {
        throw new Error('유효하지 않은 댓글입니다.');
      }
    }
    
    // 중복 반응 확인 후 생성
    try {
      const reaction = await prisma.discussionReaction.create({
        data: {
          discussionId,
          userId,
          commentId,
          emoji
        },
        include: {
          user: {
            select: {
              id: true,
              nickname: true
            }
          }
        }
      });
      
      // 활동 기록 추가 (잔디 기능)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      await prisma.activityCalendar.upsert({
        where: {
          userId_date: {
            userId,
            date: today
          }
        },
        update: {
          count: {
            increment: 1
          }
        },
        create: {
          userId,
          date: today,
          count: 1
        }
      });
      
      return reaction;
    } catch (error) {
      // 중복 오류 처리
      if (error.code === 'P2002') {
        throw new Error('이미 동일한 반응을 추가했습니다.');
      }
      throw error;
    }
  };
  
  /**
   * 반응 삭제
   * @param {object} prisma - Prisma 클라이언트
   * @param {number} discussionId - 토론 ID
   * @param {number} userId - 사용자 ID
   * @param {string} emoji - 이모지 코드
   * @param {number} commentId - 댓글 ID
   * @returns {Promise<void>}
   */
  const removeReaction = async (prisma, discussionId, userId, emoji, commentId) => {
    // 반응 조회
    const reaction = await prisma.discussionReaction.findFirst({
      where: {
        discussionId,
        userId,
        emoji,
        commentId: commentId || null
      }
    });
    
    if (!reaction) {
      throw new Error('존재하지 않는 반응입니다.');
    }
    
    // 반응 삭제
    await prisma.discussionReaction.delete({
      where: {
        id: reaction.id
      }
    });
  };
  
  /**
   * 문제 응답 시 활동 기록 업데이트 (잔디 기능)
   * @param {object} prisma - Prisma 클라이언트
   * @param {number} userId - 사용자 ID
   * @returns {Promise<Object>} 업데이트된 활동 기록
   */
  const updateActivityOnAnswer = async (prisma, userId) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return await prisma.activityCalendar.upsert({
      where: {
        userId_date: {
          userId,
          date: today
        }
      },
      update: {
        count: {
          increment: 1
        }
      },
      create: {
        userId,
        date: today,
        count: 1
      }
    });
  };
  
  module.exports = {
    getActivityCalendar,
    getStatisticsByGender,
    getStatisticsByAgeGroup,
    getTopPerformers,
    getCategoryPerformance,
    getDiscussions,
    createDiscussion,
    getDiscussionById,
    addComment,
    addReaction,
    removeReaction,
    updateActivityOnAnswer
  };