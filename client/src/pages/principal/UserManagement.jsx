// import { useState, useEffect } from 'react';
// import DashboardLayout from '../../components/DashboardLayout';
// import api from '../../services/api';
// import { showSuccess, showError } from '../../utils/sweetAlert';
// import Swal from 'sweetalert2';
// import { HeadingWithButtonSkeleton, TableSkeleton, SearchBarSkeleton } from '../../components/skeletons';

// export default function UserManagement() {
//   const [users, setUsers] = useState([]);
//   const [showResetModal, setShowResetModal] = useState(false);
//   const [showParentModal, setShowParentModal] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [newPassword, setNewPassword] = useState('');
//   const [search, setSearch] = useState('');
//   const [filterRole, setFilterRole] = useState('');
//   const [parentForm, setParentForm] = useState({ email: '', password: '', firstName: '', lastName: '', phone: '' });
//   const [loading, setLoading] = useState(false);
  
//   const fetchUsers = async () => {
//     setLoading(true);
//     try {
//       const teaRes = await api.get('/teachers');
//       // We need a route to get parents. Let's assume we add /api/users/parents
//       const parRes = await api.get('/users/parents');
//       const combined = [...teaRes.data, ...parRes.data];
//       setUsers(combined);
//     } catch (err) { console.error(err); }
//     finally { setLoading(false); }
//   };

//   useEffect(() => { fetchUsers(); }, []);

//   const openResetModal = (user) => {
//     setSelectedUser(user);
//     setNewPassword('');
//     setShowResetModal(true);
//   };

//   const handleResetPassword = async (e) => {
//     setLoading(true);
//     e.preventDefault();
//     try {
//       await api.put(`/users/${selectedUser._id}/reset-password`, { password: newPassword });
//       showSuccess('Password reset successfully!');
//       setShowResetModal(false);
//     } catch (err) { showError('Failed to reset password'); }
//     finally { setLoading(false); }
//   };

//   const handleCreateParent = async (e) => {
//     setLoading(true);
//     e.preventDefault();
//     try {
//       await api.post('/users/parent', parentForm);
//       showSuccess('Parent account created!');
//       setShowParentModal(false);
//       fetchUsers();
//     } catch (err) { showError(err.response?.data?.error || 'Failed to create parent'); }
//     finally { setLoading(false); }
//   };

//   return (
//     <>{(loading) ? (
//       <DashboardLayout>
//         <HeadingWithButtonSkeleton />
//         <SearchBarSkeleton btn={true} />
//         <TableSkeleton rows={10} />
//       </DashboardLayout>
//     ) : (
//       <DashboardLayout>
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold text-gray-800">User Management</h1>

//           <button onClick={() => setShowParentModal(true)} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400 font-medium">
//             + Register New Parent
//           </button>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow mb-4 flex flex-col md:flex-row gap-4">
//           <input
//             type="text"
//             placeholder="Search by name or email..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="flex-1 border border-gray-300 p-2 rounded"
//           />
//           <select
//             value={filterRole}
//             onChange={(e) => setFilterRole(e.target.value)}
//             className="border border-gray-300 p-2 rounded w-full md:w-48"
//           >
//             <option value="">All Roles</option>
//             <option value="Teacher">Teachers</option>
//             <option value="Parent">Parents</option>
//           </select>
//         </div>

//         <div className="bg-white rounded-lg shadow overflow-auto">
//           <table className="w-full table-fixed divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="w-[30%] px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
//                 <th className="w-[35%] px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
//                 <th className="w-[20%] px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
//                 <th className="w-[15%] px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">

//               {(() => {
//                 const filteredUsers = users.filter(u =>
//                   (`${u.profile?.firstName} ${u.profile?.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
//                     u.email.toLowerCase().includes(search.toLowerCase())) &&
//                   (!filterRole || u.role === filterRole)
//                 );

//                 return filteredUsers.length > 0 ? (
//                   filteredUsers.map((u) => (
//                     <tr key={u._id}>
//                       <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900" title={(u.profile?.firstName || 'First Name') + ' ' + (u.profile?.lastName || 'Last Name')}>
//                         Mr. {(u.profile?.firstName || 'First Name') }
//                       </td>
//                       <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900" title={u.email}>
//                         {u.email.substring(0, 15)}...
//                       </td>
//                       <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{u.role}</td>
//                       <td className="px-4 py-4 whitespace-nowrap text-sm">
//                         <button onClick={() => openResetModal(u)} className="text-red-600 hover:scale-130 transition-transform font-medium center" title="Reset Password">🔐</button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr><td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">No users found.</td></tr>
//                 );
//               })()}

