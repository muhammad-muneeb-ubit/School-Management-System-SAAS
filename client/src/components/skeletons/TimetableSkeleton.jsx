export default function TimetableSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
      <div className="bg-white p-4 rounded-lg shadow h-fit space-y-4">
        <div className="h-6 w-32 bg-gray-200 rounded"></div>
        <div className="h-10 w-full bg-gray-200 rounded"></div>
        <div className="h-10 w-full bg-gray-200 rounded"></div>
        <div className="h-10 w-full bg-gray-200 rounded"></div>
        <div className="h-10 w-full bg-gray-200 rounded"></div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow lg:col-span-2 space-y-4">
        <div className="h-6 w-40 bg-gray-200 rounded"></div>
        <div className="h-20 w-full bg-gray-200 rounded"></div>
        <div className="h-20 w-full bg-gray-200 rounded"></div>
        <div className="h-20 w-full bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}