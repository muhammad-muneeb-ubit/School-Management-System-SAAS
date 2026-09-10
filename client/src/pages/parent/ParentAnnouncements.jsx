import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import {DashboardHeaderSkeleton, AnnouncementCardSkeleton} from '../../components/skeletons';

export default function ParentAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);  

  useEffect(() => {
    setLoading(true);
    const fetchAnnouncements = async () => {
      try {
        const res = await api.get('/communication/announcements');
        setAnnouncements(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  return (
   <>{loading ? (
      <DashboardLayout>
        <DashboardHeaderSkeleton />
        <AnnouncementCardSkeleton count={2} />
      </DashboardLayout>
    ) : (
      <DashboardLayout>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">School Announcements</h1>
        
        <div className="space-y-4">
          {announcements.length > 0 ? (
            announcements.map((a) => (
            <div key={a._id} className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-800">{a.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  a.audience === 'School' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                }`}>
                  {a.audience === 'School' ? 'School-Wide' : 'Class Specific'}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-2">{a.message}</p>
              <p className="text-xs text-gray-400">
                Posted on {new Date(a.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
            No announcements available right now.
          </div>
        )}
      </div>
    </DashboardLayout>)}</>
  );
}