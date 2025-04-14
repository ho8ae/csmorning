import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars

const Features = () => {
  const features = [
    {
      title: '매일 아침 CS 지식 전달',
      description: '컴퓨터 공학의 핵심 개념을 매일 아침 간결하게 전달합니다.',
      icon: '📚'
    },
    {
      title: '효율적인 학습',
      description: '짧은 시간 내에 핵심 개념을 쉽게 이해할 수 있도록 설계되었습니다.',
      icon: '⏱️'
    },
    {
      title: '기억에 오래 남는 학습',
      description: '아침에 학습한 정보는 더 오래 기억에 남습니다.',
      icon: '🧠'
    },
    {
      title: '편리한 채널 구독',
      description: '카카오톡으로 간편하게 구독하고 매일 아침 정보를 받아보세요.',
      icon: '📱'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <motion.h2 
          className="text-3xl font-bold text-center text-blue-900 mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          CS Morning의 특징
        </motion.h2>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="bg-blue-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-blue-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;