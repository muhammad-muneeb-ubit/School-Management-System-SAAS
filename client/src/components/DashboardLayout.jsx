// import { useState } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import { logoutUser } from '../features/auth/authSlice';
// import { TrendingUp, LayoutDashboard, Users, Archive, GraduationCap, BookOpen, CalendarDays, CreditCard, LogOut, Menu, X, MessageSquare, ClipboardList, PersonStandingIcon } from 'lucide-react';

// // export default function DashboardLayout({ children }) {
// //   const [sidebarOpen, setSidebarOpen] = useState(() => {
// //     const saved = localStorage.getItem('sidebarOpen');
// //     return saved === null ? true : saved === 'true';
// //   });
// //   const { user } = useSelector((state) => state.auth);
// //   const dispatch = useDispatch();
// //   const navigate = useNavigate();
// //   const location = useLocation();

// //   const toggleSidebar = () => {
// //     setSidebarOpen(prev => {
// //       const newState = !prev;
// //       localStorage.setItem('sidebarOpen', String(newState));
// //       return newState;
// //     });
// //   };

// //   const handleLogout = () => {
// //     dispatch(logoutUser());
// //     navigate('/');
// //   };

// //   // Dynamic Menu based on Role
// //   let menuItems = [];
// //   if (user?.role === 'Principal') {
// //     menuItems = [
// //       { name: 'Dashboard', icon: LayoutDashboard, path: '/principal' },
// //       { name: 'Users', icon: Users, path: '/principal/users' },
// //       { name: 'Students', icon: PersonStandingIcon, path: '/principal/students' },
// //       { name: 'Teachers', icon: GraduationCap, path: '/principal/teachers' },
// //       { name: 'Academics', icon: BookOpen, path: '/principal/academics' },
// //       { name: 'Attendance', icon: CalendarDays, path: '/principal/attendance' },
// //       { name: 'Exams', icon: ClipboardList, path: '/principal/exams' },
// //       { name: 'Fees', icon: CreditCard, path: '/principal/fees' },
// //       { name: 'Communication', icon: MessageSquare, path: '/principal/communication' },
// //       { name: 'Timetable', icon: CalendarDays, path: '/principal/timetable' },
// //       { name: 'Promotion', icon: TrendingUp, path: '/principal/promotion' },
// //       { name: 'Data Archive', icon: Archive, path: '/principal/archive' },
// //       { name: 'Logs', icon: ClipboardList, path: '/principal/logs' },
// //     ];
// //   } else if (user?.role === 'Teacher') {
// //     menuItems = [
// //       { name: 'Dashboard', icon: LayoutDashboard, path: '/teacher' },
// //       { name: 'My Classes', icon: BookOpen, path: '/teacher/classes' },
// //       { name: 'Mark Attendance', icon: CalendarDays, path: '/teacher/attendance' },
// //       { name: 'Enter Marks', icon: ClipboardList, path: '/teacher/marks' },
// //       { name: 'Homework', icon: ClipboardList, path: '/teacher/homework' },
// //       { name: 'Timetable', icon: CalendarDays, path: '/teacher/timetable' },
// //     ];
// //   } else if (user?.role === 'Parent') {
// //     menuItems = [
// //       { name: 'Dashboard', icon: LayoutDashboard, path: '/parent' },
// //       { name: 'Attendance', icon: CalendarDays, path: '/parent/attendance' },
// //       { name: 'Results', icon: ClipboardList, path: '/parent/results' },
// //       { name: 'Fees', icon: CreditCard, path: '/parent/fees' },
// //       { name: 'Announcements', icon: MessageSquare, path: '/parent/announcements' },
// //       { name: 'Timetable', icon: CalendarDays, path: '/parent/timetable' },
// //     ];
// //   } else if (user?.role === 'Super Admin') {
// //     // Note: If you want Super Admin to stay gray, you can use a different layout or classes here.
// //     // For now, applying the theme to everyone.
// //     menuItems = [
// //       { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
// //       { name: 'Manage Principals', icon: Users, path: '/admin/principals' },
// //       { name: 'View Logs', icon: ClipboardList, path: '/admin/logs' },
// //       { name: 'Branding', icon: ClipboardList, path: '/admin/branding' }, // Ensure this is here!
// //     ];
// //   }

