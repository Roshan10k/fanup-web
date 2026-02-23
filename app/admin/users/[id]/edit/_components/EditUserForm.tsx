"use client";

import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { z } from "zod";
import { handleUpdateUser } from "@/app/lib/action/admin/user-action";

const editUserSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().optional(),
  photo: z.instanceof(File).optional(),
});

type EditUserData = z.infer<typeof editUserSchema>;

interface EditableUser {
  _id: string;
  fullName: string;
  email: string;
  role: "admin" | "user";
  profilePicture?: string | null;
}

interface EditUserFormProps {
  user: EditableUser;
  userId: string;
}

export default function EditUserForm({ user, userId }: EditUserFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    getProfilePictureUrl(user.profilePicture)
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EditUserData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      fullName: user.fullName || "",
      email: user.email || "",
      password: "",
    },
  });

  const onSubmit = async (data: EditUserData) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("fullName", data.fullName.trim());
      formData.append("email", data.email.trim());

      const nextPassword = (data.password || "").trim();
      if (nextPassword.length > 0) {
        formData.append("password", nextPassword);
      }

      if (data.photo instanceof File) {
        formData.append("photo", data.photo);
      }

      const result = await handleUpdateUser(userId, formData);
      if (!result.success) {
        toast.error(result.message || "Failed to update user");
        return;
      }

      toast.success("User updated successfully");
      router.replace(`/admin/users/${userId}`);
      router.refresh();
    } catch {
      toast.error("Failed to update user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSelectFile = (file: File | undefined) => {
    if (!file) return;
    setValue("photo", file, { shouldValidate: true });
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(String(reader.result || ""));
    reader.readAsDataURL(file);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="rounded-xl border border-gray-200 p-4 bg-gray-50 flex items-center gap-4">
        {imagePreview ? (
          <img
            src={imagePreview}
            alt={user.fullName}
            className="w-20 h-20 rounded-full object-cover border-2 border-red-200"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-rose-600 text-white text-2xl font-bold flex items-center justify-center">
            {user.fullName?.charAt(0) || "U"}
          </div>
        )}
        <div>
          <p className="font-semibold text-gray-900">{user.fullName}</p>
          <p className="text-sm text-gray-600">{user.email}</p>
          <p className="text-xs text-gray-500 mt-1">Role: {user.role.toUpperCase()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Full Name" error={errors.fullName?.message}>
          <input
            {...register("fullName")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
            placeholder="Enter full name"
          />
        </Field>

        <Field label="Email" error={errors.email?.message}>
          <input
            type="email"
            {...register("email")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
            placeholder="Enter email"
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="New Password" error={errors.password?.message}>
          <input
            type="password"
            {...register("password")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
            placeholder="Leave blank to keep current password"
          />
        </Field>

        <Field label="Profile Picture">
          <input
            type="file"
            accept="image/*"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            onChange={(event) => onSelectFile(event.target.files?.[0])}
          />
        </Field>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-60"
        >
          {isSubmitting ? "Updating..." : "Update User"}
        </button>
        <button
          type="button"
          onClick={() => router.push(`/admin/users/${userId}`)}
          className="px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
  error,
}: {
  label: string;
  children: ReactNode;
  error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      {children}
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
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
