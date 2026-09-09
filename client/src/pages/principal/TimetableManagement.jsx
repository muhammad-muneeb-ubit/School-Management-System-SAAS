import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import { showSuccess, showError } from '../../utils/sweetAlert';
import Loader from '../../components/Loader';
import { DashboardHeaderSkeleton, ClassSectionFilterSkeleton, TimetableSkeleton } from '../../components/skeletons';

export default function TimetableManagement() {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);

  // Principal states
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');

  // Parent states
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState('');

  const [timetable, setTimetable] = useState(null);
  const [period, setPeriod] = useState({ day: 'Monday', startTime: '', endTime: '', subjectId: '', teacherId: '' });

  // Fetch Initial Data based on Role
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        if (user?.role === 'Parent') {
          const res = await api.get('/students/my-children');
          setChildren(res.data);
          if (res.data.length > 0) {
            // Auto-select first child
            const firstChild = res.data[0];
            setSelectedChild(firstChild._id);
            setSelectedClass(firstChild.classId?._id);
            setSelectedSection(firstChild.sectionId?._id);
          }
        } else if (user?.role === 'Principal') {
          setLoading(true);
          const clsRes = await api.get('/academic/classes');
          setClasses(clsRes.data);
          const tchRes = await api.get('/teachers');
          setTeachers(tchRes.data);
        } else if (user?.role === 'Teacher') {
          setLoading(true);
          const assignRes = await api.get('/teachers/my-assignments');
          if (assignRes.data.length > 0) {
            const firstAssign = assignRes.data[0];
            setSelectedClass(firstAssign.classId?._id);
            setSelectedSection(firstAssign.sectionId?._id);
          }
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchInitialData();
  }, [user]);

  // Fetch Timetable whenever selectedClass or selectedSection changes
  useEffect(() => {
    const fetchTimetable = async () => {
      if (!selectedClass || !selectedSection) return;
      setLoading(true);
      try {
        const res = await api.get(`/academic/timetable?classId=${selectedClass}&sectionId=${selectedSection}`);
        setTimetable(res.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchTimetable();
  }, [selectedClass, selectedSection]);

  // Handle Parent Child Selection
  const handleChildChange = (childId) => {
    const child = children.find(c => c._id === childId);
    setSelectedChild(childId);
    if (child) {
      setSelectedClass(child.classId?._id);
      setSelectedSection(child.sectionId?._id);
    }
  };

  // Handle Principal Class Change (fetch sections & subjects)
  const handleClassChange = async (e) => {
    const classId = e.target.value;
    setSelectedClass(classId);
    setSelectedSection('');
    if (!classId) return;
    try {
      setLoading(true);
      const secRes = await api.get(`/academic/classes/${classId}/sections`);
      setSections(secRes.data);
      const subRes = await api.get(`/academic/classes/${classId}/subjects`);
      setSubjects(subRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleAddPeriod = async (e) => {
    e.preventDefault();
    if (!selectedClass || !selectedSection) return showError('Please select a class and section first.');
    setLoading(true);
    try {
      let updatedSchedule = (timetable && timetable.schedule) ? [...timetable.schedule] : [];
      const dayIndex = updatedSchedule.findIndex(d => d.day === period.day);

      if (dayIndex > -1) {
        updatedSchedule[dayIndex].periods.push({
          startTime: period.startTime, endTime: period.endTime,
          subjectId: period.subjectId, teacherId: period.teacherId
        });
      } else {
        updatedSchedule.push({
          day: period.day,
          periods: [{ startTime: period.startTime, endTime: period.endTime, subjectId: period.subjectId, teacherId: period.teacherId }]
        });
      }
      setLoading(true);
      await api.put('/academic/timetable', { classId: selectedClass, sectionId: selectedSection, schedule: updatedSchedule });
      showSuccess('Period added successfully!');
      setPeriod({ ...period, startTime: '', endTime: '' });
      // Refetch timetable
      const res = await api.get(`/academic/timetable?classId=${selectedClass}&sectionId=${selectedSection}`);
      setTimetable(res.data);
    } catch (err) {
      showError(err.response?.data?.error || 'Failed to add period');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      {/* <h1 className="text-2xl font-bold text-gray-800 mb-6">Timetable Management</h1> */}
      {loading ? (
        <DashboardHeaderSkeleton />
      ) : (
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Timetable Management
        </h1>
      )}

      {/* Dynamic Filters based on Role */}
      {loading ? (
        <>
        <ClassSectionFilterSkeleton />
        <TimetableSkeleton/>
        </>
      ) : (user?.role === 'Parent' ? (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <label className="block text-sm font-medium mb-1">Select Child</label>
          <select value={selectedChild} onChange={(e) => handleChildChange(e.target.value)} className="w-full border p-2 rounded">
            {children.length > 0 ? children.map(c => <option key={c._id} value={c._id}>{c.firstName} {c.lastName} ({c.classId?.name || 'N/A'})</option>) : <option disabled>No children found</option>}
          </select>
        </div>
      ) : (
        <div className="bg-white p-4 rounded-lg shadow mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Class</label>
            <select value={selectedClass} onChange={handleClassChange} className="w-full border p-2 rounded">
              <option value="">Select Class</option>
              {classes.length > 0 ? classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>) : <option disabled>No classes found</option>}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Section</label>
            <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} className="w-full border p-2 rounded" disabled={!selectedClass}>
              {sections.length > 0 ? (
                <>
                  <option value="">Select Section</option>
                  {sections.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                </>
              ) : (
                <option disabled>Create sections first in Academic Management</option>
              )}
            </select>
          </div>
        </div>
      ))}

      {/* Main Grid */}
      {!loading && (<div className={`grid grid-cols-1 lg:grid-cols-${user?.role === 'Principal' ? '3' : '1'} gap-6`}>

        {/* Add Period Form (Principal Only) */}
        {user?.role === 'Principal' && (
          <div className="bg-white p-4 rounded-lg shadow h-fit">
            <h2 className="text-lg font-semibold mb-4">Add New Period</h2>
            <form onSubmit={handleAddPeriod} className="space-y-3">
              <select value={period.day} onChange={(e) => setPeriod({ ...period, day: e.target.value })} className="w-full border p-2 rounded" required>
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <div className="flex gap-2">
                <input type="time" value={period.startTime} onChange={(e) => setPeriod({ ...period, startTime: e.target.value })} className="w-full border p-2 rounded" required />
                <input type="time" value={period.endTime} onChange={(e) => setPeriod({ ...period, endTime: e.target.value })} className="w-full border p-2 rounded" required />
              </div>
              <select value={period.subjectId} onChange={(e) => setPeriod({ ...period, subjectId: e.target.value })} className="w-full border p-2 rounded" required>
                <option value="">Select Subject</option>
                {subjects.length > 0 ? subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>) : <option disabled>Create subjects first</option>}
              </select>
              <select value={period.teacherId} onChange={(e) => setPeriod({ ...period, teacherId: e.target.value })} className="w-full border p-2 rounded" required>
                <option value="">Select Teacher</option>
                {teachers.length > 0 ? teachers.map(t => <option key={t._id} value={t._id}>{t.profile?.firstName} {t.profile?.lastName}</option>) : <option disabled>No teachers found</option>}
              </select>
              <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400">
                {loading ? 'Saving...' : '+ Add Period'}
              </button>
            </form>
          </div>
        )}

        {/* Timetable Display (For Everyone) */}
        <div className={`bg-white p-4 rounded-lg shadow ${user?.role === 'Principal' ? 'lg:col-span-2' : 'lg:col-span-1'}`}>
          <h2 className="text-lg font-semibold mb-4">Current Timetable</h2>
          {loading ? <Loader /> : timetable && timetable.schedule ? (
            <div className="space-y-4">
              {timetable.schedule.map((day, i) => (
                <div key={i} className="border-l-4 border-blue-500 pl-3">
                  <h3 className="font-bold text-gray-700">{day.day}</h3>
                  <div className="mt-2 space-y-1">
                    {/* Added safe array check and optional chaining */}
                    {Array.isArray(day.periods) && day.periods.length > 0 ? (
                      day.periods.map((p, j) => (
                        <div key={j} className="text-sm bg-gray-50 p-2 rounded flex justify-between items-center">
                          <span>{p?.startTime || 'N/A'} - {p?.endTime || 'N/A'}</span>
                          <span className="font-medium">{p?.subjectId?.name || 'N/A'}</span>
                          <span className="text-gray-500">{p?.teacherId?.profile?.firstName} {p?.teacherId?.profile?.lastName || ''}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400 italic">No periods added for this day.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No timetable created yet.</p>
          )}
        </div>
      </div>)}
    </DashboardLayout>
  );
}