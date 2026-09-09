import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { LayoutSkeleton } from '../components/skeletons';

export default function ProtectedRoute({ element, allowedRoles }) {
  const { user, loading } = useSelector((state) => state.auth);
  console.log('ProtectedRoute - user:', user?.role);
  if (loading) return<LayoutSkeleton  theme={'blue'} />
  if (!user) return <Navigate to="/" replace />;
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return element;
}