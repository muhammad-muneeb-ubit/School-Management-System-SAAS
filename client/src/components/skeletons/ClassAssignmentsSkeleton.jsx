export default function ClassAssignmentsSkeleton({full = false}) {
  return (
    <div className={`${full ? 'w-full' : 'w-150'} bg-white p-6 rounded-lg shadow border-l-4 border-gray-200 animate-pulse`}>
      <div className="h-4 w-32 bg-gray-200 rounded mb-5"></div>

      <div className="flex justify-between items-center">
        <div className="h-5 w-28 bg-gray-200 rounded"></div>
        <div className="h-5 w-28 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}