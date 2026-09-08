import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import DashboardLayout from '../components/DashboardLayout';
import api from '../services/api';

export default function ParentDashboard() {
  const { user } = useSelector((state) => state.auth);
  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState('');
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Fetch children on mount
  useEffect(() => {
    const fetchChildren = async () => {
      setLoading(true);
      try {
        const res = await api.get('/students/my-children');
        setChildren(res.data);
        if (res.data.length > 0) {
          setSelectedChildId(res.data[0]._id); // Auto-select first child
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchChildren();
  }, []);

  // 2. Fetch summary when selectedChildId changes
  useEffect(() => {
    if (!selectedChildId) return;
    
    const fetchSummary = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/reports/student-summary/${selectedChildId}`);
        setSummary(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [selectedChildId]);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Parent Dashboard</h1>

      {/* Child Selector */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 flex items-center space-x-4">
        <label className="font-medium text-gray-700">Viewing Child:</label>
        <select 
          value={selectedChildId} 
          onChange={(e) => setSelectedChildId(e.target.value)}
          className="border p-2 rounded flex-1"
        >
          {children.length>0? children.map((c) => (
            <option key={c._id} value={c._id}>
              {c.firstName} {c.lastName} ({c.classId?.name || 'No Class'})
            </option>
          )): <option>No children available</option>}
        </select>
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Loading child data...</div>
      ) : summary ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
            <h3 className="text-gray-500 text-sm">Student Profile</h3>
            <p className="text-xl font-bold text-gray-800 mt-2">{summary.student.firstName} {summary.student.lastName}</p>
            <p className="text-sm text-gray-600 mt-1">Roll No: {summary.student.rollNumber}</p>
            <p className="text-sm text-gray-600">Class: {summary.student.classId?.name || 'N/A'}</p>
          </div>

          {/* Attendance Card */}
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
            <h3 className="text-gray-500 text-sm">Overall Attendance</h3>
            <p className="text-3xl font-bold text-gray-800 mt-2">{summary.attendance.percentage}%</p>
            <p className="text-xs text-gray-500 mt-1">
              Present: {summary.attendance.presentDays} / {summary.attendance.totalDays} days
            </p>
          </div>

          {/* Fee Card */}
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
            <h3 className="text-gray-500 text-sm">Latest Fee Status</h3>
            {summary.latestFee ? (
              <>
                <p className="text-xl font-bold text-gray-800 mt-2">{summary.latestFee.status}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Month: {summary.latestFee.month} | Paid: Rs {summary.latestFee.amountPaid} / {summary.latestFee.totalAmount}
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-500 mt-2">No fee records</p>
            )}
          </div>

          {/* Latest Result Card */}
          <div className="bg-white p-6 rounded-lg shadow col-span-3">
            <h3 className="text-gray-500 text-sm mb-2">Latest Exam Result</h3>
            {summary.latestResult ? (
              <div>
                <p className="text-lg font-bold text-gray-800">{summary.latestResult.examId?.name || 'Exam'}</p>
                <p className="text-sm text-gray-600">
                  Percentage: {summary.latestResult.percentage}% | Grade: {summary.latestResult.grade}
                </p>
                <div className="mt-4 border-t pt-4">
                  <h4 className="text-sm font-medium mb-2">Subject Breakdown:</h4>
                  <ul className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {summary.latestResult.marks.map((m, i) => (
                      <li key={i} className="text-sm bg-gray-50 p-2 rounded">
                        {m.subjectId?.name}: <span className="font-medium">{m.obtainedMarks}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No results published yet.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
          No children linked to your account. Please contact the school administration.
        </div>
      )}
    </DashboardLayout>
  );
}