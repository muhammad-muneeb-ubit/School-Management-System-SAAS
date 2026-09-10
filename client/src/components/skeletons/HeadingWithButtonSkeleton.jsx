const HeadingWithButtonSkeleton = ({ btnCount = 1 }) => {
  return (
    <div className="flex justify-between items-center mb-6 animate-pulse">
      {/* Heading */}
      <div className="h-8 w-56 bg-gray-200 rounded"></div>
      <div className="flex space-x-2">
        {/* Register Button */}
        {Array.from({ length: btnCount }, (_, i) => (
          <div key={i} className={`h-11 ${btnCount > 1 ? 'w-36' : 'w-52'} bg-gray-200 rounded`}></div>
        ))}
      </div>
    </div>
  );
};

export default HeadingWithButtonSkeleton;