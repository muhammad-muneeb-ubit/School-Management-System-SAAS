export default function BarChartSkeleton() {
  return (
    <div className="bg-white p-6 rounded-lg shadow animate-pulse">
      <div className="h-6 w-48 bg-gray-200 rounded mb-6"></div>
      <div className="flex items-end justify-around h-[300px] w-full pt-6">
        <div className="w-1/4 bg-gray-200 rounded-t h-1/2"></div>
        <div className="w-1/4 bg-gray-200 rounded-t h-3/4"></div>
      </div>
      <div className="flex justify-center mt-4 space-x-4">
        <div className="h-3 w-12 bg-gray-200 rounded"></div>
        <div className="h-3 w-12 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}