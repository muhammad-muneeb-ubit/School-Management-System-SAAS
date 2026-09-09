import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import api from '../services/api';
import { useSelector } from 'react-redux';
import { downloadFile } from '../utils/downloadFile';
import { showSuccess, showError, showConfirm } from '../utils/sweetAlert';
import Tooltip from '../components/Tooltip';
import { TableSkeleton,SearchBarSkeleton, HeadingWithButtonSkeleton } from '../components/skeletons';
export default function Exams() {
    const [classes, setClasses] = useState([]);
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', classId: '', totalMarksPerSubject: 100, passingPercentage: 40 });

    // New state for Marks Entry
    const [showMarksModal, setShowMarksModal] = useState(false);
    const [selectedExam, setSelectedExam] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [marksData, setMarksData] = useState({}); // { studentId: marks }
    const { user } = useSelector((state) => state.auth);
    const fetchClasses = async () => {
        setLoading(true);
        try {
            const res = await api.get('/academic/classes');
            setClasses(res.data);
        } catch (err) { console.error(err); }
        finally {
            setLoading(false);
        }
    };

    const fetchExams = async () => {
        setLoading(true);
        try {
            const res = await api.get('/exams');
            setExams(res.data);
        } catch (err) { console.error(err); }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
        fetchExams();
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/exams', formData);
            setShowModal(false);
            fetchExams();
        } catch (err) {
            showError(err.response?.data?.error || 'Failed to create exam');
        } finally {
            setLoading(false);
        }
    };

    // --- Marks Entry Logic ---
    const openMarksModal = async (exam) => {
        setSelectedExam(exam);
        setShowMarksModal(true);

        try {
            // Fetch subjects for this class
            const subRes = await api.get(`/academic/classes/${exam.classId._id}/subjects`);
            setSubjects(subRes.data);

            // Fetch students for this class
            const stuRes = await api.get(`/students?classId=${exam.classId._id}`);
            setStudents(stuRes.data);

            // Initialize marks data to empty strings
            const initMarks = {};
            stuRes.data.forEach(s => { initMarks[s._id] = ''; });
            setMarksData(initMarks);
        } catch (err) {
            console.error(err);
        }
    };

    const handleMarksChange = (studentId, value) => {
        setMarksData({ ...marksData, [studentId]: value });
    };

    const handleSaveMarks = async () => {
        if (!selectedSubject) return showError('Please select a subject first.');
        setLoading(true);

        try {
            // Loop through students and submit marks one by one (or batch if preferred)
            for (const studentId in marksData) {
                if (marksData[studentId] !== '') {
                    await api.put(`/exams/${selectedExam._id}/marks`, {
                        studentId,
                        subjectId: selectedSubject,
                        obtainedMarks: Number(marksData[studentId])
                    });
                }
            }
            showSuccess('Marks saved successfully!');
            setShowMarksModal(false);
        } catch (err) {
            showError(err.response?.data?.error || 'Failed to save marks');
        } finally {
            setLoading(false);
        }
    };

    const handlePublish = async (examId) => {
        const confirm = await showConfirm(
            'Publish Results',
            'Are you sure you want to publish these results? Parents and students will be able to see them.'
        );

        if (confirm.isConfirmed) {
            try {
                await api.put(`/exams/${examId}/publish`);
                showSuccess('Results published successfully!');
                fetchExams();
            } catch (err) {
                showError(err.response?.data?.error || 'Failed to publish');
            }
        }
    };

    return (
        <DashboardLayout>
            {loading ? (
                <HeadingWithButtonSkeleton />
            ) : (
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Exams & Results</h1>
                    <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium">+ Create Exam</button>
                </div>
            )}
           {(loading) ? (
                <SearchBarSkeleton />
            ) : (
                <div className="bg-white p-4 rounded-lg shadow mb-4 flex flex-col md:flex-row gap-4">
                <input
                    type="text"
                    placeholder="Search exams by name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 border border-gray-300  p-2 rounded"
                />
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border border-gray-300  p-2 rounded w-full md:w-48"
                >
                    <option value="">All Statuses</option>
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                </select>
            </div>)}

            {loading? <TableSkeleton/>:(<div className="bg-white border border-gray-300 rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exam Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {(() => {
                            const filteredExams = exams.filter(ex =>
                                ex.name.toLowerCase().includes(search.toLowerCase()) &&
                                (!filterStatus || ex.status === filterStatus)
                            );

                            return filteredExams.length > 0 ? (
                                filteredExams.map((ex) => (
                                    <tr key={ex._id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ex.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ex.classId?.name || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 py-1 rounded-full text-xs ${ex.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {ex.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                            <button onClick={() => openMarksModal(ex)} className="text-blue-600 hover:underline font-medium">Enter Marks</button>

                                            {/* Add this PDF Button - Only show if Published */}
                                            {ex.status === 'Published' && (
                                                <button
                                                    onClick={() => downloadFile(`/pdf/class-result?examId=${ex._id}&classId=${ex.classId?._id}`, `Class_Result_${ex.name}.pdf`)}
                                                    className="text-purple-600 hover:underline font-medium"
                                                >
                                                    Result PDF
                                                </button>
                                            )}

                                            {user?.role === 'Principal' && ex.status === 'Draft' && (
                                                <button onClick={() => handlePublish(ex._id)} className="text-green-600 hover:underline font-medium">Publish</button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">No exams found.</td></tr>
                            );
                        })()}
                    </tbody>
                </table>
            </div>)}

            {/* Create Exam Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Create New Exam</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Exam Name (e.g., Mid-Term)</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border p-2 rounded" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Class</label>
                                    <select name="classId" value={formData.classId} onChange={handleChange} className="w-full border p-2 rounded" required>
                                        <option value="">Select Class</option>
                                        {classes.length > 0 ? (
                                            classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)
                                        ) : (
                                            <option disabled>Create classes first in Academic Management</option>
                                        )}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Total Marks</label>
                                        <input type="number" name="totalMarksPerSubject" value={formData.totalMarksPerSubject} onChange={handleChange} className="w-full border p-2 rounded" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Passing %</label>
                                        <input type="number" name="passingPercentage" value={formData.passingPercentage} onChange={handleChange} className="w-full border p-2 rounded" required />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 rounded hover:bg-gray-100">Cancel</button>
                                <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400">{loading ? 'Saving...' : 'Create Exam'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Enter Marks Modal */}
            {showMarksModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">Enter Marks: {selectedExam.name}</h2>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Select Subject</label>
                            <select
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                                className="w-full border p-2 rounded"
                                required
                            >
                                <option value="">Select Subject</option>
                                {/* {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                                 */}
                                {subjects.length > 0 ? (
                                    subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)
                                ) : (
                                    <option disabled>Create subjects first in Academic Management</option>
                                )}
                            </select>
                        </div>

                        <table className="min-w-full divide-y divide-gray-200 mb-4">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Roll No</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Marks (/{selectedExam.totalMarksPerSubject})</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Report Card</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {students.map((s) => (
                                    <tr key={s._id}>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm">{s.rollNumber}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm">{s.firstName} {s.lastName}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm">
                                            <input
                                                type="number"
                                                max={selectedExam.totalMarksPerSubject}
                                                value={marksData[s._id]}
                                                onChange={(e) => handleMarksChange(s._id, e.target.value)}
                                                className="w-24 border p-1 rounded"
                                            />
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm">
                                            {/* NEW: Report Card PDF Button */}
                                            {selectedExam.status === 'Published' && (
                                                <button
                                                    onClick={() => downloadFile(`/pdf/report-card/${selectedExam._id}/${s._id}`, `ReportCard_${s.rollNumber}.pdf`)}
                                                    className="text-purple-600 hover:underline text-xs font-medium"
                                                >
                                                    Report Card PDF
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="flex justify-end space-x-2">
                            <button type="button" onClick={() => setShowMarksModal(false)} className="px-4 py-2 text-gray-600 rounded hover:bg-gray-100">Cancel</button>
                            <button onClick={handleSaveMarks} disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-400">
                                {loading ? 'Saving...' : 'Save Marks'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}