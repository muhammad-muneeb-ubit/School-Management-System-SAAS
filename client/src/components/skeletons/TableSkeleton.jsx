export default function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="bg-gray-50 p-4 border-b border-gray-200">
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            {[...Array(cols)].map((_, i) => (
              <th key={i} className="px-6 py-3">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mx-auto"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {[...Array(rows)].map((_, r) => (
            <tr key={r}>
              {[...Array(cols)].map((_, c) => (
                <td key={c} className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 w-full max-w-[120px] bg-gray-200 rounded animate-pulse"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}