// //   return (
// //     <div className="min-h-screen bg-gray-100 flex">
// //       {/* SIDEBAR CHANGED TO USE DYNAMIC COLORS */}
// //       <div className={`${sidebarOpen ? 'w-64' : 'w-15'} fixed left-0 top-0 h-screen bg-sidebar text-white transition-all duration-300 flex flex-col z-50`}>
        
// //         {/* Sidebar Header */}
// //         <div className="p-4 flex items-center justify-between border-b border-white/10 shrink-0">
// //           {sidebarOpen && (
// //             <span className="text-xl font-bold">SMS</span>
// //           )}
// //           <button
// //             onClick={toggleSidebar}
// //             className="p-1 rounded hover:bg-sidebar-hover"
// //           >
// //             {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
// //           </button>
// //         </div>

// //         {/* Navigation */}
// //         <nav className="p-2 space-y-1 overflow-y-auto">
// //           {menuItems.map((item) => (
// //             <Link 
// //               key={item.name} 
// //               to={item.path} 
// //               className={`flex items-center space-x-2 p-2 rounded hover:bg-sidebar-hover transition ${location.pathname === item.path ? 'bg-sidebar-active' : ''}`}
// //             >
// //               <item.icon size={20} />
// //               {sidebarOpen && (
// //                 <span>{item.name}</span>
// //               )}
// //             </Link>
// //           ))}
// //         </nav>

// //         {/* Logout */}
// //         <div className="p-2 border-t border-white/10 shrink-0">
// //           <button
// //             onClick={handleLogout}
// //             className="flex items-center space-x-2 p-2 rounded hover:bg-red-600 w-full transition"
// //           >
// //             <LogOut size={20} />
// //             {sidebarOpen && (
// //               <span>Logout</span>
// //             )}
// //           </button>
// //         </div>
// //       </div>

// //       {/* Main Content */}
// //       <div className={`flex-1 flex flex-col overflow-hidden ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
// //         <header className="bg-white shadow-sm p-4 flex justify-between items-center">
// //           <h1 className="text-xl font-semibold text-gray-800 capitalize">
// //             {user?.role} Portal
// //           </h1>
// //           <Link to="/profile" className="text-sm text-brand hover:text-brand-hover hover:underline hidden md:block">
// //             {user?.email}
// //           </Link>
// //         </header>
// //         <main className="flex-1 p-6 overflow-y-auto">
// //           {children}
// //         </main>
// //         {/* Footer */}
// //         <footer className="bg-white shadow-sm p-4 text-center text-sm text-gray-500">
// //           &copy; {new Date().getFullYear()} SMS. All rights reserved.
// //         </footer>
// //       </div>
// //     </div>
// //   );
// // }


// export default function DashboardLayout({ children }) {
//   const [sidebarOpen, setSidebarOpen] = useState(() => {
//     const saved = localStorage.getItem('sidebarOpen');

//     return saved === null
//       ? true
//       : saved === 'true';
//   });

//   const { user } = useSelector(
//     (state) => state.auth
//   );

//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const toggleSidebar = () => {
//     setSidebarOpen((prev) => {
//       const newState = !prev;

//       localStorage.setItem(
//         'sidebarOpen',
//         String(newState)
//       );

//       return newState;
//     });
//   };

//   const handleLogout = () => {
//     dispatch(logoutUser());
//     navigate('/');
//   };

//   /* =====================================================
//      MENU
//      ===================================================== */

//   let menuItems = [];

