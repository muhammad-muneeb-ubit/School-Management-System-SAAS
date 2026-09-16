// import { useState, useEffect } from 'react';
// import DashboardLayout from '../../components/DashboardLayout';
// import api from '../../services/api';
// import Loader from '../../components/Loader';
// import { showSuccess, showError } from '../../utils/sweetAlert';
// import Swal from 'sweetalert2';
// import { Link } from 'react-router-dom';
// import Tooltip from '../../components/Tooltip';
// import { downloadFile } from '../../utils/downloadFile';
// import { SearchBarSkeleton, TableSkeleton, HeadingWithButtonSkeleton } from '../../components/skeletons';

// export default function StudentManagement() {
//   const [students, setStudents] = useState([]);
//   const [classes, setClasses] = useState([]);
//   const [sections, setSections] = useState([]); // New state for sections
//   const [loading, setLoading] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [showMoreMenu, setShowMoreMenu] = useState(false);
//   const [search, setSearch] = useState('');
//   const [formData, setFormData] = useState({
//     firstName: '', lastName: '', rollNumber: '', gender: 'Male', classId: '', sectionId: '', parentEmail: ''
//   });

//   const fetchStudents = async () => {
//     setLoading(true);
//     try {
//       const res = await api.get('/students');
//       setStudents(res.data);

//     } catch (err) { console.error(err); }
//     finally {
//       setLoading(false);
//     }
//   };

//   const fetchClasses = async () => {
//     setLoading(true);
//     try {
//       const res = await api.get('/academic/classes');
//       setClasses(res.data);
//     } catch (err) { console.error(err); }
//     finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchClasses();
//     fetchStudents();
//   }, []);

//   // Fetch sections when a class is selected in the form
//   const handleClassChange = async (e) => {
//     const classId = e.target.value;
//     setFormData({ ...formData, classId, sectionId: '' });

//     if (!classId) { setSections([]); return; }
//     try {
//       const res = await api.get(`/academic/classes/${classId}/sections`);
//       setSections(res.data);
//     } catch (err) { console.error(err); }
//   };

//   const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await api.post('/students', formData);
//       showSuccess('Student admitted successfully!');
//       setShowModal(false);
//       fetchStudents();
//     } catch (err) {
//       showError(err.response?.data?.error || 'Failed to admit student');
//     } finally {
//       setLoading(false);
//     }
//   };
//   const handleFileUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const data = new FormData();
//     data.append('file', file);

//     setLoading(true);
//     try {
//       const res = await api.post('/students/bulk-import', data);
//       showSuccess(res.data.message);
//       fetchStudents();
//     } catch (err) {
//       showError('Bulk import failed. Ensure CSV headers are correct.');
//     } finally {
//       setLoading(false);
//     }
//   };
//   // Filter students based on search
//   const filteredStudents = students.filter(s =>
//     s.firstName?.toLowerCase().includes(search.toLowerCase()) ||
//     s.rollNumber?.includes(search) ||
//     s.parentId?.email?.toLowerCase().includes(search.toLowerCase())
//   );
//   const showCsvHelp = () => {
//     Swal.fire({
//       title: 'CSV File Format Guide',
//       html: `
//         <div style="text-align: left; font-size: 14px;">
//           <p>Your CSV file <b>must</b> have the following headers exactly as written:</p>
//           <pre style="background: #f3f4f6; padding: 10px; border-radius: 5px; font-size: 12px; overflow-x: auto;">
// firstName,lastName,rollNumber,gender,className,sectionName,parentEmail,parentFirstName,parentPhone
//           </pre>
//           <ul style="margin-top: 10px; font-size: 13px;">
//             <li><b>className</b> and <b>sectionName</b> must match exactly what you created in Academic Management (e.g., "Grade 5" and "A").</li>
//             <li><b>lastName</b> is optional.</li>
//             <li><b>gender</b> must be 'Male', 'Female', or 'Other'.</li>
//             <li><b>parentEmail</b> must be unique. If it exists, the student will be linked to that existing parent.</li>
//           </ul>
//         </div>
//       `,
//       icon: 'info',
//       confirmButtonText: 'Got it'
//     });
//   };
//   const handleStatusChange = async (id, status) => {
//     try {
//       await api.put(`/students/${id}/status`, { status });
//       showSuccess(`Student marked as ${status}`);
//       fetchStudents();
//     } catch (err) {
//       showError('Failed to update status');
//     }
//   };

