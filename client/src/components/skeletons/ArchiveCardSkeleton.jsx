export default function ArchiveCardSkeleton({ columnCount = 1, rowCount = 3 }) {
  return (
    <>
      {[...Array(columnCount)].map((_, i) => (
        <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
          <div className="h-6 w-40 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            {[...Array(rowCount)].map((_, j) => (
              <div key={j} className="flex justify-between items-center p-3 border border-gray-300 rounded">
                <div className="space-y-2">
                  <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  <div className="h-3 w-12 bg-gray-200 rounded"></div>
                </div>
                <div className="h-8 w-24 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
          
        </div>
      ))}
            {/* Import Archived Data */}
      <div className="bg-white p-6 rounded-lg shadow">

        {/* Heading */}
        <div className="h-6 w-52 bg-gray-200 rounded mb-6"></div>

        {/* Description */}
        <div className="space-y-2 mb-5">
          <div className="h-4 w-full bg-gray-200 rounded"></div>
          <div className="h-4 w-72 bg-gray-200 rounded"></div>
        </div>

        {/* File input */}
        <div className="flex items-center gap-4">
          <div className="h-10 w-28 bg-gray-200 rounded-full"></div>
          <div className="h-4 w-24 text-gray-500 bg-gray-200 rounded"></div>
        </div>

      </div>
    </>
  );
}