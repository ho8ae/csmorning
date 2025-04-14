import { useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import HowItWorks from '../components/landing/HowItWorks';
import Testimonials from '../components/landing/TestImonials';
import CTA from '../components/landing/CTA';
import Footer from '../components/landing/Footer';

const LandingPage = () => {
  // 스크롤 시 부드러운 전환 효과를 위한 설정
  useEffect(() => {
    // 앵커 링크 클릭 시 부드러운 스크롤 처리
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href')?.substring(1);
        if (!targetId) return;
        
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth'
          });
        }
      });
    });
  }, []);

  return (
    <div className="overflow-x-hidden">
      <Navbar />
      
      <main>
        <section id="home">
          <Hero />
        </section>
        
        <section id="features">
          <Features />
        </section>
        
        <section id="how-it-works">
          <HowItWorks />
        </section>
        
        <section id="testimonials">
          <Testimonials />
        </section>
        
        <section id="contact">
          <CTA />
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default LandingPage;