//   return (
//     <DashboardLayout>
//       {loading ? (
//         <>
//           <HeadingWithButtonSkeleton btnCount={4} />
//           <SearchBarSkeleton />
//           <TableSkeleton rows={6} cols={5} />
//         </>
//       ) : (
//         <>
//           {/* <div className="flex justify-between items-center mb-6">
//             <h1 className="text-2xl font-bold text-gray-800">Student Management</h1>
//             <div className="flex space-x-2">
//               <button onClick={showCsvHelp} disabled={loading} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:bg-gray-300 font-medium flex items-center">
//                 CSV Help
//               </button>
//               <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" id="csv-upload" disabled={loading} />
//               <label htmlFor={loading ? undefined : 'csv-upload'} className={`bg-green-600 text-white px-4 py-2 rounded font-medium cursor-pointer ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-green-700'}`}>
//                 Bulk Import CSV
//               </label>
//               <button onClick={() => setShowModal(true)} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400 font-medium">
//                 + Admit Student
//               </button>
//               <button
//                 onClick={() => downloadFile(`/pdf/students`, 'All_Students_List.pdf')}
//                 className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 font-medium"
//               >
//                 Download List PDF
//               </button>
//             </div>
//           </div> */}

//           <div className="flex justify-between items-center mb-6">
//             <h1 className="text-2xl font-bold text-gray-800">
//               Student Management
//             </h1>

//             <div className="flex items-center gap-2">
//               {/* Primary Action */}
//               <button
//                 onClick={() => setShowModal(true)}
//                 disabled={loading}
//                 className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400 font-medium"
//               >
//                 + Admit Student
//               </button>

//               {/* More Actions */}
//               <div className="relative">
//                 <button
//                   type="button"
//                   onClick={() => setShowMoreMenu(!showMoreMenu)}
//                   disabled={loading}
//                   className="px-3 py-2 border border-gray-300 bg-white text-gray-700 rounded hover:bg-gray-50 disabled:bg-gray-100 font-bold text-lg leading-none"
//                   aria-label="More options"
//                 >
//                   ⋮
//                 </button>

//                 {showMoreMenu && (
//                   <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-30">

//                     {/* CSV Help */}
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setShowMoreMenu(false);
//                         showCsvHelp();
//                       }}
//                       disabled={loading}
//                       className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 disabled:text-gray-400"
//                     >
//                       CSV Help
//                     </button>

//                     {/* Bulk Import CSV */}
//                     <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" id="csv-upload" disabled={loading} />
//                     <button
//                       type="button"
//                       onClick={() => {
//                         document.getElementById('csv-upload')?.click();
//                       }}
//                       disabled={loading}
//                       className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 disabled:text-gray-400"
//                     >
//                       Bulk Import CSV
//                     </button>

//                     {/* Download List PDF */}
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setShowMoreMenu(false);
//                         downloadFile(
//                           `/pdf/students`,
//                           'All_Students_List.pdf'
//                         );
//                       }}
//                       disabled={loading}
//                       className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 disabled:text-gray-400"
//                     >
//                       Download List PDF
//                     </button>

//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Search Bar */}
//           <div className="bg-white p-4 rounded-lg shadow mb-4">
//             <input
//               type="text"
//               placeholder="Search by Name, Roll No, or Parent Email..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="w-full border border-gray-300   p-2 rounded"
//             />
//           </div>
//           {/* <div className="bg-white rounded-lg shadow overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="min-w-[760px] w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll No</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parent Email</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status/ Action</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {filteredStudents.length > 0 ? (
//                     filteredStudents.map((s) => (
//                       <tr key={s._id} className="hover:bg-gray-50">
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{s.rollNumber}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:underline">
//                           <Link to={`/principal/students/${s._id}`}>{s.firstName} {s.lastName}</Link>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{s.classId?.name || 'N/A'}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{s.parentId?.email || 'N/A'}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm">
//                           {s.status === 'Active' ? (
//                             <button
//                               onClick={() => handleStatusChange(s._id, 'Left')}
//                               className="text-red-600 hover:underline font-medium"
//                             >
//                               Mark as Left
//                             </button>
//                           ) : (
//                             <div className="flex items-center flex-wrap gap-2">
//                               <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">{s.status}</span>
//                               <button
//                                 onClick={() => handleStatusChange(s._id, 'Active')}
//                                 className="text-green-600 hover:underline text-xs font-medium"
//                               >
//                                 Re-activate
//                               </button>
//                             </div>
//                           )}
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr><td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">No students found.</td></tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div> */}
//           <div className="bg-white rounded-lg shadow overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="w-full min-w-[600px] table-fixed divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="w-[12%] px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">
//                       Roll No
//                     </th>

