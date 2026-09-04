import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';

export default function FeeManagement() {
    const [classes, setClasses] = useState([]);
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(false);

    // Forms
    const [structureForm, setStructureForm] = useState({ classId: '', amount: 5000, frequency: 'Monthly' });
    const [generateForm, setGenerateForm] = useState({ classId: '', month: new Date().toISOString().slice(0, 7) });

    // Payment Modal
    const [showPayModal, setShowPayModal] = useState(false);
    const [selectedFee, setSelectedFee] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState(0);

    const fetchClasses = async () => {
        try {
            const res = await api.get('/academic/classes');
            setClasses(res.data);
        } catch (err) { console.error(err); }
    };

    const fetchFees = async () => {
        try {
            const res = await api.get('/fees');
            setFees(res.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => {
        fetchClasses();
        fetchFees();
    }, []);

    const handleSetStructure = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/fees/structure', structureForm);
            alert('Fee structure saved!');
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to set structure');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/fees/generate', generateForm);
            alert(res.data.message);
            fetchFees(); // Refresh list
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to generate invoices');
        } finally {
            setLoading(false);
        }
    };

    const openPayModal = (fee) => {
        setSelectedFee(fee);
        setPaymentAmount(fee.totalAmount - fee.amountPaid); // Default to remaining balance
        setShowPayModal(true);
    };

    const handleRecordPayment = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.put(`/fees/${selectedFee._id}/pay`, { amountPaid: Number(paymentAmount) });
            alert('Payment recorded!');
            setShowPayModal(false);
            fetchFees();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to record payment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Fee Management</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Set Fee Structure */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">Set Class Fee Structure</h2>
                    <form onSubmit={handleSetStructure} className="space-y-3">
                        <select value={structureForm.classId} onChange={(e) => setStructureForm({ ...structureForm, classId: e.target.value })} className="w-full border p-2 rounded" required>
                            <option value="">Select Class</option>
                            {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                        </select>
                        <input type="number" placeholder="Amount (e.g., 5000)" value={structureForm.amount} onChange={(e) => setStructureForm({ ...structureForm, amount: e.target.value })} className="w-full border p-2 rounded" required />
                        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Save Structure</button>
                    </form>
                </div>

                {/* Generate Monthly Invoices */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">Generate Monthly Invoices</h2>
                    <form onSubmit={handleGenerate} className="space-y-3">
                        <select value={generateForm.classId} onChange={(e) => setGenerateForm({ ...generateForm, classId: e.target.value })} className="w-full border p-2 rounded" required>
                            <option value="">Select Class</option>
                            {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                        </select>
                        <input type="month" value={generateForm.month} onChange={(e) => setGenerateForm({ ...generateForm, month: e.target.value })} className="w-full border p-2 rounded" required />
                        <button type="submit" disabled={loading} className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">Generate Invoices</button>
                    </form>
                </div>
            </div>

            {/* Fees List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b">
                    <h2 className="text-lg font-semibold">Fee Records</h2>
                </div>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paid</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {fees.length > 0 ? (
                            fees.map((f) => (
                                <tr key={f._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {f.studentId?.firstName} {f.studentId?.lastName} ({f.studentId?.rollNumber})
                                    </td>
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
                                    {/* Replace the Action td in the Fees table with this */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {f.status === 'Paid' ? (
                                            <span className="text-gray-400 italic">Fully Paid</span>
                                        ) : (
                                            <button onClick={() => openPayModal(f)} className="text-blue-600 hover:underline font-medium">
                                                Record Payment
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">No fee records found. Generate invoices first.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Payment Modal */}
            {showPayModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Record Payment</h2>
                        <p className="mb-2 text-sm text-gray-600">
                            Student: <span className="font-medium">{selectedFee.studentId?.firstName} {selectedFee.studentId?.lastName}</span>
                        </p>
                        <p className="mb-4 text-sm text-gray-600">
                            Pending Amount: <span className="font-medium text-red-600">Rs {selectedFee.totalAmount - selectedFee.amountPaid}</span>
                        </p>
                        <form onSubmit={handleRecordPayment}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Enter Amount Received</label>
                                <input
                                    type="number"
                                    value={paymentAmount}
                                    onChange={(e) => setPaymentAmount(e.target.value)}
                                    className="w-full border p-2 rounded"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button type="button" onClick={() => setShowPayModal(false)} className="px-4 py-2 text-gray-600 rounded hover:bg-gray-100">Cancel</button>
                                <button type="submit" disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-400">
                                    {loading ? 'Saving...' : 'Record Payment'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}