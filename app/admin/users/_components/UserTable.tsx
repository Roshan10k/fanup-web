"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { handleDeleteUser } from "@/app/lib/action/admin/user-action";
import { toast } from "react-toastify";

interface User {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
}

interface UserTableProps {
  initialUsers: User[];
}

export default function UserTable({ initialUsers }: UserTableProps) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    setDeletingId(id);
    try {
      const result = await handleDeleteUser(id);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      setUsers(users.filter((user) => user._id !== id));
      toast.success("User deleted successfully");
      router.refresh();
    } catch {
      toast.error("Failed to delete user");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div
      className="overflow-hidden border"
      style={{
        backgroundColor: "#FFFFFF",
        borderColor: "#E0E0E0",
        borderRadius: "20px",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <table className="w-full border-collapse">
        {/* Header */}
        <thead
          style={{
            backgroundColor: "#F5F5F5",
            borderBottom: "1px solid #E0E0E0",
          }}
        >
          <tr>
            {["User", "Email", "Role", "Joined", "Actions"].map((h) => (
              <th
                key={h}
                className="px-6 py-4 text-left text-sm font-semibold"
                style={{ color: "#333333" }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {users.map((user) => (
            <tr
              key={user._id}
              className="transition"
              style={{
                borderBottom: "1px solid #E0E0E0",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#F5F5F5")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#FFFFFF")
              }
            >
              {/* User */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 flex items-center justify-center font-semibold text-white"
                    style={{
                      backgroundColor:
                        user.role === "admin" ? "#FE304C" : "#1565C0",
                      borderRadius: "50%",
                    }}
                  >
                    {user.fullName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold" style={{ color: "#333333" }}>
                      {user.fullName}
                    </div>
                    <div className="text-xs" style={{ color: "#999999" }}>
                      {user._id.slice(-6)}
                    </div>
                  </div>
                </div>
              </td>

              {/* Email */}
              <td className="px-6 py-4 text-sm" style={{ color: "#333333" }}>
                {user.email}
              </td>

              {/* Role */}
              <td className="px-6 py-4">
                <span
                  className="px-3 py-1 text-xs font-semibold"
                  style={{
                    borderRadius: "20px",
                    backgroundColor:
                      user.role === "admin" ? "#FCE4EC" : "#E3F2FD",
                    color: user.role === "admin" ? "#C2185B" : "#1565C0",
                  }}
                >
                  {user.role.toUpperCase()}
                </span>
              </td>

              {/* Joined */}
              <td className="px-6 py-4 text-sm" style={{ color: "#777777" }}>
                {new Date(user.createdAt).toLocaleDateString()}
              </td>

              {/* Actions */}
              <td className="px-6 py-4">
                <div className="flex justify-end gap-2 text-sm font-medium">
                  <Link
                    href={`/admin/users/${user._id}`}
                    style={{ color: "#FE304C" }}
                  >
                    View
                  </Link>
                  <Link
                    href={`/admin/users/${user._id}/edit`}
                    style={{ color: "#777777" }}
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(user._id, user.fullName)}
                    disabled={deletingId === user._id}
                    style={{
                      color: "#E74C3C",
                      opacity: deletingId === user._id ? 0.5 : 1,
                    }}
                  >
                    {deletingId === user._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Empty state */}
      {users.length === 0 && (
        <div className="py-12 text-center text-sm" style={{ color: "#777777" }}>
          No users found
        </div>
      )}
    </div>
  );
}
