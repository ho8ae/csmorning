import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars

const LogoutButton = ({ onLogout }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="mt-6 text-center"
    >
      <button
        onClick={onLogout}
        className="px-4 py-2 text-red-700 bg-red-100 rounded-md hover:bg-red-200"
      >
        로그아웃
      </button>
    </motion.div>
  );
};

export default LogoutButton;