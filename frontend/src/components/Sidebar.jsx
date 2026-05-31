import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Departments', path: '/departments' },
    { name: 'Employees', path: '/employees' },
    { name: 'Salaries', path: '/salaries' },
    { name: 'Reports', path: '/reports' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className={`fixed left-0 top-0 h-screen bg-black text-white transition-all duration-300 z-50 flex flex-col shadow-2xl ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
        {!isCollapsed && <span className="text-xl font-bold tracking-wide text-gray-200">EPMS</span>}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-1 hover:bg-gray-800 rounded transition text-gray-400">
          {isCollapsed ? <span>&#9776;</span> : <span>&#10005;</span>}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200
              ${isActive(item.path) 
                ? 'bg-green-600 text-white shadow-lg shadow-green-500/30' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
          >
            {!isCollapsed && <span className="font-medium">{item.name}</span>}
          </Link>
        ))}
      </nav>

      {/* User Profile / Logout */}
      <div className="p-4 border-t border-gray-800">
        {!isCollapsed && (
          <div className="mb-4">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Logged in as</p>
            <p className="text-sm font-semibold truncate">{user?.username || 'Admin'}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors"
        >
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;