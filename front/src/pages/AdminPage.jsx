import { Outlet, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import useAuthStore from '../store/authStore';

function AdminPage() {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  
  useEffect(() => {
    checkAuth().catch(err => console.error(err));
  }, [checkAuth]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl">로딩 중...</div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        <Navbar />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminPage;