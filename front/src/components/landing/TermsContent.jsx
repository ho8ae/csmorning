import React from 'react';

const TermsContent = () => {
  return (
    <div className="space-y-6 text-gray-700">
      <section>
        <h3 className="text-lg font-semibold mb-3">제1조 (목적)</h3>
        <p>
          이 약관은 CS Morning (이하 "회사"라 함)이 제공하는 서비스의 이용조건 및 절차, 회사와 회원 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
        </p>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-3">제2조 (용어의 정의)</h3>
        <p>이 약관에서 사용하는 용어의 정의는 다음과 같습니다:</p>
        <ol className="list-decimal ml-6 mt-2 space-y-2">
          <li>"서비스"란 회사가 제공하는 모든 서비스를 의미합니다.</li>
          <li>"회원"이란 회사와 서비스 이용계약을 체결하고 회사가 제공하는 서비스를 이용하는 개인 또는 법인을 말합니다.</li>
          <li>"아이디(ID)"란 회원의 식별과 서비스 이용을 위하여 회원이 설정하고 회사가 승인하는 문자와 숫자의 조합을 말합니다.</li>
          <li>"비밀번호"란 회원이 부여받은 아이디와 일치된 회원임을 확인하고 회원의 개인정보를 보호하기 위해 회원 자신이 설정한 문자와 숫자의 조합을 말합니다.</li>
        </ol>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-3">제3조 (약관의 효력 및 변경)</h3>
        <ol className="list-decimal ml-6 mt-2 space-y-2">
          <li>이 약관은 서비스 화면에 게시하거나 기타의 방법으로 회원에게 공지함으로써 효력이 발생합니다.</li>
          <li>회사는 필요하다고 인정되는 경우 이 약관을 변경할 수 있으며, 변경된 약관은 제1항과 같은 방법으로 공지함으로써 효력이 발생합니다.</li>
          <li>회원은 변경된 약관에 동의하지 않을 경우 회원 탈퇴를 요청할 수 있으며, 변경된 약관의 효력 발생일 이후에도 서비스를 계속 사용할 경우 약관의 변경사항에 동의한 것으로 간주됩니다.</li>
        </ol>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-3">제4조 (개인정보 수집 및 이용)</h3>
        <ol className="list-decimal ml-6 mt-2 space-y-2">
          <li>회사는 서비스 제공을 위해 다음과 같은 개인정보를 수집합니다:
            <ul className="list-disc ml-6 mt-1">
              <li>필수항목: 이름, 성별, 연령대, 생일(출생연도), 카카오계정(전화번호), 닉네임, 프로필 이미지, 카카오 계정 ID,이메일 주소</li>
              <li>선택항목: 카카오톡 메시지 전송	</li>
            </ul>
          </li>
          <li>개인정보의 수집 및 이용목적은 다음과 같습니다:
            <ul className="list-disc ml-6 mt-1">
              <li>회원 식별 및 관리</li>
              <li>서비스 제공 및 운영</li>
              <li>맞춤형 콘텐츠 제공</li>
              <li>학습 통계 관리</li>
              <li>서비스 개선 및 신규 서비스 개발</li>
              <li>마케팅 및 광고에의 활용(선택 동의 시)</li>
            </ul>
          </li>
          <li>회사는 수집한 개인정보를 회원 탈퇴 시까지 보관하며, 미사용 계정의 경우 최종 접속일로부터 1년 후 자동 삭제합니다.</li>
          <li>회원은 개인정보 수집 및 이용 동의를 거부할 권리가 있으나, 필수항목에 대한 동의를 거부할 경우 서비스 이용이 제한될 수 있습니다.</li>
        </ol>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-3">제5조 (서비스 이용 계약의 성립)</h3>
        <ol className="list-decimal ml-6 mt-2 space-y-2">
          <li>서비스 이용 계약은 회원이 되고자 하는 자(이하 "가입신청자")가 약관의 내용에 대하여 동의를 한 다음 회원가입 신청을 하고 회사가 이러한 신청에 대하여 승낙함으로써 체결됩니다.</li>
          <li>회사는 가입신청자의 신청에 대하여 서비스 이용 승낙을 원칙으로 합니다. 다만, 회사는 다음 각 호에 해당하는 신청에 대하여는 승낙을 하지 않거나 사후에 이용계약을 해지할 수 있습니다:
            <ul className="list-disc ml-6 mt-1">
              <li>가입신청자가 이 약관에 의하여 이전에 회원자격을 상실한 적이 있는 경우</li>
              <li>실명이 아니거나 타인의 명의를 이용한 경우</li>
              <li>허위의 정보를 기재하거나, 회사가 요구하는 정보를 제공하지 않은 경우</li>
              <li>가입신청자가 만 14세 미만인 경우</li>
              <li>기타 회원으로 등록하는 것이 회사의 서비스 운영 기준에 현저히 지장이 있다고 판단되는 경우</li>
            </ul>
          </li>
        </ol>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-3">제6조 (회원의 의무)</h3>
        <ol className="list-decimal ml-6 mt-2 space-y-2">
          <li>회원은 서비스 이용 시 다음 행위를 하지 않아야 합니다:
            <ul className="list-disc ml-6 mt-1">
              <li>타인의 정보 도용</li>
              <li>회사가 게시한 정보의 변경</li>
              <li>회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</li>
              <li>회사와 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
              <li>회사 및 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
              <li>외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 서비스에 공개 또는 게시하는 행위</li>
              <li>기타 불법적이거나 부당한 행위</li>
            </ul>
          </li>
          <li>회원은 관계법령, 이 약관의 규정, 이용안내 및 서비스와 관련하여 공지한 주의사항, 회사가 통지하는 사항 등을 준수하여야 하며, 기타 회사의 업무에 방해되는 행위를 하여서는 안 됩니다.</li>
        </ol>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-3">제7조 (서비스의 제공 및 변경)</h3>
        <ol className="list-decimal ml-6 mt-2 space-y-2">
          <li>회사는 회원에게 아래와 같은 서비스를 제공합니다:
            <ul className="list-disc ml-6 mt-1">
              <li>CS 관련 정보 제공 서비스</li>
              <li>CS 학습 콘텐츠 및 문제 제공</li>
              <li>카카오톡 챗봇을 통한 CS 문제 제공 및 피드백</li>
              <li>학습 통계 및 진도 관리</li>
              <li>기타 회사가 추가 개발하거나 다른 회사와의 제휴계약 등을 통해 회원에게 제공하는 일체의 서비스</li>
            </ul>
          </li>
          <li>회사는 서비스의 내용, 이용방법, 이용시간에 대하여 변경이 있는 경우에는 변경사유, 변경된 서비스의 내용 및 제공일자 등을 명시하여 현행 서비스 화면에 그 적용일자 7일 이전부터 공지합니다.</li>
        </ol>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-3">제8조 (서비스 이용 시간)</h3>
        <ol className="list-decimal ml-6 mt-2 space-y-2">
          <li>서비스 이용은 회사의 업무상 또는 기술상 특별한 지장이 없는 한 연중무휴, 1일 24시간 운영을 원칙으로 합니다.</li>
          <li>회사는 서비스를 일정범위로 분할하여 각 범위별로 이용가능 시간을 별도로 정할 수 있습니다. 이 경우 그 내용을 사전에 공지합니다.</li>
        </ol>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-3">제9조 (개인정보의 보호 및 관리)</h3>
        <ol className="list-decimal ml-6 mt-2 space-y-2">
          <li>회사는 관련 법령이 정하는 바에 따라 회원의 개인정보를 보호하기 위해 노력합니다.</li>
          <li>개인정보의 보호 및 사용에 대해서는 관련 법령 및 회사의 개인정보처리방침이 적용됩니다.</li>
          <li>회사는 서비스를 중단하거나 회원이 개인정보 제공 동의를 철회한 경우에는 신속하게 회원의 개인정보를 파기합니다. 단, 관련 법령에 따라 보존해야 하는 정보는 예외로 합니다.</li>
        </ol>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-3">제10조 (책임제한)</h3>
        <ol className="list-decimal ml-6 mt-2 space-y-2">
          <li>회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.</li>
          <li>회사는 회원의 귀책사유로 인한 서비스 이용의 장애에 대하여 책임을 지지 않습니다.</li>
          <li>회사는 회원이 서비스를 이용하여 기대하는 수익을 상실한 것에 대하여 책임을 지지 않으며, 그 밖의 서비스를 통하여 얻은 자료로 인한 손해에 관하여 책임을 지지 않습니다.</li>
        </ol>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-3">제11조 (준거법 및 재판관할)</h3>
        <p>
          이 약관의 해석 및 회사와 회원 간의 분쟁에 대하여는 대한민국의 법을 적용하며, 이로 인한 분쟁이 발생할 경우 민사소송법상의 관할법원에 제소합니다.
        </p>
      </section>

      <p className="text-sm text-gray-500 mt-8">
        본 약관은 2024년 04월 15일부터 시행합니다.
      </p>
    </div>
  );
};

export default TermsContent;