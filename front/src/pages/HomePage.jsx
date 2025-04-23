import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      {/* 네비게이션 바 */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-blue-600">CS Morning</span>
            </div>
            <div className="flex items-center">
              <Link 
                to="/login" 
                className="ml-4 px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition duration-200"
              >
                관리자 로그인
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 히어로 섹션 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">매일 아침 8시,</span>
            <span className="block text-blue-600">CS 면접 준비가 완료됩니다</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            매일 아침 8시에 엄선된 CS 면접 질문을 카카오톡으로 받아보세요. 
            간편하게 답변하고 즉각적인 피드백을 받아 기술 면접을 완벽하게 준비하세요.
          </p>
          <div className="mt-10">
            <a
              href="https://pf.kakao.com/_Sxkswn" 
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-yellow-400 hover:bg-yellow-500 md:py-4 md:text-lg md:px-10 inline-flex items-center"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 208 191" 
                className="w-5 h-5 mr-2"
                fill="currentColor"
              >
                <path d="M104 0C46.56 0 0 36.71 0 82c0 29.28 19.47 55 48.75 69.48-1.59 5.49-10.24 35.34-10.58 37.69 0 0-.21 1.76.93 2.43.79.46 1.79.35 1.79.35.82-.07 13.04-1.85 45.35-32.45 5.8.81 11.73 1.24 17.76 1.24 57.44 0 104-36.71 104-82S161.44 0 104 0z"/>
              </svg>
              카카오톡 채널 추가하기
            </a>
          </div>
        </div>
      </div>

      {/* 특징 섹션 */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">서비스 특징</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              개발자를 위한 최적의 CS 학습 방법
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              CS Morning은 당신의 기술 면접 준비를 위한 최적의 솔루션입니다.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              {/* 특징 1 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">정확한 시간</h3>
                  <p className="mt-2 text-base text-gray-500">
                    매일 아침 8시에 정확하게 전송되어 규칙적인 학습 습관을 형성합니다.
                  </p>
                </div>
              </div>

              {/* 특징 2 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">엄선된 질문</h3>
                  <p className="mt-2 text-base text-gray-500">
                    다양한 개발 분야와 난이도의 질문이 엄선되어 실전 면접 역량을 향상시킵니다.
                  </p>
                </div>
              </div>

              {/* 특징 3 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">즉각적인 피드백</h3>
                  <p className="mt-2 text-base text-gray-500">
                    답변 즉시 정답 여부와 상세한 설명을 제공하여 효과적인 학습을 돕습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 사용 방법 섹션 */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">이용 방법</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              간단한 3단계로 시작하세요
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              {/* 단계 1 */}
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-500 text-xl font-bold">
                  1
                </div>
                <h3 className="mt-4 text-lg leading-6 font-medium text-gray-900">카카오톡 채널 추가</h3>
                <p className="mt-2 text-base text-gray-500">
                  CS Morning 카카오톡 채널을 친구로 추가합니다.
                </p>
              </div>

              {/* 단계 2 */}
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-500 text-xl font-bold">
                  2
                </div>
                <h3 className="mt-4 text-lg leading-6 font-medium text-gray-900">매일 아침 질문 수신</h3>
                <p className="mt-2 text-base text-gray-500">
                  매일 아침 8시에 CS 면접 질문을 받습니다.
                </p>
              </div>

              {/* 단계 3 */}
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-500 text-xl font-bold">
                  3
                </div>
                <h3 className="mt-4 text-lg leading-6 font-medium text-gray-900">답변 후 피드백 확인</h3>
                <p className="mt-2 text-base text-gray-500">
                  질문에 답변하고 즉시 피드백을 받습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 푸터 */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:order-2">
              <a href="mailto:contact@csmorning.co.kr" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Email</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </a>
            </div>
            <div className="mt-8 md:mt-0 md:order-1">
              <p className="text-center text-base text-gray-400">
                &copy; 2023 CS Morning. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;