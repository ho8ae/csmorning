const webhookService = require('./webhook.service');
const kakaoService = require('../../services/kakao.service');

/**
 * 카카오톡 챗봇 스킬 메시지 처리
 */
const handleKakaoMessage = async (req, res, next) => {
  try {
    // 카카오 챗봇 스킬 API 요청 구조를 따라야 함
    const { userRequest, action } = req.body;

    // 요청 구조 확인
    if (!userRequest || !action) {
      return res.status(400).json({
        version: '2.0',
        template: {
          outputs: [
            {
              simpleText: {
                text: '유효하지 않은 요청입니다.',
              },
            },
          ],
        },
      });
    }

    // 사용자 정보 추출
    const userId = userRequest.user.id;
    const utterance = userRequest.utterance;

    console.log('받은 메시지:', utterance);
    console.log('사용자 ID:', userId);

    // 사용자 확인/생성
    const user = await webhookService.findOrCreateUser(req.prisma, userId);

    // 메시지 내용에 따른 처리
    let responseText = '';
    let quickReplies = [
      {
        label: '오늘의 질문',
        action: 'message',
        messageText: '오늘의 질문',
      },
      {
        label: '구독하기',
        action: 'message',
        messageText: '구독',
      },
      {
        label: '도움말',
        action: 'message',
        messageText: '도움말',
      },
      {
        label: '계정 연동',
        action: 'message',
        messageText: '계정 연동',
      },
    ];

    if (
      utterance.includes('안녕') ||
      utterance.includes('시작') ||
      utterance.includes('도움말')
    ) {
      responseText =
        '안녕하세요! CS Morning 챗봇입니다.\n\n다음 명령어를 사용할 수 있어요:\n- 오늘의 질문: 오늘의 CS 질문을 받아볼 수 있어요.\n- 구독하기: CS Morning을 구독합니다.\n- 도움말: CS Morning의 사용법을 안내합니다.\n- 계정 연동: CS Morning 웹사이트와 계정을 연동합니다.\n\n원하는 명령어를 입력해보세요!';
    } else if (
      utterance.includes('오늘의 질문') ||
      utterance.includes('문제')
    ) {
      // 오늘의 질문 가져오기
      const todayQuestion = await webhookService.getTodayQuestion(req.prisma);

      if (!todayQuestion) {
        responseText =
          '오늘의 질문이 아직 준비되지 않았습니다. 잠시 후 다시 시도해주세요!';
      } else {
        // 질문 포맷팅
        const question = todayQuestion.question;
        let options = '';

        // options가 문자열인 경우 JSON 파싱
        const optionsArray =
          typeof question.options === 'string'
            ? JSON.parse(question.options)
            : question.options;

        // 이제 배열로 처리
        if (Array.isArray(optionsArray)) {
          optionsArray.forEach((option, index) => {
            options += `${index + 1}. ${option}\n`;
          });
          
          // 선택지 수에 맞게 퀵 리플라이 버튼 생성
          quickReplies = [];
          for (let i = 0; i < optionsArray.length; i++) {
            quickReplies.push({
              label: `${i + 1}번`,
              action: 'message',
              messageText: `${i + 1}`,
            });
          }
          
          // 기존 메뉴도 추가
          quickReplies.push({
            label: '도움말',
            action: 'message',
            messageText: '도움말',
          });
        } else {
          console.log('Parsed question options is not an array:', optionsArray);
          options = '선택지 형식이 올바르지 않습니다.';
        }

        responseText = `[오늘의 CS 질문😎]\n\n카테고리: ${question.category}\n난이도: ${question.difficulty}\n\n${question.text}\n\n${options}\n\n답변은 번호로 입력해주세요 (예: 1) \n\n[안내] 계정 연동을 해야 기록이 됩니다\n'안녕'을 입력하면 처음으로 돌아갑니다`;
      }
    } else if (/^[1-9]\d*$/.test(utterance.trim())) {
      // 숫자 응답 처리
      const todayQuestion = await webhookService.getTodayQuestion(req.prisma);

      if (!todayQuestion) {
        responseText =
          "현재 답변할 수 있는 질문이 없습니다. '오늘의 질문'을 먼저 요청해주세요.";
      } else {
        // 사용자 답변 처리
        const answerIndex = parseInt(utterance.trim()) - 1;
        const options = todayQuestion.question.options;

        // 옵션 범위 확인
        if (answerIndex < 0 || answerIndex >= options.length) {
          responseText = `1부터 ${options.length} 사이의 번호로 답변해주세요.`;
        } else {
          // 정답 확인
          const isCorrect =
            answerIndex === todayQuestion.question.correctOption;

          // 이미 응답했는지 확인
          const existingResponse =
            await webhookService.getUserResponseForQuestion(
              req.prisma,
              user.id,
              todayQuestion.id,
            );

          if (!existingResponse) {
            // 새 응답 저장
            await webhookService.createResponse(
              req.prisma,
              user.id,
              todayQuestion.id,
              answerIndex,
              isCorrect,
            );

            // 사용자 통계 업데이트
            await webhookService.updateUserStats(
              req.prisma,
              user.id,
              isCorrect,
            );
          }

          // 응답 메시지 준비
          if (isCorrect) {
            responseText = `정답입니다! 👏\n\n[설명]\n${todayQuestion.question.explanation}`;
          } else {
            const correctOptionIndex = todayQuestion.question.correctOption;
            responseText = `아쉽게도 오답입니다. 😢\n\n정답은 ${
              correctOptionIndex + 1
            }번입니다.\n\n[설명]\n${todayQuestion.question.explanation}`;
          }
          
          // 퀵 리플라이에 '다음 질문' 버튼 추가
          quickReplies.unshift({
            label: '다음 질문(아직 X)',
            action: 'message',
            messageText: '오늘의 질문',
          });
        }
      }
    } else if (utterance.includes('계정 연동')) {
      try {
        // 카카오 채널 ID 추출
        const kakaoChannelId = userRequest.user.id;
        console.log('카카오 채널 ID:', kakaoChannelId);
        
        // 매핑 조회
        let mapping = null;
        try {
          mapping = await req.prisma.userKakaoMapping.findUnique({
            where: { kakaoChannelId },
            include: { user: true }
          });
          console.log('매핑 조회 결과:', mapping);
        } catch (error) {
          console.error('매핑 조회 중 오류:', error);
        }
        
        // 이미 연동된 계정인지 확인
        if (mapping && mapping.user && mapping.user.isTemporary === false) {
          // 이미 연동된 계정인 경우
          return res.status(200).json({
            version: "2.0",
            template: {
              outputs: [
                {
                  textCard: {
                    title: "계정 연동 완료",
                    description: "이미 CS Morning 웹사이트와 계정이 연동되어 있습니다.\n웹사이트에서 동일한 계정으로 서비스를 이용하실 수 있습니다.",
                    buttons: [
                      {
                        action: "webLink",
                        label: "CSMorning 웹사이트",
                        webLinkUrl: "https://csmorning.co.kr"
                      }
                    ]
                  }
                }
              ],
              quickReplies: [
                {
                  label: '오늘의 질문',
                  action: 'message',
                  messageText: '오늘의 질문',
                },
                {
                  label: '도움말',
                  action: 'message',
                  messageText: '도움말',
                }
              ]
            }
          });
        } else {
          // 계정 연동 코드 생성
          const linkCode = await webhookService.generateLinkCode(req.prisma, kakaoChannelId);
          
          // 서비스 도메인
          const serviceDomain = process.env.NODE_ENV === 'production'
            ? 'https://csmorning.co.kr'
            : 'http://localhost:5173';
          
          // 계정 연동이 필요한 경우 - textCard 형식으로 응답
          return res.status(200).json({
            version: "2.0",
            template: {
              outputs: [
                {
                  textCard: {
                    title: "CS Morning 계정 연동",
                    description: `계정 연동 코드가 생성되었습니다.\n\n코드: ${linkCode}\n\n아래 버튼을 통해 CS Morning 웹사이트에서 계정을 연동하세요.\n연동 코드는 10분간 유효합니다.`,
                    buttons: [
                      {
                        action: "webLink",
                        label: "웹사이트에서 연동하기",
                        webLinkUrl: `${serviceDomain}/kakao-link?code=${linkCode}`
                      },
                      {
                        action: "webLink",
                        label: "CSMorning 웹사이트",
                        webLinkUrl: "https://csmorning.co.kr"
                      }
                    ]
                  }
                }
              ],
              quickReplies: [
                {
                  label: '오늘의 질문',
                  action: 'message',
                  messageText: '오늘의 질문',
                },
                {
                  label: '도움말',
                  action: 'message',
                  messageText: '도움말',
                }
              ]
            }
          });
        }
      } catch (error) {
        console.error('계정 연동 처리 중 오류:', error);
        
        // 오류 발생 시 응답
        return res.status(200).json({
          version: "2.0",
          template: {
            outputs: [
              {
                simpleText: {
                  text: '계정 연동 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
                },
              },
            ],
          },
        });
      }
    } else if (utterance.includes('구독')) {
      if (utterance.includes('취소') || utterance.includes('해지')) {
        await req.prisma.user.update({
          where: { id: user.id },
          data: { isSubscribed: false },
        });
        responseText =
          'CS Morning 구독이 취소되었습니다. 언제든지 다시 구독하실 수 있습니다.';
      } else {
        await req.prisma.user.update({
          where: { id: user.id },
          data: { isSubscribed: true },
        });
        responseText =
          'CS Morning을 구독해주셔서 감사합니다! 매일 아침 8시에 CS 지식을 보내드립니다.';
      }
    } else {
      responseText =
        "죄송합니다. 이해하지 못했어요. '도움말'을 입력하시면 사용 가능한 명령어를 확인할 수 있습니다.";
    }

    // 카카오 챗봇 스킬 응답 형식으로 반환
    const responseBody = {
      version: '2.0',
      template: {
        outputs: [
          {
            simpleText: {
              text: responseText,
            },
          },
        ],
        quickReplies: quickReplies,
      },
    };

    // 카카오 챗봇이 응답을 처리할 때 필요한 헤더
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(200).json(responseBody);
  } catch (error) {
    console.error('웹훅 처리 중 오류 발생:', error);

    // 오류 발생 시에도 챗봇 스킬 응답 형식 유지
    return res.status(200).json({
      version: '2.0',
      template: {
        outputs: [
          {
            simpleText: {
              text: '요청 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
            },
          },
        ],
      },
    });
  }
};

