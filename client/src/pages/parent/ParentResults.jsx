import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import { downloadFile } from '../../utils/downloadFile';

export default function ParentResults() {
  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState('');
  const [results, setResults] = useState([]);
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
    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/exams/student-results/${selectedChildId}`);
        setResults(res.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchResults();
  }, [selectedChildId]);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Exam Results</h1>

      <div className="bg-white p-4 rounded-lg shadow mb-6 flex items-center space-x-4">
        <label className="font-medium text-gray-700">Viewing Child:</label>
        <select value={selectedChildId} onChange={(e) => setSelectedChildId(e.target.value)} className="border p-2 rounded flex-1">
          {children.length > 0 ? children.map((c) => (
            <option key={c._id} value={c._id}>{c.firstName} {c.lastName} ({c.classId?.name || 'N/A'})</option>
          )) : <option disabled>No children found</option>}
        </select>
      </div>

      <div className="space-y-6">
        {!loading && results.length > 0 ? (
          results.map((r) => (
            <div key={r._id} className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">{r.examId?.name || 'Exam'}</h3>
                <button
                  onClick={() => downloadFile(`/pdf/report-card/${r.examId?._id}/${selectedChildId}`, `ReportCard_${r.examId?.name}.pdf`)}
                  className="text-purple-600 hover:underline font-medium text-sm flex items-center space-x-1"
                >
                  Download PDF
                </button>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-800">{r.percentage}%</p>
                  <p className="text-sm text-gray-500">Grade: {r.grade}</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium mb-2">Subject Breakdown:</h4>
                <ul className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {r.marks.map((m, i) => (
                    <li key={i} className="text-sm bg-gray-50 p-2 rounded flex justify-between">
                      <span>{m.subjectId?.name}</span>
                      <span className="font-medium">{m.obtainedMarks}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
            {loading ? 'Loading...' : 'No published results found for this child.'}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}