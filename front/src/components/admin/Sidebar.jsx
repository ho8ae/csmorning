import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FiMenu, FiX, FiHome, FiHelpCircle, FiUsers, FiDollarSign, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

function Sidebar({ onToggle }) {
    const [collapsed, setCollapsed] = useState(false);

    const toggleSidebar = () => {
      const newCollapsedState = !collapsed;
      setCollapsed(newCollapsedState);
      
      // onToggle prop이 있으면 호출
      if (onToggle) {
        onToggle(newCollapsedState);
      }
    };
  
    // 컴포넌트 마운트 시 초기 상태 알림
    useEffect(() => {
      if (onToggle) {
        onToggle(collapsed);
      }
    }, [onToggle, collapsed]);

  return (
    <div className={`${collapsed ? 'w-16' : 'w-64'} bg-gray-800 text-white h-screen fixed transition-all duration-300`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!collapsed && <h2 className="text-xl font-semibold">CS Morning</h2>}
        <button 
          onClick={toggleSidebar} 
          className={`text-gray-300 hover:text-white ${collapsed ? 'mx-auto' : ''}`}
        >
          {collapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
        </button>
      </div>
      <nav className="mt-6">
        <NavLink 
          to="/admin" 
          end
          className={({ isActive }) => 
            `flex items-center py-3 px-4 ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'} transition-colors`
          }
        >
          <FiHome className="mx-auto" size={collapsed ? 20 : 16} />
          {!collapsed && <span className="ml-3">대시보드</span>}
        </NavLink>
        <NavLink 
          to="/admin/questions" 
          className={({ isActive }) => 
            `flex items-center py-3 px-4 ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'} transition-colors`
          }
        >
          <FiHelpCircle className="mx-auto" size={collapsed ? 20 : 16} />
          {!collapsed && <span className="ml-3">질문 관리</span>}
        </NavLink>
        <NavLink 
          to="/admin/questions/new" 
          className={({ isActive }) => 
            `flex items-center py-3 px-4 ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'} transition-colors ${collapsed ? 'pl-2' : 'pl-8'}`
          }
        >
          {!collapsed && <span>- 새 질문 등록</span>}
        </NavLink>
        <NavLink 
          to="/admin/users" 
          className={({ isActive }) => 
            `flex items-center py-3 px-4 ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'} transition-colors`
          }
        >
          <FiUsers className="mx-auto" size={collapsed ? 20 : 16} />
          {!collapsed && <span className="ml-3">사용자 관리</span>}
        </NavLink>
        <NavLink 
          to="/admin/donations" 
          className={({ isActive }) => 
            `flex items-center py-3 px-4 ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'} transition-colors`
          }
        >
          <FiDollarSign className="mx-auto" size={collapsed ? 20 : 16} />
          {!collapsed && <span className="ml-3">기부 관리</span>}
        </NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;