//   if (user?.role === 'Principal') {
//     menuItems = [
//       {
//         name: 'Dashboard',
//         icon: LayoutDashboard,
//         path: '/principal',
//       },
//       {
//         name: 'Users',
//         icon: Users,
//         path: '/principal/users',
//       },
//       {
//         name: 'Students',
//         icon: PersonStandingIcon,
//         path: '/principal/students',
//       },
//       {
//         name: 'Teachers',
//         icon: GraduationCap,
//         path: '/principal/teachers',
//       },
//       {
//         name: 'Academics',
//         icon: BookOpen,
//         path: '/principal/academics',
//       },
//       {
//         name: 'Attendance',
//         icon: CalendarDays,
//         path: '/principal/attendance',
//       },
//       {
//         name: 'Exams',
//         icon: ClipboardList,
//         path: '/principal/exams',
//       },
//       {
//         name: 'Fees',
//         icon: CreditCard,
//         path: '/principal/fees',
//       },
//       {
//         name: 'Communication',
//         icon: MessageSquare,
//         path: '/principal/communication',
//       },
//       {
//         name: 'Timetable',
//         icon: CalendarDays,
//         path: '/principal/timetable',
//       },
//       {
//         name: 'Promotion',
//         icon: TrendingUp,
//         path: '/principal/promotion',
//       },
//       {
//         name: 'Data Archive',
//         icon: Archive,
//         path: '/principal/archive',
//       },
//       {
//         name: 'Logs',
//         icon: ClipboardList,
//         path: '/principal/logs',
//       },
//     ];
//   }

//   else if (user?.role === 'Teacher') {
//     menuItems = [
//       {
//         name: 'Dashboard',
//         icon: LayoutDashboard,
//         path: '/teacher',
//       },
//       {
//         name: 'My Classes',
//         icon: BookOpen,
//         path: '/teacher/classes',
//       },
//       {
//         name: 'Mark Attendance',
//         icon: CalendarDays,
//         path: '/teacher/attendance',
//       },
//       {
//         name: 'Enter Marks',
//         icon: ClipboardList,
//         path: '/teacher/marks',
//       },
//       {
//         name: 'Homework',
//         icon: ClipboardList,
//         path: '/teacher/homework',
//       },
//       {
//         name: 'Timetable',
//         icon: CalendarDays,
//         path: '/teacher/timetable',
//       },
//     ];
//   }

//   else if (user?.role === 'Parent') {
//     menuItems = [
//       {
//         name: 'Dashboard',
//         icon: LayoutDashboard,
//         path: '/parent',
//       },
//       {
//         name: 'Attendance',
//         icon: CalendarDays,
//         path: '/parent/attendance',
//       },
//       {
//         name: 'Results',
//         icon: ClipboardList,
//         path: '/parent/results',
//       },
//       {
//         name: 'Fees',
//         icon: CreditCard,
//         path: '/parent/fees',
//       },
//       {
//         name: 'Announcements',
//         icon: MessageSquare,
//         path: '/parent/announcements',
//       },
//       {
//         name: 'Timetable',
//         icon: CalendarDays,
//         path: '/parent/timetable',
//       },
//     ];
//   }

//   else if (user?.role === 'Super Admin') {
//     menuItems = [
//       {
//         name: 'Dashboard',
//         icon: LayoutDashboard,
//         path: '/admin',
//       },
//       {
//         name: 'Manage Principals',
//         icon: Users,
//         path: '/admin/principals',
//       },
//       {
//         name: 'View Logs',
//         icon: ClipboardList,
//         path: '/admin/logs',
//       },
//       {
//         name: 'Branding',
//         icon: ClipboardList,
//         path: '/admin/branding',
//       },
//     ];
//   }

//   return (
//     <div className="min-h-screen bg-background flex">

//       {/* =================================================
//           SIDEBAR
//           ================================================= */}

//       <aside
//         className={`
//           ${sidebarOpen ? 'w-64' : 'w-16'}
//           fixed
//           left-0
//           top-0
//           h-screen
//           bg-sidebar
//           text-white
//           transition-all
//           duration-300
//           flex
//           flex-col
//           z-50
//         `}
//       >

//         {/* Header */}

//         <div
//           className="
//             p-4
//             flex
//             items-center
//             justify-between
//             border-b
//             shrink-0
//           "
//           style={{
//             borderColor:
//               'var(--sidebar-border)',
//           }}
//         >
//           {sidebarOpen && (
//             <span className="text-xl font-bold">
//               SMS
//             </span>
//           )}

