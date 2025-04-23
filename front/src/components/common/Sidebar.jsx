import { NavLink } from 'react-router-dom';

function Sidebar() {
  return (
    <div className="w-64 bg-gray-800 text-white h-screen fixed">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-semibold">CS Morning</h2>
      </div>
      <nav className="mt-6">
        <NavLink 
          to="/admin" 
          end
          className={({ isActive }) => 
            `flex items-center py-3 px-4 ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
          }
        >
          <span>대시보드</span>
        </NavLink>
        <NavLink 
          to="/admin/questions" 
          className={({ isActive }) => 
            `flex items-center py-3 px-4 ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
          }
        >
          <span>질문 관리</span>
        </NavLink>
        <NavLink 
          to="/admin/users" 
          className={({ isActive }) => 
            `flex items-center py-3 px-4 ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
          }
        >
          <span>사용자 관리</span>
        </NavLink>
        <NavLink 
          to="/admin/donations" 
          className={({ isActive }) => 
            `flex items-center py-3 px-4 ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
          }
        >
          <span>기부 관리</span>
        </NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;