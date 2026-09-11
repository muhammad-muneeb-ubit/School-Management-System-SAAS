// import SuperAdminLayout from '../SuperAdminLayout';
// import CardSkeleton from './CardSkeleton';
// import CollapseSidebarSkeleton from './CollapseSidebarSkeleton';
// import DashboardHeaderSkeleton from './DashboardHeaderSkeleton';
// import PortalHeaderSkeleton from './PortalHeaderSkeleton';
// import SidebarSkeleton from './SidebarSkeleton';
// import SystemSetupSkeleton from './SystemSetupSkeleton';

// export default function LayoutSkeleton({ theme = 'blue' , user}) {
//   let isOpen = JSON.parse(localStorage.getItem('sidebarOpen'));
//   // console.log('role:', role);
//   return (
//     <div className="min-h-screen bg-gray-100 flex animate-pulse">

//       {/* Sidebar */}
//       <CollapseSidebarSkeleton sidebarOpen={isOpen} theme={theme} user={user} />

//       {/* Right side */}
//       <div className="flex-1 flex flex-col min-w-0">

//         {/* Header */}
//         {theme == 'blue' && <PortalHeaderSkeleton />}

//         {/* Empty main area */}
//         <main className="flex-1"></main>

//       </div>

//     </div>
//   );
// }


import CollapseSidebarSkeleton from './CollapseSidebarSkeleton';
import PortalHeaderSkeleton from './PortalHeaderSkeleton';

export default function LayoutSkeleton({ user }) {
  const saved = localStorage.getItem('sidebarOpen');

  const sidebarOpen =
    saved === null ? true : saved === 'true';

  return (
    <div className="min-h-screen bg-background flex animate-pulse">

      {/* Sidebar */}

      <CollapseSidebarSkeleton
        sidebarOpen={sidebarOpen}
        user={user}
      />

      {/* Main */}

      <div
        className={`
          flex-1
          flex
          flex-col
          min-w-0
          ${sidebarOpen ? 'ml-64' : 'ml-16'}
        `}
      >

        {/* Header */}

        <PortalHeaderSkeleton />

        {/* Main Content */}

        <main className="flex-1" />

      </div>
    </div>
  );
}