const PortalHeaderSkeleton = () => {
  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-sm px-6 py-5 mb-6 animate-pulse">
      <div className="flex items-center justify-between">
        
        {/* Portal title */}
        <div className="h-7 w-48 bg-gray-200 rounded"></div>

        {/* Email */}
        <div className="h-5 w-32 bg-gray-200 rounded"></div>

      </div>
    </div>
  );
};

export default PortalHeaderSkeleton;