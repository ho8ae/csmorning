import { Helmet } from 'react-helmet-async';
import DebateDetail from '../components/debate/DebateDetail';
import Navbar from '../components/common/Navbar';
import Footer from '../components/dashboard/Footer';

const DebateDetailPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Helmet>
        <title>토론 상세보기 - CS Morning</title>
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow">
        <DebateDetail />
      </main>
      
      <Footer />
    </div>
  );
};

export default DebateDetailPage;