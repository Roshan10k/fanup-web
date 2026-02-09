import Link from "next/link";
import { handleGetAllUsers, handleGetUserStats } from "@/app/lib/action/admin/user-action";
import UserTable from "./_components/UserTable";

export default async function Page({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams;
    const page = params.page as string || '1';
    const size = params.size as string || '10';
    const search = params.search as string || '';

    const [usersResult, statsResult] = await Promise.all([
        handleGetAllUsers(page, size, search),
        handleGetUserStats(),
    ]);

    if (!usersResult.success) {
        throw new Error(usersResult.message || 'Failed to load users');
    }

    const stats = statsResult.success ? statsResult.data : null;

    // Ensure pagination is always defined
    const pagination = usersResult.pagination || {
        page: parseInt(page),
        size: parseInt(size),
        totalItems: 0,
        totalPages: 0
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">User Management</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage all users in the system
                    </p>
                </div>
                <Link
                    href="/admin/users/create"
                    className="px-4 py-2 rounded-md bg-foreground text-background text-sm font-semibold hover:opacity-90"
                >
                    + Create User
                </Link>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-lg border bg-card p-6">
                        <div className="text-sm font-semibold text-muted-foreground">
                            Total Users
                        </div>
                        <div className="text-3xl font-bold mt-2">
                            {stats.totalUsers}
                        </div>
                    </div>
                    <div className="rounded-lg border bg-card p-6">
                        <div className="text-sm font-semibold text-muted-foreground">
                            Admin Users
                        </div>
                        <div className="text-3xl font-bold mt-2 text-purple-600">
                            {stats.adminCount}
                        </div>
                    </div>
                    <div className="rounded-lg border bg-card p-6">
                        <div className="text-sm font-semibold text-muted-foreground">
                            Regular Users
                        </div>
                        <div className="text-3xl font-bold mt-2 text-blue-600">
                            {stats.userCount}
                        </div>
                    </div>
                </div>
            )}

            {/* Users Table */}
            <UserTable 
                users={usersResult.data || []} 
                pagination={pagination} 
                search={search} 
            />
        </div>
    );
}