const ClassSectionFilterSkeleton = () => {
  return (
    <div className="bg-white p-4 mb-6 rounded-lg shadow animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Class */}
        <div>
          <div className="h-4 w-12 bg-gray-200 rounded mb-2"></div>

          <div className="h-11 w-full bg-gray-200 rounded"></div>
        </div>

        {/* Section */}
        <div>
          <div className="h-4 w-16 bg-gray-200 rounded mb-2"></div>

          <div className="h-11 w-full bg-gray-200 rounded"></div>
        </div>

      </div>
    </div>
  );
};

export default ClassSectionFilterSkeleton;