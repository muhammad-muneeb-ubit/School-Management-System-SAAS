import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { LayoutSkeleton } from '../components/skeletons';

export default function ProtectedRoute({ element, allowedRoles }) {
  const { user, loading } = useSelector((state) => state.auth);
   const location = useLocation();

  // console.log('ProtectedRoute - user:', user?.role);
  if (loading) {
    // If the URL is /admin, show the dark skeleton, else show the blue one!
    const theme = location.pathname.startsWith('/admin') ? 'admin' : 'blue';
    return <LayoutSkeleton theme={theme} user={user?.role} />;
  }if (!user) return <Navigate to="/" replace />;
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return element;
}