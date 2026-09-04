import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../features/auth/authSlice';
import { LogOut, Settings, Users, Building, FileText } from 'lucide-react';
import api from '../../services/api';

export default function PrincipalManagement() {
  const [principals, setPrincipals] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: 'Principal123!', branchId: '' });

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const prinRes = await api.get('/admin/principals');
      setPrincipals(prinRes.data);
      
      const branchRes = await api.get('/admin/branches');
      setBranches(branchRes.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/admin/principal', formData);
      alert('Principal created!');
      setShowModal(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed');
    } finally { setLoading(false); }
  };

  const handleResetPassword = async (id) => {
    if (window.confirm('Reset password to a random temp password?')) {
      try {
        const res = await api.put(`/users/${id}/reset-password`);
        alert(`New temp password: ${res.data.tempPassword}`);
      } catch (err) { alert('Failed to reset'); }
    }
  };

  const handleLogout = () => { dispatch(logoutUser()); navigate('/login'); };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 border-b border-gray-700"><h1 className="text-xl font-bold">SMS System</h1><p className="text-xs text-gray-400">Super Admin Panel</p></div>
        <nav className="flex-1 p-2 space-y-1">
          <Link to="/admin" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800"><Settings size={20} /> <span>System Setup</span></Link>
          <Link to="/admin/principals" className="flex items-center space-x-2 p-2 rounded bg-gray-800"><Users size={20} /> <span>Principals</span></Link>
          <Link to="/admin/logs" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800"><FileText size={20} /> <span>Audit Logs</span></Link>
        </nav>
        <div className="p-2 border-t border-gray-700"><button onClick={handleLogout} className="flex items-center space-x-2 p-2 rounded hover:bg-red-600 w-full"><LogOut size={20} /> <span>Logout</span></button></div>
      </div>

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Principal Accounts</h1>
          <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium">+ Add Principal</button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Branch</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {principals.map((p) => (
                <tr key={p._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.branchId?.name || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button onClick={() => handleResetPassword(p._id)} className="text-red-600 hover:underline font-medium">Reset Password</button>
                  </td>
                </tr>
              ))}
              {principals.length === 0 && <tr><td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">No principals found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create Principal Account</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm font-medium mb-1">Email</label><input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full border p-2 rounded" required /></div>
              <div><label className="block text-sm font-medium mb-1">Password</label><input type="text" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full border p-2 rounded" required /></div>
              <div><label className="block text-sm font-medium mb-1">Branch</label><select value={formData.branchId} onChange={(e) => setFormData({ ...formData, branchId: e.target.value })} className="w-full border p-2 rounded" required><option value="">Select Branch</option>{branches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}</select></div>
              <div className="flex justify-end space-x-2"><button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 rounded hover:bg-gray-100">Cancel</button><button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{loading ? 'Saving...' : 'Create'}</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}