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
                    <h1 className="text-2xl font-bold">Edit User</h1>
                    <p className="text-sm text-muted-foreground">ID: {id}</p>
                </div>
                <Link
                    href={`/admin/users/${id}`}
                    className="px-4 py-2 rounded-md border text-sm font-medium"
                >
                    ← Back
                </Link>
            </div>

            <div className="rounded-lg border bg-card p-6">
                <EditUserForm user={result.data} userId={id} />
            </div>
        </div>
    );
}