import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';

export default function UserManagement() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/teachers'); // Fetches teachers
      setUsers(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleResetPassword = async (id) => {
    if (window.confirm('Reset password to a random temp password?')) {
      try {
        const res = await api.put(`/users/${id}/reset-password`);
        alert(`New temp password: ${res.data.tempPassword}`);
      } catch (err) { alert('Failed to reset'); }
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">User Management (Teachers)</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((u) => (
              <tr key={u._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.profile?.firstName} {u.profile?.lastName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button onClick={() => handleResetPassword(u._id)} className="text-red-600 hover:underline font-medium">Reset Password</button>
                </td>
              </tr>
            ))}
            {users.length === 0 && <tr><td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">No teachers found.</td></tr>}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}