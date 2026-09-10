import { useState, useEffect } from 'react';
import SuperAdminLayout from '../../components/SuperAdminLayout';
import api from '../../services/api';
import Swal from 'sweetalert2';
import { showSuccess, showError } from '../../utils/sweetAlert';
import { HeadingWithButtonSkeleton, TableSkeleton } from '../../components/skeletons';

export default function PrincipalManagement() {
  const [principals, setPrincipals] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: 'Principal123!', branchId: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const prinRes = await api.get('/admin/principals');
      setPrincipals(prinRes.data);
      
      const branchRes = await api.get('/admin/branches');
      setBranches(branchRes.data);
    } catch (err) { 
      console.error(err); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchData(); 
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/admin/principal', formData);
      showSuccess('Principal created successfully!');
      setShowModal(false);
      setFormData({ email: '', password: 'Principal123!', branchId: '' });
      fetchData();
    } catch (err) {
      showError(err.response?.data?.error || 'Failed to create principal');
    } finally { 
      setLoading(false); 
    }
  };

const handleResetPassword = async (id) => {
  const { value: password } = await Swal.fire({
    title: 'Enter new password',
    input: 'text',
    inputPlaceholder: 'Enter the new password',
    inputAttributes: { autocapitalize: 'off', autocorrect: 'off' },
    showCancelButton: true,
    confirmButtonText: 'Reset Password',
    showLoaderOnConfirm: true,
    preConfirm: (pwd) => {
      if (!pwd) Swal.showValidationMessage('Password cannot be empty');
      return pwd;
    }
  });

  if (password) {
    try {
      await api.put(`/users/${id}/reset-password`, { password });
      showSuccess('Password reset successfully.');
    } catch (err) { 
      showError('Failed to reset password.'); 
    }
  }
};

  return (
  <>{loading ? (
      <SuperAdminLayout>
        <HeadingWithButtonSkeleton/>
        <TableSkeleton rows={3} cols={3} />
      </SuperAdminLayout> )
     : <SuperAdminLayout loading={loading}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Principal Accounts</h1>
        <button 
          onClick={() => setShowModal(true)} 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium"
        >
          + Add Principal
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned Branch</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {principals.length > 0 ? (
              principals.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.branchId?.name || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button 
                      onClick={() => handleResetPassword(p._id)} 
                      className="text-red-600 hover:underline font-medium"
                    >
                      Reset Password
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                  No principals found. Click "Add Principal" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create Principal Account</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input 
                  type="email" 
                  value={formData.email} 
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                  className="w-full border border-gray-300 p-2 rounded" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Temp Password</label>
                <input 
                  type="text" 
                  value={formData.password} 
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                  className="w-full border border-gray-300 p-2 rounded" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Assign Branch</label>
                <select 
                  value={formData.branchId} 
                  onChange={(e) => setFormData({ ...formData, branchId: e.target.value })} 
                  className="w-full border border-gray-300 p-2 rounded" 
                  required
                >
                  <option value="">Select Branch</option>
                  { branches.length>0? branches.map(b => <option key={b._id} value={b._id}>{b.name}</option>) : (
                    <option disabled>Create branches first</option>
                  )}
                </select>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="px-4 py-2 text-gray-600 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
                >
                  {loading ? 'Creating...' : 'Create Principal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SuperAdminLayout>}
  </>);
}