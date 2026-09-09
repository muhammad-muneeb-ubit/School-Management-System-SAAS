import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import { showSuccess, showError } from '../../utils/sweetAlert';
import Tooltip from '../../components/Tooltip';

export default function TeacherHomework() {
  const [homeworks, setHomeworks] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '', description: '', dueDate: '', classId: '', sectionId: '', subjectId: ''
  });

  const fetchHomeworks = async () => {
    try {
      const res = await api.get('/communication/homework');
      setHomeworks(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchMyAssignments = async () => {
    try {
      const res = await api.get('/teachers/my-assignments');
      setAssignments(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchHomeworks();
    fetchMyAssignments();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/communication/homework', formData);
      showSuccess('Homework posted!');
      setShowModal(false);
      fetchHomeworks();
    } catch (err) {
      showError(err.response?.data?.error || 'Failed to post homework');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Homework & Assignments</h1>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium">
          + Post Homework
        </button>
      </div>

      <div className="space-y-4">
        {homeworks.length > 0 ? (
          homeworks.map((hw) => (
            <div key={hw._id} className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-800">{hw.title}</h3>
                <span className="text-xs text-red-500 font-medium">Due: {new Date(hw.dueDate).toLocaleDateString()}</span>
              </div>
              <p className="text-gray-600 text-sm mb-2">{hw.description}</p>
              <p className="text-xs text-gray-400">
                Class: {hw.classId?.name} | Subject: {hw.subjectId?.name}
              </p>
            </div>
          ))
        ) : (
          <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
            No homework posted yet.
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Post New Homework</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Select Assignment</label>
                  <select 
                    name="assignmentIndex" 
                    onChange={(e) => {
                      const a = assignments[e.target.value];
                      setFormData({ ...formData, classId: a.classId, sectionId: a.sectionId, subjectId: a.subjectId });
                    }} 
                    className="w-full border border-gray-300 p-2 rounded"
                    required
                  >
                    <option value="">Select Class/Subject</option>
                    {assignments.length>0? assignments.map((a, i) => (
                      <option key={i} value={i}>{a.classId?.name} - {a.subjectId?.name}</option>
                    )) : (
                      <option disabled>Create assignments first</option>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <Tooltip text="Enter the title of the new homework.">
                    <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded" required />
                  </Tooltip>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <Tooltip text="Provide a brief description or instructions for the homework.">
                    <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full border border-gray-300 p-2 rounded" required></textarea>
                  </Tooltip>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Due Date</label>
                  <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded" required />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 rounded hover:bg-gray-100">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400">
                  {loading ? 'Posting...' : 'Post Homework'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}