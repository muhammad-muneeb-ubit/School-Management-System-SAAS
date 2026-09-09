export default function AnnouncementCardSkeleton({ count = 4 }) {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-white p-4 rounded-lg shadow border-l-4 border-gray-200 animate-pulse mb-4">
          <div className="flex justify-between items-start mb-3">
            <div className="h-5 w-1/3 bg-gray-200 rounded"></div>
            <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
          </div>
          <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-3/4 bg-gray-200 rounded mb-4"></div>
          <div className="h-3 w-24 bg-gray-200 rounded"></div>
        </div>
      ))}
    </>
  );
}