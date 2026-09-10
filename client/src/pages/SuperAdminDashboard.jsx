import { useState, useEffect } from 'react';
import SuperAdminLayout from '../components/SuperAdminLayout';
import api from '../services/api';
import { showSuccess, showError } from '../utils/sweetAlert';
import Tooltip from '../components/Tooltip';
import { SystemSetupSkeleton } from '../components/skeletons';

export default function SuperAdminDashboard() {
  const [maxBranches, setMaxBranches] = useState(3);
  const [branches, setBranches] = useState([]);
  const [principals, setPrincipals] = useState([]);
  const [loading, setLoading] = useState(false);

  const [branchForm, setBranchForm] = useState({ name: '', address: '' });

  const fetchSystemData = async () => {
    setLoading(true);
    try {
      // Fetch settings
      const settingsRes = await api.get('/admin/settings');
      if (settingsRes.data) setMaxBranches(settingsRes.data.maxBranches);

      // Fetch branches
      const branchesRes = await api.get('/admin/branches');
      setBranches(branchesRes.data);

      // Fetch all principals
      const prinRes = await api.get('/admin/principals');
      setPrincipals(prinRes.data);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemData();
  }, []);

  const handleSaveLimit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/admin/settings/max-branches', { maxBranches: Number(maxBranches) });
      showSuccess('Branch limit updated successfully!');
      fetchSystemData();
    } catch (err) {
      showError(err.response?.data?.error || 'Failed to update limit');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBranch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/admin/branches', branchForm);
      showSuccess('Branch created successfully!');
      setBranchForm({ name: '', address: '' });
      fetchSystemData();
    } catch (err) {
      showError(err.response?.data?.error || 'Failed to create branch');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>{loading ? (
      <SuperAdminLayout>
        <SystemSetupSkeleton />
      </SuperAdminLayout> )
     : (<SuperAdminLayout loading={loading}>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">System Setup & Administration</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
          <h3 className="text-gray-500 text-sm">Current Branch Limit</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">{maxBranches}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
          <h3 className="text-gray-500 text-sm">Total Branches Created</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">{branches.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
          <h3 className="text-gray-500 text-sm">Total Principal Accounts</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">{principals.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Update Branch Limit */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Update Branch Limit</h2>
          <form onSubmit={handleSaveLimit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Max Allowed Branches</label>
              <input
                type="number"
                value={maxBranches}
                onChange={(e) => setMaxBranches(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Set the maximum number of campuses this school can have.</p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
            >
              {loading ? 'Saving...' : 'Save Limit'}
            </button>
          </form>
        </div>

        {/* Create Branch */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Create New Branch (Campus)</h2>
          <form onSubmit={handleCreateBranch}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Branch Name</label>
              <Tooltip text="Enter the name of the new branch." >
                <input
                  type="text"
                  value={branchForm.name}
                  onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </Tooltip>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Address</label>
              <Tooltip text="Enter the physical address of the new branch." >
                <input
                  type="text"
                  value={branchForm.address}
                  onChange={(e) => setBranchForm({ ...branchForm, address: e.target.value })}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </Tooltip>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled:bg-green-400"
            >
              {loading ? 'Creating...' : 'Add Branch'}
            </button>
          </form>
        </div>
      </div>
    </SuperAdminLayout>)}</>
  );
}