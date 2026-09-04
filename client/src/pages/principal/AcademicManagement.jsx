import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';

export default function AcademicManagement() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [classForm, setClassForm] = useState({ name: '' });
  const [sectionForm, setSectionForm] = useState({ name: '', capacity: 30 });
  const [subjectForm, setSubjectForm] = useState({ name: '', code: '' });

  const fetchClasses = async () => {
    try {
      const res = await api.get('/academic/classes');
      setClasses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleClassSelect = async (cls) => {
    setSelectedClass(cls);
    try {
      const secRes = await api.get(`/academic/classes/${cls._id}/sections`);
      setSections(secRes.data);
      const subRes = await api.get(`/academic/classes/${cls._id}/subjects`);
      setSubjects(subRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClassSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/academic/classes', classForm);
      setClassForm({ name: '' });
      fetchClasses();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create class');
    } finally {
      setLoading(false);
    }
  };

  const handleSectionSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClass) return alert('Please select a class first.');
    setLoading(true);
    try {
      await api.post(`/academic/classes/${selectedClass._id}/sections`, sectionForm);
      setSectionForm({ name: '', capacity: 30 });
      handleClassSelect(selectedClass);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create section');
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClass) return alert('Please select a class first.');
    setLoading(true);
    try {
      await api.post(`/academic/classes/${selectedClass._id}/subjects`, subjectForm);
      setSubjectForm({ name: '', code: '' });
      handleClassSelect(selectedClass);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create subject');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Academic Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Classes */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Classes (Current Session)</h2>
          
          <form onSubmit={handleClassSubmit} className="mb-4 flex gap-2">
            <input 
              type="text" 
              placeholder="New Class (e.g., Grade 5)" 
              value={classForm.name} 
              onChange={(e) => setClassForm({ ...classForm, name: e.target.value })} 
              className="flex-1 border p-2 rounded text-sm" 
              required 
            />
            <button type="submit" disabled={loading} className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700">Add</button>
          </form>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {classes.map((c) => (
              <button 
                key={c._id} 
                onClick={() => handleClassSelect(c)}
                className={`w-full text-left p-2 rounded transition ${
                  selectedClass?._id === c._id ? 'bg-blue-100 border-l-4 border-blue-600' : 'hover:bg-gray-100'
                }`}
              >
                {c.name}
              </button>
            ))}
            {classes.length === 0 && <p className="text-gray-500 text-sm">No classes found.</p>}
          </div>
        </div>

        {/* Column 2: Sections */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Sections {selectedClass ? `(${selectedClass.name})` : ''}</h2>
          
          <form onSubmit={handleSectionSubmit} className="mb-4 flex gap-2">
            <input 
              type="text" 
              placeholder="Section (e.g., A)" 
              value={sectionForm.name} 
              onChange={(e) => setSectionForm({ ...sectionForm, name: e.target.value })} 
              className="w-16 border p-2 rounded text-sm" 
              required 
            />
            <input 
              type="number" 
              placeholder="Capacity" 
              value={sectionForm.capacity} 
              onChange={(e) => setSectionForm({ ...sectionForm, capacity: e.target.value })} 
              className="w-20 border p-2 rounded text-sm" 
              required 
            />
            <button type="submit" disabled={loading} className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700">Add</button>
          </form>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {sections.map((s) => (
              <div key={s._id} className="p-2 bg-gray-50 rounded flex justify-between items-center">
                <span className="font-medium">{s.name}</span>
                <span className="text-xs text-gray-500">Capacity: {s.capacity}</span>
              </div>
            ))}
            {!selectedClass ? <p className="text-gray-500 text-sm">Select a class first.</p> : 
             sections.length === 0 && <p className="text-gray-500 text-sm">No sections found.</p>}
          </div>
        </div>

        {/* Column 3: Subjects */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Subjects {selectedClass ? `(${selectedClass.name})` : ''}</h2>
          
          <form onSubmit={handleSubjectSubmit} className="mb-4 flex gap-2">
            <input 
              type="text" 
              placeholder="Subject (e.g., Math)" 
              value={subjectForm.name} 
              onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })} 
              className="flex-1 border p-2 rounded text-sm" 
              required 
            />
            <input 
              type="text" 
              placeholder="Code (e.g., MTH)" 
              value={subjectForm.code} 
              onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })} 
              className="w-16 border p-2 rounded text-sm" 
              required 
            />
            <button type="submit" disabled={loading} className="bg-purple-600 text-white px-3 py-2 rounded text-sm hover:bg-purple-700">Add</button>
          </form>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {subjects.map((s) => (
              <div key={s._id} className="p-2 bg-gray-50 rounded">
                <span className="font-medium">{s.name}</span> 
                <span className="text-xs text-gray-500 ml-2">({s.code})</span>
              </div>
            ))}
            {!selectedClass ? <p className="text-gray-500 text-sm">Select a class first.</p> : 
             subjects.length === 0 && <p className="text-gray-500 text-sm">No subjects found.</p>}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}