export default function PieChartSkeleton() {
  return (
    <div className="bg-white p-6 rounded-lg shadow animate-pulse">
      <div className="h-6 w-48 bg-gray-200 rounded mb-6"></div>
      <div className="flex justify-center items-center h-[300px]">
        <div className="w-48 h-48 bg-gray-200 rounded-full"></div>
      </div>
      <div className="flex justify-center mt-4 space-x-4">
        <div className="h-3 w-16 bg-gray-200 rounded"></div>
        <div className="h-3 w-16 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}