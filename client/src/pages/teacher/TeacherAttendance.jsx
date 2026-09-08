import DashboardLayout from '../../components/DashboardLayout';
import AttendanceUI from '../Attendance'; // Import the raw UI

export default function TeacherAttendance() {
  return (
    <DashboardLayout>
      <AttendanceUI />
    </DashboardLayout>
  );
}