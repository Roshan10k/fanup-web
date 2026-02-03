import Link from "next/link";
import { notFound } from "next/navigation";
import { handleGetUserById } from "@/app/lib/action/admin/user-action";

export default async function Page({
    params
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const result = await handleGetUserById(id);

    if (!result.success || !result.data) {
        notFound();
    }

    const user = result.data;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">User Details</h1>
                    <p className="text-sm text-muted-foreground">ID: {id}</p>
                </div>
                <Link
                    href="/admin/users"
                    className="px-4 py-2 rounded-md border text-sm font-medium"
                >
                    ← Back
                </Link>
            </div>

            {/* User Card */}
            <div className="rounded-lg border bg-card p-8">
                <div className="space-y-6">
                    <div className="flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-foreground text-background flex items-center justify-center text-3xl font-bold">
                            {user.fullName?.charAt(0) || 'U'}
                        </div>
                    </div>

                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-bold">{user.fullName}</h2>
                        <p className="text-muted-foreground">{user.email}</p>
                        <span className="inline-block px-4 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700">
                            {user.role.toUpperCase()}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-6 border-t">
                        <div>
                            <div className="text-sm font-semibold text-muted-foreground">User ID</div>
                            <div className="font-medium mt-1">{user._id}</div>
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-muted-foreground">Member Since</div>
                            <div className="font-medium mt-1">
                                {new Date(user.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-6">
                        <Link
                            href={`/admin/users/${id}/edit`}
                            className="flex-1 py-2 rounded-md bg-foreground text-background text-center font-semibold"
                        >
                            Edit User
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}