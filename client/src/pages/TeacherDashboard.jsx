import DashboardLayout from '../components/DashboardLayout';
import { useEffect, useState } from 'react';
import api from '../services/api';
import { DashboardHeaderSkeleton, ClassAssignmentsSkeleton, AssignedClassesSkeleton } from '../components/skeletons';

export default function TeacherDashboard() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchAssignments = async () => {
      try {
        const res = await api.get('/teachers/my-assignments');
        setAssignments(res.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchAssignments();
  }, []);

  return (
    <> {loading ? (
      <DashboardLayout>
        {[1,2,3].map((i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <AssignedClassesSkeleton />
            <ClassAssignmentsSkeleton />
          </div>
        ))}
      </DashboardLayout>
    ) : (
      <DashboardLayout>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
            <h3 className="text-gray-500 text-sm">My Assigned Classes</h3>
            <p className="text-3xl font-bold text-gray-800 mt-2">{assignments.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500 col-span-2">
            <h3 className="text-gray-500 text-sm mb-2">Class Assignments</h3>
            {assignments.length > 0 ? (
              <ul className="divide-y divide-gray-100">
                {assignments.map((a, i) => (
                  <li key={i} className="py-2 flex justify-between">
                    <span className="font-medium">{a.classId?.name} - {a.sectionId?.name}</span>
                    <span className="text-gray-500">{a.subjectId?.name}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No classes assigned yet. Please contact your Principal.</p>
            )}
          </div>
        </div>
      </DashboardLayout>)}</>
  );
}