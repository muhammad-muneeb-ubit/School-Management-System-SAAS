export default function PromotionFormSkeleton() {
  return (
    <div className="bg-white p-5 rounded-xl shadow border border-gray-100 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

        {/* Select Current Class */}
        <div>
          <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
          <div className="h-11 w-full bg-gray-200 rounded-lg"></div>
        </div>

        {/* Target Session */}
        <div>
          <div className="h-4 w-28 bg-gray-200 rounded mb-2"></div>
          <div className="h-11 w-full bg-gray-200 rounded-lg"></div>
        </div>

        {/* Promote To */}
        <div>
          <div className="h-4 w-40 bg-gray-200 rounded mb-2"></div>
          <div className="h-11 w-full bg-gray-200 rounded-lg"></div>
        </div>

        {/* Retain To */}
        <div>
          <div className="h-4 w-40 bg-gray-200 rounded mb-2"></div>
          <div className="h-11 w-full bg-gray-200 rounded-lg"></div>
        </div>

      </div>

      {/* Execute Promotion Button */}
      <div className="mt-4">
        <div className="h-11 w-44 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );
}