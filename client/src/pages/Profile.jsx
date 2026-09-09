import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import api from '../services/api';
import { showSuccess, showError } from '../utils/sweetAlert';

export default function Profile() {
  const [profile, setProfile] = useState({ firstName: '', lastName: '', phone: '', email: '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/me');
        setProfile({
          firstName: res.data.profile?.firstName || '',
          lastName: res.data.profile?.lastName || '',
          phone: res.data.profile?.phone || '',
          email: res.data.email
        });
      } catch (err) { console.error(err); }
    };
    fetchProfile();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put('/auth/profile', profile);
      showSuccess('Profile updated successfully!');
    } catch (err) {
      showError('Failed to update profile');
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put('/auth/update-password', passwords);
      showSuccess('Password updated successfully!');
      setPasswords({ currentPassword: '', newPassword: '' });
    } catch (err) {
      showError(err.response?.data?.error || 'Failed to update password');
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Settings & Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Info Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">Personal Information</h2>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email (Cannot be changed)</label>
              <input type="email" value={profile.email} disabled className="w-full border border-gray-300 p-2 rounded bg-gray-100 text-gray-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">First Name</label>
                <input type="text" value={profile.firstName} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} className="w-full border border-gray-300 p-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <input type="text" value={profile.lastName} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} className="w-full border border-gray-300 p-2 rounded" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <input type="text" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="w-full border border-gray-300 p-2 rounded" />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Save Changes</button>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">Change Password</h2>
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Current Password</label>
              <input type="password" value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} className="w-full border border-gray-300 p-2 rounded" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">New Password</label>
              <input type="password" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} className="w-full border border-gray-300 p-2 rounded" required minLength="6" />
              <p className="text-xs text-gray-500 mt-1">Minimum 6 characters.</p>
            </div>
            <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">Update Password</button>
          </form>
          {/* Account Information Card */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between bg-gray-50 p-3 rounded">
                <span className="font-medium text-gray-500">Account Role</span>
                <span className="text-gray-800 capitalize">{profile.role || 'User'}</span>
              </div>
              <div className="flex justify-between bg-gray-50 p-3 rounded">
                <span className="font-medium text-gray-500">Account Status</span>
                <span className="text-green-600">Active</span>
              </div>
              <div className="flex justify-between bg-gray-50 p-3 rounded">
                <span className="font-medium text-gray-500">Password Last Changed</span>
                <span className="text-gray-800">N/A</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-4 italic">
              If you need to change your email address or branch, please contact your Principal or System Administrator.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}