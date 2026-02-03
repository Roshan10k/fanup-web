"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { handleCreateUser } from "@/app/lib/action/admin/user-action";
import { z } from "zod";

// Validation schema
const createUserSchema = z
  .object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    photo: z.any().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type CreateUserData = z.infer<typeof createUserSchema>;

export default function CreateUserForm() {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CreateUserData>({
    resolver: zodResolver(createUserSchema),
  });

  const handleImageChange = (file: File | undefined) => {
    if (file) {
      setValue("photo", file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageChange(e.dataTransfer.files[0]);
    }
  };

  const onSubmit = async (data: CreateUserData) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value as any);
      });

      const result = await handleCreateUser(formData);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success("User created successfully!");
      router.push("/admin/users");
      router.refresh();
    } catch {
      toast.error("Failed to create user");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center space-y-4">
          {/* Image Preview or Placeholder */}
          <div className="relative">
            {imagePreview ? (
              <div className="relative group">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 rounded-full object-cover border-4 shadow-lg"
                  style={{ borderColor: "#FE304C" }}
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setValue("photo", undefined);
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-red-600 transition-all transform hover:scale-110"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div
                className="w-32 h-32 rounded-full flex items-center justify-center shadow-lg"
                style={{
                  background:
                    "linear-gradient(135deg, #FCE043 0%, #FF5E62 100%)",
                }}
              >
                <svg
                  className="w-16 h-16 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Upload Area */}
          <div className="w-full">
            <label
              htmlFor="photo-upload"
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`
                flex flex-col items-center justify-center w-full h-32 
                border-2 border-dashed rounded-2xl cursor-pointer
                transition-all duration-300 ease-in-out
                ${
                  dragActive
                    ? "border-[#FE304C] bg-pink-50 scale-105"
                    : "border-[#E0E0E0] hover:border-[#FE304C] hover:bg-gray-50"
                }
              `}
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-10 h-10 mb-3"
                  style={{ color: "#FE304C" }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p
                  className="mb-2 text-sm font-semibold"
                  style={{ color: "#333333" }}
                >
                  <span style={{ color: "#FE304C" }}>Click to upload</span> or
                  drag and drop
                </p>
                <p className="text-xs" style={{ color: "#999999" }}>
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>
              <input
                id="photo-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleImageChange(e.target.files?.[0])}
              />
            </label>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-5">
          {/* Full Name */}
          <div className="space-y-2">
            <label
              className="text-sm font-semibold flex items-center gap-2"
              style={{ color: "#333333", fontFamily: "Poppins, sans-serif" }}
            >
              <svg
                className="w-4 h-4"
                style={{ color: "#FE304C" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Full Name
            </label>
            <input
              {...register("fullName")}
              placeholder="John Doe"
              className="w-full px-4 py-3 border outline-none transition-all duration-300 focus:border-[#FE304C] focus:shadow-lg"
              style={{
                backgroundColor: "#FFFFFF",
                borderColor: errors.fullName ? "#F44336" : "#E0E0E0",
                borderRadius: "12px",
                borderWidth: "1px",
                color: "#333333",
                fontFamily: "Poppins, sans-serif",
              }}
            />
            {errors.fullName && (
              <p
                className="text-xs flex items-center gap-1"
                style={{ color: "#F44336" }}
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label
              className="text-sm font-semibold flex items-center gap-2"
              style={{ color: "#333333", fontFamily: "Poppins, sans-serif" }}
            >
              <svg
                className="w-4 h-4"
                style={{ color: "#FE304C" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Email Address
            </label>
            <input
              type="email"
              {...register("email")}
              placeholder="john@example.com"
              className="w-full px-4 py-3 border outline-none transition-all duration-300 focus:border-[#FE304C] focus:shadow-lg"
              style={{
                backgroundColor: "#FFFFFF",
                borderColor: errors.email ? "#F44336" : "#E0E0E0",
                borderRadius: "12px",
                borderWidth: "1px",
                color: "#333333",
                fontFamily: "Poppins, sans-serif",
              }}
            />
            {errors.email && (
              <p
                className="text-xs flex items-center gap-1"
                style={{ color: "#F44336" }}
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Password */}
            <div className="space-y-2">
              <label
                className="text-sm font-semibold flex items-center gap-2"
                style={{ color: "#333333", fontFamily: "Poppins, sans-serif" }}
              >
                <svg
                  className="w-4 h-4"
                  style={{ color: "#FE304C" }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                Password
              </label>
              <input
                type="password"
                {...register("password")}
                placeholder="••••••••"
                className="w-full px-4 py-3 border outline-none transition-all duration-300 focus:border-[#FE304C] focus:shadow-lg"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: errors.password ? "#F44336" : "#E0E0E0",
                  borderRadius: "12px",
                  borderWidth: "1px",
                  color: "#333333",
                  fontFamily: "Poppins, sans-serif",
                }}
              />
              {errors.password && (
                <p
                  className="text-xs flex items-center gap-1"
                  style={{ color: "#F44336" }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label
                className="text-sm font-semibold flex items-center gap-2"
                style={{ color: "#333333", fontFamily: "Poppins, sans-serif" }}
              >
                <svg
                  className="w-4 h-4"
                  style={{ color: "#FE304C" }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Confirm Password
              </label>
              <input
                type="password"
                {...register("confirmPassword")}
                placeholder="••••••••"
                className="w-full px-4 py-3 border outline-none transition-all duration-300 focus:border-[#FE304C] focus:shadow-lg"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: errors.confirmPassword ? "#F44336" : "#E0E0E0",
                  borderRadius: "12px",
                  borderWidth: "1px",
                  color: "#333333",
                  fontFamily: "Poppins, sans-serif",
                }}
              />
              {errors.confirmPassword && (
                <p
                  className="text-xs flex items-center gap-1"
                  style={{ color: "#F44336" }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-3 font-semibold text-white transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            style={{
              background: isSubmitting
                ? "#999999"
                : "linear-gradient(135deg, #FE304C 0%, #FF5E62 100%)",
              borderRadius: "30px",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Creating User...
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
                Create User
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 py-3 font-semibold border-2 transition-all duration-300 hover:bg-gray-50 flex items-center justify-center gap-2"
            style={{
              borderRadius: "30px",
              borderColor: "#E0E0E0",
              color: "#777777",
              backgroundColor: "#FFFFFF",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}