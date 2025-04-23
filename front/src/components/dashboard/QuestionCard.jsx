import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars

const QuestionCard = ({
  todayQuestion,
  selectedAnswer,
  setSelectedAnswer,
  isAnswered,
  isCorrect,
  handleAnswerSubmit,
}) => {
  // 질문이 없는 경우 처리
  if (!todayQuestion) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="p-6 mx-auto mb-8 bg-white rounded-lg shadow-md max-w-3xl"
      >
        <h2 className="mb-6 text-2xl text-center text-blue-900 font-['chosunGu']">
          오늘의 CS 문제
        </h2>
        
        <div className="p-4 text-center text-gray-500">
          오늘의 질문이 없습니다. 다음에 다시 시도해주세요.
        </div>
      </motion.div>
    );
  }

  // options를 파싱하여 배열로 변환
  const getOptionsArray = () => {
    const options = todayQuestion.question.options;

    // options가 문자열인 경우 JSON 파싱
    if (typeof options === 'string') {
      try {
        return JSON.parse(options);
      } catch (error) {
        console.error('Options 파싱 오류:', error);
        return [];
      }
    }

    // 이미 배열인 경우
    if (Array.isArray(options)) {
      return options;
    }

    // 그 외의 경우
    return [];
  };

  // 옵션 배열 가져오기
  const optionsArray = getOptionsArray();

  // 정답 옵션 가져오기 (정답이 있는 경우)
  const correctOption =
    todayQuestion.question.correctOption  ;
  

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="p-6 mx-auto mb-8 bg-white rounded-lg shadow-md max-w-3xl"
    >
      <h2 className="text-2xl font-bold text-center text-blue-900 ">
        오늘의 질문
      </h2>
      <p className='text-center font-["ChosunGu"] mb-4 text-gray-700'>매일 CS Morning 채널에서 '오늘의 질문' 입력하면 받으실 수 있어요 !</p>
      
      <div className="p-4 mb-4 bg-blue-50 rounded-lg">
        <p className="text-lg font-medium text-blue-800 ">
          {todayQuestion.question.text}
        </p>
        {todayQuestion.question.description && (
          <p className="mt-2 text-blue-600">
            {todayQuestion.question.description}
          </p>
        )}
      </div>

      <div className="mb-6 space-y-3">
        {optionsArray.map((option, index) => (
          <button
            key={index}
            onClick={() => !isAnswered && setSelectedAnswer(index)}
            disabled={isAnswered}
            className={`w-full p-3 text-left rounded-lg transition-colors ${
              selectedAnswer === index
                ? isAnswered
                  ? index === correctOption
                    ? 'bg-green-100 border border-green-500'
                    : 'bg-red-100 border border-red-500'
                  : 'bg-blue-100 border border-blue-500'
                : isAnswered && index === correctOption
                ? 'bg-green-100 border border-green-500'
                : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <div className="flex items-start">
              <span className="flex items-center justify-center w-6 h-6 mr-3 text-sm rounded-full bg-blue-100 text-blue-800">
                {index+1}
              </span>
              <span>{option}</span>
            </div>
          </button>
        ))}
      </div>

      {!isAnswered ? (
        <button
          onClick={handleAnswerSubmit}
          disabled={selectedAnswer === null}
          className="w-full py-3 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          답변 제출하기
        </button>
      ) : (
        <div className="p-4 mt-4 rounded-lg bg-blue-50">
          <h3 className="mb-2 text-lg font-semibold text-blue-800">
            {isCorrect ? '정답입니다! 👍' : '틀렸습니다. 😔'}
          </h3>
          <p className="mb-2 text-blue-700">
            정답: {optionsArray[correctOption]}
          </p>
          <div className="p-3 bg-white rounded-lg">
            <h4 className="mb-1 font-medium text-blue-800">설명:</h4>
            <p className="text-gray-700">
              {todayQuestion.question.explanation}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default QuestionCard;
