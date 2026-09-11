import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout'; // We will make this conditional later
import api from '../services/api';
import { DashboardHeaderSkeleton, SearchBarSkeleton, TableSkeleton } from '../components/skeletons';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState('');

  useEffect(() => {
    setLoading(true);
    const fetchLogs = async () => {
      try {
        const res = await api.get('/logs');
        setLogs(res.data);
        // console.log('Fetched logs:', res.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchLogs();
  }, []);

  return (
    <> {loading ? (<>
      <DashboardHeaderSkeleton />
      <SearchBarSkeleton btn={true} />
      <div className="h-4 w-72 bg-white p-3 rounded mb-4 "></div>
      <TableSkeleton columnCount={5} rowCount={8} />
    </>)
      : (<div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">System Audit Logs</h1>
        <div className="bg-white p-4 rounded-lg shadow mb-4 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by user email or entity..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-gray-300  p-2 rounded"
          />
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="border border-gray-300  p-2 rounded w-full md:w-48"
          >
            <option value="">All Actions</option>
            <option value="save">Save</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
          </select>
        </div>
        <p className="text-sm text-gray-500 mb-4">Logs are automatically deleted after 45 days.</p>

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 min-w-[1000px] md:min-w-0">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Performed By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 ">
              {(() => {
                const filteredLogs = logs.filter(log =>
                  (log.performedBy?.email?.toLowerCase().includes(search.toLowerCase()) ||
                    log.entity?.toLowerCase().includes(search.toLowerCase())) &&
                  (!filterAction || log.action === filterAction)
                );

                return filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <tr key={log._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.action}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.entity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.performedBy?.email || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.performedBy?.role || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" title={log.changes.message || 'Not Provided'}>
                        {log.changes.message || 'Not Provided'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(log.timestamp).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">No logs found.</td></tr>
                );
              })()}
            </tbody>
          </table>
        </div>
      </div>)}</>
  );
}