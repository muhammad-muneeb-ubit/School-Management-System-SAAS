
export default function CollapseSidebarSkeleton({ sidebarOpen = true, theme, user = 'Principal' }) {

    // console.log(" from collapse sidebar skeleton",user?.role);
    let menuCount = 0;
    if (user?.role === 'Principal') {
        menuCount = 13;
    } else if (user?.role === 'Teacher') {
        menuCount = 6;
    }else if (user?.role === 'Parent') {
        menuCount = 3;
    }else if (user?.role  === 'Super Admin' || theme === 'admin') {
        menuCount = 3;
    }

  // console.log('CollapseSidebarSkeleton - theme:', theme);
  const items = Array.from({ length: menuCount || 7});
  const bgColor = theme === 'admin' ? 'bg-gray-900' : 'bg-blue-800';
  const borderColor = theme === 'admin' ? 'border-gray-700' : 'border-blue-700';
  const itemColor = theme === 'admin' ? 'bg-gray-800' : 'bg-blue-700';

  return (
    <div
      className={` ${sidebarOpen ? 'w-64' : 'w-15'} fixed left-0 top-0 h-screen ${bgColor} flex flex-col z-50 animate-pulse transition-all duration-300`}>
      {/* Header */}
      <div className={`h-[73px] p-4 flex items-center justify-between border-b ${borderColor} shrink-0`}>
        {sidebarOpen && (
          <div className={`h-6 w-16 ${itemColor} rounded`}></div>
        )}

        <div className={`h-8 w-8 ${itemColor} rounded`}></div>
      </div>

      {/* Menu */}
      <nav className="p-2 space-y-2 overflow-hidden">
        {items.map((_, index) => (
          <div key={index} className={`   flex items-center gap-3   rounded-lg   ${sidebarOpen ? 'px-3' : 'justify-center'}   h-10 `}>
            {/* Icon */}
            <div className={`h-5 w-5 ${itemColor} rounded`}></div>

            {/* Text */}
            {sidebarOpen && (
              <div className={`h-4 w-24 ${itemColor} rounded`}></div>
            )}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className={`p-2 border-t ${borderColor} shrink-0`}>
        <div
          className={`
            flex items-center gap-3
            h-10
            ${sidebarOpen ? 'px-3' : 'justify-center'}
          `}
        >
          <div className={`h-5 w-5 ${itemColor} rounded`}></div>

          {sidebarOpen && (
            <div className={`h-4 w-16 ${itemColor} rounded`}></div>
          )}
        </div>
      </div>
    </div>
  );
}