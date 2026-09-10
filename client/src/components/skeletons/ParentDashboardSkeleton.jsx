export default function ParentDashboardSkeleton({full = true}) {
  return (
    <div className="animate-pulse">

      {/* 3 Summary Cards */}
  {(full) && (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

        {/* Student Profile */}
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-200 h-[164px]">
          <div className="h-4 w-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-6 w-52 bg-gray-200 rounded mb-3"></div>
          <div className="h-4 w-28 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>

        {/* Attendance */}
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-200 h-[164px]">
          <div className="h-4 w-36 bg-gray-200 rounded mb-4"></div>
          <div className="h-8 w-20 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-28 bg-gray-200 rounded"></div>
        </div>

        {/* Fee Status */}
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-200 h-[164px]">
          <div className="h-4 w-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-6 w-24 bg-gray-200 rounded mb-3"></div>
          <div className="h-4 w-48 bg-gray-200 rounded"></div>
        </div>

      </div>
)}
      {/* Latest Exam Result */}
      <div className="bg-white p-6 rounded-lg shadow h-[244px]">

        {/* Title */}
        <div className="h-4 w-36 bg-gray-200 rounded mb-4"></div>

        {/* Exam Name */}
        <div className="h-6 w-48 bg-gray-200 rounded mb-2"></div>

        {/* Percentage / Grade */}
        <div className="h-4 w-52 bg-gray-200 rounded mb-5"></div>

        {/* Divider */}
        <div className="border-t border-gray-200 mb-5"></div>

        {/* Subject Breakdown */}
        <div className="h-4 w-36 bg-gray-200 rounded mb-3"></div>

        {/* Subject */}
        <div className="h-10 w-72 bg-gray-200 rounded"></div>

      </div>

    </div>
  );
}