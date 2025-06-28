import React, { useEffect } from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/landing/Footer';

const SubscriptionTermsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      
      <main className="py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-8">구독 서비스 이용 약관</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              본 약관은 (주)후이즈왓(이하 "회사")이 제공하는 CS Morning 프리미엄 구독 서비스(이하 "서비스")의 
              이용 조건을 규정함을 목적으로 합니다.
            </p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">제1조 (목적 및 정의)</h2>
              <ol className="list-decimal pl-6 space-y-2">
                <li>본 약관은 회사가 제공하는 CS Morning 프리미엄 구독 서비스의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.</li>
                <li>"서비스"란 회사가 제공하는 CS Morning 프리미엄 구독 서비스를 의미합니다.</li>
                <li>"이용자"란 본 약관에 따라 회사가 제공하는 서비스를 이용하는 회원을 말합니다.</li>
                <li>"구독"이란 이용자가 일정 기간 동안 서비스를 이용하기 위해 대금을 지불하고 서비스를 제공받는 계약을 의미합니다.</li>
              </ol>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">제2조 (구독 신청 및 결제)</h2>
              <ol className="list-decimal pl-6 space-y-2">
                <li>서비스 구독은 회원 가입 후 이용 가능합니다.</li>
                <li>구독 신청은 회사가 정한 양식에 따라 제반 정보를 기입하고 결제 절차를 완료함으로써 성립됩니다.</li>
                <li>구독 결제는 카카오페이를 통해 진행되며, 결제 시 입력한 정보의 정확성에 대한 책임은 이용자에게 있습니다.</li>
                <li>회사는 다음과 같은 구독 신청에 대해서는 승낙하지 않을 수 있습니다:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>실명이 아니거나 타인의 명의를 사용하는 경우</li>
                    <li>허위 정보를 기재하거나 회사가 요구하는 정보를 제공하지 않는 경우</li>
                    <li>서비스 이용 목적이 불법 또는 부당한 경우</li>
                    <li>기타 회사가 합리적인 판단에 의하여 필요하다고 인정하는 경우</li>
                  </ul>
                </li>
              </ol>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">제3조 (구독 요금 및 청구)</h2>
              <ol className="list-decimal pl-6 space-y-2">
                <li>서비스 이용 요금은 회사의 웹사이트에 게시된 요금제에 따르며, 회사는 요금을 변경할 수 있습니다.</li>
                <li>구독 요금은 선택한 구독 기간(1개월, 6개월, 12개월)에 따라 일시불로 청구됩니다.</li>
                <li>구독 갱신 시 현재 적용되는 요금이 청구됩니다.</li>
                <li>요금이 변경될 경우, 회사는 변경 사항을 웹사이트에 공지하고 이메일 등을 통해 이용자에게 사전 통지합니다.</li>
                <li>이용자는 결제 정보 변경 시 마이페이지를 통해 즉시 업데이트해야 합니다.</li>
              </ol>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">제4조 (구독 기간 및 갱신)</h2>
              <ol className="list-decimal pl-6 space-y-2">
                <li>구독 기간은 이용자가 선택한 기간(1개월, 6개월, 12개월)으로 설정됩니다.</li>
                <li>자동 갱신을 선택한 경우, 구독 기간 만료 24시간 전까지 해지 의사를 밝히지 않으면 동일한 기간으로 자동 갱신됩니다.</li>
                <li>자동 갱신 시 갱신일 기준의 요금이 적용됩니다.</li>
                <li>갱신 3일 전 이메일을 통해 갱신 예정 안내가 발송됩니다.</li>
              </ol>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">제5조 (구독 해지 및 환불)</h2>
              <ol className="list-decimal pl-6 space-y-2">
                <li>이용자는 마이페이지 {'>'} 구독 관리에서 언제든지 구독을 해지할 수 있습니다.</li> 
                <li>구독 해지 시 남은 기간 동안은 서비스를 계속 이용할 수 있으며, 다음 결제일부터 갱신되지 않습니다.</li>
                <li>환불 정책은 다음과 같습니다:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>결제 후 7일 이내, 서비스를 이용하지 않은 경우: 전액 환불</li>
                    <li>결제 후 7일 이내, 서비스를 이용한 경우: 구독 금액의 90% 환불</li>
                    <li>결제 후 7일 이후: 남은 기간에 대한 일할 계산 금액의 50% 환불</li>
                    <li>1개월 이상 경과 후: 환불 불가</li>
                  </ul>
                </li>
                <li>환불 신청은 이메일(support@csmorning.co.kr) 또는 고객센터(02-123-4567)를 통해 가능합니다.</li>
                <li>다음의 경우 환불이 제한될 수 있습니다:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>이용자의 귀책사유로 서비스를 이용할 수 없는 경우</li>
                    <li>프로모션이나 할인을 통해 정상 가격보다 할인된 가격으로 결제한 경우</li>
                    <li>약관, 운영정책을 위반하여 이용 제한을 받은 경우</li>
                  </ul>
                </li>
              </ol>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">제6조 (서비스 변경 및 중단)</h2>
              <ol className="list-decimal pl-6 space-y-2">
                <li>회사는 서비스 내용을 변경하거나 서비스 제공을 중단할 수 있으며, 이 경우 변경 내용과 시기를 7일 전에 공지합니다.</li>
                <li>회사는 다음과 같은 경우 서비스 제공을 일시적으로 중단할 수 있습니다:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>시스템 점검, 교체, 고장 등의 경우</li>
                    <li>천재지변, 국가비상사태 등 불가항력적 사유가 있는 경우</li>
                    <li>기타 회사의 제반 사정으로 서비스 제공이 어려운 경우</li>
                  </ul>
                </li>
                <li>서비스 중단이 24시간 이상 지속되는 경우, 이용자는 해당 기간에 대한 이용료 환불을 요청할 수 있습니다.</li>
              </ol>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">제7조 (이의신청 및 분쟁해결)</h2>
              <ol className="list-decimal pl-6 space-y-2">
                <li>결제, 환불, 서비스 이용 등에 관한 이의신청은 고객센터(02-123-4567) 또는 이메일(support@csmorning.co.kr)을 통해 접수할 수 있습니다.</li>
                <li>회사는 이의신청 접수 후 영업일 기준 3일 이내에 처리 결과를 안내합니다.</li>
                <li>이용자와 회사 간 발생한 분쟁은 먼저 양 당사자 간의 협의를 통해 해결을 모색합니다.</li>
                <li>협의로 해결되지 않는 경우 관련 법령 및 소비자보호 규정에 따라 처리합니다.</li>
              </ol>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">제8조 (약관 변경)</h2>
              <ol className="list-decimal pl-6 space-y-2">
                <li>회사는 필요한 경우 본 약관을 변경할 수 있으며, 변경된 약관은 서비스 내 공지사항을 통해 공지합니다.</li>
                <li>약관 변경 시 회사는 적용일자 및 변경사유를 명시하여 현행 약관과 함께 공지합니다.</li>
                <li>이용자가 변경된 약관에 동의하지 않는 경우 서비스 이용을 중단하고 구독을 해지할 수 있습니다.</li>
              </ol>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">부칙</h2>
              <ol className="list-decimal pl-6 space-y-2">
                <li>본 약관은 2023년 1월 1일부터 시행합니다.</li>
                <li>본 약관에 명시되지 않은 사항은 관련 법령 및 회사의 개인정보처리방침, 이용약관에 따릅니다.</li>
              </ol>
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

export default SubscriptionTermsPage;