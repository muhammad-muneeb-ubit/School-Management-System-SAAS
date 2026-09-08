import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';

export default function ParentAttendance() {
  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const res = await api.get('/students/my-children');
        setChildren(res.data);
        if (res.data.length > 0) setSelectedChildId(res.data[0]._id);
      } catch (err) { console.error(err); }
    };
    fetchChildren();
  }, []);

  useEffect(() => {
    if (!selectedChildId) return;
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/attendance/my-history?studentId=${selectedChildId}`);
        setHistory(res.data);
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchHistory();
  }, [selectedChildId]);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Attendance History</h1>

      <div className="bg-white p-4 rounded-lg shadow mb-6 flex items-center space-x-4">
        <label className="font-medium text-gray-700">Viewing Child:</label>
        <select value={selectedChildId} onChange={(e) => setSelectedChildId(e.target.value)} className="border p-2 rounded flex-1">
          { children.length > 0 ? children.map((c) => (
            <option key={c._id} value={c._id}>{c.firstName} {c.lastName} ({c.classId?.name || 'N/A'})</option>
          )) : <option disabled>No children found</option> }
        </select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {!loading && history.length > 0 ? (
              history.map((h) => (
                <tr key={h._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(h.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      h.records[0].status === 'Present' ? 'bg-green-100 text-green-700' : 
                      h.records[0].status === 'Absent' ? 'bg-red-100 text-red-700' : 
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {h.records[0].status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="px-6 py-4 text-center text-sm text-gray-500">
                  {loading ? 'Loading...' : 'No attendance records found.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}