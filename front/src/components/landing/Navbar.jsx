import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import useAuthStore from '../../store/authStore';

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { name: '홈', href: '#' },
    { name: '특징', href: '#features' },
    { name: '사용 방법', href: '#how-it-works' },
    { name: '후기', href: '#testimonials' },
    { name: '문의하기', href: '#contact' }
  ];

  // 로그인 상태에 따라 나타낼 버튼 결정
  const renderActionButton = () => {
    if (isAuthenticated) {
      return (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          onClick={() => navigate(user?.role === 'admin' ? '/admin' : '/dashboard')}
          className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 px-4 py-2 rounded-full font-medium transition duration-300"
        >
          {user?.role === 'admin' ? '관리자 대시보드' : '대시보드 확인하기'}
        </motion.button>
      );
    } else {
      return (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          onClick={() => navigate('/login')}
          className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 px-4 py-2 rounded-full font-medium transition duration-300"
        >
          시작하기
        </motion.button>
      );
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'py-2 bg-blue-950 shadow-lg' : 'py-4 bg-transparent'
    }`}>
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center">
          {/* 로고 */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <a href="#" className="text-2xl font-bold text-white flex items-center font-['SBAggroB']">
              <span className="text-yellow-400 mr-1 ">CS</span> Morning
            </a>
          </motion.div>

          {/* 데스크탑 내비게이션 */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, i) => (
              <motion.a
                key={i}
                href={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-blue-100 hover:text-yellow-300 transition duration-300"
              >
                {link.name}
              </motion.a>
            ))}
            {renderActionButton()}
          </div>

          {/* 모바일 메뉴 토글 버튼 */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={`md:hidden transition-colors duration-300 ${
              scrolled ? 'bg-blue-950' : 'bg-blue-350 backdrop-blur-sm'
            }`}
          >
            <div className="container mx-auto px-6 py-4">
              {navLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  className={`block py-2 transition duration-300 ${
                    scrolled ? 'text-blue-100 hover:text-yellow-300' : 'text-white hover:text-yellow-400'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              
              <div className="mt-4">
                {isAuthenticated ? (
                  <button
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-blue-900 px-4 py-2 rounded-full font-medium transition duration-300"
                    onClick={() => {
                      setIsOpen(false);
                      navigate(user?.role === 'admin' ? '/admin' : '/dashboard');
                    }}
                  >
                    {user?.role === 'admin' ? '관리자 대시보드' : '대시보드 확인하기'}
                  </button>
                ) : (
                  <button
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-blue-900 px-4 py-2 rounded-full font-medium transition duration-300"
                    onClick={() => {
                      setIsOpen(false);
                      navigate('/login');
                    }}
                  >
                    시작하기
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;