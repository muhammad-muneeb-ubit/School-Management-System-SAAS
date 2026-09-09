export default function AttendanceFilterSkeleton() {
  return (
    <div className="bg-white p-5 rounded-xl shadow border border-gray-100 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">

        {/* Class */}
        <div>
          <div className="h-4 w-12 bg-gray-200 rounded mb-2"></div>
          <div className="h-11 w-full bg-gray-200 rounded-lg"></div>
        </div>

        {/* Section */}
        <div>
          <div className="h-4 w-16 bg-gray-200 rounded mb-2"></div>
          <div className="h-11 w-full bg-gray-200 rounded-lg"></div>
        </div>

        {/* Date */}
        <div>
          <div className="h-4 w-10 bg-gray-200 rounded mb-2"></div>
          <div className="h-11 w-full bg-gray-200 rounded-lg"></div>
        </div>

        {/* Load Students button */}
        <div>
          <div className="h-11 w-full bg-gray-200 rounded-lg"></div>
        </div>

      </div>
    </div>
  );
}