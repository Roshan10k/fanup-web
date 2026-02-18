"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginType } from "../schema";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { handleLogin } from "@/app/lib/action/auth_action";
import { useAuth } from "@/context/AuthContext";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const { checkAuth } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginType>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginType) => {
    try {
      setErrorMessage(null); // Clear previous errors

      // Call your server action
      const result = await handleLogin(data);

      if (result.success) {
        await checkAuth();
        if (result.data?.role === "admin") {
          router.replace("/admin");
        } else {
          router.replace("/dashboard");
        }
        router.refresh();
      } else {
        // Show error message from server
        setErrorMessage(result.message || "Login failed. Please try again.");
      }
    } catch (error: any) {
      // Handle unexpected errors
      setErrorMessage(error.message || "An unexpected error occurred");
      console.error("Login error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
        <p className="text-sm text-gray-600 mt-2">
          Login to continue your FanUp journey
        </p>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {errorMessage}
        </div>
      )}

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          {...register("email")}
          placeholder="Enter your email"
          className={`w-full rounded-lg border ${
            errors.email ? "border-red-500" : "border-gray-300"
          } px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400`}
        />
        {errors.email && (
          <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-sm font-medium text-gray-700">
            Password <span className="text-red-500">*</span>
          </label>
          <Link
            href="/request-reset-password"
            className="text-sm text-red-600 hover:text-red-700"
          >
            Forgot Password?
          </Link>
        </div>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            {...register("password")}
            placeholder="Enter your password"
            className={`w-full rounded-lg border ${
              errors.password ? "border-red-500" : "border-gray-300"
            } px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-red-400`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {errors.password && (
          <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Login Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white py-3.5 rounded-xl font-medium flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Logging in...
          </>
        ) : (
          "Login"
        )}
      </button>

      {/* Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-6 bg-white text-gray-500 font-medium">
            Or continue with
          </span>
        </div>
      </div>

      {/* Social Buttons */}
      <div className="space-y-4">
        {/* Google*/}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 px-6 py-3.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition font-medium shadow-sm"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.51h5.84c-.25 1.31-.98 2.42-2.07 3.16v2.63h3.35c1.96-1.81 3.09-4.47 3.09-7.25z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.35-2.63c-.98.66-2.23 1.06-3.93 1.06-3.02 0-5.58-2.04-6.49-4.79H.96v2.67C2.77 20.39 6.62 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.51 14.21c-.23-.66-.36-1.37-.36-2.21s.13-1.55.36-2.21V7.34H.96C.35 8.85 0 10.39 0 12s.35 3.15.96 4.66l4.55-2.45z"
            />
            <path
              fill="#EA4335"
              d="M12 4.98c1.64 0 3.11.56 4.27 1.66l3.19-3.19C17.46 1.01 14.97 0 12 0 6.62 0 2.77 2.61.96 6.34l4.55 2.45C6.42 6.02 9 4.98 12 4.98z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Facebook */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-[#1877F2] text-white rounded-xl hover:bg-[#166FE5] transition font-medium shadow-sm"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="white">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span>Continue with Facebook</span>
        </button>
      </div>
    </form>
  );
}
