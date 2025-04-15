import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { questionsAPI } from '../../services/api';

const QuestionForm = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    text: '',
    description: '',
    options: ['', '', '', ''],
    correctOption: 0,
    explanation: '',
    category: '',
    difficulty: 'medium',
    active: true
  });

  useEffect(() => {
    const fetchQuestion = async () => {
      if (isEdit && id) {
        try {
          setIsLoading(true);
          const question = await questionsAPI.getById(id);
          setFormData({
            text: question.text || '',
            description: question.description || '',
            options: Array.isArray(question.options) ? question.options : ['', '', '', ''],
            correctOption: question.correctOption || 0,
            explanation: question.explanation || '',
            category: question.category || '',
            difficulty: question.difficulty || 'medium',
            active: question.active !== undefined ? question.active : true
          });
        } catch (error) {
          console.error('질문 로딩 중 오류:', error);
          setError('질문을 불러오는 중 오류가 발생했습니다.');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchQuestion();
  }, [isEdit, id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({
      ...formData,
      options: newOptions
    });
  };

  const handleAddOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, '']
    });
  };

  const handleRemoveOption = (index) => {
    // 최소 2개의 옵션은 유지
    if (formData.options.length <= 2) return;
    
    const newOptions = formData.options.filter((_, i) => i !== index);
    
    // 만약 삭제된 옵션이 정답이었다면 정답을 첫 번째 옵션으로 설정
    let newCorrectOption = formData.correctOption;
    if (formData.correctOption === index) {
      newCorrectOption = 0;
    } else if (formData.correctOption > index) {
      // 삭제된 옵션 이후의 정답 인덱스를 조정
      newCorrectOption = formData.correctOption - 1;
    }
    
    setFormData({
      ...formData,
      options: newOptions,
      correctOption: newCorrectOption
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // 폼 유효성 검사
      if (!formData.text.trim()) {
        throw new Error('질문을 입력해주세요.');
      }
      
      if (!formData.options.every(option => option.trim())) {
        throw new Error('모든 옵션을 입력해주세요.');
      }
      
      if (!formData.explanation.trim()) {
        throw new Error('정답 설명을 입력해주세요.');
      }
      
      if (!formData.category.trim()) {
        throw new Error('카테고리를 입력해주세요.');
      }

      // API 호출
      if (isEdit) {
        await questionsAPI.update(id, formData);
      } else {
        await questionsAPI.create(formData);
      }

      setSuccess(true);
      // 3초 후 목록으로 리다이렉트
      setTimeout(() => {
        navigate('/admin/questions');
      }, 3000);
    } catch (error) {
      console.error('질문 저장 중 오류:', error);
      setError(error.message || '질문을 저장하는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && isEdit) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="ml-3">질문 정보를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-blue-900 mb-6">
        {isEdit ? '질문 수정' : '새 질문 등록'}
      </h2>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md">
          질문이 성공적으로 {isEdit ? '수정' : '등록'}되었습니다. 목록 페이지로 이동합니다...
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* 질문 */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="text">
            질문 *
          </label>
          <textarea
            id="text"
            name="text"
            value={formData.text}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            required
          />
        </div>

        {/* 질문 설명 */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="description">
            질문 설명 (선택사항)
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="2"
          />
        </div>

        {/* 옵션 */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            선택 항목 *
          </label>
          {formData.options.map((option, index) => (
            <div key={index} className="flex items-center mb-2">
              <div className="flex-shrink-0 mr-3">
                <input
                  type="radio"
                  name="correctOption"
                  value={index}
                  checked={parseInt(formData.correctOption) === index}
                  onChange={() => setFormData({...formData, correctOption: index})}
                  className="mr-1"
                  id={`option-${index}`}
                />
                <label htmlFor={`option-${index}`} className="text-sm">정답</label>
              </div>
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`선택 항목 ${index + 1}`}
                required
              />
              <button
                type="button"
                onClick={() => handleRemoveOption(index)}
                className="ml-2 text-red-500 hover:text-red-700"
                disabled={formData.options.length <= 2}
              >
                삭제
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddOption}
            className="mt-2 text-blue-500 hover:text-blue-700"
          >
            + 선택 항목 추가
          </button>
        </div>

        {/* 정답 설명 */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="explanation">
            정답 설명 *
          </label>
          <textarea
            id="explanation"
            name="explanation"
            value={formData.explanation}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            required
          />
        </div>

        {/* 카테고리 */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="category">
            카테고리 *
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* 난이도 */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="difficulty">
            난이도 *
          </label>
          <select
            id="difficulty"
            name="difficulty"
            value={formData.difficulty}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="easy">쉬움</option>
            <option value="medium">보통</option>
            <option value="hard">어려움</option>
          </select>
        </div>

        {/* 활성화 여부 */}
        <div className="mb-6 flex items-center">
          <input
            type="checkbox"
            id="active"
            name="active"
            checked={formData.active}
            onChange={handleInputChange}
            className="mr-2"
          />
          <label htmlFor="active" className="text-gray-700">
            질문 활성화
          </label>
        </div>

        {/* 제출 버튼 */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate('/admin/questions')}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 mr-3"
            disabled={isLoading}
          >
            취소
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? '처리 중...' : (isEdit ? '질문 수정' : '질문 등록')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuestionForm;