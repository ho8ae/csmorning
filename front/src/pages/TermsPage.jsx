import React, { useState } from 'react';

const TermsPage = () => {
  const [language, setLanguage] = useState('ko'); // 'ko' for Korean, 'en' for English

  const toggleLanguage = () => {
    setLanguage(language === 'ko' ? 'en' : 'ko');
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-4xl bg-white shadow-md rounded-lg">
        <div className="flex justify-between items-center py-4 px-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-blue-600">
            {language === 'ko' ? 'CS Morning 서비스 이용약관' : 'CS Morning Service Terms and Conditions'}
          </h1>
          <button
            onClick={toggleLanguage}
            className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-blue-900 rounded-md transition-colors"
          >
            {language === 'ko' ? 'English' : '한국어'}
          </button>
        </div>
        
        <div className="py-6 px-6">
          {language === 'ko' ? <KoreanTerms /> : <EnglishTerms />}
        </div>
        
        <div className="py-4 px-6 border-t border-gray-200 text-center">
          <p className="text-gray-600 text-sm">
            © 2025 CS Morning. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

const KoreanTerms = () => (
  <div className="space-y-6 text-gray-700">
    <section>
      <h2 className="text-xl font-semibold text-blue-800 mb-2">제1조 (목적)</h2>
      <p>본 약관은 CS Morning(이하 "회사")이 제공하는 CS Morning 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.</p>
    </section>
    
    <section>
      <h2 className="text-xl font-semibold text-blue-800 mb-2">제2조 (정의)</h2>
      <ol className="list-decimal list-inside space-y-1 ml-2">
        <li>"서비스"란 회사가 제공하는 CS 지식 및 면접 정보 제공 서비스를 의미합니다.</li>
        <li>"이용자"란 본 약관에 따라 회사가 제공하는 서비스를 이용하는 자를 말합니다.</li>
        <li>"카카오톡 채널"이란 회사가 서비스를 제공하기 위해 활용하는 카카오톡의 메시지 전송 플랫폼을 의미합니다.</li>
        <li>"챗봇"이란 회사가 카카오톡 채널을 통해 제공하는 자동 응답 서비스를 의미합니다.</li>
      </ol>
    </section>
    
    <section>
      <h2 className="text-xl font-semibold text-blue-800 mb-2">제3조 (약관의 게시와 개정)</h2>
      <ol className="list-decimal list-inside space-y-1 ml-2">
        <li>회사는 본 약관의 내용을 이용자가 쉽게 알 수 있도록 서비스 홈페이지(https://csmorning.co.kr)에 게시합니다.</li>
        <li>회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 본 약관을 개정할 수 있습니다.</li>
        <li>회사가 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행 약관과 함께 서비스 홈페이지에 그 적용일자 7일 전부터 공지합니다. 다만, 이용자에게 불리한 약관의 개정의 경우에는 30일 전부터 공지합니다.</li>
      </ol>
    </section>
    
    <section>
      <h2 className="text-xl font-semibold text-blue-800 mb-2">제4조 (서비스의 내용)</h2>
      <ol className="list-decimal list-inside space-y-1 ml-2">
        <li>회사는 이용자에게 다음 각 호의 서비스를 제공합니다:
          <ul className="list-disc list-inside ml-6 mt-1">
            <li>매일 아침 8시 CS 지식 및 면접 관련 정보 제공</li>
            <li>카카오톡 채널을 통한 정보 전송</li>
            <li>카카오톡 챗봇을 통한 CS 문제 제공 및 피드백</li>
            <li>웹사이트를 통한 학습 통계 및 진도 관리</li>
            <li>기타 회사가 정하는 서비스</li>
          </ul>
        </li>
        <li className="mt-2">회사는 운영상, 기술상의 필요에 따라 제공하고 있는 서비스를 변경할 수 있습니다.</li>
      </ol>
    </section>
    
    <section>
      <h2 className="text-xl font-semibold text-blue-800 mb-2">제5조 (개인정보 수집 및 이용)</h2>
      <ol className="list-decimal list-inside space-y-1 ml-2">
        <li>회사는 서비스 제공을 위해 다음과 같은 개인정보를 수집합니다:
          <ul className="list-disc list-inside ml-6 mt-1">
            <li>필수항목: 이름, 성별, 연령대, 생일(출생연도), 카카오계정(전화번호), 닉네임, 프로필 이미지, 카카오 계정 ID</li>
            <li>선택항목: 이메일 주소, 직업 및 관심 분야</li>
          </ul>
        </li>
        <li className="mt-2">개인정보의 수집 및 이용목적은 다음과 같습니다:
          <ul className="list-disc list-inside ml-6 mt-1">
            <li>회원 식별 및 관리</li>
            <li>서비스 제공 및 운영</li>
            <li>맞춤형 콘텐츠 제공</li>
            <li>웹사이트와 카카오톡 채널 연동</li>
            <li>학습 통계 관리</li>
          </ul>
        </li>
        <li className="mt-2">회사는 수집한 개인정보를 회원 탈퇴 시까지 보관하며, 미사용 계정의 경우 최종 접속일로부터 1년 후 자동 삭제합니다.</li>
        <li className="mt-2">개인정보 보호에 관한 상세한 내용은 개인정보처리방침을 통해 확인할 수 있습니다.</li>
      </ol>
    </section>
    
    <section>
      <h2 className="text-xl font-semibold text-blue-800 mb-2">제6조 (서비스 이용)</h2>
      <ol className="list-decimal list-inside space-y-1 ml-2">
        <li>서비스 이용은 회사의 업무상 또는 기술상 특별한 지장이 없는 한 연중무휴, 1일 24시간 제공함을 원칙으로 합니다.</li>
        <li>회사는 서비스를 일정범위로 분할하여 각 범위별로 이용가능 시간을 별도로 정할 수 있습니다. 이 경우 그 내용을 사전에 공지합니다.</li>
      </ol>
    </section>
    
    <section>
      <h2 className="text-xl font-semibold text-blue-800 mb-2">제7조 (서비스 제공의 중지)</h2>
      <ol className="list-decimal list-inside space-y-1 ml-2">
        <li>회사는 다음 각 호에 해당하는 경우 서비스 제공을 중지할 수 있습니다:
          <ul className="list-disc list-inside ml-6 mt-1">
            <li>서비스용 설비의 보수 등 공사로 인한 부득이한 경우</li>
            <li>전기통신사업법에 규정된 기간통신사업자가 전기통신서비스를 중지했을 경우</li>
            <li>기타 불가항력적 사유가 있는 경우</li>
          </ul>
        </li>
        <li className="mt-2">회사는 국가비상사태, 정전, 서비스 설비의 장애 또는 서비스 이용의 폭주 등으로 정상적인 서비스 이용에 지장이 있는 때에는 서비스의 전부 또는 일부를 제한하거나 중지할 수 있습니다.</li>
      </ol>
    </section>
    
    <section>
      <h2 className="text-xl font-semibold text-blue-800 mb-2">제8조 (개인정보보호)</h2>
      <ol className="list-decimal list-inside space-y-1 ml-2">
        <li>회사는 이용자의 개인정보 보호를 위해 노력합니다.</li>
        <li>이용자의 개인정보 보호에 관한 사항은 관련법령 및 회사가 정하는 개인정보처리방침에 정한 바에 따릅니다.</li>
        <li>회사는 서비스 제공을 위해 필요한 업무 중 일부를 외부 업체에 위탁할 수 있으며, 위탁받은 업체가 개인정보를 안전하게 처리하도록 필요한 사항을 규정하고 있습니다.</li>
      </ol>
    </section>
    
    <section>
      <h2 className="text-xl font-semibold text-blue-800 mb-2">제9조 (이용자의 의무)</h2>
      <ol className="list-decimal list-inside space-y-1 ml-2">
        <li>이용자는 다음 각 호의 행위를 하여서는 안됩니다:
          <ul className="list-disc list-inside ml-6 mt-1">
            <li>서비스 신청 또는 변경 시 허위내용의 등록</li>
            <li>타인의 정보 도용</li>
            <li>회사가 게시한 정보의 변경</li>
            <li>서비스를 이용하여 법령과 본 약관이 금지하거나 공서양속에 반하는 행위를 하는 경우</li>
            <li>기타 불법적이거나 부당한 행위</li>
          </ul>
        </li>
      </ol>
    </section>
    
    <section>
      <h2 className="text-xl font-semibold text-blue-800 mb-2">제10조 (저작권)</h2>
      <ol className="list-decimal list-inside space-y-1 ml-2">
        <li>회사가 제공하는 서비스와 관련된 모든 저작권 및 기타 지적재산권은 회사에 귀속됩니다.</li>
        <li>이용자는 서비스를 이용함으로써 얻은 정보를 회사의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송, 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안됩니다.</li>
      </ol>
    </section>
    
    <section>
      <h2 className="text-xl font-semibold text-blue-800 mb-2">제11조 (면책조항)</h2>
      <ol className="list-decimal list-inside space-y-1 ml-2">
        <li>회사는 천재지변, 전쟁 및 기타 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 대한 책임이 면제됩니다.</li>
        <li>회사는 이용자의 귀책사유로 인한 서비스 이용의 장애에 대하여 책임을 지지 않습니다.</li>
        <li>회사는 이용자가 서비스를 이용하여 기대하는 수익을 상실한 것에 대하여 책임을 지지 않으며, 그 밖에 서비스를 통하여 얻은 정보로 인한 손해에 대하여 책임을 지지 않습니다.</li>
        <li>실제 서비스의 약관과 내용의 불일치가 밝혀질 경우 '파트너'의 귀책사유로 서비스 이용이 제한되거나 중단될 수 있으며, 이로 인해 발생하는 손해에 대해 회사는 책임을 지지 않습니다.</li>
      </ol>
    </section>
    
    <section>
      <h2 className="text-xl font-semibold text-blue-800 mb-2">제12조 (약관 외 사항)</h2>
      <p>본 약관에 명시되지 않은 사항은 전기통신기본법, 전기통신사업법, 정보통신망 이용촉진 및 정보보호 등에 관한 법률 및 기타 관련 법령의 규정에 따릅니다.</p>
    </section>
    
    <section>
      <h2 className="text-xl font-semibold text-blue-800 mb-2">제13조 (관할법원)</h2>
      <p>서비스 이용으로 발생한 분쟁에 대해 소송이 제기될 경우 회사의 본사 소재지를 관할하는 법원을 전속 관할법원으로 합니다.</p>
    </section>
    
    <section>
      <h2 className="text-xl font-semibold text-blue-800 mb-2">부칙</h2>
      <ol className="list-decimal list-inside space-y-1 ml-2">
        <li>본 약관은 2025년 4월 16일부터 시행합니다.</li>
        <li>본 약관 시행 전에 가입한 이용자에게도 본 약관이 적용됩니다.</li>
      </ol>
    </section>
  </div>
);

const EnglishTerms = () => (
  <div className="space-y-6 text-gray-700">
    <section>
      <h2 className="text-xl font-semibold text-blue-800 mb-2">Article 1 (Purpose)</h2>
      <p>These Terms and Conditions set forth the rights, obligations, and responsibilities between CS Morning (hereinafter referred to as the "Company") and users regarding the use of CS Morning Service (hereinafter referred to as the "Service").</p>
    </section>
    
    <section>
      <h2 className="text-xl font-semibold text-blue-800 mb-2">Article 2 (Definitions)</h2>
      <ol className="list-decimal list-inside space-y-1 ml-2">
        <li>"Service" means the CS knowledge and interview information service provided by the Company.</li>
        <li>"User" means a person who uses the Service provided by the Company in accordance with these Terms and Conditions.</li>
        <li>"KakaoTalk Channel" means the KakaoTalk messaging platform used by the Company to provide the Service.</li>
        <li>"Chatbot" means the automated response service provided by the Company through the KakaoTalk Channel.</li>
      </ol>
    </section>
    
    <section>
      <h2 className="text-xl font-semibold text-blue-800 mb-2">Article 3 (Posting and Revisions of Terms and Conditions)</h2>
      <ol className="list-decimal list-inside space-y-1 ml-2">
        <li>The Company shall post these Terms and Conditions on the Service website (https://csmorning.co.kr) so that users can easily access them.</li>
        <li>The Company may revise these Terms and Conditions if necessary, within the scope of not violating relevant laws.</li>
        <li>When the Company revises the Terms and Conditions, it shall specify the application date and reasons for revision and announce them on the Service website 7 days before the application date along with the current Terms and Conditions. However, if the revision is disadvantageous to users, it shall be announced 30 days before.</li>
      </ol>
    </section>
    
    <section>
      <h2 className="text-xl font-semibold text-blue-800 mb-2">Article 4 (Content of Service)</h2>
      <ol className="list-decimal list-inside space-y-1 ml-2">
        <li>The Company provides the following services to users:
          <ul className="list-disc list-inside ml-6 mt-1">
            <li>Daily CS knowledge and interview-related information at 8 AM</li>
            <li>Information delivery through KakaoTalk Channel</li>
            <li>CS problems and feedback through KakaoTalk Chatbot</li>
            <li>Learning statistics and progress management through the website</li>
            <li>Other services determined by the Company</li>
          </ul>
        </li>
        <li className="mt-2">The Company may change the services provided according to operational or technical needs.</li>
      </ol>
    </section>
    
    <section>
      <h2 className="text-xl font-semibold text-blue-800 mb-2">Article 5 (Collection and Use of Personal Information)</h2>
      <ol className="list-decimal list-inside space-y-1 ml-2">
        <li>The Company collects the following personal information for providing the Service:
          <ul className="list-disc list-inside ml-6 mt-1">
            <li>Required items: Name, gender, age group, birth date (birth year), Kakao account (phone number), nickname, profile image, Kakao account ID</li>
            <li>Optional items: Email address, occupation and areas of interest</li>
          </ul>
        </li>
        <li className="mt-2">The purposes of collecting and using personal information are as follows:
          <ul className="list-disc list-inside ml-6 mt-1">
            <li>User identification and management</li>
            <li>Service provision and operation</li>
            <li>Providing personalized content</li>
            <li>Linking the website and KakaoTalk Channel</li>
            <li>Learning statistics management</li>
          </ul>
        </li>
        <li className="mt-2">The Company keeps the collected personal information until the user withdraws from membership, and in the case of inactive accounts, automatically deletes them one year after the last access date.</li>
        <li className="mt-2">Detailed information about the protection of personal information can be found in the Privacy Policy.</li>
      </ol>
    </section>
    
    <section>
      <h2 className="text-xl font-semibold text-blue-800 mb-2">Article 6 (Service Use)</h2>
      <ol className="list-decimal list-inside space-y-1 ml-2">
        <li>In principle, the Service is provided 24 hours a day, 365 days a year, unless there are special operational or technical issues.</li>
        <li>The Company may divide the Service into certain ranges and set separate available times for each range. In this case, the content shall be announced in advance.</li>
      </ol>
    </section>
    
    <section>
      <h2 className="text-xl font-semibold text-blue-800 mb-2">Article 7 (Suspension of Service)</h2>
      <ol className="list-decimal list-inside space-y-1 ml-2">
        <li>The Company may suspend the provision of Service in the following cases:
          <ul className="list-disc list-inside ml-6 mt-1">
            <li>Unavoidable circumstances due to maintenance or construction of service facilities</li>
            <li>When a telecommunications business operator specified in the Telecommunications Business Act suspends telecommunications service</li>
            <li>Other cases of force majeure</li>
          </ul>
        </li>
        <li className="mt-2">The Company may restrict or suspend all or part of the Service when normal use of the Service is hindered due to national emergency, power outage, service facility failure, or service congestion.</li>
      </ol>
    </section>
    
    <section>
      <h2 className="text-xl font-semibold text-blue-800 mb-2">Article 8 (Protection of Personal Information)</h2>
      <ol className="list-decimal list-inside space-y-1 ml-2">
        <li>The Company strives to protect users' personal information.</li>
        <li>Matters concerning the protection of users' personal information shall be governed by relevant laws and the privacy policy established by the Company.</li>
        <li>The Company may outsource part of the work necessary for providing the Service to external companies, and has established necessary provisions to ensure that the entrusted companies handle personal information safely.</li>
      </ol>
    </section>
    
    <section>
      <h2 className="text-xl font-semibold text-blue-800 mb-2">Article 9 (User Obligations)</h2>
      <ol className="list-decimal list-inside space-y-1 ml-2">
        <li>Users shall not engage in the following activities:
          <ul className="list-disc list-inside ml-6 mt-1">
            <li>Registration of false information when applying for or changing the Service</li>
            <li>Impersonation of others</li>
            <li>Modification of information posted by the Company</li>
            <li>Use of the Service to engage in activities prohibited by law and these Terms and Conditions or contrary to public order and morals</li>
            <li>Other illegal or unjust activities</li>
          </ul>
        </li>
      </ol>
    </section>
    
    <section>
      <h2 className="text-xl font-semibold text-blue-800 mb-2">Article 10 (Copyright)</h2>
      <ol className="list-decimal list-inside space-y-1 ml-2">
        <li>All copyrights and other intellectual property rights related to the Service provided by the Company belong to the Company.</li>
        <li>Users shall not use information obtained through the Service for commercial purposes or allow third parties to use it by reproduction, transmission, publication, distribution, broadcasting, or other methods without prior approval from the Company.</li>
      </ol>
    </section>
    
    <section>
      <h2 className="text-xl font-semibold text-blue-800 mb-2">Article 11 (Disclaimer)</h2>
      <ol className="list-decimal list-inside space-y-1 ml-2">
        <li>The Company is exempted from responsibility for providing the Service if it cannot provide the Service due to force majeure such as natural disasters, war, and other similar circumstances.</li>
        <li>The Company is not responsible for service disruptions due to user fault.</li>
        <li>The Company is not responsible for lost profits expected by users through the Service, nor for damages caused by information obtained through the Service.</li>
        <li>If discrepancies between the actual service and these Terms and Conditions are discovered, the service use may be restricted or suspended due to the "Partner's" fault, and the Company shall not be responsible for any damages resulting from this.</li>
      </ol>
    </section>
    
    <section>
      <h2 className="text-xl font-semibold text-blue-800 mb-2">Article 12 (Matters Not Specified in the Terms and Conditions)</h2>
      <p>Matters not specified in these Terms and Conditions shall be governed by the provisions of the Framework Act on Telecommunications, the Telecommunications Business Act, the Act on Promotion of Information and Communications Network Utilization and Information Protection, and other relevant laws.</p>
    </section>
    
    <section>
      <h2 className="text-xl font-semibold text-blue-800 mb-2">Article 13 (Jurisdiction)</h2>
      <p>In case a lawsuit is filed regarding disputes arising from the use of the Service, the exclusive jurisdiction shall be the court having jurisdiction over the location of the Company's headquarters.</p>
    </section>
    
    <section>
      <h2 className="text-xl font-semibold text-blue-800 mb-2">Supplementary Provisions</h2>
      <ol className="list-decimal list-inside space-y-1 ml-2">
        <li>These Terms and Conditions shall be effective from April 16, 2025.</li>
        <li>These Terms and Conditions shall also apply to users who subscribed before the implementation of these Terms and Conditions.</li>
      </ol>
    </section>
  </div>
);

export default TermsPage;