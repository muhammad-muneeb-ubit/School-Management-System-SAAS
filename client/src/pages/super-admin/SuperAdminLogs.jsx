import AuditLogs from '../AuditLogs';
// We need to wrap it in the dark sidebar layout, or just style the raw AuditLogs.
// For simplicity, let's just import AuditLogs and wrap it in a simple div.
export default function SuperAdminLogs() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <AuditLogs />
    </div>
  );
}