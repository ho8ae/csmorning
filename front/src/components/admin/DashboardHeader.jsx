import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars

const DashboardHeader = ({ user, error }) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 text-center"
      >
        <h1 className="text-3xl font-bold text-blue-900">학습 대시보드</h1>
        <p className="text-gray-600">안녕하세요, {user?.nickname || '사용자'}님!</p>
      </motion.div>
      
      {error && (
        <div className="p-4 mx-auto mb-6 text-red-700 bg-red-100 rounded-lg max-w-3xl">
          {error}
        </div>
      )}
    </>
  );
};

export default DashboardHeader;