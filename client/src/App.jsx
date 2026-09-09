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
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import PrincipalManagement from './pages/super-admin/PrincipalManagement';
import PrincipalLogs from './pages/principal/PrincipalLogs';
import UserManagement from './pages/principal/UserManagement';
import SuperAdminLogs from './pages/super-admin/SuperAdminLogs';
import PromotionManagement from './pages/principal/PromotionManagement';
import TimetableManagement from './pages/principal/TimetableManagement';
import DataArchive from './pages/principal/DataArchive';
import NotFound from './pages/NotFound';
import StudentProfile from './pages/principal/StudentProfile';
import Profile from './pages/Profile';

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/profile" element={<ProtectedRoute element={<Profile />} allowedRoles={['Super Admin', 'Principal', 'Teacher', 'Parent']} />} />

        
        {/* Super Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute element={<SuperAdminDashboard />} allowedRoles={['Super Admin']} />} />
        <Route path="/admin/logs" element={<ProtectedRoute element={<SuperAdminLogs />} allowedRoles={['Super Admin']} />} />
        <Route path="/admin/principals" element={<ProtectedRoute element={<PrincipalManagement />} allowedRoles={['Super Admin']} />} />

        {/* Principal Routes */}
        <Route path="/principal" element={<ProtectedRoute element={<PrincipalDashboard />} allowedRoles={['Principal']} />} />
        <Route path="/principal/academics" element={<ProtectedRoute element={<AcademicManagement />} allowedRoles={['Principal']} />} />
        <Route path="/principal/students" element={<ProtectedRoute element={<StudentManagement />} allowedRoles={['Principal']} />} />
        <Route path="/principal/teachers" element={<ProtectedRoute element={<TeacherManagement />} allowedRoles={['Principal']} />} />
        <Route path="/principal/attendance" element={<ProtectedRoute element={<Attendance />} allowedRoles={['Principal', 'Teacher']} />} />
        <Route path="/principal/exams" element={<ProtectedRoute element={<Exams />} allowedRoles={['Principal', 'Teacher']} />} />
        <Route path="/principal/fees" element={<ProtectedRoute element={<FeeManagement />} allowedRoles={['Principal']} />} />
        <Route path="/principal/communication" element={<ProtectedRoute element={<Communication />} allowedRoles={['Principal']} />} />
        <Route path="/principal/logs" element={<ProtectedRoute element={<PrincipalLogs />} allowedRoles={['Principal']} />} />
        <Route path="/principal/users" element={<ProtectedRoute element={<UserManagement />} allowedRoles={['Principal']} />} />
        <Route path="/principal/promotion" element={<ProtectedRoute element={<PromotionManagement />} allowedRoles={['Principal']} />} />
        <Route path="/principal/timetable" element={<ProtectedRoute element={<TimetableManagement />} allowedRoles={['Principal']} />} />
        <Route path="/principal/archive" element={<ProtectedRoute element={<DataArchive />} allowedRoles={['Principal']} />} />
        <Route path="/principal/students/:id" element={<ProtectedRoute element={<StudentProfile />} allowedRoles={['Principal', 'Teacher']} />} />


        {/* Teacher & Parent Routes (Still placeholders) */}
        <Route path="/teacher" element={<ProtectedRoute element={<TeacherDashboard />} allowedRoles={['Teacher']} />} />
        <Route path="/teacher/classes" element={<ProtectedRoute element={<TeacherClasses />} allowedRoles={['Teacher']} />} />
        <Route path="/teacher/attendance" element={<ProtectedRoute element={<Attendance />} allowedRoles={['Teacher']} />} />
        <Route path="/teacher/marks" element={<ProtectedRoute element={<Exams />} allowedRoles={['Teacher']} />} />
        <Route path="/teacher/homework" element={<ProtectedRoute element={<TeacherHomework />} allowedRoles={['Teacher']} />} />
        <Route path="/teacher/timetable" element={<ProtectedRoute element={<TimetableManagement />} allowedRoles={['Teacher']} />} />

        <Route path="/parent" element={<ProtectedRoute element={<ParentDashboard />} allowedRoles={['Parent']} />} />
        <Route path="/parent/announcements" element={<ProtectedRoute element={<ParentAnnouncements />} allowedRoles={['Parent']} />} />
        <Route path="/parent/fees" element={<ProtectedRoute element={<ParentFees />} allowedRoles={['Parent']} />} />
        <Route path="/parent/attendance" element={<ProtectedRoute element={<ParentAttendance />} allowedRoles={['Parent']} />} />
        <Route path="/parent/results" element={<ProtectedRoute element={<ParentResults />} allowedRoles={['Parent']} />} />
        <Route path="/parent/timetable" element={<ProtectedRoute element={<TimetableManagement />} allowedRoles={['Parent']} />} />

        


      </Routes>
    </BrowserRouter>
  );
}