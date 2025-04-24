import { useState } from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import UserStatusBadge from './UserStatusBadge';
import { FiX, FiSave, FiEdit, FiCheck, FiArrowLeft } from 'react-icons/fi';

/**
 * 사용자 상세 정보 패널 컴포넌트
 * 선택된 사용자의 상세 정보를 표시하고 수정할 수 있는 패널
 */
const UserDetailPanel = ({ user, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nickname: user?.nickname || '',
    email: user?.email || '',
    name: user?.name || '',
    gender: user?.gender || '',
    ageGroup: user?.ageGroup || '',
    phoneNumber: user?.phoneNumber || '',
    isSubscribed: user?.isSubscribed || false,
    isPremium: user?.isPremium || false,
    isActive: user?.isActive !== false
  });

  if (!user) return null;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(user.id, formData);
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 right-0 h-full w-96 bg-white shadow-xl z-50 overflow-y-auto"
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-blue-900">
            사용자 상세 정보
          </h2>
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2 text-gray-600 hover:text-gray-800"
                  title="취소"
                >
                  <FiX />
                </button>
                <button
                  onClick={handleSubmit}
                  className="p-2 text-green-600 hover:text-green-800"
                  title="저장"
                >
                  <FiSave />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-blue-600 hover:text-blue-800"
                  title="수정"
                >
                  <FiEdit />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-600 hover:text-gray-800"
                  title="닫기"
                >
                  <FiArrowLeft />
                </button>
              </>
            )}
          </div>
        </div>

        {/* 사용자 기본 정보 */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mr-4">
              {user.profileImage ? (
                <img src={user.profileImage} alt={user.nickname} className="w-16 h-16 rounded-full" />
              ) : (
                <span className="text-3xl text-gray-500">
                  {user.nickname?.charAt(0) || '?'}
                </span>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                {user.nickname || '이름 없음'}
                {user.role === 'admin' && (
                  <UserStatusBadge type="role" value={user.role} />
                )}
              </h3>
              <p className="text-gray-500">ID: {user.id}</p>
              <p className="text-gray-500">가입일: {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <div>
              <UserStatusBadge type="active" value={user.isActive !== false} />
            </div>
            <div>
              <UserStatusBadge type="subscription" value={user.isSubscribed} />
            </div>
            <div>
              <UserStatusBadge type="premium" value={user.isPremium} expiryDate={user.premiumUntil} />
            </div>
          </div>
        </div>

        {/* 편집 폼 또는 정보 표시 */}
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">닉네임</label>
              <input
                type="text"
                name="nickname"
                value={formData.nickname}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">성별</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">선택 안함</option>
                <option value="male">남성</option>
                <option value="female">여성</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">연령대</label>
              <select
                name="ageGroup"
                value={formData.ageGroup}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">선택 안함</option>
                <option value="10~19">10대</option>
                <option value="20~29">20대</option>
                <option value="30~39">30대</option>
                <option value="40~49">40대</option>
                <option value="50~59">50대</option>
                <option value="60~">60대 이상</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="01X-XXXX-XXXX"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isSubscribed"
                  id="isSubscribed"
                  checked={formData.isSubscribed}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="isSubscribed" className="ml-2 block text-sm text-gray-700">
                  구독 활성화
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isPremium"
                  id="isPremium"
                  checked={formData.isPremium}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="isPremium" className="ml-2 block text-sm text-gray-700">
                  프리미엄 활성화
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  disabled={user.role === 'admin'}
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                  계정 활성화
                </label>
              </div>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">카카오 ID</p>
              <p className="font-medium">{user.kakaoId || '-'}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-gray-500">이메일</p>
              <p className="font-medium">{user.email || '-'}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-gray-500">이름</p>
              <p className="font-medium">{user.name || '-'}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-gray-500">성별</p>
              <p className="font-medium">{user.gender === 'male' ? '남성' : user.gender === 'female' ? '여성' : '-'}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-gray-500">연령대</p>
              <p className="font-medium">{user.ageGroup || '-'}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-gray-500">전화번호</p>
              <p className="font-medium">{user.phoneNumber || '-'}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-gray-500">통계</p>
              <p className="font-medium">답변: {user.totalAnswered || 0} / 정답: {user.correctAnswers || 0}</p>
              <p className="font-medium">
                정확도: {user.totalAnswered > 0 ? `${Math.round((user.correctAnswers / user.totalAnswered) * 100)}%` : '-'}
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default UserDetailPanel;