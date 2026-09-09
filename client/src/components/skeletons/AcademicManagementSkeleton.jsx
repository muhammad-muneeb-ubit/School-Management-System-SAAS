export default function AcademicManagementSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">

      {/* Classes Skeleton */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        {/* Heading */}
        <div className="h-6 w-52 bg-gray-200 rounded mb-5"></div>

        {/* Form */}
        <div className="flex gap-2 mb-5">
          <div className="h-10 flex-1 bg-gray-200 rounded-lg"></div>
          <div className="h-10 w-14 bg-gray-200 rounded-lg"></div>
        </div>

        {/* Class items */}
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-10 w-full bg-gray-200 rounded-lg"
            ></div>
          ))}
        </div>
      </div>


      {/* Sections Skeleton */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        {/* Heading */}
        <div className="h-6 w-32 bg-gray-200 rounded mb-5"></div>

        {/* Form */}
        <div className="flex gap-2 mb-5">
          <div className="h-10 w-16 bg-gray-200 rounded-lg"></div>
          <div className="h-10 w-20 bg-gray-200 rounded-lg"></div>
          <div className="h-10 w-14 bg-gray-200 rounded-lg"></div>
        </div>

        {/* Section items */}
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-10 w-full bg-gray-200 rounded-lg"
            ></div>
          ))}
        </div>
      </div>


      {/* Subjects Skeleton */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        {/* Heading */}
        <div className="h-6 w-32 bg-gray-200 rounded mb-5"></div>

        {/* Form */}
        <div className="flex gap-2 mb-5">
          <div className="h-10 flex-1 bg-gray-200 rounded-lg"></div>
          <div className="h-10 w-16 bg-gray-200 rounded-lg"></div>
          <div className="h-10 w-14 bg-gray-200 rounded-lg"></div>
        </div>

        {/* Subject items */}
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-10 w-full bg-gray-200 rounded-lg"
            ></div>
          ))}
        </div>
      </div>

    </div>
  );
}