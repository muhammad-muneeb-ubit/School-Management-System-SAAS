const InvoiceFiltersSkeleton = () => {
  return (
    <div className="bg-white p-5 rounded-lg shadow animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Class */}
        <div>
          <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
          <div className="h-11 w-full bg-gray-200 rounded"></div>
        </div>

        {/* Month */}
        <div>
          <div className="h-4 w-28 bg-gray-200 rounded mb-2"></div>
          <div className="h-11 w-full bg-gray-200 rounded"></div>
        </div>

        {/* Status */}
        <div>
          <div className="h-4 w-28 bg-gray-200 rounded mb-2"></div>
          <div className="h-11 w-full bg-gray-200 rounded"></div>
        </div>

      </div>
    </div>
  );
};

export default InvoiceFiltersSkeleton;