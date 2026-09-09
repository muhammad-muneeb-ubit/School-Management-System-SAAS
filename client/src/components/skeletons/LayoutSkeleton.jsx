import CollapseSidebarSkeleton from './CollapseSidebarSkeleton';
import PortalHeaderSkeleton from './PortalHeaderSkeleton';
import SidebarSkeleton from './SidebarSkeleton';

export default function LayoutSkeleton({theme='blue'}) {
  let isOpen = JSON.parse(localStorage.getItem('sidebarOpen'));
  // console.log('role:', role);
  return (
    <div className="min-h-screen bg-gray-100 flex animate-pulse">

      {/* Sidebar */}
          <CollapseSidebarSkeleton sidebarOpen={isOpen} theme={theme  } />

      {/* Right side */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <PortalHeaderSkeleton />

        {/* Empty main area */}
        <main className="flex-1"></main>

      </div>

    </div>
  );
}