import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { LayoutSkeleton } from '../components/skeletons';

export default function ProtectedRoute({ element, allowedRoles }) {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) return<LayoutSkeleton />
  if (!user) return <Navigate to="/" replace />;
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return element;
}