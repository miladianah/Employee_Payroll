import { useState, useEffect } from 'react';
import api from '../services/api';

const Salaries = () => {
  const [salaries, setSalaries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // State for Editing
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const [form, setForm] = useState({
    grossSalary: '', totalDeduction: '', netSalary: '', monthOfPayment: '', employeeNumber: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [salRes, empRes] = await Promise.all([
        api.get('/salaries'),
        api.get('/employees')
      ]);
      setSalaries(salRes.data);
      setEmployees(empRes.data);
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Auto-calculate Net Salary
  useEffect(() => {
    const gross = parseFloat(form.grossSalary) || 0;
    const deduction = parseFloat(form.totalDeduction) || 0;
    setForm(prev => ({ ...prev, netSalary: (gross - deduction).toString() }));
  }, [form.grossSalary, form.totalDeduction]);

  // Start Edit Mode
  const handleEdit = (salary) => {
    setIsEditing(true);
    setEditId(salary.salaryId);
    setForm({
      grossSalary: salary.grossSalary,
      totalDeduction: salary.totalDeduction,
      netSalary: salary.netSalary,
      monthOfPayment: salary.monthOfPayment,
      employeeNumber: salary.employeeNumber
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancel Edit Mode
  const handleCancel = () => {
    setIsEditing(false);
    setEditId(null);
    setForm({ grossSalary: '', totalDeduction: '', netSalary: '', monthOfPayment: '', employeeNumber: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // UPDATE Operation
        await api.put(`/salaries/${editId}`, form);
      } else {
        // INSERT Operation
        await api.post('/salaries', form);
      }
      
      // Reset and Refresh
      handleCancel();
      fetchData();
    } catch (error) {
      alert(isEditing ? 'Failed to update salary' : 'Failed to record salary');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this salary record?')) return;
    try {
      await api.delete(`/salaries/${id}`);
      fetchData();
    } catch (error) {
      alert('Failed to delete record');
    }
  };

  return (
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-green-100 text-green-600 rounded-lg font-bold text-xl">RWF</div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Salaries</h1>
          <p className="text-sm text-gray-500">Manage payroll (Create, Update, Delete)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* FORM (Insert or Update) */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">
                {isEditing ? 'Update Payment' : 'Process Payment'}
              </h2>
              {isEditing && (
                <button onClick={handleCancel} className="text-gray-400 hover:text-red-500 font-bold text-lg">&times;</button>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Select Employee</label>
                  <select 
                  className="w-full px-4 py-2 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  value={form.employeeNumber}
                  onChange={e => setForm({...form, employeeNumber: e.target.value})}
                  required
                >
                  <option value="">Choose employee...</option>
                  {employees.map(emp => (
                    <option key={emp.employeeNumber} value={emp.employeeNumber}>
                      {emp.firstName} {emp.lastName} ({emp.employeeNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Month</label>
                <input 
                  type="month" 
                  className="w-full px-4 py-2 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  value={form.monthOfPayment}
                  onChange={e => setForm({...form, monthOfPayment: e.target.value})}
                  required 
                />
              </div>

              <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Gross Salary</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">RWF</span>
                    <input type="number" placeholder="0" className="w-full pl-12 pr-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" value={form.grossSalary} onChange={e => setForm({...form, grossSalary: e.target.value})} required />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-red-800 uppercase mb-1">Total Deduction</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-red-600">-</span>
                    <input type="number" placeholder="0.00" className="w-full pl-7 pr-3 py-2 bg-white border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" value={form.totalDeduction} onChange={e => setForm({...form, totalDeduction: e.target.value})} required />
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Net Salary (Auto)</label>
                  <div className="text-2xl font-bold text-gray-800">
                    RWF {parseFloat(form.netSalary || 0).toLocaleString()}
                  </div>
                </div>
              </div>

              <button type="submit" className={`w-full font-semibold py-2.5 rounded-lg transition-all shadow-md ${isEditing ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20' : 'bg-green-700 hover:bg-green-800 shadow-green-500/20'} text-white`}>
                {isEditing ? 'Update Record' : 'Record Salary'}
              </button>
            </form>
          </div>
        </div>

        {/* SALARY HISTORY (Retrieve) */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h3 className="font-semibold text-gray-700">Payment History ({salaries.length})</h3>
            </div>

            <div className="overflow-x-auto">
              {loading ? <div className="p-8 text-center text-gray-400">Loading history...</div> : (
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4">Employee</th>
                      <th className="px-6 py-4">Month</th>
                      <th className="px-6 py-4 text-right">Gross</th>
                      <th className="px-6 py-4 text-right">Deduction</th>
                      <th className="px-6 py-4 text-right">Net Pay</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {salaries.map(sal => (
                      <tr key={sal.salaryId} className="hover:bg-gray-50/30 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-800">{sal.employeeNumber}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{sal.monthOfPayment}</td>
                        <td className="px-6 py-4 text-right text-sm text-gray-600">
                          {parseFloat(sal.grossSalary).toLocaleString()} RWF
                        </td>
                        <td className="px-6 py-4 text-right text-sm text-red-500">
                          -{parseFloat(sal.totalDeduction).toLocaleString()} RWF
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-gray-800 bg-gray-50/50">
                          {parseFloat(sal.netSalary).toLocaleString()} RWF
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button onClick={() => handleEdit(sal)} className="text-blue-500 hover:text-blue-700 p-2 rounded hover:bg-blue-50 transition-colors" title="Edit">
                              Edit
                            </button>
                            <button onClick={() => handleDelete(sal.salaryId)} className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50 transition-colors" title="Delete">
                              Delete
                            </button>
                          </div>
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

export default Salaries;