import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import { showSuccess, showError } from '../../utils/sweetAlert';
import Tooltip from '../../components/Tooltip';
import { DashboardHeaderSkeleton, AcademicManagementSkeleton } from '../../components/skeletons';

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
    setLoading(true);
    try {
      const res = await api.get('/academic/classes');
      setClasses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleClassSelect = async (cls) => {
    setLoading(true);
    setSelectedClass(cls);
    try {
      const secRes = await api.get(`/academic/classes/${cls._id}/sections`);
      setSections(secRes.data);
      const subRes = await api.get(`/academic/classes/${cls._id}/subjects`);
      setSubjects(subRes.data);
    } catch (err) {
      console.error(err);
    }
    finally {
      setLoading(false);
    }
  };

  const handleClassSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/academic/classes', classForm);
      showSuccess('Class created successfully!');
      setClassForm({ name: '' });
      fetchClasses();
    } catch (err) {
      showError(err.response?.data?.error || 'Failed to create class');
    } finally {
      setLoading(false);
    }
  };

  const handleSectionSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClass) return showError('Please select a class first.');
    setLoading(true);
    try {
      await api.post(`/academic/classes/${selectedClass._id}/sections`, sectionForm);
      showSuccess('Section created successfully!');
      setSectionForm({ name: '', capacity: 30 });
      handleClassSelect(selectedClass);
    } catch (err) {
      showError(err.response?.data?.error || 'Failed to create section');
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClass) return showError('Please select a class first.');
    setLoading(true);
    try {
      await api.post(`/academic/classes/${selectedClass._id}/subjects`, subjectForm);
      showSuccess('Subject created successfully!');
      setSubjectForm({ name: '', code: '' });
      handleClassSelect(selectedClass);
    } catch (err) {
      showError(err.response?.data?.error || 'Failed to create subject');
    } finally {
      setLoading(false);
    }
  };

  return (
    <> {loading ? (
      <DashboardLayout>
        <DashboardHeaderSkeleton />
        <AcademicManagementSkeleton />
      </DashboardLayout>
    ) : (
      <DashboardLayout>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Academic Management</h1>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

  {/* ================= CLASSES ================= */}
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">

    <div className="flex items-center justify-between mb-5">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Classes
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Current academic session
        </p>
      </div>

      <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">
        {classes.length} Classes
      </span>
    </div>


    {/* Add Class */}
    <form
      onSubmit={handleClassSubmit}
      className="flex gap-2 mb-5"
    >
      <Tooltip text="Create a class such as Grade 5 or Grade 8 for the current academic session.">

        <input
          type="text"
          placeholder="New Class (e.g. Grade 5)"
          value={classForm.name}
          onChange={(e) =>
            setClassForm({
              ...classForm,
              name: e.target.value
            })
          }
          className="
            flex-1
            border border-gray-300
            rounded-lg
            px-3 py-2
            text-sm
            outline-none
            focus:ring-2
            focus:ring-blue-500
            focus:border-blue-500
            transition
          "
          required
        />

      </Tooltip>

      <button
        type="submit"
        disabled={loading}
        className="
          bg-blue-600
          hover:bg-blue-700
          disabled:bg-gray-300
          text-white
          px-4
          py-2
          rounded-lg
          text-sm
          font-medium
          transition
          shadow-sm
        "
      >
        Add
      </button>
    </form>


    {/* Classes List */}
    <div className="space-y-2 max-h-96 overflow-y-auto pr-1">

      {classes.map((c) => (
        <button
          key={c._id}
          onClick={() => handleClassSelect(c)}
          className={`
            w-full
            text-left
            px-3 py-2.5
            rounded-lg
            border
            transition-all
            ${
              selectedClass?._id === c._id
                ? `
                  bg-blue-50
                  border-blue-300
                  text-blue-700
                  font-medium
                  shadow-sm
                `
                : `
                  bg-gray-50
                  border-transparent
                  text-gray-700
                  hover:bg-gray-100
                  hover:border-gray-200
                `
            }
          `}
        >
          {c.name}
        </button>
      ))}


      {classes.length === 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-gray-500">
            No classes found.
          </p>
        </div>
      )}

    </div>
  </div>


  {/* ================= SECTIONS ================= */}
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">

    <div className="mb-5">
      <h2 className="text-lg font-semibold text-gray-900">
        Sections
        {selectedClass && (
          <span className="text-blue-600">
            {" "}({selectedClass.name})
          </span>
        )}
      </h2>

      <p className="text-xs text-gray-500 mt-1">
        Manage sections for the selected class
      </p>
    </div>


    {/* Add Section */}
    <form
      onSubmit={handleSectionSubmit}
      className="flex gap-2 mb-5"
    >

      <Tooltip text="Enter the section name such as A, B or C.">

        <input
          type="text"
          placeholder="Section"
          value={sectionForm.name}
          onChange={(e) =>
            setSectionForm({
              ...sectionForm,
              name: e.target.value
            })
          }
          className="
            w-20
            border border-gray-300
            rounded-lg
            px-3 py-2
            text-sm
            outline-none
            focus:ring-2
            focus:ring-green-500
            focus:border-green-500
          "
          required
        />

      </Tooltip>


      <Tooltip text="Set the maximum number of students allowed in this section.">

        <input
          type="number"
          placeholder="Capacity"
          value={sectionForm.capacity}
          onChange={(e) =>
            setSectionForm({
              ...sectionForm,
              capacity: e.target.value
            })
          }
          className="
            w-24
            border border-gray-300
            rounded-lg
            px-3 py-2
            text-sm
            outline-none
            focus:ring-2
            focus:ring-green-500
            focus:border-green-500
          "
          required
        />

      </Tooltip>


      <button
        type="submit"
        disabled={loading || !selectedClass}
        className="
          bg-green-600
          hover:bg-green-700
          disabled:bg-gray-300
          text-white
          px-4
          py-2
          rounded-lg
          text-sm
          font-medium
          transition
          shadow-sm
        "
      >
        Add
      </button>

    </form>


    {/* Sections List */}
    <div className="space-y-2 max-h-96 overflow-y-auto">

      {!selectedClass ? (

        <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-6 text-center">
          <p className="text-sm text-gray-500">
            Select a class first.
          </p>
        </div>

      ) : sections.length === 0 ? (

        <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-6 text-center">
          <p className="text-sm text-gray-500">
            No sections found.
          </p>
        </div>

      ) : (

        sections.map((s) => (
          <div
            key={s._id}
            className="
              flex
              justify-between
              items-center
              bg-gray-50
              border border-gray-100
              hover:border-gray-200
              hover:bg-gray-100
              rounded-lg
              px-3 py-2.5
              transition
            "
          >

            <span className="font-medium text-gray-800">
              {s.name}
            </span>

            <span className="text-xs text-gray-500 bg-white border px-2 py-1 rounded-full">
              Capacity: {s.capacity}
            </span>

          </div>
        ))

      )}

    </div>
  </div>


  {/* ================= SUBJECTS ================= */}
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">

    <div className="mb-5">
      <h2 className="text-lg font-semibold text-gray-900">
        Subjects
        {selectedClass && (
          <span className="text-purple-600">
            {" "}({selectedClass.name})
          </span>
        )}
      </h2>

      <p className="text-xs text-gray-500 mt-1">
        Manage subjects for the selected class
      </p>
    </div>


    {/* Add Subject */}
    <form
      onSubmit={handleSubjectSubmit}
      className="flex gap-2 mb-5"
    >

      <Tooltip text="Add a subject such as Mathematics, Science or English.">

        <input
          type="text"
          placeholder="Subject (e.g. Math)"
          value={subjectForm.name}
          onChange={(e) =>
            setSubjectForm({
              ...subjectForm,
              name: e.target.value
            })
          }
          className="
            flex-1
            min-w-0
            border border-gray-300
            rounded-lg
            px-3 py-2
            text-sm
            outline-none
            focus:ring-2
            focus:ring-purple-500
            focus:border-purple-500
          "
          required
        />

      </Tooltip>


      <Tooltip text="Use a short code such as MTH or ENG.">

        <input
          type="text"
          placeholder="Code"
          value={subjectForm.code}
          onChange={(e) =>
            setSubjectForm({
              ...subjectForm,
              code: e.target.value
            })
          }
          className="
            w-20
            border border-gray-300
            rounded-lg
            px-3 py-2
            text-sm
            outline-none
            focus:ring-2
            focus:ring-purple-500
            focus:border-purple-500
          "
          required
        />

      </Tooltip>


      <button
        type="submit"
        disabled={loading || !selectedClass}
        className="
          bg-purple-600
          hover:bg-purple-700
          disabled:bg-gray-300
          text-white
          px-4
          py-2
          rounded-lg
          text-sm
          font-medium
          transition
          shadow-sm
        "
      >
        Add
      </button>

    </form>


    {/* Subjects List */}
    <div className="space-y-2 max-h-96 overflow-y-auto">

      {!selectedClass ? (

        <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-6 text-center">
          <p className="text-sm text-gray-500">
            Select a class first.
          </p>
        </div>

      ) : subjects.length === 0 ? (

        <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-6 text-center">
          <p className="text-sm text-gray-500">
            No subjects found.
          </p>
        </div>

      ) : (

        subjects.map((s) => (
          <div
            key={s._id}
            className="
              flex
              items-center
              justify-between
              bg-gray-50
              border border-gray-100
              hover:border-gray-200
              hover:bg-gray-100
              rounded-lg
              px-3 py-2.5
              transition
            "
          >

            <span className="font-medium text-gray-800">
              {s.name}
            </span>

            <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full font-medium">
              {s.code}
            </span>

          </div>
        ))

      )}

    </div>
  </div>

</div>
      </DashboardLayout>
    )}</>);
}