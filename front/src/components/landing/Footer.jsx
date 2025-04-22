import React, { useState } from 'react';
import Modal from '../common/Modal';
import TermsContent from './TermsContent';
import PrivacyContent from './PrivacyContent';
import { RiThreadsLine } from "react-icons/ri";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";

const Footer = () => {
    const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
    const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

    const openTermsModal = (e) => {
        e.preventDefault();
        setIsTermsModalOpen(true);
    };

    const openPrivacyModal = (e) => {
        e.preventDefault();
        setIsPrivacyModalOpen(true);
    };

    return (
      <footer className="bg-blue-950 text-blue-200 py-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold text-white mb-3">CS Morning</h3>
              {/* 사업자 정보 */}
                <p className="text-sm md:text-left">상호명: 후이즈왓</p> 
                <p className="text-sm md:text-left">대표자: 김태호</p>
                <p className="text-sm md:text-left">사업자 등록번호: 846-05-03131</p>
                <p className="text-sm md:text-left">전화번호: 0507-2097-2373</p>
                <p className="text-sm md:text-left">주소: 경기도 다산동 4025-33 A-202 </p>
                <p className="text-sm md:text-left">이메일: whoiswatashi@gmail.com</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-white text-lg font-semibold mb-3">서비스</h4>
                <ul className="space-y-2">
                  <li><a href="/#features" className="hover:text-yellow-300 transition">소개</a></li>
                  <li><a href="/#how-it-works" className="hover:text-yellow-300 transition">사용 방법</a></li>
                  <li><a href="/#faq" className="hover:text-yellow-300 transition">자주 묻는 질문</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-white text-lg font-semibold mb-3">연락처</h4>
                <ul className="space-y-2">
                  <li><a href="https://capable-hydrogen-361.notion.site/1dce7274f15f817d8b03fa46dc92c8c7?pvs=105" target='_blank' className="hover:text-yellow-300 transition">고객 지원</a></li>
                  <li><a href="https://capable-hydrogen-361.notion.site/1dce7274f15f817d8b03fa46dc92c8c7?pvs=105" target='_blank' className="hover:text-yellow-300 transition">피드백</a></li>
                  <li><a href="https://capable-hydrogen-361.notion.site/1dce7274f15f817d8b03fa46dc92c8c7?pvs=105" target='_blank' className="hover:text-yellow-300 transition">제휴 문의</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-white text-lg font-semibold mb-3">소셜 미디어</h4>
                <div className="flex space-x-4">
                  <a href="#" className="text-blue-200 hover:text-yellow-300 transition">
                    <span className="sr-only">GitHub</span>
                    <FaGithub size={24}/>
                  </a>
                  
                  <a href="https://www.threads.net/@low_o80" className="text-blue-200 hover:text-yellow-300 transition">
                    <span className="sr-only">Thread</span>
                    <RiThreadsLine size={24}/>
                  </a>
  
                  <a href="https://www.linkedin.com/in/%ED%83%9C%ED%98%B8-%EA%B9%80-893801319/" className="text-blue-200 hover:text-yellow-300 transition">
                    <span className="sr-only">Linkedin</span>
                    <FaLinkedin size={24}/>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-blue-800 mt-10 pt-6 text-sm text-center md:text-left md:flex md:justify-between">
            <p>&copy; {new Date().getFullYear()} CS Morning. All rights reserved.</p>
            <div className="mt-4 md:mt-0">
              <a href="#" onClick={openPrivacyModal} className="text-blue-300 hover:text-yellow-300 mx-2">개인정보처리방침</a>
              <a href="#" onClick={openTermsModal} className="text-blue-300 hover:text-yellow-300 mx-2">이용약관</a>
            </div>
          </div>
        </div>

        {/* 이용약관 모달 */}
        <Modal 
          isOpen={isTermsModalOpen} 
          onClose={() => setIsTermsModalOpen(false)} 
          title="이용약관"
        >
          <TermsContent />
        </Modal>

        {/* 개인정보처리방침 모달 */}
        <Modal 
          isOpen={isPrivacyModalOpen} 
          onClose={() => setIsPrivacyModalOpen(false)} 
          title="개인정보처리방침"
        >
          <PrivacyContent />
        </Modal>
      </footer>
    );
  };
  
  export default Footer;