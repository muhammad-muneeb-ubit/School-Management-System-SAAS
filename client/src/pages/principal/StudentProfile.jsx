
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import { User, Mail, Phone, CalendarDays, CreditCard, Users } from 'lucide-react';

// 1. Create a Skeleton Component that matches the layout
const SkeletonProfile = () => (
  <DashboardLayout>
    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-4"></div>
    
    <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
      <div className="bg-gray-200 h-28 animate-pulse"></div>
      <div className="px-6 pb-6 -mt-12 flex items-end">
        <div className="w-24 h-24 bg-gray-200 rounded-full border-4 border-white animate-pulse"></div>
        <div className="ml-6 mt-12 space-y-2">
          <div className="h-6 w-40 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center">
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse mr-3"></div>
              <div className="space-y-2">
                <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map(i => (
          <div key={i} className="bg-white p-6 rounded-lg shadow flex flex-col justify-center items-center text-center">
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse mb-2"></div>
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-1"></div>
            <div className="h-3 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  </DashboardLayout>
);

export default function StudentProfile() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/reports/student-summary/${id}`);
        setData(res.data);
      } catch (err) { console.error(err); }
    };
    fetchData();
  }, [id]);

  // Show skeleton while data is null
  if (!data) return <SkeletonProfile />;

  const { student, attendance, latestFee } = data;
  // console.log('Student Data:', data);

  return (
    <DashboardLayout>
      <Link to="/principal/students" className="text-blue-600 hover:underline mb-4 inline-block">&larr; Back to Students</Link>
      
           {/* Profile Header Banner */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-blue-800 to-indigo-900 h-32 flex items-center justify-center relative">
          {/* School Initials in Background */}
          <span className="text-white text-6xl font-extrabold tracking-widest opacity-20">SMS</span>
          
          {/* Avatar overlapping the banner and content */}
          <div className="absolute -bottom-12 left-6 bg-blue-100 border-4 border-white rounded-full w-24 h-24 flex items-center justify-center text-blue-600 text-4xl font-bold shadow-md">
            {student.firstName.charAt(0)}{student.lastName.charAt(0)}
          </div>
        </div>
        
        <div className="px-6 pt-16 pb-6 flex flex-col md:flex-row md:items-end md:justify-between">
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold text-gray-800">{student.firstName} {student.lastName}</h1>
            <p className="text-gray-500">Roll No: {student.rollNumber} | {student.classId?.name} - {student.sectionId?.name}</p>
          </div>
          <div className="mt-4 md:mt-0 text-center md:text-right">
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${student.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {student.status}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4 flex items-center"><Users size={20} className="mr-2 text-blue-600" /> Guardian Info</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mr-3">
                <User size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Name</p>
                <p className="font-medium">{student?.parentId?.profile?.firstName || 'N/A'} {student?.parentId?.profile?.lastName || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mr-3">
                <Mail size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="font-medium text-sm">{student.parentId?.email}</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mr-3">
                <Phone size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <p className="font-medium">{student.parentId?.profile?.phone || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow flex flex-col justify-center items-center text-center">
            <CalendarDays size={32} className="text-green-500 mb-2" />
            <h3 className="text-gray-500 text-sm">Overall Attendance</h3>
            <p className="text-4xl font-bold text-gray-800 mt-1">{attendance.percentage}%</p>
            <p className="text-xs text-gray-400 mt-1">{attendance.presentDays} / {attendance.totalDays} days present</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow flex flex-col justify-center items-center text-center">
            <CreditCard size={32} className={`mb-2 ${latestFee?.status === 'Paid' ? 'text-green-500' : 'text-red-500'}`} />
            <h3 className="text-gray-500 text-sm">Latest Fee Status</h3>
            <p className={`text-2xl font-bold mt-1 ${latestFee?.status === 'Paid' ? 'text-green-600' : 'text-red-600'}`}>
              {latestFee?.status || 'N/A'}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {latestFee ? `Month: ${latestFee.month} (Rs ${latestFee.amountPaid}/${latestFee.totalAmount})` : 'No invoices'}
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}