//                     <th className="w-[23%] px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">
//                       Name
//                     </th>

//                     <th className="w-[15%] px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">
//                       Class
//                     </th>

//                     <th className="w-[30%] px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">
//                       Parent Email
//                     </th>

//                     <th className="w-[20%] px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">
//                       Status / Action
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {filteredStudents.length > 0 ? (
//                     filteredStudents.map((s) => (
//                       <tr key={s._id} className="hover:bg-gray-50">

//                         <td className="px-3 py-3 text-sm text-gray-900 truncate">
//                           {s.rollNumber}
//                         </td>

//                         <td className="px-3 py-3 text-sm text-blue-600 truncate">
//                           <Link
//                             to={`/principal/students/${s._id}`}
//                             className="hover:underline"
//                           >
//                             {s.firstName} {s.lastName}
//                           </Link>
//                         </td>

//                         <td className="px-3 py-3 text-sm text-gray-900 truncate">
//                           {s.classId?.name || 'N/A'}
//                         </td>

//                         <td
//                           className="px-3 py-3 text-sm text-gray-900 truncate"
//                           title={s.parentId?.email || 'N/A'}
//                         >
//                           {s.parentId?.email || 'N/A'}
//                         </td>

//                         <td className="px-3 py-3 text-sm">
//                           {s.status === 'Active' ? (
//                             <button
//                               onClick={() => handleStatusChange(s._id, 'Left')}
//                               className="text-red-600 hover:underline font-medium"
//                             >
//                               Mark as Left
//                             </button>
//                           ) : (
//                             <div className="flex items-center gap-2 flex-wrap">
//                               <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
//                                 {s.status}
//                               </span>

//                               <button
//                                 onClick={() => handleStatusChange(s._id, 'Active')}
//                                 className="text-green-600 hover:underline text-xs font-medium"
//                               >
//                                 Re-activate
//                               </button>
//                             </div>
//                           )}
//                         </td>

//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td
//                         colSpan="5"
//                         className="px-3 py-4 text-center text-sm text-gray-500"
//                       >
//                         No students found.
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//         </>)}

//       {showModal && (
//         <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-lg">
//             <h2 className="text-xl font-bold mb-4">Admit New Student</h2>
//             <form onSubmit={handleSubmit} >

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-1">First Name</label>
//                   <Tooltip text="Enter first name (e.g., Muhammad)">
//                     <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded " required />
//                   </Tooltip>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Last Name</label>
//                   <Tooltip text="Enter last name (e.g., Ahmed)">
//                     <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded " />
//                   </Tooltip>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Roll No</label>
//                   <Tooltip text="Enter a unique roll number (e.g., 101)">
//                     <input type="text" name="rollNumber" value={formData.rollNumber} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded " required />
//                   </Tooltip>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Gender</label>
//                   <select name="gender" value={formData.gender} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded ">
//                     <option>Male</option><option>Female</option><option>Other</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Class</label>
//                   <select name="classId" value={formData.classId} onChange={handleClassChange} className="w-full border border-gray-300 p-2 rounded " required>
//                     <option value="">Select Class</option>
//                     {classes.length > 0 ? classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>) : <option disabled>No classes found</option>}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Section</label>
//                   <select name="sectionId" value={formData.sectionId} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded " required>
//                     <option value="">Select Section</option>
//                     {sections.length > 0 ? sections.map(s => <option key={s._id} value={s._id}>{s.name}</option>) : <option disabled>Create sections first in Academic Management</option>}
//                   </select>
//                 </div>
//                 <div className="col-span-2">
//                   <label className="block text-sm font-medium mb-1">Parent Email</label>
//                   <Tooltip text="Enter parent's email (e.g.,ahmed@gmail.com)">
//                     <input type="email" name="parentEmail" value={formData.parentEmail} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded " required />
//                   </Tooltip>
//                 </div>
//               </div>
//               <div className="flex justify-end space-x-2">
//                 <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 rounded hover:bg-gray-100">Cancel</button>
//                 <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400">{loading ? 'Saving...' : 'Save Student'}</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </DashboardLayout>

//   );
// }


import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import { showSuccess, showError } from '../../utils/sweetAlert';
import Swal from 'sweetalert2';
import { HeadingWithButtonSkeleton, TableSkeleton, SearchBarSkeleton } from '../../components/skeletons';
import Tooltip from '../../components/Tooltip';
import { downloadFile } from '../../utils/downloadFile';
import { X, ChevronUp, ChevronDown } from 'lucide-react';

export default function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'rollNumber', direction: 'ascending' });
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', rollNumber: '', gender: 'Male', classId: '', sectionId: '', parentEmail: ''
  });

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await api.get('/students');
      setStudents(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const res = await api.get('/academic/classes');
      setClasses(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchClasses();
    fetchStudents();
  }, []);

  const handleClassChange = async (e) => {
    const classId = e.target.value;
    setFormData({ ...formData, classId, sectionId: '' });
    if (!classId) { setSections([]); return; }
    try {
      const res = await api.get(`/academic/classes/${classId}/sections`);
      setSections(res.data);
    } catch (err) { console.error(err); }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/students', formData);
      showSuccess('Student admitted successfully!');
      setShowModal(false);
      fetchStudents();
    } catch (err) {
      showError(err.response?.data?.error || 'Failed to admit student');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = new FormData();
    data.append('file', file);

    setLoading(true);
    try {
      const res = await api.post('/students/bulk-import', data);
      showSuccess(res.data.message);
      fetchStudents();
    } catch (err) {
      showError('Bulk import failed. Ensure CSV headers are correct.');
    } finally {
      setLoading(false);
    }
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const processedStudents = students.filter(s =>
    s.firstName?.toLowerCase().includes(search.toLowerCase()) ||
    s.rollNumber?.includes(search) ||
    s.parentId?.email?.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => {
    let valA, valB;
    if (sortConfig.key === 'name') {
      valA = `${a.firstName} ${a.lastName}`.toLowerCase();
      valB = `${b.firstName} ${b.lastName}`.toLowerCase();
    } else if (sortConfig.key === 'email') {
      valA = a.parentId?.email?.toLowerCase() || '';
      valB = b.parentId?.email?.toLowerCase() || '';
    } else if (sortConfig.key === 'class') {
      valA = a.classId?.name?.toLowerCase() || '';
      valB = b.classId?.name?.toLowerCase() || '';
    } else {
      valA = a.rollNumber?.toLowerCase() || '';
      valB = b.rollNumber?.toLowerCase() || '';
    }

    if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
    if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) return null;
    return sortConfig.direction === 'ascending' ? <ChevronUp size={14} className="inline ml-1" /> : <ChevronDown size={14} className="inline ml-1" />;
  };

  const showCsvHelp = () => {
    Swal.fire({
      title: 'CSV File Format Guide',
      html: `
        <div style="text-align: left; font-size: 14px;">
          <p>Your CSV file <b>must</b> have the following headers exactly as written:</p>
          <pre style="background: #f3f4f6; padding: 10px; border-radius: 5px; font-size: 12px; overflow-x: auto;">
firstName,lastName,rollNumber,gender,className,sectionName,parentEmail,parentFirstName,parentPhone
          </pre>
          <ul style="margin-top: 10px; font-size: 13px;">
            <li><b>className</b> and <b>sectionName</b> must match exactly what you created in Academic Management (e.g., "Grade 5" and "A").</li>
            <li><b>lastName</b> is optional.</li>
            <li><b>gender</b> must be 'Male', 'Female', or 'Other'.</li>
            <li><b>parentEmail</b> must be unique. If it exists, the student will be linked to that existing parent.</li>
          </ul>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Got it'
    });
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/students/${id}/status`, { status });
      showSuccess(`Student marked as ${status}`);
      fetchStudents();
    } catch (err) {
      showError('Failed to update status');
    }
  };

  return (
    <DashboardLayout>
      {loading ? (
        <>
          <HeadingWithButtonSkeleton btnCount={4} />
          <SearchBarSkeleton />
          <TableSkeleton rows={6} cols={5} />
        </>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Student Management</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowModal(true)}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400 font-medium"
              >
                + Admit Student
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  disabled={loading}
                  className="px-3 py-2 border border-gray-300 bg-white text-gray-700 rounded hover:bg-gray-50 disabled:bg-gray-100 font-bold text-lg leading-none"
                  aria-label="More options"
                >
                  ⋮
                </button>

                {showMoreMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-30">
                    <button type="button" onClick={() => { setShowMoreMenu(false); showCsvHelp(); }} disabled={loading} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 disabled:text-gray-400">
                      CSV Help
                    </button>
                    <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" id="csv-upload" disabled={loading} />
                    <button type="button" onClick={() => document.getElementById('csv-upload')?.click()} disabled={loading} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 disabled:text-gray-400">
                      Bulk Import CSV
                    </button>
                    <button type="button" onClick={() => { setShowMoreMenu(false); downloadFile('/pdf/students', 'All_Students_List.pdf'); }} disabled={loading} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 disabled:text-gray-400">
                      Download List PDF
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow mb-4">
            <input
              type="text"
              placeholder="Search by Name, Roll No, or Parent Email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] table-fixed divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th onClick={() => requestSort('rollNumber')} className="w-[12%] px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 transition">
                      Roll No <SortIcon column="rollNumber" />
                    </th>
                    <th onClick={() => requestSort('name')} className="w-[23%] px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 transition">
                      Name <SortIcon column="name" />
                    </th>
                    <th onClick={() => requestSort('class')} className="w-[15%] px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 transition">
                      Class <SortIcon column="class" />
                    </th>
                    <th onClick={() => requestSort('email')} className="w-[30%] px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 transition">
                      Parent Email <SortIcon column="email" />
                    </th>
                    <th className="w-[20%] px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">
                      Status / Action
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {processedStudents.length > 0 ? (
                    processedStudents.map((s) => (
                      <tr key={s._id} className="hover:bg-gray-50">
                        <td className="px-3 py-3 text-sm text-gray-900 truncate">{s.rollNumber}</td>
                        <td className="px-3 py-3 text-sm text-blue-600 truncate">
                          <Link to={`/principal/students/${s._id}`} className="hover:underline">
                            {s.firstName} {s.lastName}
                          </Link>
                        </td>
                        <td className="px-3 py-3 text-sm text-gray-900 truncate">{s.classId?.name || 'N/A'}</td>
                        <td className="px-3 py-3 text-sm text-gray-900 truncate" title={s.parentId?.email || 'N/A'}>
                          {s.parentId?.email || 'N/A'}
                        </td>
                        <td className="px-3 py-3 text-sm">
                          {s.status === 'Active' ? (
                            <button onClick={() => handleStatusChange(s._id, 'Left')} className="text-red-600 hover:underline font-medium">
                              Mark as Left
                            </button>
                          ) : (
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">{s.status}</span>
                              <button onClick={() => handleStatusChange(s._id, 'Active')} className="text-green-600 hover:underline text-xs font-medium">
                                Re-activate
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-3 py-4 text-center text-sm text-gray-500">No students found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* --- PREMIUM MODAL: Admit New Student --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh] border border-gray-100">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800">Admit New Student</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">First Name</label>
                    <Tooltip text="Enter first name (e.g., Muhammad)">
                      <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" required />
                    </Tooltip>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Last Name</label>
                    <Tooltip text="Enter last name (e.g., Ahmed)">
                      <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" />
                    </Tooltip>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Roll No</label>
                    <Tooltip text="Enter a unique roll number (e.g., 101)">
                      <input type="text" name="rollNumber" value={formData.rollNumber} onChange={handleChange} className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" required />
                    </Tooltip>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition">
                      <option>Male</option><option>Female</option><option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Class</label>
                    <select name="classId" value={formData.classId} onChange={handleClassChange} className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" required>
                      <option value="">Select Class</option>
                      {classes.length > 0 ? classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>) : <option disabled>No classes found</option>}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Section</label>
                    <select name="sectionId" value={formData.sectionId} onChange={handleChange} className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" required>
                      <option value="">Select Section</option>
                      {sections.length > 0 ? sections.map(s => <option key={s._id} value={s._id}>{s.name}</option>) : <option disabled>Create sections first in Academic Management</option>}
                    </select>
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Parent Email</label>
                    <Tooltip text="Enter parent's email (e.g.,ahmed@gmail.com)">
                      <input type="email" name="parentEmail" value={formData.parentEmail} onChange={handleChange} className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" required />
                    </Tooltip>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end space-x-3 p-5 bg-gray-50 border-t border-gray-200 rounded-b-xl">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-200 font-medium transition">Cancel</button>
                <button type="submit" disabled={loading} className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition shadow-sm disabled:bg-blue-400">
                  {loading ? 'Saving...' : 'Save Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}