/**
 * 계정 연동 코드 생성 처리
 */
const handleAccountLinking = async (req, res, next) => {
  try {
    const { userRequest } = req.body;

    if (!userRequest || !userRequest.user || !userRequest.user.id) {
      return res.status(200).json({
        version: '2.0',
        template: {
          outputs: [
            {
              simpleText: {
                text: '유효하지 않은 요청입니다.',
              },
            },
          ],
        },
      });
    }

    const kakaoChannelId = userRequest.user.id;

    // 이미 연동된 계정인지 확인
    let mapping = null;
    try {
      mapping = await req.prisma.userKakaoMapping.findUnique({
        where: { kakaoChannelId },
        include: { user: true },
      });
      console.log('매핑 조회 결과:', mapping);
    } catch (error) {
      console.error('매핑 조회 중 오류:', error);
    }

    // 이미 연동된 계정인 경우
    if (mapping && mapping.user && mapping.user.isTemporary === false) {
      const responseBody = {
        version: '2.0',
        template: {
          outputs: [
            {
              simpleText: {
                text: `이미 계정이 연동되어 있습니다. CS Morning 웹사이트에서 동일한 계정으로 서비스를 이용하실 수 있습니다.`,
              },
            },
          ],
          quickReplies: [
            {
              label: '오늘의 질문',
              action: 'message',
              messageText: '오늘의 질문',
            },
          ],
        },
      };

      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      return res.status(200).json(responseBody);
    }

    // 연동 코드 생성
    const linkCode = await webhookService.generateLinkCode(
      req.prisma,
      kakaoChannelId,
    );

    // 서비스 도메인
    const serviceDomain =
      process.env.NODE_ENV === 'production'
        ? 'https://csmorning.co.kr'
        : 'http://localhost:5173';

    // 카카오 챗봇 응답
    const responseBody = {
      version: '2.0',
      template: {
        outputs: [
          {
            simpleText: {
              text: `계정 연동 코드가 생성되었습니다.\n\n코드: ${linkCode}\n\n아래 '계정 연동하기' 버튼을 클릭하면 자동으로 연동됩니다. 또는 CS Morning 웹사이트에서 계정 연동 메뉴를 선택한 후 이 코드를 입력해주세요. 연동 코드는 10분간 유효합니다.`,
            },
          },
        ],
        quickReplies: [
          {
            label: '계정 연동하기',
            action: 'webLink',
            webLinkUrl: `${serviceDomain}/kakao-link?code=${linkCode}`,
          },
          {
            label: '오늘의 질문',
            action: 'message',
            messageText: '오늘의 질문',
          },
        ],
      },
    };

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(200).json(responseBody);
  } catch (error) {
    console.error('계정 연동 처리 중 오류 발생:', error);

    return res.status(200).json({
      version: '2.0',
      template: {
        outputs: [
          {
            simpleText: {
              text: '계정 연동 코드 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
            },
          },
        ],
      },
    });
  }
};

/**
 * 테스트 엔드포인트
 */
const testEndpoint = (req, res) => {
  const responseBody = {
    version: '2.0',
    template: {
      outputs: [
        {
          simpleText: {
            text: '테스트 응답입니다.',
          },
        },
      ],
    },
  };
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  return res.status(200).json(responseBody);
};

module.exports = {
  handleKakaoMessage,
  testEndpoint,
  handleAccountLinking,
};