export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600">403 - Access Denied</h1>
        <p className="mt-2">You do not have permission to view this page.</p>
        <a href="/" className="mt-4 inline-block text-blue-600 hover:underline">Go to Login</a>
      </div>
    </div>
  );
}