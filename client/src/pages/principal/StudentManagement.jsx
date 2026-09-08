import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import Loader from '../../components/Loader';
import { showSuccess, showError } from '../../utils/sweetAlert';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import Tooltip from '../../components/Tooltip';
import { downloadFile } from '../../utils/downloadFile';


export default function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]); // New state for sections
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
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
      showSuccess('Student admitted successfully!');
      setShowModal(false);
      fetchStudents();
    } catch (err) {
      showError(err.response?.data?.error || 'Failed to admit student');
    } finally {
      setLoading(false);
    }
  };
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = new FormData();
    data.append('file', file);

    setLoading(true);
    try {
      const res = await api.post('/students/bulk-import', data);
      showSuccess(res.data.message);
      fetchStudents();
    } catch (err) {
      showError('Bulk import failed. Ensure CSV headers are correct.');
    } finally {
      setLoading(false);
    }
  };
  // Filter students based on search
  const filteredStudents = students.filter(s =>
    s.firstName?.toLowerCase().includes(search.toLowerCase()) ||
    s.rollNumber?.includes(search) ||
    s.parentId?.email?.toLowerCase().includes(search.toLowerCase())
  );
  const showCsvHelp = () => {
    Swal.fire({
      title: 'CSV File Format Guide',
      html: `
        <div style="text-align: left; font-size: 14px;">
          <p>Your CSV file <b>must</b> have the following headers exactly as written:</p>
          <pre style="background: #f3f4f6; padding: 10px; border-radius: 5px; font-size: 12px; overflow-x: auto;">
firstName,lastName,rollNumber,gender,className,sectionName,parentEmail,parentFirstName,parentPhone
          </pre>
          <ul style="margin-top: 10px; font-size: 13px;">
            <li><b>className</b> and <b>sectionName</b> must match exactly what you created in Academic Management (e.g., "Grade 5" and "A").</li>
            <li><b>lastName</b> is optional.</li>
            <li><b>gender</b> must be 'Male', 'Female', or 'Other'.</li>
            <li><b>parentEmail</b> must be unique. If it exists, the student will be linked to that existing parent.</li>
          </ul>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Got it'
    });
  };
  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/students/${id}/status`, { status });
      showSuccess(`Student marked as ${status}`);
      fetchStudents();
    } catch (err) {
      showError('Failed to update status');
    }
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Student Management</h1>
        <div className="flex space-x-2">
          <button onClick={showCsvHelp} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 font-medium flex items-center">
            CSV Help
          </button>
          <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" id="csv-upload" />
          <label htmlFor="csv-upload" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-medium cursor-pointer">
            Bulk Import CSV
          </label>
          <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium">
            + Admit Student
          </button>
          <button
            onClick={() => downloadFile(`/pdf/students`, 'All_Students_List.pdf')}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 font-medium"
          >
            Download List PDF
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <input
          type="text"
          placeholder="Search by Name, Roll No, or Parent Email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parent Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status/ Action</th>

            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan="4"><Loader /></td></tr>
            ) : filteredStudents.length > 0 ? (
              filteredStudents.map((s) => (
                // Inside the <tbody> map function
                <tr key={s._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{s.rollNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:underline">
                    <Link to={`/principal/students/${s._id}`}>{s.firstName} {s.lastName}</Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{s.classId?.name || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{s.parentId?.email || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {s.status === 'Active' ? (
                      <button
                        onClick={() => handleStatusChange(s._id, 'Left')}
                        className="text-red-600 hover:underline font-medium"
                      >
                        Mark as Left
                      </button>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">{s.status}</span>
                        <button
                          onClick={() => handleStatusChange(s._id, 'Active')}
                          className="text-green-600 hover:underline text-xs font-medium"
                        >
                          Re-activate
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">No students found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Admit New Student</h2>
            <form onSubmit={handleSubmit} >

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">First Name</label>
                  <Tooltip text="Enter first name (e.g., Muhammad)">
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full border p-2 rounded " required />
                  </Tooltip>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Last Name</label>
                  <Tooltip text="Enter last name (e.g., Ahmed)">
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full border p-2 rounded " />
                  </Tooltip>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Roll No</label>
                  <Tooltip text="Enter a unique roll number (e.g., 101)">
                    <input type="text" name="rollNumber" value={formData.rollNumber} onChange={handleChange} className="w-full border p-2 rounded " required />
                  </Tooltip>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} className="w-full border p-2 rounded ">
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Class</label>
                  <select name="classId" value={formData.classId} onChange={handleClassChange} className="w-full border p-2 rounded " required>
                    <option value="">Select Class</option>
                    {classes.length > 0 ? classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>) : <option disabled>No classes found</option>}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Section</label>
                  <select name="sectionId" value={formData.sectionId} onChange={handleChange} className="w-full border p-2 rounded " required>
                    <option value="">Select Section</option>
                    {sections.length > 0 ? sections.map(s => <option key={s._id} value={s._id}>{s.name}</option>) : <option disabled>Create sections first in Academic Management</option>}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Parent Email</label>
                  <Tooltip text="Enter parent's email (e.g.,ahmed@gmail.com)">
                    <input type="email" name="parentEmail" value={formData.parentEmail} onChange={handleChange} className="w-full border p-2 rounded " required />
                  </Tooltip>
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