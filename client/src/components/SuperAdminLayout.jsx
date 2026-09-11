// import { useState } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { logoutUser } from '../features/auth/authSlice';

// import {
//   LogOut,
//   Menu,
//   X,
//   Settings,
//   Users,
//   FileText,
//   Palette,
// } from 'lucide-react';

// import { LayoutSkeleton } from './skeletons';

// export default function SuperAdminLayout({ children, loading }) {
//   const [sidebarOpen, setSidebarOpen] = useState(() => {
//     const saved = localStorage.getItem('sidebarOpen');
//     return saved === null ? true : saved === 'true';
//   });

//   const location = useLocation();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const menuItems = [
//     {
//       name: 'System Setup',
//       icon: Settings,
//       path: '/admin',
//     },
//     {
//       name: 'Principals',
//       icon: Users,
//       path: '/admin/principals',
//     },
//     {
//       name: 'Audit Logs',
//       icon: FileText,
//       path: '/admin/logs',
//     },
//     {
//       name: 'Branding',
//       icon: Palette,
//       path: '/admin/branding',
//     },
//   ];

//   const toggleSidebar = () => {
//     setSidebarOpen((prev) => {
//       const newState = !prev;
//       localStorage.setItem('sidebarOpen', String(newState));
//       return newState;
//     });
//   };

//   const handleLogout = () => {
//     dispatch(logoutUser());
//     navigate('/');
//   };

//   if (loading) {
//     return <LayoutSkeleton theme="admin" user="admin" />;
//   }

// //   return (
// //     <div className="min-h-screen bg-background flex">

// //       {/* Sidebar */}
// //       <aside
// //         className={`
// //           ${sidebarOpen ? 'w-64' : 'w-16'}
// //           bg-sidebar
// //           text-white
// //           transition-all
// //           duration-300
// //           flex
// //           flex-col
// //           shrink-0
// //         `}
// //       >

// //         {/* Header */}
// //         <div className="p-4 flex items-center justify-between border-b border-white/10">

// //           {sidebarOpen && (
// //             <div>
// //               <h1 className="text-xl font-bold">
// //                 SMS System
// //               </h1>

// //               <p className="text-xs text-white/60">
// //                 Super Admin
// //               </p>
// //             </div>
// //           )}

// //           <button
// //             onClick={toggleSidebar}
// //             className="
// //               p-1.5
// //               rounded-md
// //               text-white/80
// //               hover:bg-sidebar-hover
// //               hover:text-white
// //               transition
// //             "
// //             aria-label="Toggle sidebar"
// //           >
// //             {sidebarOpen ? (
// //               <X size={20} />
// //             ) : (
// //               <Menu size={20} />
// //             )}
// //           </button>
// //         </div>


// //         {/* Navigation */}
// //         <nav className="flex-1 p-2 space-y-1">

// //           {menuItems.map((item) => {
// //             const Icon = item.icon;

// //             const isActive =
// //               location.pathname === item.path;

// //             return (
// //               <Link
// //                 key={item.name}
// //                 to={item.path}
// //                 title={!sidebarOpen ? item.name : undefined}
// //                 className={`
// //                   flex
// //                   items-center
// //                   ${sidebarOpen ? 'gap-3' : 'justify-center'}
// //                   px-3
// //                   py-2.5
// //                   rounded-md
// //                   transition
// //                   text-sm
// //                   font-medium

// //                   ${
// //                     isActive
// //                       ? 'bg-sidebar-active text-white'
// //                       : 'text-white/80 hover:bg-sidebar-hover hover:text-white'
// //                   }
// //                 `}
// //               >
// //                 <Icon size={20} className="shrink-0" />

// //                 {sidebarOpen && (
// //                   <span>{item.name}</span>
// //                 )}
// //               </Link>
// //             );
// //           })}

// //         </nav>


// //         {/* Logout */}
// //         <div className="p-2 border-t border-white/10">

// //           <button
// //             onClick={handleLogout}
// //             title={!sidebarOpen ? 'Logout' : undefined}
// //             className={`
// //               w-full
// //               flex
// //               items-center
// //               ${sidebarOpen ? 'gap-3' : 'justify-center'}
// //               px-3
// //               py-2.5
// //               rounded-md
// //               text-sm
// //               font-medium
// //               text-white/80
// //               hover:bg-danger
// //               hover:text-white
// //               transition
// //             `}
// //           >
// //             <LogOut size={20} className="shrink-0" />

// //             {sidebarOpen && (
// //               <span>Logout</span>
// //             )}
// //           </button>

// //         </div>

// //       </aside>


// //       {/* Main Content */}
// //       <div className="flex-1 min-w-0 flex flex-col overflow-hidden">

// //         <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
// //           {children}
// //         </main>

// //       </div>

// //     </div>
// //   );
// // }

// return (
//   <div className="min-h-screen bg-background flex flex-col md:flex-row">

