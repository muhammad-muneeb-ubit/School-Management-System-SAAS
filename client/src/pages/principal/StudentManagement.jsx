import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';

export default function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]); // New state for sections
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', rollNumber: '', gender: 'Male', classId: '', sectionId: '', parentEmail: ''
  });

  const fetchStudents = async () => {
    try {
      const res = await api.get('/students');
      setStudents(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchClasses = async () => {
    try {
      const res = await api.get('/academic/classes');
      setClasses(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchClasses();
    fetchStudents();
  }, []);

  // Fetch sections when a class is selected in the form
  const handleClassChange = async (e) => {
    const classId = e.target.value;
    setFormData({ ...formData, classId, sectionId: '' });
    
    if (!classId) { setSections([]); return; }
    try {
      const res = await api.get(`/academic/classes/${classId}/sections`);
      setSections(res.data);
    } catch (err) { console.error(err); }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/students', formData);
      alert('Student Admitted Successfully!');
      setShowModal(false);
      fetchStudents();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to admit student');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Student Management</h1>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium">+ Admit Student</button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parent Email</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.length > 0 ? (
              students.map((s) => (
                <tr key={s._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{s.rollNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{s.firstName} {s.lastName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{s.classId?.name || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{s.parentId?.email || 'N/A'}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">No students found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Admit New Student</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">First Name</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full border p-2 rounded" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Last Name</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full border p-2 rounded" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Roll No</label>
                  <input type="text" name="rollNumber" value={formData.rollNumber} onChange={handleChange} className="w-full border p-2 rounded" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} className="w-full border p-2 rounded">
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Class</label>
                  <select name="classId" value={formData.classId} onChange={handleClassChange} className="w-full border p-2 rounded" required>
                    <option value="">Select Class</option>
                    {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Section</label>
                  <select name="sectionId" value={formData.sectionId} onChange={handleChange} className="w-full border p-2 rounded" required>
                    <option value="">Select Section</option>
                    {sections.length > 0 ? (
                      sections.map(s => <option key={s._id} value={s._id}>{s.name}</option>)
                    ) : (
                      <option disabled>Create sections first</option>
                    )}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Parent Email</label>
                  <input type="email" name="parentEmail" value={formData.parentEmail} onChange={handleChange} className="w-full border p-2 rounded" required />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 rounded hover:bg-gray-100">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400">{loading ? 'Saving...' : 'Save Student'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}