//             </tbody>
//           </table>
//         </div>

//         {/* Reset Password Modal */}
//         {showResetModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-lg p-6 w-full max-w-md">
//               <h2 className="text-xl font-bold mb-4">Reset Password for {selectedUser?.email}</h2>
//               <form onSubmit={handleResetPassword}>
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium mb-1">New Password</label>
//                   <input
//                     type="text"
//                     value={newPassword}
//                     onChange={(e) => setNewPassword(e.target.value)}
//                     className="w-full border border-gray-300 p-2 rounded"
//                     placeholder="Enter new password"
//                     required
//                   />
//                 </div>
//                 <div className="flex justify-end space-x-2">
//                   <button type="button" onClick={() => setShowResetModal(false)} className="px-4 py-2 text-gray-600 rounded hover:bg-gray-100">Cancel</button>
//                   <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400">Reset Password</button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* Register Parent Modal */}
//         {showParentModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-lg p-6 w-full max-w-md">
//               <h2 className="text-xl font-bold mb-4">Register New Parent</h2>
//               <form onSubmit={handleCreateParent} className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Email</label>
//                   <input type="email" value={parentForm.email} onChange={(e) => setParentForm({ ...parentForm, email: e.target.value })} className="w-full border border-gray-300 p-2 rounded" required />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Password</label>
//                   <input type="text" value={parentForm.password} onChange={(e) => setParentForm({ ...parentForm, password: e.target.value })} className="w-full border border-gray-300 p-2 rounded" required />
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium mb-1">First Name</label>
//                     <input type="text" value={parentForm.firstName} onChange={(e) => setParentForm({ ...parentForm, firstName: e.target.value })} className="w-full border border-gray-300 p-2 rounded" required />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-1">Last Name</label>
//                     <input type="text" value={parentForm.lastName} onChange={(e) => setParentForm({ ...parentForm, lastName: e.target.value })} className="w-full border border-gray-300 p-2 rounded" />
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Phone</label>
//                   <input type="text" value={parentForm.phone} onChange={(e) => setParentForm({ ...parentForm, phone: e.target.value })} className="w-full border border-gray-300 p-2 rounded" />
//                 </div>
//                 <div className="flex justify-end space-x-2 pt-2">
//                   <button type="button" onClick={() => setShowParentModal(false)} className="px-4 py-2 text-gray-600 rounded hover:bg-gray-100">Cancel</button>
//                   <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400">Create Parent</button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </DashboardLayout>)}</>
//   );
// }


