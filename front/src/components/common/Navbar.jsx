import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

import { RiLogoutBoxRLine } from 'react-icons/ri';

function Navbar() {
  const { user, logout } = useAuthStore();

  return (
    <nav className="bg-blue-900 shadow-md py-4 px-6">
      <div className="flex justify-between items-center">
        <div>
          <Link
            to="/"
            className="text-[14px] md:text-xl font-semibold text-white font-['SBAggroB']"
          >
            <span className="text-yellow-400">CS</span> Morning{' '}
            {user?.role == 'admin' ? 'Admin' : ''}
          </Link>
        </div>

        <div className="flex items-center">
          {user && (
            <>
              <span className="mr-4 text-[10px] md:text-xl text-white font-['ChosunGu']">
                안녕하세요? {user?.role == 'admin' ? 'admin' : user.nickname} 님
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
