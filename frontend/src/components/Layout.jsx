import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      {/* The Outlet renders the child route components (Dashboard, Departments, etc.) */}
      <main className="flex-1 ml-20 md:ml-64 overflow-y-auto transition-all duration-300 bg-white">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;