//     <div
//       className={` ${sidebarOpen ? 'w-full md:w-64' : 'w-full md:w-16'} bg-sidebar text-white transition-all duration-300 flex flex-col md:relative fixed md:static inset-x-0 bottom-0 md:inset-auto z-40 md:z-auto`}>

//       <div className="p-4 flex items-center justify-between border-b border-white/10">

//         {sidebarOpen && (
//           <div className="hidden md:block">
//             <h1 className="text-xl font-bold">
//               SMS System
//             </h1>

//             <p className="text-xs text-white/70">
//               Super Admin
//             </p>
//           </div>
//         )}

//         <button
//           onClick={toggleSidebar}
//           className="p-1 rounded hover:bg-sidebar-hover ml-auto md:ml-0"
//         >
//           {sidebarOpen ? (
//             <X size={20} />
//           ) : (
//             <Menu size={20} />
//           )}
//         </button>

//       </div>

//       <nav className="flex-1 p-2 space-y-1 overflow-y-auto">

//         {menuItems.map((item) => {

//           const isActive = location.pathname === item.path;

//           return (
//             <Link
//               key={item.name}
//               to={item.path}
//               className={`
//                 flex
//                 items-center
//                 ${sidebarOpen ? 'justify-start' : 'justify-center md:justify-start'}
//                 gap-2
//                 p-2
//                 rounded
//                 transition
//                 ${isActive
//                   ? 'bg-sidebar-active'
//                   : 'hover:bg-sidebar-hover'
//                 }
//               `}
//             >
//               <item.icon size={20} />

//               {(sidebarOpen || !sidebarOpen) && (
//                 <span className="text-sm md:block hidden">{item.name}</span>
//               )}
//             </Link>
//           );

//         })}

//       </nav>

//       <div className="p-2 border-t border-white/10">

//         <button
//           onClick={() => {
//             dispatch(logoutUser());
//             navigate('/');
//           }}
//           className="
//             flex
//             items-center
//             justify-center
//             md:justify-start
//             gap-2
//             p-2
//             rounded
//             hover:bg-danger
//             w-full
//             transition
//           "
//         >
//           <LogOut size={20} />

//           <span className="text-sm md:block hidden">Logout</span>
//         </button>

//       </div>

//     </div>

//     <div className="flex-1 flex flex-col overflow-hidden min-w-0 pt-0 md:pt-0">

//       <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
//         {children}
//       </main>

//     </div>

//   </div>
// );}


import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../features/auth/authSlice';
import { LogOut, Menu, X, Settings, Users, FileText, Palette } from 'lucide-react';
import { LayoutSkeleton } from './skeletons';

export default function SuperAdminLayout({ children, loading }) {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile drawer
  const [desktopCollapsed, setDesktopCollapsed] = useState(() => {
    const saved = localStorage.getItem('saDesktopCollapsed');
    return saved === null ? false : saved === 'true';
  });

  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'System Setup', icon: Settings, path: '/admin' },
    { name: 'Principals', icon: Users, path: '/admin/principals' },
    { name: 'Audit Logs', icon: FileText, path: '/admin/logs' },
    { name: 'Branding', icon: Palette, path: '/admin/branding' },
  ];

  const toggleDesktop = () => {
    const newState = !desktopCollapsed;
    setDesktopCollapsed(newState);
    localStorage.setItem('saDesktopCollapsed', String(newState));
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  if (loading) {
    return <LayoutSkeleton theme="admin" user="admin" />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 h-screen bg-gray-900 text-white transition-all duration-300 flex flex-col z-40
        ${sidebarOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full md:translate-x-0'}
        ${desktopCollapsed ? 'md:w-16' : 'md:w-64'}
      `}>
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-gray-700 shrink-0">
          {(!desktopCollapsed || sidebarOpen) && (
            <div>
              <h1 className="text-xl font-bold">SMS System</h1>
              <p className="text-xs text-gray-400">Super Admin</p>
            </div>
          )}

          {/* Mobile Close Button */}
          <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-md hover:bg-gray-800 md:hidden">
            <X size={20} />
          </button>

          {/* Desktop Collapse Button */}
          <button onClick={toggleDesktop} className="p-1.5 rounded-md hover:bg-gray-800 hidden md:block">
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
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition text-sm font-medium ${desktopCollapsed ? 'md:justify-center' : ''} ${
                  isActive ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon size={20} className="shrink-0" />
                {(!desktopCollapsed || sidebarOpen) && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-2 border-t border-gray-700 shrink-0">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-gray-400 hover:bg-red-600 hover:text-white transition ${desktopCollapsed ? 'md:justify-center' : ''}`}
          >
            <LogOut size={20} className="shrink-0" />
            {(!desktopCollapsed || sidebarOpen) && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${desktopCollapsed ? 'md:ml-16' : 'md:ml-64'}`}>
        
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <button onClick={() => setSidebarOpen(true)} className="p-1 rounded hover:bg-gray-100 md:hidden">
              <Menu size={24} />
            </button>
            <h1 className="text-lg md:text-xl font-semibold text-gray-800">Super Admin Portal</h1>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}