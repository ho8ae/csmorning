import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { RiLogoutBoxRLine } from 'react-icons/ri';

function Navbar() {
  const { user, logout } = useAuthStore();

  return (
    <nav className="bg-blue-900 shadow-md py-4">
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        <div className="pl-2 md:pl-4">
          <Link
            to="/"
            className="text-[18px] md:text-xl font-semibold text-white font-['SBAggroB']"
          >
            <span className="text-yellow-400">CS</span> Morning{' '}
            {user?.role === 'admin' ? 'Admin' : ''}
          </Link>
        </div>

        <div className="flex items-center pr-2 md:pr-4">
          {user && (
            <>
              <span className="mr-4 text-[12px] md:text-xl text-white font-['ChosunGu']">
                안녕하세요? {user?.role === 'admin' ? 'admin' : user.nickname} 님
              </span>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
              >
                <RiLogoutBoxRLine size={20} />
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;