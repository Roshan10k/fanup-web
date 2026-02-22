import Link from "next/link";
import { handleGetAllUsers, handleGetUserStats } from "@/app/lib/action/admin/user-action";

type AdminUser = {
  _id: string;
  fullName: string;
  email: string;
  role: "admin" | "user";
  createdAt: string;
};

export default async function Page() {
  const [statsResult, usersResult] = await Promise.all([
    handleGetUserStats(),
    handleGetAllUsers("1", "6"),
  ]);

  const stats = statsResult.success && statsResult.data ? statsResult.data : null;
  const recentUsers = (usersResult.success ? usersResult.data : []) as AdminUser[];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">
            Overview of platform users and quick admin actions.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/users/create"
            className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition"
          >
            Create User
          </Link>
          <Link
            href="/admin/users"
            className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            Manage Users
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Total Users" value={String(stats?.totalUsers ?? 0)} />
        <StatCard label="Admin Accounts" value={String(stats?.adminCount ?? 0)} />
        <StatCard label="Regular Users" value={String(stats?.userCount ?? 0)} />
      </div>

      <section className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Users</h2>
          <Link
            href="/admin/users"
            className="text-sm font-semibold text-red-600 hover:text-red-700"
          >
            View all
          </Link>
        </div>

        {recentUsers.length === 0 ? (
          <div className="px-5 py-10 text-sm text-gray-500 text-center">
            No users found yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Name</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Email</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Role</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Joined</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wide">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 text-sm font-medium text-gray-900">{user.fullName}</td>
                    <td className="px-5 py-3 text-sm text-gray-600">{user.email}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                          user.role === "admin"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        href={`/admin/users/${user._id}`}
                        className="text-sm font-semibold text-red-600 hover:text-red-700"
                      >
                        Open
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-red-50 p-5">
        <h3 className="text-base font-semibold text-gray-900">What to do from Admin Dashboard</h3>
        <p className="text-sm text-gray-700 mt-2">
          Use this page for quick visibility, then move to Users for full CRUD operations.
        </p>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-700">
          <div className="rounded-lg bg-white border border-red-100 px-3 py-2">1. Check user count growth</div>
          <div className="rounded-lg bg-white border border-red-100 px-3 py-2">2. Create/update admin accounts</div>
          <div className="rounded-lg bg-white border border-red-100 px-3 py-2">3. Review latest registrations</div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-gray-600">{label}</p>
      <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
    </div>
  );
}
