export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl animate-pulse space-y-6">
        <div className="h-8 w-56 rounded-lg bg-gray-200" />
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2 h-48 rounded-3xl bg-gray-200" />
          <div className="h-48 rounded-3xl bg-gray-200" />
        </div>
        <div className="h-12 w-72 rounded-2xl bg-gray-200" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          <div className="h-64 rounded-2xl bg-gray-200" />
          <div className="h-64 rounded-2xl bg-gray-200" />
          <div className="h-64 rounded-2xl bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
