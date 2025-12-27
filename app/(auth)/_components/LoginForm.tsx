"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginType } from "../schema";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginType>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginType) => {
    console.log("Login Data:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-[#374151] mb-1">
          Email
        </label>
        <input
          type="email"
          {...register("email")}
          placeholder="Enter your email"
          className="
            w-full
            rounded-lg
            border border-[#d1d5db]
            px-4 py-2.5
            text-sm
            placeholder-[#9ca3af]
            focus:outline-none
            focus:ring-2
            focus:ring-red-400
            focus:border-red-400
          "
        />
        {errors.email && (
          <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-[#374151] mb-1">
          Password
        </label>
        <input
          type="password"
          {...register("password")}
          placeholder="Enter your password"
          className="
            w-full
            rounded-lg
            border border-[#d1d5db]
            px-4 py-2.5
            text-sm
            placeholder-[#9ca3af]
            focus:outline-none
            focus:ring-2
            focus:ring-red-400
            focus:border-red-400
          "
        />
        {errors.password && (
          <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Forgot Password */}
      <div className="text-right">
        <span className="text-sm text-[#2563eb] cursor-pointer">
          Forgot Password?
        </span>
      </div>

      {/* Button */}
      <button
        disabled={isSubmitting}
        className="
          w-full
          bg-red-500
          hover:bg-red-600
          text-white
          py-3
          rounded-xl
          font-medium
          transition
        "
      >
        {isSubmitting ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
