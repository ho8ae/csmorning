import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars

const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      title: '카카오톡 채널 추가',
      description: 'CS Morning 카카오톡 채널을 친구로 추가하세요.',
    },
    {
      number: '02',
      title: '구독 설정',
      description: '알림 수신 설정을 켜서 매일 아침 컨텐츠를 받아보세요.',
    },
    {
      number: '03',
      title: '매일 아침 CS 지식 습득',
      description:
        '매일 아침 8시, 간결한 CS 개념을 받아보고 하루를 시작하세요.',
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-yellow-300 to-yellow-400">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-blue-900">
            어떻게 사용하나요?
          </h2>
          <p className="text-blue-800 mt-2">
            간단한 3단계로 CS Morning을 시작하세요
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white rounded-lg p-8 shadow-lg relative overflow-hidden"
            >
              <div className="absolute -right-4 -top-4 text-8xl font-bold text-yellow-200 opacity-30">
                {step.number}
              </div>
              <h3 className="text-xl font-bold text-blue-800 mb-4 relative z-10">
                {step.title}
              </h3>
              <p className="text-gray-600 relative z-10">{step.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="bg-black w-64 h-64 mx-auto rounded-2xl flex items-center justify-center text-yellow-400">
            <img
              src="/assets/landing/qr-home.png"
              alt="QR Code"
              className="w-full h-full rounded-2xl"
            />
          </div>
          <p className="mt-4 text-blue-900 font-medium">
            QR 찍고 베타 테스트 참여해보기!
          </p>
          <button
            className="mt-4 bg-blue-800 hover:bg-blue-900 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 transform hover:scale-105"
            onClick={() => window.open('http://pf.kakao.com/_Sxkswn', '_blank')}
          >
            채널 추가하기
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
