import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import { downloadFile } from '../../utils/downloadFile';
import { showSuccess, showError } from '../../utils/sweetAlert';
import Loader from '../../components/Loader';

export default function DataArchive() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSessions = async () => {
    try {
      const res = await api.get('/academic/sessions');
      setSessions(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchSessions(); }, []);

  const handleExport = async (sessionId, sessionName) => {
    if (window.confirm(`Are you sure? This will download all Attendance, Fees, and Results for ${sessionName} and DELETE them from the database to save space.`)) {
      setLoading(true);
      try {
        await downloadFile(`/archive/export/${sessionId}`, `Archive_${sessionName}.json`);
        showSuccess('Data exported and cleared from DB successfully!');
        fetchSessions(); // Refresh state if needed
      } catch (err) {
        showError('Export failed.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const jsonData = JSON.parse(event.target.result);
        setLoading(true);
        await api.post('/archive/import', jsonData);
        showSuccess('Archive imported successfully!');
      } catch (err) {
        showError('Failed to import archive. Ensure it is a valid SMS JSON file.');
      } finally {
        setLoading(false);
        e.target.value = ''; // Reset input
      }
    };
    reader.readAsText(file);
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Data Archive & Management</h1>
      
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <p className="text-sm text-blue-700">
          <b>How this works:</b> Exporting an academic session will download a JSON file containing all its Attendance, Fees, and Exam Results to your computer. It will then permanently delete that data from the active database to save hosting space. If you ever need to view old data, use the "Import Archive" button to temporarily load it back.
        </p>
      </div>

      {loading && <Loader />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Export & Clear Old Data</h2>
          <div className="space-y-3">
            {sessions.map(s => (
              <div key={s._id} className="flex justify-between items-center p-3 border rounded">
                <div>
                  <p className="font-medium">{s.name}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${s.status === 'current' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {s.status}
                  </span>
                </div>
                <button 
                  onClick={() => handleExport(s._id, s.name)}
                  disabled={s.status === 'current'}
                  className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:bg-gray-300"
                >
                  Export & Delete
                </button>
              </div>
            ))}
            {sessions.length === 0 && <p className="text-sm text-gray-500">No sessions found.</p>}
          </div>
        </div>

        {/* Import Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Import Archived Data</h2>
          <p className="text-sm text-gray-500 mb-4">Select a previously downloaded JSON file to restore old data back into the system.</p>
          <input 
            type="file" 
            accept=".json" 
            onChange={handleImport} 
            className="block w-full text-sm text-gray-500 file:ml-0 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}