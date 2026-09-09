import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import { showSuccess, showError, showConfirm } from '../../utils/sweetAlert';
import Loader from '../../components/Loader';
import { PromotionFormSkeleton, DashboardHeaderSkeleton, TableSkeleton } from '../../components/skeletons';
export default function PromotionManagement() {
  const [loading, setLoading] = useState(false);
  const [resultLoading, setResultLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  // Filters & Execution data
  const [selectedClass, setSelectedClass] = useState('');
  const [targetSessionId, setTargetSessionId] = useState('');
  const [promotedToClassId, setPromotedToClassId] = useState('');
  const [retainedToClassId, setRetainedToClassId] = useState('');

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const classRes = await api.get('/academic/classes');
      setClasses(classRes.data);

      // We need to fetch sessions. Let's assume we have a getSessions endpoint (we will add it if missing)
      const sessRes = await api.get('/academic/sessions');
      setSessions(sessRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchInitialData(); }, []);

  const fetchRecommendations = async () => {

    if (!selectedClass) return;
    setResultLoading(true);
    try {
      const res = await api.get(`/promotion/recommendations?classId=${selectedClass}`);
      setRecommendations(res.data);
    } catch (err) { console.error(err); }
    finally { setResultLoading(false); }
  };

  useEffect(() => {
    if (selectedClass) fetchRecommendations();
  }, [selectedClass]);

  const handleExecute = async () => {
    if (!targetSessionId || !promotedToClassId || !retainedToClassId) {
      return showError("Please select the target session, promoted class, and retained class.");
    }

    const confirm = await showConfirm('Execute Promotion', 'Are you sure? This will move students to the next session and archive the current one.');
    if (confirm.isConfirmed) {
      try {
        setLoading(true);
        const res = await api.post('/promotion/execute', { targetSessionId, promotedToClassId, retainedToClassId });
        showSuccess(res.data.message);
        fetchRecommendations();
      } catch (err) {
        showError(err.response?.data?.error || 'Failed to execute promotion');
      } finally { setLoading(false); }
    }
  };

  return (
    <DashboardLayout>
      {loading ? (<>
        <DashboardHeaderSkeleton text={true} />
        <PromotionFormSkeleton />
      </>) : (<>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Year-End Promotion</h1>
        <p className="text-sm text-gray-500 mb-6" tooltip="Review teacher recommendations and move students to the next academic year.">
          Review teacher recommendations and move students to the next academic year.
        </p>

        <div className="bg-white p-4 rounded-lg shadow mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-1">Select Current Class</label>
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="w-full border border-gray-300 p-2 rounded">
              <option value="">Select Class</option>
              {classes.length > 0 ? classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>) : <option disabled>No classes found</option>}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Target Session</label>
            <select value={targetSessionId} onChange={(e) => setTargetSessionId(e.target.value)} className="w-full border border-gray-300 p-2 rounded">
              <option value="">Select New Session</option>
              {sessions.length > 0 ? sessions.map(s => <option key={s._id} value={s._id}>{s.name}</option>) : <option disabled>No sessions found</option>}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Promote To (Next Class)</label>
            <select value={promotedToClassId} onChange={(e) => setPromotedToClassId(e.target.value)} className="w-full border border-gray-300 p-2 rounded">
              <option value="">Select Class</option>
              {classes.length > 0 ? classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>) : <option disabled>No classes found</option>}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Retain To (Same Class)</label>
            <select value={retainedToClassId} onChange={(e) => setRetainedToClassId(e.target.value)} className="w-full border border-gray-300 p-2 rounded">
              <option value="">Select Class</option>
              {classes.length > 0 ? classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>) : <option disabled>No classes found</option>}
            </select>
          </div>
          <div className="col-span-4">
            <button onClick={handleExecute} disabled={loading || !selectedClass} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400">
              Execute Promotion
            </button>
          </div>
        </div></>)}

     {resultLoading ? <TableSkeleton rows={3} />:( <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teacher</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recommendation</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? <tr><td colSpan="4"><Loader /></td></tr> :
              recommendations.length > 0 ? (
                recommendations.map(r => (
                  <tr key={r._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{r.studentId?.firstName} {r.studentId?.lastName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{r.studentId?.rollNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{r.teacherId?.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${r.recommendation === 'Pass' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {r.recommendation}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">Select a class to view recommendations.</td></tr>
              )}
          </tbody>
        </table>
      </div>)}
    </DashboardLayout>
  );
}