import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import { showSuccess, showError, showConfirm } from '../../utils/sweetAlert';
import { SearchBarSkeleton, TableSkeleton, HeadingWithButtonSkeleton } from '../../components/skeletons';

export default function TeacherManagement() {
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const [formData, setFormData] = useState({
    email: '', password: 'Teacher123!', firstName: '', lastName: '', phone: ''
  });

  const [assignData, setAssignData] = useState({ classId: '', sectionId: '', subjectId: '' });
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/teachers');
      setTeachers(res.data);
    } catch (err) { console.error(err); }
    finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const res = await api.get('/academic/classes');
      setClasses(res.data);
    } catch (err) { console.error(err); }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
    fetchClasses();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/teachers', formData);
      showSuccess('Teacher added successfully!');
      setShowModal(false);
      fetchTeachers();
    } catch (err) {
      showError(err.response?.data?.error || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  const openAssignModal = (teacher) => {
    setSelectedTeacher(teacher);
    setAssignData({ classId: '', sectionId: '', subjectId: '' });
    setSections([]);
    setSubjects([]);
    setShowAssignModal(true);
  };
  const handleDeactivate = async (id) => {
    const confirm = await showConfirm(
      'Deactivate Teacher',
      'Are you sure you want to deactivate this teacher? Their history will be kept, but they cannot log in.'
    );

    if (confirm.isConfirmed) {
      try {
        await api.delete(`/teachers/${id}`);
        showSuccess('Teacher deactivated successfully.');
        fetchTeachers();
      } catch (err) {
        showError('Failed to deactivate teacher');
      }
    }
  };

  // When a class is selected in the assign modal, fetch its sections & subjects
  const handleClassChangeForAssign = async (e) => {
    const classId = e.target.value;
    setAssignData({ ...assignData, classId, sectionId: '', subjectId: '' });
    if (!classId) { setSections([]); setSubjects([]); return; }

    try {
      const secRes = await api.get(`/academic/classes/${classId}/sections`);
      setSections(secRes.data);
      const subRes = await api.get(`/academic/classes/${classId}/subjects`);
      setSubjects(subRes.data);
    } catch (err) { console.error(err); }
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/teachers/${selectedTeacher._id}/assign`, assignData);
      showSuccess('Class assigned successfully!');
      setShowAssignModal(false);
      fetchTeachers();
    } catch (err) {
      showError(err.response?.data?.error || 'Failed to assign');
    } finally {
      setLoading(false);
    }
  };

  return (<>
    {
      loading?(
      <DashboardLayout>
        <HeadingWithButtonSkeleton/>
        <SearchBarSkeleton />
        <TableSkeleton rows={8} cols={5} />
      </DashboardLayout>
    ): (<DashboardLayout>
    <div className="flex justify-between items-center mb-6">

      <h1 className="text-2xl font-bold text-gray-800">Teacher Management</h1>
      <button onClick={() => setShowModal(true)} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400 font-medium">+ Add Teacher</button>
    </div>
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <input
        type="text"
        placeholder="Search teachers by name, email, or phone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border border-gray-300 p-2 rounded"
      />
    </div>

    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-[760px] w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned Classes</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {(() => {
              const filteredTeachers = teachers.filter(t =>
                `${t.profile?.firstName} ${t.profile?.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
                t.email.toLowerCase().includes(search.toLowerCase()) ||
                (t.profile?.phone || '').includes(search)
              );

              return filteredTeachers.length > 0 ? (
                filteredTeachers.map((t) => (
                  <tr key={t._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{t.profile?.firstName} {t.profile?.lastName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{t.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{t.profile?.phone || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{t.assignments?.length || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => openAssignModal(t)} disabled={loading} className="text-blue-600 hover:underline disabled:text-blue-300 font-medium">Assign</button>
                        <button onClick={() => handleDeactivate(t._id)} disabled={loading} className="text-red-600 hover:underline disabled:text-red-300 font-medium">Deactivate</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">No teachers found.</td></tr>
              );
            })()}
          </tbody>
        </table>
      </div>
    </div>

    {/* Add Teacher Modal */}
    {showModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 w-full max-w-lg">
          <h2 className="text-xl font-bold mb-4">Add New Teacher</h2>
          <form onSubmit={handleSubmit} >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div><label className="block text-sm font-medium mb-1">First Name</label><input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded form-field-hint" data-tooltip="Enter the teacher's first name as it should appear in records." required /></div>
              <div><label className="block text-sm font-medium mb-1">Last Name</label><input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded form-field-hint" data-tooltip="Add the teacher's last name for identification in class rosters." required /></div>
              <div className="sm:col-span-2"><label className="block text-sm font-medium mb-1">Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded form-field-hint" data-tooltip="Use the official email address for login and communication." required /></div>
              <div><label className="block text-sm font-medium mb-1">Phone</label><input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded form-field-hint" data-tooltip="Add a contact number for urgent communication or updates." /></div>
              <div><label className="block text-sm font-medium mb-1">Temp Password</label><input type="text" name="password" value={formData.password} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded form-field-hint" data-tooltip="Set an initial password and ask the teacher to change it after first login." required /></div>
            </div>
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 rounded hover:bg-gray-100">Cancel</button>
              <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400">{loading ? 'Saving...' : 'Add Teacher'}</button>
            </div>
          </form>
        </div>
      </div>
    )}

    {/* Assign Class Modal */}
    {showAssignModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">Assign Class to {selectedTeacher?.profile?.firstName}</h2>
          <form onSubmit={handleAssignSubmit} >
            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Class</label>
                <select name="classId" value={assignData.classId} onChange={handleClassChangeForAssign} className="w-full border border-gray-300 p-2 rounded" required>
                  <option value="">Select Class</option>
                  {classes.length > 0 ? classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>) : <option disabled>No classes found</option>}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Section</label>
                <select name="sectionId" value={assignData.sectionId} onChange={(e) => setAssignData({ ...assignData, sectionId: e.target.value })} className="w-full border border-gray-300 p-2 rounded" required>
                  <option value="">Select Section</option>
                  {sections.length > 0 ? (
                    sections.map(s => <option key={s._id} value={s._id}>{s.name}</option>)
                  ) : (
                    <option disabled>Create sections first</option>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <select name="subjectId" value={assignData.subjectId} onChange={(e) => setAssignData({ ...assignData, subjectId: e.target.value })} className="w-full border border-gray-300 p-2 rounded" required>
                  <option value="">Select Subject</option>
                  {subjects.length > 0 ? (
                    subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)
                  ) : (
                    <option disabled>Create subjects first</option>
                  )}
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={() => setShowAssignModal(false)} className="px-4 py-2 text-gray-600 rounded hover:bg-gray-100">Cancel</button>
              <button type="submit" disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-400">{loading ? 'Saving...' : 'Assign'}</button>
            </div>
          </form>
        </div>
      </div>
    )}
  </DashboardLayout>)
}
  </>);
}