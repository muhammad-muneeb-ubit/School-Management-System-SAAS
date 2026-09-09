import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import api from '../services/api';
import { showSuccess, showError } from '../utils/sweetAlert';
import { downloadFile } from '../utils/downloadFile';
import { DashboardHeaderSkeleton, TableSkeleton, AttendanceFilterSkeleton } from '../components/skeletons';

export default function Attendance() {
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);

  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [loading, setLoading] = useState(false);
  const [resultLoading, setResultLoading] = useState(false);

  // Fetch Classes on mount
  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      try {
        const res = await api.get('/academic/classes');
        setClasses(res.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchClasses();
  }, []);

  // Fetch Sections when Class changes
  const handleClassChange = async (e) => {
    const classId = e.target.value;
    setSelectedClass(classId);
    setSelectedSection('');
    setStudents([]);
    setAttendanceRecords({});

    if (!classId) { setSections([]); return; }
    try {
      const res = await api.get(`/academic/classes/${classId}/sections`);
      setSections(res.data);
    } catch (err) { console.error(err); }
  };

  // Fetch Students & Existing Attendance when Section/Date changes
  const fetchAttendanceData = async () => {
    setResultLoading(true);
    if (!selectedClass || !selectedSection || !date) return;
    try {
      // 1. Fetch Students (Put sectionId back in to keep it strict)
      const stuRes = await api.get(`/students?classId=${selectedClass}&sectionId=${selectedSection}`);
      setStudents(stuRes.data);

      // 2. Fetch Existing Attendance for this date
      const attRes = await api.get(`/attendance?classId=${selectedClass}&sectionId=${selectedSection}&date=${date}`);

      // 3. Initialize attendance state
      const initRecords = {};
      if (attRes.data && attRes.data.records) {
        attRes.data.records.forEach(r => {
          initRecords[r.studentId._id] = r.status;
        });
      } else {
        // Default everyone to 'Present' if no attendance exists yet
        stuRes.data.forEach(s => {
          initRecords[s._id] = 'Present';
        });
      }
      setAttendanceRecords(initRecords);
    } catch (err) {
      console.error(err);
    } finally {
      setResultLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSection && date) fetchAttendanceData();
  }, [selectedSection, date]);

  const toggleAttendance = (studentId, status) => {
    setAttendanceRecords({ ...attendanceRecords, [studentId]: status });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const records = Object.keys(attendanceRecords).map(studentId => ({
        studentId,
        status: attendanceRecords[studentId]
      }));

      await api.post('/attendance', {
        classId: selectedClass,
        sectionId: selectedSection,
        date: date,
        records: records
      });

      showSuccess('Attendance saved successfully!');
    } catch (err) {
      showError(err.response?.data?.error || 'Failed to save attendance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      {loading ? (
        <>
          <DashboardHeaderSkeleton />
          <AttendanceFilterSkeleton />
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Mark Attendance</h1>
          {/* Filters */}
          <div className="bg-white p-4 rounded-lg shadow mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Class</label>
              <select value={selectedClass} onChange={handleClassChange} className="w-full border border-gray-300 p-2 rounded">
                <option value="">Select Class</option>
                {/* {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)} */}
                {classes.length > 0 ? (
                  classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)
                ) : (
                  <option disabled>Create classes first in Academic Management</option>
                )}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Section</label>
              <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} className="w-full border border-gray-300 p-2 rounded" disabled={!selectedClass}>
                <option value="">Select Section</option>
                {sections.length > 0 ? (
                  sections.map(s => <option key={s._id} value={s._id}>{s.name}</option>)
                ) : (
                  <option disabled>Create sections first</option>
                )}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full border border-gray-300 p-2 rounded" />
            </div>
            <div className="flex items-end">
              <button onClick={fetchAttendanceData} className="w-full bg-gray-200 text-gray-700 p-2 rounded hover:bg-gray-300 font-medium">
                Load Students
              </button>
            </div>
          </div>
        </>
      )}


      {/* Student List & Toggles */}
      {resultLoading ? <TableSkeleton /> : (
        students.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">Students ({students.length})</h2>
              <div className="flex space-x-2">
                <button onClick={handleSave} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium">
                  {loading ? 'Saving...' : 'Save Attendance'}
                </button>
                <button
                  onClick={() => downloadFile(`/pdf/attendance-sheet?classId=${selectedClass}&sectionId=${selectedSection}&date=${date}`, 'Attendance_Sheet.pdf')}
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 font-medium ml-2"
                >
                  Download Sheet PDF
                </button>
              </div>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((s) => (
                  <tr key={s._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{s.rollNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{s.firstName} {s.lastName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toggleAttendance(s._id, 'Present')}
                          className={`px-3 py-1 rounded-full font-medium ${attendanceRecords[s._id] === 'Present' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'}`}
                        >
                          Present
                        </button>
                        <button
                          onClick={() => toggleAttendance(s._id, 'Absent')}
                          className={`px-3 py-1 rounded-full font-medium ${attendanceRecords[s._id] === 'Absent' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600'}`}
                        >
                          Absent
                        </button>
                        <button
                          onClick={() => toggleAttendance(s._id, 'Leave')}
                          className={`px-3 py-1 rounded-full font-medium ${attendanceRecords[s._id] === 'Leave' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-600'}`}
                        >
                          Leave
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          selectedSection && <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">No students found in this section.</div>
        )
      )}

    </DashboardLayout>
  );
}