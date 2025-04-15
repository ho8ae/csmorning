import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

function Navbar() {
  const { user, logout } = useAuthStore();
  
  return (
    <nav className="bg-white shadow-md py-4 px-6">
      <div className="flex justify-between items-center">
        <div>
          <Link to='/' className="text-xl font-semibold">CS Morning {user?.role=='admin' ? 'Admin': ''}</Link>
        </div>
        
        <div className="flex items-center">
          {user && (
            <>
              <span className="mr-4">안녕하세요, {user?.role=='admin'? 'admin' : user.nickname}님</span>
              <button 
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
              >
                로그아웃
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;