import Sidebar from '../../components/admin/Sidebar';
import QuestionForm from '../../components/admin/QuestionForm';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars

const EditQuestionPage = () => {
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
          <h1 className="text-3xl font-bold text-blue-900">질문 수정</h1>
          <p className="text-gray-600">기존 질문을 수정하고 업데이트합니다.</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <QuestionForm isEdit={true} />
        </motion.div>
      </div>
    </div>
  );
};

export default EditQuestionPage; 