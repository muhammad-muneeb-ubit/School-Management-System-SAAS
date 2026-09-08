import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../features/auth/authSlice';
import { LogOut, Menu, X, Settings, Users, FileText } from 'lucide-react';

export default function SuperAdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'System Setup', icon: Settings, path: '/admin' },
    { name: 'Principals', icon: Users, path: '/admin/principals' },
    { name: 'Audit Logs', icon: FileText, path: '/admin/logs' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 text-white transition-all duration-300 flex flex-col`}>
        <div className="p-4 flex items-center justify-between border-b border-gray-700">
          {sidebarOpen && <div><h1 className="text-xl font-bold">SMS System</h1><p className="text-xs text-gray-400">Super Admin</p></div>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 rounded hover:bg-gray-800">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        
        <nav className="flex-1 p-2 space-y-1">
          {menuItems.map((item) => (
            <Link key={item.name} to={item.path} className={`flex items-center space-x-2 p-2 rounded hover:bg-gray-800 transition ${location.pathname === item.path ? 'bg-gray-800' : ''}`}>
              <item.icon size={20} />
              {sidebarOpen && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-2 border-t border-gray-700">
          <button onClick={() => { dispatch(logoutUser()); navigate('/'); }} className="flex items-center space-x-2 p-2 rounded hover:bg-red-600 w-full transition">
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}