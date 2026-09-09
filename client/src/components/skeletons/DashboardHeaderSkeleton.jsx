const DashboardHeaderSkeleton = ({text=false}) => {
  return (
    <div className=" animate-pulse">
      {/* Dashboard Heading */}
      <div className="h-8 w-56 bg-gray-200 rounded mb-6 mr-6"></div>
      {text && <div className="h-4 w-120 bg-gray-200 rounded mb-6 mr-6"></div>}
    </div>
  );
};

export default DashboardHeaderSkeleton;