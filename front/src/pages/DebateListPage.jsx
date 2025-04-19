import { Helmet } from 'react-helmet-async';
import DebateList from '../components/debate/DebateList';
import Navbar from '../components/common/Navbar';
import Footer from '../components/dashboard/Footer';

const DebateListPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Helmet>
        <title>토론 목록 - CS Morning</title>
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow">
        <DebateList />
      </main>
      
      <Footer />
    </div>
  );
};

export default DebateListPage;