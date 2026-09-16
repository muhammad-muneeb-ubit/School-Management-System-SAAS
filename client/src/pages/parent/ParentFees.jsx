import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import { downloadFile } from '../../utils/downloadFile';
import { DashboardHeaderSkeleton, TableSkeleton, ChildSelectorSkeleton } from '../../components/skeletons';


export default function ParentFees() {
  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState('');
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch children
  useEffect(() => {
    setLoading(true);
    const fetchChildren = async () => {
      try {
        const res = await api.get('/students/my-children');
        setChildren(res.data);
        if (res.data.length > 0) setSelectedChildId(res.data[0]._id);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchChildren();
  }, []);

  // Fetch fees when child changes
  useEffect(() => {
    if (!selectedChildId) return;
    setLoading(true);
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

  // return (
  //   <>{loading ? (
  //     <DashboardLayout>
  //       <DashboardHeaderSkeleton />
  //       <ChildSelectorSkeleton />
  //       <TableSkeleton cols={4} rows={5} />
  //     </DashboardLayout>
  //   ) : (
  //     <DashboardLayout>
  //       <h1 className="text-2xl font-bold text-gray-800 mb-6">Fee History</h1>

  //       {/* Child Selector */}
  //       <div className="bg-white p-4 rounded-lg shadow mb-6 flex items-center space-x-4">
  //         <label className="font-medium text-gray-700">Viewing Child:</label>
  //         <select
  //           value={selectedChildId}
  //           onChange={(e) => setSelectedChildId(e.target.value)}
  //           className="border border-gray-300 p-2 rounded flex-1"
  //         >
  //           {children.length > 0 ? children.map((c) => (
  //             <option key={c._id} value={c._id}>
  //               {c.firstName} {c.lastName} ({c.classId?.name || 'No Class'})
  //             </option>
  //           )) : <option disabled>No children found</option>}
  //         </select>
  //       </div>

  //       {/* Fees Table */}
  //       <div className="bg-white rounded-lg shadow overflow-hidden">
  //         <table className="min-w-full divide-y divide-gray-200">
  //           <thead className="bg-gray-50">
  //             <tr>
  //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
  //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Amount</th>
  //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount Paid</th>
  //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
  //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Download Voucher</th>
  //             </tr>
  //           </thead>
  //           <tbody className="bg-white divide-y divide-gray-200">
  //             {!loading && fees.length > 0 ? (
  //               fees.map((f) => (
  //                 <tr key={f._id}>
  //                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{f.month}</td>
  //                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rs {f.totalAmount}</td>
  //                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rs {f.amountPaid}</td>
  //                   <td className="px-6 py-4 whitespace-nowrap text-sm">
  //                     <span className={`px-2 py-1 rounded-full text-xs font-medium ${f.status === 'Paid' ? 'bg-green-100 text-green-700' :
  //                       f.status === 'Partial' ? 'bg-yellow-100 text-yellow-700' :
  //                         'bg-red-100 text-red-700'
  //                       }`}>
  //                       {f.status}
  //                     </span>
  //                   </td>
  //                   <td className="px-6 py-4 whitespace-nowrap text-sm">
  //                     <button
  //                       onClick={() => downloadFile(`/pdf/fee-receipt/${f._id}`, `Receipt_${f.month}.pdf`)}
  //                       className="text-purple-600 hover:underline font-medium"
  //                     >
  //                       Download PDF
  //                     </button>
  //                   </td>
  //                 </tr>
  //               ))
  //             ) : (
  //               <tr>
  //                 <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
  //                   {loading ? 'Loading...' : 'No fee records found for this child.'}
  //                 </td>
  //               </tr>
  //             )}
  //           </tbody>
  //         </table>
  //       </div>
  //     </DashboardLayout>)}</>
  // );

return (
  <>
    {loading ? (
      <DashboardLayout>
        <DashboardHeaderSkeleton />
        <ChildSelectorSkeleton />
        <TableSkeleton cols={4} rows={5} />
      </DashboardLayout>
    ) : (
      <DashboardLayout>

        {/* Page Heading */}
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Fee History
        </h1>

        {/* Child Selector */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">

            <label className="font-medium text-gray-700 text-sm sm:text-base shrink-0">
              Viewing Child:
            </label>

            <select
              value={selectedChildId}
              onChange={(e) => setSelectedChildId(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full sm:flex-1 min-w-0"
            >
              {children.length > 0 ? (
                children.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.firstName} {c.lastName} (
                    {c.classId?.name || 'No Class'}
                    )
                  </option>
                ))
              ) : (
                <option disabled>No children found</option>
              )}
            </select>

          </div>
        </div>

        {/* Fees */}
        <div className="bg-white rounded-lg shadow overflow-hidden">

          {fees.length > 0 ? (
            <>
              {/* ================================= */}
              {/* DESKTOP / TABLET TABLE             */}
              {/* ================================= */}

              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full divide-y divide-gray-200">

                  <thead className="bg-gray-50">
                    <tr>
                      <th className="w-[18%] px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Month
                      </th>

                      <th className="w-[18%] px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Total Amount
                      </th>

                      <th className="w-[18%] px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Amount Paid
                      </th>

                      <th className="w-[16%] px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>

                      <th className="w-[30%] px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Download Voucher
                      </th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200">

                    {fees.map((f) => (
                      <tr
                        key={f._id}
                        className="hover:bg-gray-50"
                      >

                        <td className="px-4 py-3 text-sm text-gray-900">
                          {f.month}
                        </td>

                        <td className="px-4 py-3 text-sm text-gray-900">
                          Rs {f.totalAmount}
                        </td>

                        <td className="px-4 py-3 text-sm text-gray-900">
                          Rs {f.amountPaid}
                        </td>

                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              f.status === 'Paid'
                                ? 'bg-green-100 text-green-700'
                                : f.status === 'Partial'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {f.status}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-sm">
                          <button
                            onClick={() =>
                              downloadFile(
                                `/pdf/fee-receipt/${f._id}`,
                                `Receipt_${f.month}.pdf`
                              )
                            }
                            className="text-purple-600 hover:underline font-medium whitespace-nowrap"
                          >
                            Download PDF
                          </button>
                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>
              </div>


              {/* ================================= */}
              {/* MOBILE CARDS                      */}
              {/* ================================= */}

              <div className="sm:hidden divide-y divide-gray-200">

                {fees.map((f) => (
                  <div
                    key={f._id}
                    className="p-4"
                  >

                    {/* Month + Status */}
                    <div className="flex items-center justify-between gap-3">

                      <p className="text-sm font-semibold text-gray-900">
                        {f.month}
                      </p>

                      <span
                        className={`shrink-0 px-2 py-1 rounded-full text-xs font-medium ${
                          f.status === 'Paid'
                            ? 'bg-green-100 text-green-700'
                            : f.status === 'Partial'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {f.status}
                      </span>

                    </div>


                    {/* Amount Information */}
                    <div className="grid grid-cols-2 gap-3 mt-3">

                      <div>
                        <p className="text-xs text-gray-500">
                          Total Amount
                        </p>

                        <p className="text-sm font-medium text-gray-800 mt-0.5">
                          Rs {f.totalAmount}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">
                          Amount Paid
                        </p>

                        <p className="text-sm font-medium text-gray-800 mt-0.5">
                          Rs {f.amountPaid}
                        </p>
                      </div>

                    </div>


                    {/* Download */}
                    <div className="mt-3 pt-3 border-t border-gray-100">

                      <button
                        onClick={() =>
                          downloadFile(
                            `/pdf/fee-receipt/${f._id}`,
                            `Receipt_${f.month}.pdf`
                          )
                        }
                        className="text-purple-600 hover:underline font-medium text-sm"
                      >
                        Download PDF
                      </button>

                    </div>

                  </div>
                ))}

              </div>
            </>
          ) : (
            <div className="px-4 py-8 text-center text-sm text-gray-500">
              No fee records found for this child.
            </div>
          )}

        </div>

      </DashboardLayout>
    )}
  </>
);
}