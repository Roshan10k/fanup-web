"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { handleDeleteUser } from "@/app/lib/action/admin/user-action";
import { Search, Eye, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import DeleteModal from "../../../_components/DeleteModal"; 

interface User {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
  profilePicture?: string | null;
}

interface Pagination {
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}

interface UserTableProps {
  users?: User[];
  pagination: Pagination;
  search?: string;
}

export default function UserTable({
  users = [],
  pagination,
  search,
}: UserTableProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(search || "");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // Delete modal state
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    userId: string;
    userName: string;
  } | null>(null);

  /* ---------------- SEARCH ---------------- */
  const handleSearch = () => {
    router.push(
      `/admin/users?page=1&size=${pagination.size}${
        searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ""
      }`
    );
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    router.push(`/admin/users?page=1&size=${pagination.size}`);
  };

  /* -------------- PAGINATION -------------- */
  const goToPage = (page: number) => {
    router.push(
      `/admin/users?page=${page}&size=${pagination.size}${
        search ? `&search=${encodeURIComponent(search)}` : ""
      }`
    );
  };

  const renderPagination = () => {
    const { page, totalPages } = pagination;
    const pages = [];
    const delta = 1;

    const start = Math.max(1, page - delta);
    const end = Math.min(totalPages, page + delta);

    // Previous button
    pages.push(
      <button
        key="prev"
        disabled={page === 1}
        onClick={() => goToPage(page - 1)}
        className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </button>
    );

    // First page
    if (start > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => goToPage(1)}
          className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          1
        </button>
      );
      if (start > 2) {
        pages.push(
          <span key="start-ellipsis" className="px-2 py-2 text-gray-500">
            ...
          </span>
        );
      }
    }

    // Page numbers
    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
            i === page
              ? "bg-red-600 text-white border border-red-600"
              : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
          }`}
        >
          {i}
        </button>
      );
    }

    // Last page
    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push(
          <span key="end-ellipsis" className="px-2 py-2 text-gray-500">
            ...
          </span>
        );
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => goToPage(totalPages)}
          className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {totalPages}
        </button>
      );
    }

    // Next button
    pages.push(
      <button
        key="next"
        disabled={page === totalPages}
        onClick={() => goToPage(page + 1)}
        className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    );

    return pages;
  };

  /* ---------------- DELETE ---------------- */
  const handleDelete = async () => {
    if (!deleteModal) return;

    setDeletingId(deleteModal.userId);
    try {
      const result = await handleDeleteUser(deleteModal.userId);
      if (result.success) {
        toast.success("User deleted successfully");
        router.refresh();
        setDeleteModal(null);
      } else {
        toast.error(result.message || "Failed to delete user");
      }
    } catch (error) {
      toast.error("Failed to delete user");
    } finally {
      setDeletingId(null);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "user":
        return "bg-rose-100 text-rose-700 border-rose-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getAvatarGradient = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-gradient-to-br from-blue-500 to-blue-600";
      case "user":
        return "bg-gradient-to-br from-red-500 to-rose-600";
      default:
        return "bg-gradient-to-br from-gray-500 to-gray-600";
    }
  };

  const getProfilePictureUrl = (profilePicture: string | null | undefined) => {
    if (!profilePicture) return null;
    
    // If it's already a full URL (http/https)
    if (profilePicture.startsWith('http')) {
      return profilePicture;
    }
    
    // If it already has a path (starts with /)
    if (profilePicture.startsWith('/')) {
      return profilePicture;
    }
    
    // Point to backend server
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    return `${BACKEND_URL}/uploads/profile-pictures/${profilePicture}`;
  };

  /* ---------------- RENDER ---------------- */
  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Search Bar */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search by name or email..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap"
            >
              Search
            </button>
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="px-4 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <Search className="w-12 h-12 mb-3 text-gray-300" />
                      <p className="text-lg font-medium">No users found</p>
                      <p className="text-sm mt-1">Try adjusting your search criteria</p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {getProfilePictureUrl(user.profilePicture) ? (
                          <img
                            src={getProfilePictureUrl(user.profilePicture)!}
                            alt={user.fullName}
                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                          />
                        ) : (
                          <div className={`w-10 h-10 rounded-full ${getAvatarGradient(user.role)} flex items-center justify-center text-white font-semibold`}>
                            {user.fullName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="font-medium text-gray-900">{user.fullName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/users/${user._id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Link>
                        <Link
                          href={`/admin/users/${user._id}/edit`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                          Edit
                        </Link>
                        <button
                          disabled={deletingId === user._id}
                          onClick={() => setDeleteModal({
                            isOpen: true,
                            userId: user._id,
                            userName: user.fullName
                          })}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalItems > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {users.length > 0 ? (
                  <>
                    Showing <span className="font-medium">{(pagination.page - 1) * pagination.size + 1}</span> to{" "}
                    <span className="font-medium">
                      {Math.min(pagination.page * pagination.size, pagination.totalItems)}
                    </span>{" "}
                    of <span className="font-medium">{pagination.totalItems}</span> users
                  </>
                ) : (
                  <>
                    No users on this page. Total <span className="font-medium">{pagination.totalItems}</span> users
                  </>
                )}
              </div>
              <div className="flex items-center gap-1">
                {renderPagination()}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModal?.isOpen || false}
        onClose={() => setDeleteModal(null)}
        onConfirm={handleDelete}
        title="Delete User?"
        description={`Are you sure you want to delete "${deleteModal?.userName}"? All associated data will be permanently removed from the system.`}
        isDeleting={deletingId === deleteModal?.userId}
      />
    </>
  );
}