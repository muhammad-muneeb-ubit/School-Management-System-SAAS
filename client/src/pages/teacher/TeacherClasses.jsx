import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';

export default function TeacherClasses() {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await api.get('/teachers/my-assignments');
        setAssignments(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAssignments();
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Assigned Classes</h1>
      
      {assignments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map((a, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow border-t-4 border-blue-500">
              <h2 className="text-xl font-bold text-gray-800">{a.classId?.name}</h2>
              <p className="text-gray-600 mt-1">Section: <span className="font-medium">{a.sectionId?.name || 'N/A'}</span></p>
              <p className="text-gray-600">Subject: <span className="font-medium">{a.subjectId?.name}</span></p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
          You have no classes assigned yet. Please contact your Principal.
        </div>
      )}
    </DashboardLayout>
  );
}