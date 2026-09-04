import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Settings, Users, Building } from 'lucide-react';
import { logoutUser } from '../features/auth/authSlice';
import api from '../services/api';

export default function SuperAdminDashboard() {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [maxBranches, setMaxBranches] = useState(3);
    const [branches, setBranches] = useState([]);
    const [principal, setPrincipal] = useState(null);
    const [loading, setLoading] = useState(false);

    const [branchForm, setBranchForm] = useState({ name: '', address: '' });
    const [principalForm, setPrincipalForm] = useState({ email: '', password: '', branchId: '' });
    // Add these to your existing state variables
    const [logs, setLogs] = useState([]);

    // Add this function inside the component
    const fetchLogs = async () => {
        try {
            const res = await api.get('/logs');
            setLogs(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    // Add this to your existing useEffect
    useEffect(() => {
        fetchSystemData();
        fetchLogs(); // Add this
    }, []);

    // Add this function to handle password reset
    const handleResetPrincipalPassword = async () => {
        if (!principal) return;
        if (window.confirm('Reset Principal password to "Principal123!"?')) {
            try {
                const res = await api.put(`/users/${principal._id}/reset-password`);
                alert(`Password reset! New temp password: ${res.data.tempPassword}`);
            } catch (err) {
                alert('Failed to reset password');
            }
        }
    };
    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/');
    };

    // Fetch System Data
    const fetchSystemData = async () => {
        try {
            // Fetch settings
            const settingsRes = await api.get('/admin/settings');
            if (settingsRes.data) setMaxBranches(settingsRes.data.maxBranches);

            // Fetch branches
            const branchesRes = await api.get('/admin/branches');
            setBranches(branchesRes.data);

            // Fetch Principal (if exists)
            // We need a backend route for this, let's assume we create it or we just fetch all users
            const usersRes = await api.get('/admin/users');
            const prin = usersRes.data.find(u => u.role === 'Principal');
            setPrincipal(prin || null);
        } catch (err) {
            console.error(err);
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
            alert('Branch limit updated!');
            fetchSystemData();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to update limit');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateBranch = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/admin/branches', branchForm);
            alert('Branch created!');
            setBranchForm({ name: '', address: '' });
            fetchSystemData();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to create branch');
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePrincipal = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/admin/principal', principalForm);
            alert('Principal account created!');
            fetchSystemData();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to create principal');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <div className="w-64 bg-gray-900 text-white flex flex-col">
                <div className="p-4 border-b border-gray-700">
                    <h1 className="text-xl font-bold">SMS System</h1>
                    <p className="text-xs text-gray-400">Super Admin Panel</p>
                </div>
                <nav className="flex-1 p-2">
                    <Link to="/admin" className="flex items-center space-x-2 p-2 rounded bg-gray-800">
                        <Settings size={20} /> <span>System Setup</span>
                    </Link>
                </nav>
                <div className="p-2 border-t border-gray-700">
                    <button onClick={handleLogout} className="flex items-center space-x-2 p-2 rounded hover:bg-red-600 w-full">
                        <LogOut size={20} /> <span>Logout</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8 overflow-y-auto">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">System Setup & Administration</h1>

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
                        <h3 className="text-gray-500 text-sm">Principal Account</h3>
                        <p className="text-lg font-bold text-gray-800 mt-2">{principal ? "Active" : "Not Created"}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Update Branch Limit */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-lg font-semibold mb-4">Update Branch Limit</h2>
                        <form onSubmit={handleSaveLimit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Max Allowed Branches</label>
                                <input type="number" value={maxBranches} onChange={(e) => setMaxBranches(e.target.value)} className="w-full border p-2 rounded" required />
                            </div>
                            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Save Limit</button>
                        </form>
                    </div>

                    {/* Create Branch */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-lg font-semibold mb-4">Create New Branch (Campus)</h2>
                        <form onSubmit={handleCreateBranch}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Branch Name</label>
                                <input type="text" value={branchForm.name} onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })} className="w-full border p-2 rounded" required />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Address</label>
                                <input type="text" value={branchForm.address} onChange={(e) => setBranchForm({ ...branchForm, address: e.target.value })} className="w-full border p-2 rounded" />
                            </div>
                            <button type="submit" disabled={loading} className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">Add Branch</button>
                        </form>
                    </div>

                    {/* Create Principal */}
                    <div className="bg-white p-6 rounded-lg shadow col-span-1 md:col-span-2">
                        <h2 className="text-lg font-semibold mb-4">Create Principal Account</h2>
                        {principal ? (
                            <div className="bg-green-50 p-4 rounded border border-green-200 text-green-700">
                                Principal account already exists: <span className="font-bold">{principal.email}</span>
                            </div>
                        ) : (
                            <form onSubmit={handleCreatePrincipal} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Principal Email</label>
                                    <input type="email" value={principalForm.email} onChange={(e) => setPrincipalForm({ ...principalForm, email: e.target.value })} className="w-full border p-2 rounded" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Password</label>
                                    <input type="text" value={principalForm.password} onChange={(e) => setPrincipalForm({ ...principalForm, password: e.target.value })} className="w-full border p-2 rounded" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Assign Branch</label>
                                    <select value={principalForm.branchId} onChange={(e) => setPrincipalForm({ ...principalForm, branchId: e.target.value })} className="w-full border p-2 rounded" required>
                                        <option value="">Select Branch</option>
                                        {branches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                                    </select>
                                </div>
                                <div className="col-span-3">
                                    <button type="submit" disabled={loading} className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700">Create Principal</button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
                {/* Add this button next to the Principal Account status card */}
                {principal && (
                    <button onClick={handleResetPrincipalPassword} className="ml-2 text-xs text-red-600 hover:underline">
                        Reset Password
                    </button>
                )}

                {/* Add this Logs section at the very bottom of the main content */}
                <div className="bg-white p-6 rounded-lg shadow mt-6">
                    <h2 className="text-lg font-semibold mb-4">System Audit Logs</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entity</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Performed By</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {logs.length > 0 ? (
                                    logs.map((log) => (
                                        <tr key={log._id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.action}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.entity}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.performedBy?.email || 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(log.timestamp).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">No system logs found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}