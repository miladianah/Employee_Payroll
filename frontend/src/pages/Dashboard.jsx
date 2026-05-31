import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({ employees: 0, departments: 0, salaries: 0 });
  const [recentEmployees, setRecentEmployees] = useState([]); // New state for recent activity
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook for navigation

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [empRes, deptRes, salRes] = await Promise.all([
        api.get('/employees'),
        api.get('/departments'),
        api.get('/salaries')
      ]);
      
      setStats({
        employees: empRes.data.length,
        departments: deptRes.data.length,
        salaries: salRes.data.length,
      });

      // Get last 3 hired employees
      const sortedEmps = [...empRes.data].sort((a, b) => new Date(b.hiredDate) - new Date(a.hiredDate));
      setRecentEmployees(sortedEmps.slice(0, 3));

    } catch (err) {
      console.error("Dashboard Error:", err);
      setError("Failed to connect to server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const StatCard = ({ title, value, subtext }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      {loading && <div className="flex justify-center mb-2"><div className="animate-spin w-5 h-5 border-2 border-green-400 border-t-transparent rounded-full" /></div>}
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
      {subtext && <p className="text-xs text-green-600 mt-1 font-medium">{subtext}</p>}
    </div>
  );

  return (
    <div className="p-8">
      {/* WELCOME HEADER */}
      <div className="mb-8 bg-gradient-to-r from-green-700 to-black rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Welcome back, Admin!</h1>
          <p className="text-green-100 opacity-90 max-w-xl">Here is what's happening in your organization today. You can manage your payroll and team overview from here.</p>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/departments')}
            className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-green-400 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                <span className="font-bold text-lg">+</span>
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-800">Add Department</p>
                <p className="text-xs text-gray-500">Create new unit</p>
              </div>
            </div>
            <span className="text-gray-400 group-hover:text-green-600">&rarr;</span>
          </button>

          <button
            onClick={() => navigate('/employees')}
            className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-green-400 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                <span className="font-bold text-lg">+</span>
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-800">Hire Employee</p>
                <p className="text-xs text-gray-500">Onboard new staff</p>
              </div>
            </div>
            <span className="text-gray-400 group-hover:text-green-600">&rarr;</span>
          </button>

          <button
            onClick={() => navigate('/salaries')}
            className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-green-400 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                <span className="font-bold text-sm">RWF</span>
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-800">Process Salary</p>
                <p className="text-xs text-gray-500">Pay monthly wages</p>
              </div>
            </div>
            <span className="text-gray-400 group-hover:text-green-600">&rarr;</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Employees"
          value={stats.employees}
          subtext={recentEmployees.length > 0 ? `+${recentEmployees.length} recent hire(s)` : ''}
        />
        <StatCard
          title="Departments"
          value={stats.departments}
        />
        <StatCard
          title="Salary Records"
          value={stats.salaries}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-800 mb-4">Recent Hires</h3>
          {loading ? <div className="text-center text-gray-400 py-4">Loading...</div> : (
            <div className="space-y-4">
              {recentEmployees.length > 0 ? recentEmployees.map(emp => (
                <div key={emp.employeeNumber} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">
                      {emp.firstName[0]}{emp.lastName[0]}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{emp.firstName} {emp.lastName}</p>
                      <p className="text-xs text-gray-500">{emp.position} • {emp.departmentCode}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-600">Hired</p>
                    <p className="text-xs text-gray-400">{new Date(emp.hiredDate).toLocaleDateString()}</p>
                  </div>
                </div>
              )) : (
                <p className="text-gray-500 text-sm py-4">No recent hires found.</p>
              )}
            </div>
          )}
          <button
            onClick={() => navigate('/employees')}
            className="mt-4 w-full py-2 text-sm text-green-600 font-medium hover:bg-green-50 rounded-lg transition"
          >
            View All Employees
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;