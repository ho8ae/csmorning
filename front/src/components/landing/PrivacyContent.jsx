import React from 'react';

const PrivacyContent = () => {
  return (
    <div className="space-y-6 text-gray-700">
      <section>
        <h3 className="text-lg font-semibold mb-3">1. 개인정보의 수집 및 이용 목적</h3>
        <p>
          CS Morning(이하 "회사")은 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
        </p>
        <ol className="list-decimal ml-6 mt-2 space-y-2">
          <li>회원 가입 및 관리: 회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리, 서비스 부정이용 방지, 각종 고지·통지 등을 목적으로 개인정보를 처리합니다.</li>
          <li>서비스 제공: CS 문제 및 콘텐츠 제공, 맞춤형 학습 서비스 제공, 학습 통계 및 진도 관리, 서비스 이용 통계 등을 목적으로 개인정보를 처리합니다.</li>
          <li>웹사이트와 카카오톡 채널 연동: 회원의 학습 데이터 통합 관리, 서비스 연속성 유지, 개인화된 서비스 제공 등을 목적으로 개인정보를 처리합니다.</li>
          <li>마케팅 및 광고에의 활용: 신규 서비스 개발 및 맞춤 서비스 제공, 이벤트 및 광고성 정보 제공 및 참여기회 제공, 서비스의 유효성 확인, 접속빈도 파악 또는 회원의 서비스 이용에 대한 통계 등을 목적으로 개인정보를 처리합니다.</li>
        </ol>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-3">2. 수집하는 개인정보 항목 및 수집방법</h3>
        <p className="mb-2">회사는 다음과 같은 개인정보 항목을 수집하고 있습니다.</p>
        <div className="mb-4">
          <h4 className="font-medium mb-1">필수항목</h4>
          <ul className="list-disc ml-6">
            <li>카카오 계정 연동 시: 이름, 성별, 연령대, 생일(출생연도), 카카오계정(전화번호), 카카오 계정 ID, 닉네임, 프로필 이미지</li>
            <li>카카오 채널 이용 시: 카카오톡 채널 사용자 ID(해시 형태)</li>
          </ul>
        </div>
        <div className="mb-4">
          <h4 className="font-medium mb-1">선택항목</h4>
          <ul className="list-disc ml-6">
            <li>카카오 메시지 전송</li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium mb-1">서비스 이용 과정에서 자동으로 생성되어 수집되는 정보</h4>
          <ul className="list-disc ml-6">
            <li>IP 주소, 쿠키, 방문 일시, 서비스 이용 기록, 불량 이용 기록</li>
            <li>모바일 서비스 이용 시 단말기 정보(모델명, OS 버전)</li>
            <li>학습 통계 정보: 문제 응답 결과, 정답률, 학습 진도</li>
          </ul>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-3">3. 개인정보의 수집 방법</h3>
        <p>회사는 다음과 같은 방법으로 개인정보를 수집합니다:</p>
        <ul className="list-disc ml-6 mt-2 space-y-1">
          <li>카카오 로그인 API를 통한 정보 수집</li>
          <li>카카오톡 채널 연동 시 정보 수집</li>
          <li>서비스 이용 과정에서 자동으로 생성되는 정보 수집</li>
          <li>회원이 직접 입력하는 정보 수집</li>
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-3">4. 개인정보의 보유 및 이용기간</h3>
        <p className="mb-2">
          회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의 받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
        </p>
        <p>각각의 개인정보 처리 및 보유 기간은 다음과 같습니다:</p>
        <ul className="list-disc ml-6 mt-2 space-y-1">
          <li>회원 가입 및 관리: 회원 탈퇴 시까지</li>
          <li>미사용 계정: 최종 접속일로부터 1년 후 자동 삭제</li>
          <li>다만, 다음의 사유에 해당하는 경우에는 해당 사유 종료 시까지
            <ul className="list-disc ml-6 mt-1">
              <li>관계 법령 위반에 따른 수사·조사 등이 진행 중인 경우에는 해당 수사·조사 종료 시까지</li>
              <li>서비스 이용에 따른 채권·채무관계 잔존 시에는 해당 채권·채무관계 정산 시까지</li>
            </ul>
          </li>
          <li>전자상거래 등에서의 소비자 보호에 관한 법률, 통신비밀보호법 등 관계법령의 규정에 의하여 보존할 필요가 있는 경우 회사는 관계법령에서 정한 일정한 기간 동안 회원정보를 보관합니다.</li>
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-3">5. 개인정보의 파기절차 및 방법</h3>
        <p className="mb-2">
          회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.
        </p>
        <div className="mb-3">
          <h4 className="font-medium mb-1">파기절차</h4>
          <p>
            회원이 입력한 정보는 목적 달성 후 별도의 DB에 옮겨져(종이의 경우 별도의 서류) 내부 방침 및 기타 관련 법령에 따라 일정기간 저장된 후 혹은 즉시 파기됩니다. 이 때, DB로 옮겨진 개인정보는 법률에 의한 경우가 아니고서는 다른 목적으로 이용되지 않습니다.
          </p>
        </div>
        <div>
          <h4 className="font-medium mb-1">파기방법</h4>
          <ul className="list-disc ml-6">
            <li>전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용합니다.</li>
            <li>종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여 파기합니다.</li>
          </ul>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-3">6. 개인정보의 안전성 확보 조치</h3>
        <p className="mb-2">회사는 개인정보보호법 제29조에 따라 다음과 같이 안전성 확보에 필요한 기술적/관리적 및 물리적 조치를 하고 있습니다:</p>
        <ol className="list-decimal ml-6 mt-2 space-y-2">
          <li>개인정보 취급 직원의 최소화 및 교육: 개인정보를 취급하는 직원을 지정하고 담당자에 한정시켜 최소화하여 개인정보를 관리하는 대책을 시행하고 있습니다.</li>
          <li>해킹 등에 대비한 기술적 대책: 회사는 해킹이나 컴퓨터 바이러스 등에 의한 개인정보 유출 및 훼손을 막기 위하여 보안프로그램을 설치하고 주기적인 갱신·점검을 하며 외부로부터 접근이 통제된 구역에 시스템을 설치하고 기술적/물리적으로 감시 및 차단하고 있습니다.</li>
          <li>개인정보의 암호화: 이용자의 개인정보는 비밀번호는 암호화되어 저장 및 관리되고 있어, 본인만이 알 수 있으며 중요한 데이터는 파일 및 전송 데이터를 암호화하거나 파일 잠금 기능을 사용하는 등의 별도 보안기능을 사용하고 있습니다.</li>
          <li>접속기록의 보관 및 위변조 방지: 개인정보처리시스템에 접속한 기록을 최소 6개월 이상 보관, 관리하고 있으며, 접속 기록이 위변조 및 도난, 분실되지 않도록 보안기능을 사용하고 있습니다.</li>
          <li>개인정보에 대한 접근 제한: 개인정보를 처리하는 데이터베이스시스템에 대한 접근권한의 부여, 변경, 말소를 통하여 개인정보에 대한 접근통제를 위하여 필요한 조치를 하고 있으며 침입차단시스템을 이용하여 외부로부터의 무단 접근을 통제하고 있습니다.</li>
        </ol>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-3">7. 개인정보 처리 위탁</h3>
        <p className="mb-2">
          회사는 서비스 제공을 위해 필요한 업무 중 일부를 외부 업체에 위탁하고 있으며, 위탁받은 업체가 개인정보 보호법에 따라 개인정보를 안전하게 처리하도록 필요한 사항을 규정하고 있습니다.
        </p>
        <div className="mb-3">
          <h4 className="font-medium mb-1">개인정보 처리 위탁 현황</h4>
          <table className="w-full border-collapse border border-gray-300 mt-2">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">위탁받는 자(수탁자)</th>
                <th className="border border-gray-300 px-4 py-2 text-left">위탁업무 내용</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">카카오</td>
                <td className="border border-gray-300 px-4 py-2">카카오 로그인, 카카오톡 채널을 통한 메시지 발송</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-3">8. 개인정보 관련 민원서비스</h3>
        <p className="mb-2">
          회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
        </p>
        <div className="bg-gray-100 p-4 rounded-md">
          <p className="font-medium">개인정보 보호책임자</p>
          <ul className="list-none mt-2">
            <li>성명: 김태호</li>
            <li>직책: 대표</li>
            <li>연락처: 이메일 xogh2242@gmail.com</li>
          </ul>
        </div>
        <p className="mt-4">
          정보주체께서는 회사의 서비스를 이용하시면서 발생한 모든 개인정보 보호 관련 문의, 불만처리, 피해구제 등에 관한 사항을 개인정보 보호책임자에게 문의하실 수 있습니다. 회사는 정보주체의 문의에 대해 지체 없이 답변 및 처리해드릴 것입니다.
        </p>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-3">9. 개인정보 처리방침 변경</h3>
        <p>
          이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
        </p>
      </section>

      <p className="text-sm text-gray-500 mt-8">
        본 개인정보처리방침은 2024년 04월 15일부터 시행합니다.
      </p>
    </div>
  );
};

export default PrivacyContent;