export default function ClassCardSkeleton() {
  return (
    <div className="bg-white p-6 rounded-lg shadow border-t-4 border-gray-200 animate-pulse">
      <div className="h-6 w-24 bg-gray-200 rounded mb-4"></div>

      <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>

      <div className="h-4 w-36 bg-gray-200 rounded"></div>
    </div>
  );
}