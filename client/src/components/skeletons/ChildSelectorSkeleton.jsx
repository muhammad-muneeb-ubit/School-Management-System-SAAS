export default function ChildSelectorSkeleton() {
  return (
    <div className="bg-white p-4 rounded-lg shadow animate-pulse mb-6">
      <div className="flex items-center gap-4">
        {/* Label */}
        <div className="h-5 w-28 bg-gray-200 rounded"></div>

        {/* Select */}
        <div className="h-11 flex-1 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}