import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import { showSuccess, showError } from '../../utils/sweetAlert';
import Swal from 'sweetalert2';
import { HeadingWithButtonSkeleton, TableSkeleton, SearchBarSkeleton } from '../../components/skeletons';
// FIX: Added missing icons for the premium modals and sorting
import { X, ChevronUp, ChevronDown, Search, UserPlus, KeyRound } from 'lucide-react';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showParentModal, setShowParentModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [parentForm, setParentForm] = useState({ email: '', password: '', firstName: '', lastName: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const teaRes = await api.get('/teachers');
      const parRes = await api.get('/users/parents');
      const combined = [...teaRes.data, ...parRes.data];
      setUsers(combined);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const openResetModal = (user) => {
    setSelectedUser(user);
    setNewPassword('');
    setShowResetModal(true);
  };

  const handleResetPassword = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      await api.put(`/users/${selectedUser._id}/reset-password`, { password: newPassword });
      showSuccess('Password reset successfully!');
      setShowResetModal(false);
    } catch (err) { showError('Failed to reset password'); }
    finally { setLoading(false); }
  };

  const handleCreateParent = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      await api.post('/users/parent', parentForm);
      showSuccess('Parent account created!');
      setShowParentModal(false);
      fetchUsers();
    } catch (err) { showError(err.response?.data?.error || 'Failed to create parent'); }
    finally { setLoading(false); }
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Apply Search, Filter, and Sort
  const processedUsers = users.filter(u =>
    (`${u.profile?.firstName} ${u.profile?.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())) &&
    (!filterRole || u.role === filterRole)
  ).sort((a, b) => {
    let valA, valB;
    if (sortConfig.key === 'name') {
      valA = `${a.profile?.firstName} ${a.profile?.lastName}`.toLowerCase();
      valB = `${b.profile?.firstName} ${b.profile?.lastName}`.toLowerCase();
    } else if (sortConfig.key === 'email') {
      valA = a.email.toLowerCase();
      valB = b.email.toLowerCase();
    } else {
      valA = a.role; valB = b.role;
    }

    if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
    if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) return null;
    return sortConfig.direction === 'ascending' ? <ChevronUp size={14} className="inline ml-1" /> : <ChevronDown size={14} className="inline ml-1" />;
  };

  return (
    <>
      {(loading) ? (
        <DashboardLayout>
          <HeadingWithButtonSkeleton />
          <SearchBarSkeleton btn={true} />
          <TableSkeleton rows={10} />
        </DashboardLayout>
      ) : (
        <DashboardLayout>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">User Management</h1>

            <button onClick={() => setShowParentModal(true)} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400 font-medium">
              + Register New Parent
            </button>
          </div>
          <div className="bg-white p-4 rounded-lg shadow mb-4 flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 border border-gray-300 p-2 rounded"
            />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full md:w-48"
            >
              <option value="">All Roles</option>
              <option value="Teacher">Teachers</option>
              <option value="Parent">Parents</option>
            </select>
          </div>

          {/* UPDATED LISTING SECTION: Uses processedUsers and applies sorting properly */}
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full table-fixed divide-y divide-gray-200 min-w-[800px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-[30%] px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 transition" onClick={() => requestSort('name')}>
                    Name
                    <SortIcon column="name" />
                  </th>
                  <th className="w-[35%] px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 transition" onClick={() => requestSort('email')}>
                    Email
                    <SortIcon column="email" />
                  </th>
                  <th className="w-[20%] px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 transition" onClick={() => requestSort('role')}>
                    Role
                    <SortIcon column="role" />
                  </th>
                  <th className="w-[15%] px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {processedUsers.length > 0 ? (
                  processedUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900" title={`${u.profile?.firstName || ''} ${u.profile?.lastName || ''}`}>
                        {u.profile?.firstName || 'First Name'} {u.profile?.lastName || ''}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900" title={u.email}>
                        {u.email}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${u.role === 'Teacher' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <button onClick={() => openResetModal(u)} className="text-blue-600 hover:text-blue-900 flex items-center space-x-1 font-medium transition" title="Reset Password">
                          <KeyRound size={14} />
                          <span>Reset</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">No users found.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Reset Password Modal */}
          {showResetModal && (
            <div className="fixed inset-0 bg-black/10 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh] border border-gray-100">
                {/* Modal Header */}
                <div className="flex justify-between items-center p-5 border-b border-gray-200">
                  <h2 className="text-lg font-bold text-gray-800">Reset Password</h2>
                  <button onClick={() => setShowResetModal(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition">
                    <X size={20} />
                  </button>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleResetPassword} className="flex-1 overflow-y-auto">
                  <div className="p-6 space-y-4">
                    <p className="text-sm text-gray-500">Enter a new password for <span className="font-bold text-gray-700">{selectedUser?.email}</span></p>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">New Password</label>
                      <input
                        type="text"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        placeholder="Enter new password"
                        required
                      />
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="flex justify-end space-x-3 p-5 bg-gray-50 border-t border-gray-200 rounded-b-xl">
                    <button type="button" onClick={() => setShowResetModal(false)} className="px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-200 font-medium transition">Cancel</button>
                    <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition shadow-sm">Save Password</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* --- PREMIUM MODAL: Register Parent --- */}
          {showParentModal && (
            <div className="fixed inset-0 bg-black/50 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh] border border-gray-100">
                {/* Modal Header */}
                <div className="flex justify-between items-center p-5 border-b border-gray-200">
                  <h2 className="text-lg font-bold text-gray-800">Register New Parent</h2>
                  <button onClick={() => setShowParentModal(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition">
                    <X size={20} />
                  </button>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleCreateParent} className="flex-1 overflow-y-auto">
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
                      <input type="email" value={parentForm.email} onChange={(e) => setParentForm({ ...parentForm, email: e.target.value })} className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Temporary Password</label>
                      <input type="text" value={parentForm.password} onChange={(e) => setParentForm({ ...parentForm, password: e.target.value })} className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">First Name</label>
                        <input type="text" value={parentForm.firstName} onChange={(e) => setParentForm({ ...parentForm, firstName: e.target.value })} className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Last Name</label>
                        <input type="text" value={parentForm.lastName} onChange={(e) => setParentForm({ ...parentForm, lastName: e.target.value })} className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
                      <input type="text" value={parentForm.phone} onChange={(e) => setParentForm({ ...parentForm, phone: e.target.value })} className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" />
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="flex justify-end space-x-3 p-5 bg-gray-50 border-t border-gray-200 rounded-b-xl">
                    <button type="button" onClick={() => setShowParentModal(false)} className="px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-200 font-medium transition">Cancel</button>
                    <button type="submit" className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition shadow-sm">Create Parent</button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </DashboardLayout>
      )}
    </>
  );
}