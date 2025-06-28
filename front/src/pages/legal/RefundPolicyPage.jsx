import React, { useEffect } from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/landing/Footer';

const RefundPolicyPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      
      <main className="py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-8">환불 정책</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              CS Morning은 고객 만족을 최우선으로 생각합니다. 본 환불 정책은 CS Morning 프리미엄 구독 서비스의 결제 취소 및 환불에 관한 내용을 규정합니다.
            </p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">1. 환불 원칙</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>환불은 결제 시점, 서비스 이용 여부, 환불 요청 시점에 따라 적용 기준이 달라집니다.</li>
                <li>모든 환불은 원 결제 수단으로 환불됩니다.</li>
                <li>할인 쿠폰이나 프로모션 코드를 사용한 경우, 실제 결제한 금액을 기준으로 환불이 진행됩니다.</li>
                <li>부분 사용 후 환불 시, 이미 사용한 기간에 해당하는 금액은 차감됩니다.</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">2. 환불 기준</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border-collapse">
                  <thead>
                    <tr className="bg-blue-100">
                      <th className="border p-3 text-left">환불 신청 시점</th>
                      <th className="border p-3 text-left">환불 금액</th>
                      <th className="border p-3 text-left">비고</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-3">결제 후 7일 이내 (서비스 미사용)</td>
                      <td className="border p-3">결제 금액의 100%</td>
                      <td className="border p-3">콘텐츠 열람 이력이 없는 경우</td>
                    </tr>
                    <tr>
                      <td className="border p-3">결제 후 7일 이내 (서비스 이용)</td>
                      <td className="border p-3">결제 금액의 90%</td>
                      <td className="border p-3">콘텐츠 열람 이력이 있는 경우</td>
                    </tr>
                    <tr>
                      <td className="border p-3">결제 후 7일 이후 30일 이내</td>
                      <td className="border p-3">잔여 기간에 대한 일할 계산 금액의 50%</td>
                      <td className="border p-3">이용 기간 차감 후 계산</td>
                    </tr>
                    <tr>
                      <td className="border p-3">결제 후 30일 이후</td>
                      <td className="border p-3">환불 불가</td>
                      <td className="border p-3">서비스 특성상 장기 구독의 경우 환불 불가</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 text-gray-600">
                <p>※ 일할 계산 예시:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>6개월 구독(29,900원) 후 1개월 사용 시: 잔여 5개월 금액 = 24,917원의 50% = 12,458원 환불</li>
                  <li>1개월 구독(5,900원)의 경우 일할 계산을 적용하지 않고, 7일 이내 규정이 적용됩니다.</li>
                </ul>
              </div>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">3. 환불 요청 절차</h2>
              <ol className="list-decimal pl-6 space-y-2 text-gray-600">
                <li>환불 요청은 다음 방법 중 하나로 접수할 수 있습니다:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>웹사이트 마이페이지 {'>'} 구독 관리 {'>'} 구독 취소 및 환불</li>
                    <li>이메일: xogh2242@gmail.com (제목: 환불 요청)</li>
                    <li>고객센터 전화: 0507-2097-2373 (평일 10:00-18:00)</li>
                  </ul>
                </li>
                <li>환불 요청 시 다음 정보를 제공해 주셔야 합니다:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>구독자 성명 및 이메일</li>
                    <li>결제일 및 결제 금액</li>
                    <li>환불 사유</li>
                    <li>결제 영수증 또는 주문번호</li>
                  </ul>
                </li>
                <li>접수된 환불 요청은 영업일 기준 3일 이내에 처리되며, 처리 결과는 이메일로 안내됩니다.</li>
                <li>환불 요청 접수 후 추가 정보가 필요한 경우, 고객센터에서 연락을 드릴 수 있습니다.</li>
              </ol>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">4. 환불 제한 사항</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>다음의 경우에는 환불이 제한되거나 불가할 수 있습니다:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>서비스 이용 약관을 위반하여 계정이 정지 또는 삭제된 경우</li>
                    <li>무료 체험 기간을 이용한 후 유료 결제로 전환된 경우 (무료 체험 기간 자체는 환불 대상에서 제외)</li>
                    <li>특별 이벤트나 프로모션으로 제공된 무료 구독 기간</li>
                    <li>프로모션 코드나 쿠폰을 통해 70% 이상 할인된 가격으로 구매한 경우</li>
                  </ul>
                </li>
                <li>이미 다운로드하거나 저장한 콘텐츠가 있는 경우, 해당 콘텐츠에 대한 이용 권한은 환불과 동시에 소멸됩니다.</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">5. 이의 신청 방법</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>환불 처리 결과에 이의가 있는 경우, 결과 통보일로부터 7일 이내에 다음 방법으로 이의 신청을 할 수 있습니다:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>이메일: xogh2242@gmail.com (제목: 환불 이의 신청)</li>
                    <li>고객센터 전화: 0507-2097-2373 (평일 10:00-18:00)</li>
                  </ul>
                </li>
                <li>이의 신청 시 구체적인 사유와 근거를 제시해 주셔야 원활한 처리가 가능합니다.</li>
                <li>이의 신청은 영업일 기준 7일 이내에 처리되며, 처리 결과는 이메일로 안내됩니다.</li>
                <li>필요한 경우 소비자보호원이나 금융감독원의 분쟁조정 절차를 이용하실 수 있습니다.</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">6. 기타 사항</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>본 환불 정책은 관련 법령 및 소비자보호 지침에 따라 변경될 수 있으며, 변경 시 웹사이트를 통해 공지합니다.</li>
                <li>본 정책에 명시되지 않은 사항은 전자상거래 등에서의 소비자보호에 관한 법률 및 관련 법령, 일반적인 상관례에 따릅니다.</li>
                <li>환불 관련 기타 문의사항은 고객센터(02-123-4567) 또는 이메일(support@csmorning.co.kr)로 문의해 주시기 바랍니다.</li>
              </ul>
            </section>
          </div>
          
          <div className="mt-10 text-right">
            <p className="text-gray-600">최종 개정일: 2023년 1월 1일</p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RefundPolicyPage;