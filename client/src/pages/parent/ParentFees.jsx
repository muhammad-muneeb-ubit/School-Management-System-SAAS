import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import { downloadFile } from '../../utils/downloadFile';



export default function ParentFees() {
  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState('');
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch children
  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const res = await api.get('/students/my-children');
        setChildren(res.data);
        if (res.data.length > 0) setSelectedChildId(res.data[0]._id);
      } catch (err) { console.error(err); }
    };
    fetchChildren();
  }, []);

  // Fetch fees when child changes
  useEffect(() => {
    if (!selectedChildId) return;

    const fetchFees = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/fees/my-fee?studentId=${selectedChildId}`);
        setFees(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFees();
  }, [selectedChildId]);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Fee History</h1>

      {/* Child Selector */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 flex items-center space-x-4">
        <label className="font-medium text-gray-700">Viewing Child:</label>
        <select
          value={selectedChildId}
          onChange={(e) => setSelectedChildId(e.target.value)}
          className="border p-2 rounded flex-1"
        >
          { children.length > 0 ? children.map((c) => (
            <option key={c._id} value={c._id}>
              {c.firstName} {c.lastName} ({c.classId?.name || 'No Class'})
            </option>
          )) : <option disabled>No children found</option> }
        </select>
      </div>

      {/* Fees Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount Paid</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {!loading && fees.length > 0 ? (
              fees.map((f) => (
                <tr key={f._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{f.month}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rs {f.totalAmount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rs {f.amountPaid}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${f.status === 'Paid' ? 'bg-green-100 text-green-700' :
                        f.status === 'Partial' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                      }`}>
                      {f.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => downloadFile(`/pdf/fee-receipt/${f._id}`, `Receipt_${f.month}.pdf`)}
                      className="text-purple-600 hover:underline font-medium"
                    >
                      Download PDF
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                  {loading ? 'Loading...' : 'No fee records found for this child.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}