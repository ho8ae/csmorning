import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      content: "매일 아침 CS Morning과 함께 시작하는 습관이 생겼어요. 짧고 핵심적인 내용이라 부담 없이 볼 수 있어 좋습니다.",
      name: "김선우",
      role: "백엔드 개발자"
    },
    {
      id: 2,
      content: "부담스럽지 않게 CS 지식을 쌓을 수 있는 좋은 서비스입니다. 매일 아침 알림이 기다려져요!",
      name: "김대성",
      role: "풀스택 개발자"
    },
    {
      id: 3,
      content: "매일 아침 받아보는 CS 지식이 하루를 시작하는 좋은 루틴이 되었어요. 개발자라면 꼭 구독하세요!",
      name: "박민규",
      role: "AI 개발자"
    }
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section className="py-16 bg-blue-50">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-center text-blue-900 mb-12 font-['nanumBarunpen']"
        >
          사용자 후기
        </motion.h2>

        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-8 rounded-xl shadow-lg"
            >
              <div className="text-yellow-500 text-5xl mb-4">"</div>
              <p className="text-lg text-gray-700 mb-6">{testimonials[current].content}</p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center text-blue-800 font-bold">
                  {testimonials[current].name.charAt(0)}
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-blue-900">{testimonials[current].name}</p>
                  <p className="text-sm text-gray-500">{testimonials[current].role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`w-3 h-3 mx-1 rounded-full ${
                  current === index ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;