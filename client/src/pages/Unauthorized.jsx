import { Link } from 'react-router-dom';
import { ShieldAlert, Home } from 'lucide-react';

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-red-900 text-center p-4">
      <ShieldAlert size={80} className="text-red-400 mb-6" />
      <h1 className="text-6xl font-extrabold text-white mb-4 drop-shadow-md">403</h1>
      <h2 className="text-2xl font-bold text-red-200 mb-2">Access Denied</h2>
      <p className="text-gray-400 mb-8 max-w-md">You do not have the required permissions to view this page. Please contact your system administrator if you believe this is a mistake.</p>
      <Link to="/" className="flex items-center space-x-2 bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition shadow-lg">
        <Home size={20} />
        <span>Back to Dashboard</span>
      </Link>
    </div>
  );
}