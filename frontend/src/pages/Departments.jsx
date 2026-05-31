import { useState, useEffect } from 'react';
import api from '../services/api';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({ departmentCode: '', departmentName: '' });
  const [isLoading, setIsLoading] = useState(false);

  const fetchDepts = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/departments');
      setDepartments(res.data);
    } catch (error) {
      console.error('Error fetching departments', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchDepts(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.departmentCode || !form.departmentName) return alert('Fill all fields');
    try {
      await api.post('/departments', form);
      setForm({ departmentCode: '', departmentName: '' });
      fetchDepts();
    } catch (error) {
      alert('Failed to add department');
    }
  };

  return (
    <div className="p-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-green-100 text-green-600 rounded-lg font-bold text-xl">D</div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Departments</h1>
          <p className="text-sm text-gray-500">View and add departments</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-8">
            <h2 className="text-lg font-bold mb-4">Add Department</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Code</label>
                <input type="text" placeholder="e.g. IT" className="w-full px-4 py-2 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" value={form.departmentCode} onChange={e => setForm({...form, departmentCode: e.target.value.toUpperCase()})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input type="text" placeholder="e.g. Information Tech" className="w-full px-4 py-2 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" value={form.departmentName} onChange={e => setForm({...form, departmentName: e.target.value})} />
              </div>
              <button type="submit" className="w-full bg-green-700 hover:bg-green-800 text-white font-medium py-2 rounded-lg transition">Create</button>
            </form>
          </div>
        </div>

        {/* List - No Delete Actions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 font-semibold text-gray-800">
              Existing Departments ({departments.length})
            </div>
            <div className="overflow-x-auto">
              {isLoading ? <div className="p-8 text-center">Loading...</div> : (
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500">
                    <tr>
                      <th className="px-6 py-4">Code</th>
                      <th className="px-6 py-4">Name</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {departments.map(dept => (
                      <tr key={dept.departmentCode} className="hover:bg-green-50/30">
                        <td className="px-6 py-4"><span className="font-mono text-green-600 bg-green-50 px-2 py-1 rounded text-sm">{dept.departmentCode}</span></td>
                        <td className="px-6 py-4 font-medium text-gray-700">{dept.departmentName}</td>
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

export default Departments;