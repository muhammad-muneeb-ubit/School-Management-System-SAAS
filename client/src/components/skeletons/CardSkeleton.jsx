export default function CardSkeleton({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-white p-6 rounded-lg shadow border-l-4 border-gray-200 animate-pulse">
          <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
          <div className="h-8 w-16 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  );
}