//           <button
//             onClick={toggleSidebar}
//             className="
//               p-1
//               rounded
//               hover:bg-sidebar-hover
//               transition
//             "
//           >
//             {sidebarOpen ? (
//               <X size={20} />
//             ) : (
//               <Menu size={20} />
//             )}
//           </button>
//         </div>

//         {/* Navigation */}

//         <nav className="flex-1 p-2 space-y-1 overflow-y-auto">

//           {menuItems.map((item) => {
//             const Icon = item.icon;

//             const isActive =
//               location.pathname === item.path;

//             return (
//               <Link
//                 key={item.name}
//                 to={item.path}
//                 className={`
//                   flex
//                   items-center
//                   gap-2
//                   p-2
//                   rounded-md
//                   transition
//                   ${
//                     isActive
//                       ? 'bg-sidebar-active'
//                       : 'hover:bg-sidebar-hover'
//                   }
//                 `}
//               >
//                 <Icon size={20} />

//                 {sidebarOpen && (
//                   <span className="text-sm">
//                     {item.name}
//                   </span>
//                 )}
//               </Link>
//             );
//           })}

//         </nav>

//         {/* Logout */}

//         <div
//           className="
//             p-2
//             border-t
//             shrink-0
//           "
//           style={{
//             borderColor:
//               'var(--sidebar-border)',
//           }}
//         >
//           <button
//             onClick={handleLogout}
//             className="
//               flex
//               items-center
//               gap-2
//               p-2
//               rounded-md
//               hover:bg-danger
//               w-full
//               transition
//             "
//           >
//             <LogOut size={20} />

//             {sidebarOpen && (
//               <span className="text-sm">
//                 Logout
//               </span>
//             )}
//           </button>
//         </div>
//       </aside>

//       {/* =================================================
//           MAIN
//           ================================================= */}

//       <div
//         className={`
//           flex-1
//           flex
//           flex-col
//           min-w-0
//           ${sidebarOpen ? 'ml-64' : 'ml-16'}
//         `}
//       >

//         {/* Header */}

//         <header
//           className="
//             bg-surface
//             border-b
//             border-border
//             p-4
//             flex
//             justify-between
//             items-center
//           "
//         >
//           <h1
//             className="
//               text-lg
//               md:text-xl
//               font-semibold
//               text-text-primary
//             "
//           >
//             {user?.role} Portal
//           </h1>

//           <Link
//             to="/profile"
//             className="
//               text-sm
//               text-primary
//               hover:text-primary-hover
//               hover:underline
//               hidden
//               md:block
//             "
//           >
//             {user?.email}
//           </Link>
//         </header>

//         {/* Content */}

//         <main className="flex-1 p-4 md:p-6 overflow-y-auto">
//           {children}
//         </main>

//         {/* Footer */}

//         <footer
//           className="
//             bg-surface
//             border-t
//             border-border
//             p-4
//             text-center
//             text-sm
//             text-text-secondary
//           "
//         >
//           &copy; {new Date().getFullYear()} SMS.
//           All rights reserved.
//         </footer>

//       </div>
//     </div>
//   );
// }


