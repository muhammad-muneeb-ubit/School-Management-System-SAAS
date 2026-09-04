import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../features/auth/authSlice';
import { LayoutDashboard, Users, GraduationCap, BookOpen, CalendarDays, CreditCard, LogOut, Menu, X, MessageSquare, ClipboardList } from 'lucide-react';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  // Dynamic Menu based on Role
  let menuItems = [];
  if (user?.role === 'Principal') {
    menuItems = [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/principal' },
      { name: 'Students', icon: Users, path: '/principal/students' },
      { name: 'Teachers', icon: GraduationCap, path: '/principal/teachers' },
      { name: 'Academics', icon: BookOpen, path: '/principal/academics' },
      { name: 'Attendance', icon: CalendarDays, path: '/principal/attendance' },
      { name: 'Exams', icon: ClipboardList, path: '/principal/exams' },
      { name: 'Fees', icon: CreditCard, path: '/principal/fees' },
      { name: 'Communication', icon: MessageSquare, path: '/principal/communication' },
    ];
  } else if (user?.role === 'Teacher') {
    menuItems = [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/teacher' },
      { name: 'My Classes', icon: BookOpen, path: '/teacher/classes' },
      { name: 'Mark Attendance', icon: CalendarDays, path: '/teacher/attendance' },
      { name: 'Enter Marks', icon: ClipboardList, path: '/teacher/marks' },
      { name: 'Homework', icon: ClipboardList, path: '/teacher/homework' },
    ];
  } else if (user?.role === 'Parent') {
    menuItems = [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/parent' },
      { name: 'Attendance', icon: CalendarDays, path: '/parent/attendance' },
      { name: 'Results', icon: ClipboardList, path: '/parent/results' },
      { name: 'Fees', icon: CreditCard, path: '/parent/fees' },
      { name: 'Announcements', icon: MessageSquare, path: '/parent/announcements' },
    ];
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-blue-800 text-white transition-all duration-300 flex flex-col`}>
        <div className="p-4 flex items-center justify-between border-b border-blue-700">
          {sidebarOpen && <span className="text-xl font-bold">SMS</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 rounded hover:bg-blue-700">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        
        <nav className="flex-1 p-2 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center space-x-2 p-2 rounded hover:bg-blue-700 transition ${
                location.pathname === item.path ? 'bg-blue-900' : ''
              }`}
            >
              <item.icon size={20} />
              {sidebarOpen && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-2 border-t border-blue-700">
          <button onClick={handleLogout} className="flex items-center space-x-2 p-2 rounded hover:bg-red-600 w-full transition">
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800 capitalize">
            {user?.role} Portal
          </h1>
          <div className="text-sm text-gray-600">
            {user?.email}
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}