import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion'; // eslint-disable-line
import Navbar from '../components/common/Navbar';
import Footer from '../components/landing/Footer';
import useAuthStore from '../store/authStore';
import { authAPI } from '../services/api';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const [plan, setPlan] = useState(null);
  const [agreed, setAgreed] = useState({
    terms: false,
    privacy: false,
    subscription: false,
    refund: false,
  });
  const [paymentMethod, setPaymentMethod] = useState('kakaopay');

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Get plan data from URL params
    if (location.state?.plan) {
      setPlan(location.state.plan);
    } else {
      // Default plan if none provided
      setPlan({
        period: '6개월',
        price: '0',
        originalPrice: '0',
        discount: '15%',
        features: [
          '모든 프리미엄 기능 이용',
          '출석 잔디 기능',
          '사용자 통계 확인',
          '토론하기 기능',
          '심화 문제 모드'
        ]
      });
    }
  }, [location]);

  const handleAgreeAll = (e) => {
    const isChecked = e.target.checked;
    setAgreed({
      terms: isChecked,
      privacy: isChecked,
      subscription: isChecked,
      refund: isChecked,
    });
  };

  const isAllAgreed = () => {
    return Object.values(agreed).every(value => value === true);
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    
    if (!isAllAgreed()) {
      alert('모든 약관에 동의해주셔야 결제가 가능합니다.');
      return;
    }
    
    try {
      // API를 통해 프리미엄 상태 업데이트
      // 지금은 결제 처리가 바로 TEST로 진행되지만,
      // 실제 결제 API를 호출하여 결제를 처리해야 합니다.
      const result = await authAPI.updatePremium(true, plan.period);
      
      // 업데이트된 사용자 정보로 상태 갱신
      useAuthStore.setState({ user: result.user });
      
      // 결제 성공 페이지로 이동
      navigate('/payment-success', {
        state: {
          plan: plan,
          paymentMethod: paymentMethod,
          orderDate: new Date().toISOString(),
          orderId: 'ORDER-' + Math.random().toString(36).substr(2, 9).toUpperCase()
        }
      });
    } catch (error) {
      console.error('프리미엄 업데이트 오류:', error);
      alert('결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  if (!plan || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      
      <main className="py-10 pt-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <motion.h1 
              className="text-3xl font-bold text-blue-900 mb-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              결제하기
            </motion.h1>
            <p className="text-gray-600">안전한 결제를 위해 아래 정보를 확인해주세요.</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* 상단 진행 상태 표시 */}
            <div className="bg-blue-50 px-6 py-4">
              <div className="flex items-center justify-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-900 text-white rounded-full flex items-center justify-center">1</div>
                  <div className="ml-2 font-medium">서비스 선택</div>
                </div>
                <div className="w-10 h-1 bg-blue-900 mx-2"></div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-900 text-white rounded-full flex items-center justify-center">2</div>
                  <div className="ml-2 font-medium">결제 정보 확인</div>
                </div>
                <div className="w-10 h-1 bg-blue-900 mx-2"></div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-900 text-white rounded-full flex items-center justify-center">3</div>
                  <div className="ml-2 font-medium">결제 완료</div>
                </div>
              </div>
            </div>
            
            {/* 주문 정보 */}
            <div className="px-6 py-6 border-b">
              <h2 className="text-xl font-bold text-blue-900 mb-4">주문 상품 정보</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">CS Morning 프리미엄 {plan.period} 구독</span>
                  <span className="font-bold text-blue-900"><span className='line-through text-blue-100'>{plan.price}</span>0원</span>
                </div>
                {plan.discount && (
                  <div className="text-sm text-gray-600 mb-2">
                    <span>정가 {plan.originalPrice}원에서 {plan.discount} 할인 적용</span>
                  </div>
                )}
                <ul className="mt-3 space-y-1">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* 결제자 정보 */}
            <div className="px-6 py-6 border-b">
              <h2 className="text-xl font-bold text-blue-900 mb-4">결제자 정보</h2>
              <div className="space-y-3">
                <div className="flex">
                  <div className="w-24 text-gray-600">이름</div>
                  <div className="font-medium">{user.nickname || '사용자'}</div>
                </div>
                <div className="flex">
                  <div className="w-24 text-gray-600">이메일</div>
                  <div className="font-medium">{user.email || '-'}</div>
                </div>
                <div className="flex">
                  <div className="w-24 text-gray-600">전화번호</div>
                  <div className="font-medium">{user.phoneNumber || '-'}</div>
                </div>
              </div>
            </div>
            
            {/* 결제 수단 선택 */}
            <div className="px-6 py-6 border-b">
              <h2 className="text-xl font-bold text-blue-900 mb-4">결제 수단</h2>
              <div className="space-y-3">
                <label className="flex items-center p-3 border rounded-md cursor-pointer bg-yellow-50">
                  <input
                    type="radio"
                    name="payment"
                    value="kakaopay"
                    checked={paymentMethod === 'kakaopay'}
                    onChange={() => setPaymentMethod('kakaopay')}
                    className="h-5 w-5 text-yellow-400"
                  />
                  <div className="ml-3 flex items-center">
                    <img src="https://developers.kakao.com/assets/img/about/logos/kakaopay/kakaopay_symbol.png" alt="Kakao Pay" className="h-6 mr-2" />
                    <span className="font-medium">카카오페이</span>
                  </div>
                </label>
              </div>
              
              <div className="mt-4 text-sm text-gray-500">
                <p>• 카카오페이는 카카오톡에서 카드를 등록, 간단하게 비밀번호만으로 결제할 수 있는 서비스입니다.</p>
                <p>• 카카오페이 결제 시, 결제 금액이 월 자동 결제됩니다. 다음 결제 예정일은 구독 기간 만료일입니다.</p>
              </div>
            </div>
            
            {/* 최종 결제 금액 */}
            <div className="px-6 py-6 border-b">
              <h2 className="text-xl font-bold text-blue-900 mb-4">최종 결제 금액</h2>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">총 결제 금액</span>
                  <span className="text-xl font-bold text-blue-900"><span className='line-through text-blue-100'>{plan.price}</span>0원</span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <p>• 구독 기간: {plan.period}</p>
                  <p>• 다음 결제 예정일: {new Date(new Date().setMonth(new Date().getMonth() + (plan.period === '1개월' ? 1 : plan.period === '6개월' ? 6 : 12))).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            
            {/* 이용약관 동의 */}
            <div className="px-6 py-6 border-b">
              <h2 className="text-xl font-bold text-blue-900 mb-4">이용약관 동의</h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="agree-all"
                    checked={isAllAgreed()}
                    onChange={handleAgreeAll}
                    className="h-5 w-5"
                  />
                  <label htmlFor="agree-all" className="ml-3 font-medium">전체 동의</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="agree-terms"
                    checked={agreed.terms}
                    onChange={(e) => setAgreed({...agreed, terms: e.target.checked})}
                    className="h-5 w-5"
                  />
                  <label htmlFor="agree-terms" className="ml-3 text-gray-700">이용약관 동의 (필수)</label>
                  <a href="/terms" target="_blank" className="ml-auto text-sm text-blue-600">보기</a>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="agree-privacy"
                    checked={agreed.privacy}
                    onChange={(e) => setAgreed({...agreed, privacy: e.target.checked})}
                    className="h-5 w-5"
                  />
                  <label htmlFor="agree-privacy" className="ml-3 text-gray-700">개인정보 처리방침 동의 (필수)</label>
                  <a href="/privacy" target="_blank" className="ml-auto text-sm text-blue-600">보기</a>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="agree-subscription"
                    checked={agreed.subscription}
                    onChange={(e) => setAgreed({...agreed, subscription: e.target.checked})}
                    className="h-5 w-5"
                  />
                  <label htmlFor="agree-subscription" className="ml-3 text-gray-700">구독 서비스 이용약관 동의 (필수)</label>
                  <a href="/subscription-terms" target="_blank" className="ml-auto text-sm text-blue-600">보기</a>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="agree-refund"
                    checked={agreed.refund}
                    onChange={(e) => setAgreed({...agreed, refund: e.target.checked})}
                    className="h-5 w-5"
                  />
                  <label htmlFor="agree-refund" className="ml-3 text-gray-700">환불 정책 동의 (필수)</label>
                  <a href="/refund-policy" target="_blank" className="ml-auto text-sm text-blue-600">보기</a>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg text-sm text-gray-700">
                <p className="font-medium">구독 서비스 중요 안내</p>
                <p className="mt-1">• 선택하신 구독 상품은 {plan.period} 동안 이용 가능하며, 구독 기간 만료 시 자동으로 갱신됩니다.</p>
                <p>• 언제든지 마이페이지에서 구독을 해지할 수 있으며, 해지 시 다음 결제일부터 요금이 청구되지 않습니다.</p>
                <p>• 환불은 결제 후 7일 이내에 요청하실 경우 가능하며, 상세 환불 정책은 환불 정책 페이지를 참고해주세요.</p>
                <p>• 결제 관련 문의는 고객센터(0507-2097-2373) 또는 이메일(xogh2242@gmail.com)로 문의해주세요.</p>
              </div>
            </div>
            
            {/* 결제하기 버튼 */}
            <div className="px-6 py-6">
              <button
                onClick={handleCheckout}
                disabled={!isAllAgreed()}
                className={`w-full py-3 rounded-md font-bold text-lg transition-colors duration-200 ${
                  isAllAgreed() 
                    ? 'bg-yellow-400 hover:bg-yellow-500 text-blue-900' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <span className='line-through text-blue-100'>{plan.price}</span> 0원 결제하기
              </button>
              
              <p className="mt-4 text-center text-sm text-gray-600">
                위 버튼을 클릭하면 카카오페이 결제 창으로 이동합니다.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CheckoutPage;