import { useState, useEffect } from 'react';
import api from '../services/api';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('employees'); 
  const [timeFilter, setTimeFilter] = useState('all'); 
  
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [salaries, setSalaries] = useState([]);

  // Fetch all data on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empRes, deptRes, salRes] = await Promise.all([
          api.get('/employees'),
          api.get('/departments'),
          api.get('/salaries')
        ]);
        setEmployees(empRes.data);
        setDepartments(deptRes.data);
        setSalaries(salRes.data);
      } catch (error) {
        console.error('Error fetching report data', error);
      }
    };
    fetchData();
  }, []);

  // --- FILTERING LOGIC (Same as before) ---
  const isDateInRange = (dateString, filter) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0,0,0,0);
    const d = new Date(date);
    d.setHours(0,0,0,0);

    if (filter === 'daily') return d.getTime() === today.getTime();
    if (filter === 'weekly') {
      const oneWeekAgo = new Date(today);
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return d >= oneWeekAgo && d <= today;
    } 
    if (filter === 'monthly') return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
    return true; 
  };

  const isSalaryInRange = (monthString, filter) => {
    if (!monthString) return false;
    const inputDate = new Date(monthString);
    const today = new Date();
    if (filter === 'daily') return inputDate.getMonth() === today.getMonth(); 
    if (filter === 'weekly') return inputDate.getMonth() === today.getMonth(); 
    if (filter === 'monthly') return inputDate.getMonth() === today.getMonth() && inputDate.getFullYear() === today.getFullYear();
    return true;
  };

  const filteredEmployees = employees.filter(emp => isDateInRange(emp.hiredDate, timeFilter));
  const filteredSalaries = salaries.filter(sal => isSalaryInRange(sal.monthOfPayment, timeFilter));
  const totalSalaryPaid = filteredSalaries.reduce((acc, curr) => acc + parseFloat(curr.netSalary), 0);

  const FilterButtons = () => (
    <div className="flex bg-gray-100 p-1 rounded-lg no-print"> {/* Added no-print class */}
      {['all', 'daily', 'weekly', 'monthly'].map((f) => (
        <button
          key={f}
          onClick={() => setTimeFilter(f)}
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
            timeFilter === f ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {f.charAt(0).toUpperCase() + f.slice(1)}
        </button>
      ))}
    </div>
  );

  return (
    <div className="p-8 animate-fade-in">
      {/* --- PRINT STYLES --- */}
      <style>{`
        @media print {
          aside, .no-print { display: none !important; }
          main { margin-left: 0 !important; padding: 0 !important; }
          body { background: white; }
          .shadow-sm, .shadow-md { box-shadow: none !important; border: 1px solid #ddd; }
        }
      `}</style>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg font-bold text-xl">R</div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
            <p className="text-sm text-gray-500">Generate and print summaries</p>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition shadow-md no-print"
        >
          Print Report
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 no-print">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {['employees', 'departments', 'salaries'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === tab ? 'bg-white text-green-700 shadow' : 'text-gray-500'}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <FilterButtons />
        </div>
      </div>

      {/* Report Title for Print */}
      <div className="hidden print:block mb-4 text-center">
        <h2 className="text-2xl font-bold uppercase">{activeTab} Report</h2>
        <p className="text-gray-500">Filter: {timeFilter} | Date: {new Date().toLocaleDateString()}</p>
        <hr className="my-4"/>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
        
        {activeTab === 'employees' && (
          <div className="p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Employee Hires</h2>
            <div className="mb-4 p-4 bg-gray-50 rounded-lg flex items-center justify-between print:bg-white print:border">
              <span className="text-gray-700 font-medium">Total New Hires ({timeFilter}):</span>
              <span className="text-2xl font-bold text-green-700">{filteredEmployees.length}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Position</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Hired Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredEmployees.length > 0 ? filteredEmployees.map(emp => (
                    <tr key={emp.employeeNumber}>
                      <td className="px-4 py-3 font-medium">{emp.firstName} {emp.lastName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{emp.position}</td>
                      <td className="px-4 py-3"><span className="bg-gray-100 px-2 py-1 rounded text-xs">{departments.find(d => d.departmentCode === emp.departmentCode)?.departmentName || emp.departmentCode}</span></td>
                      <td className="px-4 py-3 text-sm">{new Date(emp.hiredDate).toLocaleDateString()}</td>
                    </tr>
                  )) : <tr><td colSpan="4" className="px-4 py-8 text-center text-gray-400">No records found.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'departments' && (
          <div className="p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Department Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {departments.map(dept => {
                const empCount = employees.filter(e => e.departmentCode === dept.departmentCode).length;
                return (
                  <div key={dept.departmentCode} className="border border-gray-100 rounded-xl p-4 print:border print:shadow-none">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-800">{dept.departmentName}</h3>
                      <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">{dept.departmentCode}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      {empCount} Employees
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'salaries' && (
          <div className="p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Payroll Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 border border-green-100 p-4 rounded-xl print:bg-white print:border">
                <p className="text-xs text-green-600 font-bold uppercase">Total Net Payout</p>
                <p className="text-2xl font-bold text-green-800">{totalSalaryPaid.toLocaleString()} RWF</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl print:bg-white print:border">
                <p className="text-xs text-gray-600 font-bold uppercase">Records Found</p>
                <p className="text-2xl font-bold text-gray-800">{filteredSalaries.length}</p>
              </div>
              <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl print:bg-white print:border">
                <p className="text-xs text-orange-600 font-bold uppercase">Filter</p>
                <p className="text-lg font-bold text-orange-800 capitalize">{timeFilter} View</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Employee ID</th>
                    <th className="px-4 py-3">Month</th>
                    <th className="px-4 py-3">Gross</th>
                    <th className="px-4 py-3">Deduction</th>
                    <th className="px-4 py-3">Net</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredSalaries.length > 0 ? filteredSalaries.map(sal => (
                    <tr key={sal.salaryId}>
                      <td className="px-4 py-3 font-mono text-xs">{sal.employeeNumber}</td>
                      <td className="px-4 py-3 text-sm">{sal.monthOfPayment}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{parseFloat(sal.grossSalary).toLocaleString()} RWF</td>
                      <td className="px-4 py-3 text-sm text-red-500">-{parseFloat(sal.totalDeduction).toLocaleString()} RWF</td>
                      <td className="px-4 py-3 text-sm font-bold text-green-600">{parseFloat(sal.netSalary).toLocaleString()} RWF</td>
                    </tr>
                  )) : <tr><td colSpan="5" className="px-4 py-8 text-center text-gray-400">No records found.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;