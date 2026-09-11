// import DashboardLayout from '../components/DashboardLayout';
// import { useEffect, useState } from 'react';
// import api from '../services/api';
// import { DashboardHeaderSkeleton, ClassAssignmentsSkeleton, AssignedClassesSkeleton } from '../components/skeletons';

// export default function TeacherDashboard() {
//   const [assignments, setAssignments] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     setLoading(true);
//     const fetchAssignments = async () => {
//       try {
//         const res = await api.get('/teachers/my-assignments');
//         setAssignments(res.data);
//       } catch (err) { console.error(err); }
//       finally { setLoading(false); }
//     };
//     fetchAssignments();
//   }, []);

// //   return (
// //     <> {loading ? (
// //       <DashboardLayout>
// //         {[1,2,3].map((i) => (
// //           <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
// //             <AssignedClassesSkeleton />
// //             <ClassAssignmentsSkeleton />
// //           </div>
// //         ))}
// //       </DashboardLayout>
// //     ) : (
// //       <DashboardLayout>
// //         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// //           <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
// //             <h3 className="text-gray-500 text-sm">My Assigned Classes</h3>
// //             <p className="text-3xl font-bold text-gray-800 mt-2">{assignments.length}</p>
// //           </div>
// //           <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500 col-span-2">
// //             <h3 className="text-gray-500 text-sm mb-2">Class Assignments</h3>
// //             {assignments.length > 0 ? (
// //               <ul className="divide-y divide-gray-100">
// //                 {assignments.map((a, i) => (
// //                   <li key={i} className="py-2 flex justify-between">
// //                     <span className="font-medium">{a.classId?.name} - {a.sectionId?.name}</span>
// //                     <span className="text-gray-500">{a.subjectId?.name}</span>
// //                   </li>
// //                 ))}
// //               </ul>
// //             ) : (
// //               <p className="text-gray-500">No classes assigned yet. Please contact your Principal.</p>
// //             )}
// //           </div>
// //         </div>
// //       </DashboardLayout>)}</>
// //   );
// // }


// return (
//   <DashboardLayout>
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

//       {/* Assigned Classes */}
//       <div className="bg-surface p-6 rounded-lg shadow-md border-l-4 border-primary">
//         <h3 className="text-text-secondary text-sm">
//           My Assigned Classes
//         </h3>

//         <p className="text-3xl font-bold text-text-primary mt-2">
//           {assignments.length}
//         </p>
//       </div>

//       {/* Class Assignments */}
//       <div className="bg-surface p-6 rounded-lg shadow-md border-l-4 border-secondary col-span-1 md:col-span-2">
//         <h3 className="text-lg font-semibold text-text-primary mb-2">
//           Class Assignments
//         </h3>

//         {assignments.length > 0 ? (
//           <ul className="divide-y divide-border">
//             {assignments.map((a, i) => (
//               <li
//                 key={i}
//                 className="py-3 flex flex-col sm:flex-row sm:justify-between gap-1"
//               >
//                 <span className="font-medium text-text-primary">
//                   {a.classId?.name} - {a.sectionId?.name}
//                 </span>

//                 <span className="text-text-secondary">
//                   {a.subjectId?.name}
//                 </span>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p className="text-text-secondary">
//             No classes assigned yet. Please contact your Principal.
//           </p>
//         )}
//       </div>

//     </div>
//   </DashboardLayout>
// );}


import { useEffect, useState } from 'react';

import DashboardLayout from '../components/DashboardLayout';
import api from '../services/api';

import {
  DashboardHeaderSkeleton,
  ClassAssignmentsSkeleton,
  AssignedClassesSkeleton,
} from '../components/skeletons';

export default function TeacherDashboard() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await api.get(
          '/teachers/my-assignments'
        );

        setAssignments(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardHeaderSkeleton />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AssignedClassesSkeleton />
          <div className="md:col-span-2">
            <ClassAssignmentsSkeleton />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">
          Teacher Dashboard
        </h1>

        <p className="text-sm text-text-secondary mt-1">
          Overview of your assigned classes and subjects.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Assigned Classes */}

        <div
          className="
            bg-surface
            p-6
            rounded-lg
            shadow-md
            border-l-4
            border-primary
          "
        >
          <h3 className="text-text-secondary text-sm">
            My Assigned Classes
          </h3>

          <p className="text-3xl font-bold text-text-primary mt-2">
            {assignments.length}
          </p>
        </div>

        {/* Assignments */}

        <div
          className="
            bg-surface
            p-6
            rounded-lg
            shadow-md
            border-l-4
            border-secondary
            md:col-span-2
          "
        >
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Class Assignments
          </h3>

          {assignments.length > 0 ? (
            <ul className="divide-y divide-border">

              {assignments.map((a, i) => (
                <li
                  key={i}
                  className="
                    py-3
                    flex
                    flex-col
                    sm:flex-row
                    sm:justify-between
                    gap-1
                  "
                >
                  <span className="font-medium text-text-primary">
                    {a.classId?.name} - {a.sectionId?.name}
                  </span>

                  <span className="text-text-secondary">
                    {a.subjectId?.name}
                  </span>
                </li>
              ))}

            </ul>
          ) : (
            <p className="text-text-secondary">
              No classes assigned yet. Please contact
              your Principal.
            </p>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}