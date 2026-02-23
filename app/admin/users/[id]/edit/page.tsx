import Link from "next/link";
import { notFound } from "next/navigation";
import { handleGetUserById } from "@/app/lib/action/admin/user-action";
import EditUserForm from "./_components/EditUserForm";

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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Edit User</h1>
                    <p className="text-sm text-gray-600 mt-1">Update profile details and credentials.</p>
                </div>
                <div className="flex gap-2">
                    <Link
                        href={`/admin/users/${id}`}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                        Back to Details
                    </Link>
                    <Link
                        href="/admin/users"
                        className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                        Users List
                    </Link>
                </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <EditUserForm user={result.data} userId={id} />
            </div>
        </div>
    );
}
