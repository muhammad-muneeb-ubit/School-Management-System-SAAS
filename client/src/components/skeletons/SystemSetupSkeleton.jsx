export default function SystemSetupSkeleton() {
  return (
    <div className="animate-pulse">

      {/* Page Heading */}
      <div className="h-8 w-80 bg-gray-200 rounded mb-8"></div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="bg-white p-6 rounded-lg shadow border-l-4 border-gray-200 h-[124px]"
          >
            {/* Label */}
            <div className="h-4 w-40 bg-gray-200 rounded mb-5"></div>

            {/* Number */}
            <div className="h-9 w-16 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>

      {/* Form Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Update Branch Limit */}
        <div className="bg-white p-6 rounded-lg shadow h-[326px]">

          {/* Title */}
          <div className="h-6 w-56 bg-gray-200 rounded mb-7"></div>

          {/* Label */}
          <div className="h-4 w-40 bg-gray-200 rounded mb-2"></div>

          {/* Input */}
          <div className="h-12 w-full bg-gray-200 rounded mb-2"></div>

          {/* Description */}
          <div className="h-3 w-80 bg-gray-200 rounded mb-5"></div>

          {/* Button */}
          <div className="h-11 w-full bg-gray-200 rounded"></div>
        </div>

        {/* Create New Branch */}
        <div className="bg-white p-6 rounded-lg shadow h-[326px]">

          {/* Title */}
          <div className="h-6 w-64 bg-gray-200 rounded mb-7"></div>

          {/* Branch Name */}
          <div className="h-4 w-28 bg-gray-200 rounded mb-2"></div>
          <div className="h-12 w-full bg-gray-200 rounded mb-5"></div>

          {/* Address */}
          <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
          <div className="h-12 w-full bg-gray-200 rounded mb-5"></div>

          {/* Button */}
          <div className="h-11 w-full bg-gray-200 rounded"></div>
        </div>

      </div>
    </div>
  );
}