"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupType } from "../schema";

export default function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupType>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupType) => {
    console.log("Signup Data:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium text-[#374151] mb-1">
          Full Name
        </label>
        <input
          {...register("fullName")}
          placeholder="Enter Your Full Name"
          className="w-full rounded-lg border border-[#d1d5db] px-4 py-2.5 text-sm placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400"
        />
        {errors.fullName && (
          <p className="text-xs text-red-500 mt-1">
            {errors.fullName.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-[#374151] mb-1">
          Email
        </label>
        <input
          type="email"
          {...register("email")}
          placeholder="Enter Your Email"
          className="w-full rounded-lg border border-[#d1d5db] px-4 py-2.5 text-sm placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400"
        />
        {errors.email && (
          <p className="text-xs text-red-500 mt-1">
            {errors.email.message}
          </p>
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
          placeholder="Create a Password"
          className="w-full rounded-lg border border-[#d1d5db] px-4 py-2.5 text-sm placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400"
        />
        {errors.password && (
          <p className="text-xs text-red-500 mt-1">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-medium text-[#374151] mb-1">
          Confirm Password
        </label>
        <input
          type="password"
          {...register("confirmPassword")}
          placeholder="Confirm your password"
          className="w-full rounded-lg border border-[#d1d5db] px-4 py-2.5 text-sm placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400"
        />
        {errors.confirmPassword && (
          <p className="text-xs text-red-500 mt-1">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Button */}
      <button
        disabled={isSubmitting}
        className="w-full bg-[#ef4f3f] hover:bg-[#e64535] text-white py-3 rounded-xl font-medium transition"
      >
        {isSubmitting ? "Creating Account..." : "Login"}
      </button>
    </form>
  );
}
