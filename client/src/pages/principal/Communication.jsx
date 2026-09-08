import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import { showSuccess, showError } from '../../utils/sweetAlert';

export default function Communication() {
  const [announcements, setAnnouncements] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    audience: 'School',
    classId: ''
  });

  const fetchAnnouncements = async () => {
    try {
      const res = await api.get('/communication/announcements');
      setAnnouncements(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchClasses = async () => {
    try {
      const res = await api.get('/academic/classes');
      setClasses(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchAnnouncements();
    fetchClasses();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // If audience is School, don't send classId
      const payload = formData.audience === 'School' ? { ...formData, classId: '' } : formData;
      await api.post('/communication/announcements', payload);
      showSuccess('Announcement posted!');
      setShowModal(false);
      fetchAnnouncements();
    } catch (err) {
      showError(err.response?.data?.error || 'Failed to post announcement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Communication</h1>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium">
          + New Announcement
        </button>
      </div>

      <div className="space-y-4">
        {announcements.length > 0 ? (
          announcements.map((a) => (
            <div key={a._id} className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-800">{a.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  a.audience === 'School' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                }`}>
                  {a.audience === 'School' ? 'School-Wide' : `Class Specific`}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-2">{a.message}</p>
              <p className="text-xs text-gray-400">
                Posted on {new Date(a.createdAt).toLocaleDateString()} at {new Date(a.createdAt).toLocaleTimeString()}
              </p>
            </div>
          ))
        ) : (
          <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
            No announcements yet. Click "New Announcement" to create one.
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Post Announcement</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <Tooltip text="Enter a title for your announcement.">
                    <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full border p-2 rounded" required />
                  </Tooltip>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Message</label>
                  <Tooltip text="Enter the message for your announcement.">
                    <textarea name="message" value={formData.message} onChange={handleChange} rows="4" className="w-full border p-2 rounded" required></textarea>
                  </Tooltip>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Audience</label>
                    <select name="audience" value={formData.audience} onChange={handleChange} className="w-full border p-2 rounded">
                      <option value="School">Entire School</option>
                      <option value="Class">Specific Class</option>
                    </select>
                  </div>
                  {formData.audience === 'Class' && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Select Class</label>
                      <select name="classId" value={formData.classId} onChange={handleChange} className="w-full border p-2 rounded" required>
                        <option value="">Select Class</option>
                        { classes.length > 0 ? classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>) : <option disabled>No classes found</option> }
                      </select>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 rounded hover:bg-gray-100">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400">
                  {loading ? 'Posting...' : 'Post Announcement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}