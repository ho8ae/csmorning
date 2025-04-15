import Sidebar from '../../components/admin/Sidebar';
import QuestionForm from '../../components/admin/QuestionForm';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars

const NewQuestionPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 p-6 ml-64">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-blue-900">새 질문 등록</h1>
          <p className="text-gray-600">새로운 CS 질문을 생성하고 추가합니다.</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <QuestionForm isEdit={false} />
        </motion.div>
      </div>
    </div>
  );
};

export default NewQuestionPage;