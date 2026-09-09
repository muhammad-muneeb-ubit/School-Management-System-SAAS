export default function SearchBarSkeleton() {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4 flex flex-col md:flex-row gap-4 animate-pulse">
      <div className="h-10 w-full bg-gray-200 rounded"></div>
      {/* <div className="h-10 w-full md:w-48 bg-gray-200 rounded"></div> */}
    </div>
  );
}