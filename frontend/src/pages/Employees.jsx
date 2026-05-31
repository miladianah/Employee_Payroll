import { useState, useEffect } from 'react';
import api from '../services/api';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    employeeNumber: '', firstName: '', lastName: '', 
    address: '', position: '', telephone: '', gender: '', 
    hiredDate: '', departmentCode: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [empRes, deptRes] = await Promise.all([
        api.get('/employees'),
        api.get('/departments')
      ]);
      setEmployees(empRes.data);
      setDepartments(deptRes.data);
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/employees', form);
      setForm({ employeeNumber: '', firstName: '', lastName: '', address: '', position: '', telephone: '', gender: '', hiredDate: '', departmentCode: '' });
      fetchData();
    } catch (error) {
      alert('Failed to add employee');
    }
  };

  return (
    <div className="p-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-green-100 text-green-600 rounded-lg font-bold text-xl">E</div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Employees</h1>
          <p className="text-sm text-gray-500">View and add employees</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ADD EMPLOYEE FORM */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-8">
            <h2 className="text-lg font-bold mb-4 text-gray-800">Add Employee</h2>
            
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Emp Number</label>
                  <input type="text" placeholder="EMP01" className="w-full mt-1 px-3 py-2 bg-gray-50 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" value={form.employeeNumber} onChange={e => setForm({...form, employeeNumber: e.target.value})} required />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Gender</label>
                  <select className="w-full mt-1 px-3 py-2 bg-gray-50 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" value={form.gender} onChange={e => setForm({...form, gender: e.target.value})} required>
                    <option value="">Select...</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">First Name</label>
                  <input type="text" placeholder="John" className="w-full mt-1 px-3 py-2 bg-gray-50 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} required />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Last Name</label>
                  <input type="text" placeholder="Doe" className="w-full mt-1 px-3 py-2 bg-gray-50 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} required />
                </div>
              </div>

              <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Address</label>
                <input type="text" placeholder="123 Street Name" className="w-full mt-1 px-3 py-2 bg-gray-50 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" value={form.address} onChange={e => setForm({...form, address: e.target.value})} required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Position</label>
                  <input type="text" placeholder="Developer" className="w-full mt-1 px-3 py-2 bg-gray-50 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" value={form.position} onChange={e => setForm({...form, position: e.target.value})} required />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Phone</label>
                  <input type="text" placeholder="078..." className="w-full mt-1 px-3 py-2 bg-gray-50 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" value={form.telephone} onChange={e => setForm({...form, telephone: e.target.value})} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Hired Date</label>
                  <input type="date" className="w-full mt-1 px-3 py-2 bg-gray-50 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" value={form.hiredDate} onChange={e => setForm({...form, hiredDate: e.target.value})} required />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Department</label>
                  <select className="w-full mt-1 px-3 py-2 bg-gray-50 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" value={form.departmentCode} onChange={e => setForm({...form, departmentCode: e.target.value})} required>
                    <option value="">Select Dept</option>
                    {departments.map(d => <option key={d.departmentCode} value={d.departmentCode}>{d.departmentName}</option>)}
                  </select>
                </div>
              </div>

              <button type="submit" className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-2.5 rounded-lg transition-all shadow-md shadow-green-500/20">
                Save Employee
              </button>
            </form>
          </div>
        </div>

        {/* EMPLOYEES LIST */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h3 className="font-semibold text-gray-700">Directory ({employees.length})</h3>
            </div>

            <div className="overflow-x-auto">
              {loading ? <div className="p-8 text-center text-gray-400">Loading employees...</div> : (
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Position</th>
                      <th className="px-6 py-4">Address</th>
                      <th className="px-6 py-4">Hired Date</th>
                      <th className="px-6 py-4">Dept</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {employees.map(emp => (
                      <tr key={emp.employeeNumber} className="hover:bg-green-50/30 transition-colors group">
                        <td className="px-6 py-4 font-mono text-xs text-gray-500">{emp.employeeNumber}</td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-800">{emp.firstName} {emp.lastName}</div>
                          <div className="text-xs text-gray-500">{emp.telephone}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{emp.position}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate" title={emp.address}>
                          {emp.address}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                          {emp.hiredDate ? new Date(emp.hiredDate).toLocaleDateString() : 'N/A'}
                        </td>

                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                            {departments.find(d => d.departmentCode === emp.departmentCode)?.departmentName || emp.departmentCode}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Employees;