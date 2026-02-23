import Link from "next/link";
import { notFound } from "next/navigation";
import { handleGetUserById } from "@/app/lib/action/admin/user-action";
import { Eye, Mail, Pencil, Shield, User as UserIcon } from "lucide-react";
import { ReactNode } from "react";

type UserDetails = {
    _id: string;
    fullName: string;
    email: string;
    role: "admin" | "user";
    createdAt: string;
    updatedAt: string;
    profilePicture?: string | null;
};

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

    const user = result.data as UserDetails;
    const profilePictureUrl = getProfilePictureUrl(user.profilePicture);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">User Details</h1>
                    <p className="text-sm text-gray-600 mt-1">Review user profile and account metadata.</p>
                </div>
                <div className="flex gap-2">
                    <Link
                        href="/admin/users"
                        className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                        Back
                    </Link>
                    <Link
                        href={`/admin/users/${id}/edit`}
                        className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
                    >
                        Edit User
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <section className="lg:col-span-1 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col items-center text-center">
                        {profilePictureUrl ? (
                            <img
                                src={profilePictureUrl}
                                alt={user.fullName}
                                className="w-28 h-28 rounded-full object-cover border-4 border-red-100"
                            />
                        ) : (
                            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-red-500 to-rose-600 text-white text-4xl font-bold flex items-center justify-center">
                                {user.fullName?.charAt(0) || "U"}
                            </div>
                        )}

                        <h2 className="text-2xl font-bold text-gray-900 mt-4">{user.fullName}</h2>
                        <p className="text-sm text-gray-600 mt-1">{user.email}</p>
                        <span
                            className={`mt-3 inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                                user.role === "admin"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-rose-100 text-rose-700"
                            }`}
                        >
                            {user.role.toUpperCase()}
                        </span>
                    </div>
                </section>

                <section className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-5">
                        <Eye className="w-5 h-5 text-red-600" />
                        <h3 className="text-lg font-semibold text-gray-900">Account Information</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InfoCard icon={<UserIcon className="w-4 h-4 text-red-600" />} label="Full Name" value={user.fullName} />
                        <InfoCard icon={<Mail className="w-4 h-4 text-red-600" />} label="Email" value={user.email} />
                        <InfoCard icon={<Shield className="w-4 h-4 text-red-600" />} label="Role" value={user.role.toUpperCase()} />
                        <InfoCard
                            icon={<Pencil className="w-4 h-4 text-red-600" />}
                            label="Joined"
                            value={new Date(user.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                            })}
                        />
                    </div>

                    <div className="mt-5 rounded-lg border border-gray-200 bg-gray-50 p-3">
                        <p className="text-xs text-gray-500 font-semibold">User ID</p>
                        <p className="text-sm text-gray-800 mt-1 break-all">{user._id}</p>
                    </div>
                </section>
            </div>
        </div>
    );
}

function getProfilePictureUrl(profilePicture: string | null | undefined) {
    if (!profilePicture) return null;
    if (profilePicture.startsWith("http")) return profilePicture;
    if (profilePicture.startsWith("/")) return profilePicture;
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    return `${backendUrl}/uploads/profile-pictures/${profilePicture}`;
}

function InfoCard({
    icon,
    label,
    value,
}: {
    icon: ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-lg border border-gray-200 p-4">
            <p className="text-xs font-semibold text-gray-500 flex items-center gap-1.5">{icon}{label}</p>
            <p className="text-base font-semibold text-gray-900 mt-2">{value}</p>
        </div>
    );
}
