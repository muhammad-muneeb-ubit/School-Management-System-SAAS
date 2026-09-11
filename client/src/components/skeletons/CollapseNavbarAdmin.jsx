// export default function CollapseNavbarAdmin({ sidebarOpen = true }) {
//   const items = Array.from({ length: 11 });

//   return (
//     <div
//       className={`
//         ${sidebarOpen ? 'w-64' : 'w-15'}
//         fixed left-0 top-0
//         h-screen
//         bg-blue-800
//         flex flex-col
//         z-50
//         animate-pulse
//         transition-all duration-300
//       `}
//     >
//       {/* Header */}
//       <div className="h-[73px] p-4 flex items-center justify-between border-b border-blue-700 shrink-0">
//         {sidebarOpen && (
//           <div className="h-6 w-16 bg-blue-700 rounded"></div>
//         )}

//         <div className="h-8 w-8 bg-blue-700 rounded"></div>
//       </div>

//       {/* Menu */}
//       <nav className="p-2 space-y-2 overflow-hidden">
//         {items.map((_, index) => (
//           <div
//             key={index}
//             className={`
//               flex items-center gap-3
//               rounded-lg
//               ${sidebarOpen ? 'px-3' : 'justify-center'}
//               h-10
//             `}
//           >
//             {/* Icon */}
//             <div className="h-5 w-5 bg-blue-700 rounded"></div>

//             {/* Text */}
//             {sidebarOpen && (
//               <div className="h-4 w-24 bg-blue-700 rounded"></div>
//             )}
//           </div>
//         ))}
//       </nav>

//       {/* Logout */}
//       <div className="p-2 border-t border-blue-700 shrink-0">
//         <div
//           className={`
//             flex items-center gap-3
//             h-10
//             ${sidebarOpen ? 'px-3' : 'justify-center'}
//           `}
//         >
//           <div className="h-5 w-5 bg-blue-700 rounded"></div>

//           {sidebarOpen && (
//             <div className="h-4 w-16 bg-blue-700 rounded"></div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


export default function CollapseNavbarAdmin({ sidebarOpen = true }) {
  const items = Array.from({ length: 11 });

  return (
    <div
      className={`
        ${sidebarOpen ? 'w-64' : 'w-15'}
        fixed left-0 top-0
        h-screen
        flex flex-col
        z-50
        animate-pulse
        transition-all duration-300
        bg-[var(--sidebar-bg)]
      `}
    >
      {/* Header */}
      <div
        className="
          h-[73px]
          p-4
          flex
          items-center
          justify-between
          border-b
          shrink-0
        "
        style={{ borderColor: 'var(--sidebar-border)' }}
      >
        {sidebarOpen && (
          <div className="h-6 w-16 bg-white/20 rounded"></div>
        )}

        <div className="h-8 w-8 bg-white/20 rounded"></div>
      </div>

      {/* Menu */}
      <nav className="p-2 space-y-2 overflow-hidden">
        {items.map((_, index) => (
          <div
            key={index}
            className={`
              flex items-center gap-3
              rounded-lg
              ${sidebarOpen ? 'px-3' : 'justify-center'}
              h-10
            `}
          >
            {/* Icon */}
            <div className="h-5 w-5 bg-white/20 rounded"></div>

            {/* Text */}
            {sidebarOpen && (
              <div className="h-4 w-24 bg-white/20 rounded"></div>
            )}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div
        className="p-2 border-t shrink-0"
        style={{ borderColor: 'var(--sidebar-border)' }}
      >
        <div
          className={`
            flex items-center gap-3
            h-10
            ${sidebarOpen ? 'px-3' : 'justify-center'}
          `}
        >
          <div className="h-5 w-5 bg-white/20 rounded"></div>

          {sidebarOpen && (
            <div className="h-4 w-16 bg-white/20 rounded"></div>
          )}
        </div>
      </div>
    </div>
  );
}