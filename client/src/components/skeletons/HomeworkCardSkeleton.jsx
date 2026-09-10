export default function HomeworkCardSkeleton() {
  return (
    <div className="bg-white p-5 rounded-lg shadow border-l-4 border-gray-200 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="h-5 w-40 bg-gray-200 rounded"></div>
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
      </div>

      <div className="h-4 w-3/4 bg-gray-200 rounded mb-4"></div>

      <div className="h-3 w-56 bg-gray-200 rounded"></div>
    </div>
  );
}