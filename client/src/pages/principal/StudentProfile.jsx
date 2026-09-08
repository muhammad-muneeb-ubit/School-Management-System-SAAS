import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import Loader from '../../components/Loader';


export default function StudentProfile() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await api.get(`/students/${id}`);
        setStudent(res.data);
      } catch (err) { console.error(err); }
    };
    fetchStudent();
  }, [id]);

  return (
    <DashboardLayout>
      <Link to="/principal/students" className="text-blue-600 hover:underline mb-4 inline-block">&larr; Back to Students</Link>
      
      {!student ? <Loader /> : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-blue-600 p-6 text-white">
            <h1 className="text-2xl font-bold">{student.firstName} {student.lastName}</h1>
            <p className="text-blue-200">Roll No: {student.rollNumber}</p>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold border-b pb-2 mb-3">Academic Info</h2>
              <p><strong>Class:</strong> {student.classId?.name || 'N/A'}</p>
              <p><strong>Section:</strong> {student.sectionId?.name || 'N/A'}</p>
              <p><strong>Status:</strong> <span className="capitalize">{student.status}</span></p>
              <p><strong>Gender:</strong> {student.gender}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold border-b pb-2 mb-3">Parent / Guardian Info</h2>
              <p><strong>Name:</strong> {student.parentId?.profile?.firstName} {student.parentId?.profile?.lastName}</p>
              <p><strong>Email:</strong> {student.parentId?.email}</p>
              <p><strong>Phone:</strong> {student.parentId?.profile?.phone || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}