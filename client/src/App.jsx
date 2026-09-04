import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadUser } from './features/auth/authSlice';

import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';
import PrincipalDashboard from './pages/PrincipalDashboard';
import StudentManagement from './pages/principal/StudentManagement';
import ParentDashboard from './pages/ParentDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AcademicManagement from './pages/principal/AcademicManagement';
import TeacherManagement from './pages/principal/TeacherManagement';
import Attendance from './pages/Attendance';
import FeeManagement from './pages/principal/FeeManagement';
import Communication from './pages/principal/Communication';
import Exams from './pages/Exams'; // Reusing the Exams UI for teachers
import TeacherDashboard from './pages/TeacherDashboard';
import TeacherClasses from './pages/teacher/TeacherClasses';
import TeacherHomework from './pages/teacher/TeacherHomework';
import ParentAnnouncements from './pages/parent/ParentAnnouncements';
import ParentFees from './pages/parent/ParentFees';
import ParentAttendance from './pages/parent/ParentAttendance';
import ParentResults from './pages/parent/ParentResults';


export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<div>404 Not Found</div>} />
        <Route path="/" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Principal Routes */}
        <Route path="/principal" element={<ProtectedRoute element={<PrincipalDashboard />} allowedRoles={['Principal']} />} />
        <Route path="/principal/academics" element={<ProtectedRoute element={<AcademicManagement />} allowedRoles={['Principal']} />} />
        <Route path="/principal/students" element={<ProtectedRoute element={<StudentManagement />} allowedRoles={['Principal']} />} />
        <Route path="/principal/teachers" element={<ProtectedRoute element={<TeacherManagement />} allowedRoles={['Principal']} />} />
        <Route path="/principal/attendance" element={<ProtectedRoute element={<Attendance />} allowedRoles={['Principal', 'Teacher']} />} />
        <Route path="/principal/exams" element={<ProtectedRoute element={<Exams />} allowedRoles={['Principal', 'Teacher']} />} />
        <Route path="/principal/fees" element={<ProtectedRoute element={<FeeManagement />} allowedRoles={['Principal']} />} />
        <Route path="/principal/communication" element={<ProtectedRoute element={<Communication />} allowedRoles={['Principal']} />} />

        {/* Teacher & Parent Routes (Still placeholders) */}
        <Route path="/teacher" element={<ProtectedRoute element={<TeacherDashboard />} allowedRoles={['Teacher']} />} />
        <Route path="/teacher/classes" element={<ProtectedRoute element={<TeacherClasses />} allowedRoles={['Teacher']} />} />
        <Route path="/teacher/attendance" element={<ProtectedRoute element={<Attendance />} allowedRoles={['Teacher']} />} />
        <Route path="/teacher/marks" element={<ProtectedRoute element={<Exams />} allowedRoles={['Teacher']} />} />
        <Route path="/teacher/homework" element={<ProtectedRoute element={<TeacherHomework />} allowedRoles={['Teacher']} />} />

        <Route path="/parent" element={<ProtectedRoute element={<ParentDashboard />} allowedRoles={['Parent']} />} />
        <Route path="/parent/announcements" element={<ProtectedRoute element={<ParentAnnouncements />} allowedRoles={['Parent']} />} />
        <Route path="/parent/fees" element={<ProtectedRoute element={<ParentFees />} allowedRoles={['Parent']} />} />
        <Route path="/parent/attendance" element={<ProtectedRoute element={<ParentAttendance />} allowedRoles={['Parent']} />} />
        <Route path="/parent/results" element={<ProtectedRoute element={<ParentResults />} allowedRoles={['Parent']} />} />

      </Routes>
    </BrowserRouter>
  );
}