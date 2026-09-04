import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export default function PrincipalDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/reports/dashboard-stats');
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  // Data for Fee Chart
  const feeData = [
    { name: 'Collected', amount: stats?.collected || 0 },
    { name: 'Pending', amount: stats?.pending || 0 },
  ];

  // Data for Attendance Pie Chart
  const attendanceData = [
    { name: 'Present', value: stats?.presentToday || 0 },
    { name: 'Absent', value: stats?.absentToday || 0 },
  ];

  const COLORS = ['#10b981', '#ef4444']; // Green, Red

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
          <h3 className="text-gray-500 text-sm">Total Students</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">{stats?.totalStudents || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
          <h3 className="text-gray-500 text-sm">Total Teachers</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">{stats?.totalTeachers || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
          <h3 className="text-gray-500 text-sm">Collected (This Month)</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">Rs {stats?.collected || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-red-500">
          <h3 className="text-gray-500 text-sm">Pending Fees (This Month)</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">Rs {stats?.pending || 0}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fee Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Fee Collection vs Pending (Current Month)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={feeData}>
              <XAxis dataKey="name" stroke="#8884d8" />
              <YAxis />
              <Tooltip cursor={{fill: 'transparent'}} />
              <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Attendance Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Today's Attendance Overview</h2>
          {(stats?.presentToday > 0 || stats?.absentToday > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={attendanceData} cx="50%" cy="50%" labelLine={false} outerRadius={100} dataKey="value" label={({name, value}) => `${name}: ${value}`}>
                  {attendanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              No attendance marked today yet.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
} 