import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../features/auth/authSlice';
import { TrendingUp, LayoutDashboard, Users, Archive, GraduationCap, BookOpen, CalendarDays, CreditCard, LogOut, Menu, X, MessageSquare, ClipboardList, PersonStandingIcon } from 'lucide-react';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Default closed for mobile
  const [desktopCollapsed, setDesktopCollapsed] = useState(() => {
    const saved = localStorage.getItem('desktopCollapsed');
    return saved === null ? false : saved === 'true';
  });

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleDesktop = () => {
    const newState = !desktopCollapsed;
    setDesktopCollapsed(newState);
    localStorage.setItem('desktopCollapsed', String(newState));
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  let menuItems = [];
  if (user?.role === 'Principal') {
    menuItems = [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/principal' },
      { name: 'Users', icon: Users, path: '/principal/users' },
      { name: 'Students', icon: PersonStandingIcon, path: '/principal/students' },
      { name: 'Teachers', icon: GraduationCap, path: '/principal/teachers' },
      { name: 'Academics', icon: BookOpen, path: '/principal/academics' },
      { name: 'Attendance', icon: CalendarDays, path: '/principal/attendance' },
      { name: 'Exams', icon: ClipboardList, path: '/principal/exams' },
      { name: 'Fees', icon: CreditCard, path: '/principal/fees' },
      { name: 'Communication', icon: MessageSquare, path: '/principal/communication' },
      { name: 'Timetable', icon: CalendarDays, path: '/principal/timetable' },
      { name: 'Promotion', icon: TrendingUp, path: '/principal/promotion' },
      { name: 'Data Archive', icon: Archive, path: '/principal/archive' },
      { name: 'Logs', icon: ClipboardList, path: '/principal/logs' },
    ];
  } else if (user?.role === 'Teacher') {
    menuItems = [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/teacher' },
      { name: 'My Classes', icon: BookOpen, path: '/teacher/classes' },
      { name: 'Mark Attendance', icon: CalendarDays, path: '/teacher/attendance' },
      { name: 'Enter Marks', icon: ClipboardList, path: '/teacher/marks' },
      { name: 'Homework', icon: ClipboardList, path: '/teacher/homework' },
      { name: 'Timetable', icon: CalendarDays, path: '/teacher/timetable' },
    ];
  } else if (user?.role === 'Parent') {
    menuItems = [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/parent' },
      { name: 'Attendance', icon: CalendarDays, path: '/parent/attendance' },
      { name: 'Results', icon: ClipboardList, path: '/parent/results' },
      { name: 'Fees', icon: CreditCard, path: '/parent/fees' },
      { name: 'Announcements', icon: MessageSquare, path: '/parent/announcements' },
      { name: 'Timetable', icon: CalendarDays, path: '/parent/timetable' },
    ];
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 h-screen bg-sidebar text-white transition-all duration-300 flex flex-col z-40
        ${sidebarOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full md:translate-x-0'}
        ${desktopCollapsed ? 'md:w-16' : 'md:w-64'}
      `}>
        
        {/* Sidebar Header */}
        <div className="p-4 flex items-center justify-between border-b border-white/10 shrink-0">
          {(!desktopCollapsed || sidebarOpen) && (
            <span className="text-xl font-bold">SMS</span>
          )}
          
          {/* Mobile Close Button */}
          <button onClick={() => setSidebarOpen(false)} className="p-1 rounded hover:bg-sidebar-hover md:hidden">
            <X size={20} />
          </button>
          
          {/* Desktop Collapse Button */}
          <button onClick={toggleDesktop} className="p-1 rounded hover:bg-sidebar-hover hidden md:block">
            <Menu size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.name} 
                to={item.path} 
                onClick={() => setSidebarOpen(false)} // Close drawer on click (mobile)
                className={`flex items-center gap-2 p-2 rounded-md transition ${isActive ? 'bg-sidebar-active' : 'hover:bg-sidebar-hover'} ${desktopCollapsed ? 'md:justify-center' : ''}`}
              >
                <Icon size={20} className="shrink-0" />
                {(!desktopCollapsed || sidebarOpen) && (
                  <span className="text-sm">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-2 border-t border-white/10 shrink-0">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-2 p-2 rounded-md hover:bg-red-600 w-full transition ${desktopCollapsed ? 'md:justify-center' : ''}`}
          >
            <LogOut size={20} className="shrink-0" />
            {(!desktopCollapsed || sidebarOpen) && (
              <span className="text-sm">Logout</span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${desktopCollapsed ? 'md:ml-16' : 'md:ml-64'}`}>
        
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-20">
          <div className="flex items-center gap-2">
            {/* Mobile Menu Button */}
            <button onClick={() => setSidebarOpen(true)} className="p-1 rounded hover:bg-gray-100 md:hidden">
              <Menu size={24} />
            </button>
            <h1 className="text-lg md:text-xl font-semibold text-gray-800 capitalize">
              {user?.role} Portal
            </h1>
          </div>
          
          <Link to="/profile" className="text-sm text-brand hover:text-brand-hover hover:underline hidden md:block">
            {user?.email}
          </Link>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 p-4 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} SMS. All rights reserved.
        </footer>
      </div>
    </div>
  );
}