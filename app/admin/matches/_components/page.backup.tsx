import MatchManagement from "./_components/MatchManagement";

export default async function MatchesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Match Management</h1>
          <p className="text-sm text-gray-600 mt-1">
            View leaderboards, lock matches, and complete & settle contests.
          </p>
        </div>
      </div>

      <MatchManagement />
    </div>
  );
}
