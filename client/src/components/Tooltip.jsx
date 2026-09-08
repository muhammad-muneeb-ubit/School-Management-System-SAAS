export default function Tooltip({ text, children }) {
  return (
    <div className="tooltip relative inline-block w-full">
      {children}
      <span className="tooltiptext absolute z-50 w-64 -translate-x-1/2 left-1/2 bottom-full mb-2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        {text}
      </span>
    </div>
  );
}