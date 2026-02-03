"use client";

import { useAuth } from "@/context/AuthContext"; 
import { useState } from "react";
import { toast } from "react-toastify";

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const [editing, setEditing] = useState(false);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">My Profile</h1>
                <button
                    onClick={logout}
                    className="px-4 py-2 rounded-md border text-sm"
                >
                    Logout
                </button>
            </div>

            <div className="rounded-lg border bg-card p-8">
                <div className="space-y-6">
                    <div className="flex justify-center">
                        <div className="w-24 h-24 rounded-full bg-foreground text-background flex items-center justify-center text-3xl font-bold">
                            {user.email?.charAt(0).toUpperCase()}
                        </div>
                    </div>

                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-bold">{user.fullName || user.email}</h2>
                        <p className="text-muted-foreground">{user.email}</p>
                        <span className="inline-block px-4 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700">
                            {user.role?.toUpperCase()}
                        </span>
                    </div>

                    {!editing ? (
                        <button
                            onClick={() => setEditing(true)}
                            className="w-full py-2 rounded-md bg-foreground text-background font-semibold"
                        >
                            Edit Profile
                        </button>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-center text-muted-foreground">
                                Edit functionality coming soon!
                            </p>
                            <button
                                onClick={() => setEditing(false)}
                                className="w-full py-2 rounded-md border font-semibold"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}