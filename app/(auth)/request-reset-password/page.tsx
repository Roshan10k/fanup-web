"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { handleRequestPasswordReset } from "@/app/lib/action/auth_action";
import { ForgotPasswordType, forgotPasswordSchema } from "../schema";
import Navbar from "@/app/_components/navbar";



export default function ForgotPasswordPage() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordType>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordType) => {
    try {
      setErrorMessage(null);
      setSuccessMessage(null);

      const result = await handleRequestPasswordReset(data.email);

      if (result.success) {
        setSuccessMessage(
          "Password reset link has been sent to your email."
        );
      } else {
        setErrorMessage(result.message || "Something went wrong.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Unexpected error occurred.");
    }
  };

  return (
    <>
      <Navbar variant="auth" />
      <div className="min-h-[calc(100vh-73px)] px-4 py-10 dark:bg-slate-950">
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow dark:bg-slate-900 dark:border dark:border-slate-700">
          <h1 className="text-2xl font-bold text-center mb-2 dark:text-slate-100">
            Forgot Password?
          </h1>
          <p className="text-sm text-gray-600 text-center mb-6 dark:text-slate-300">
            Enter your email and we’ll send you a reset link.
          </p>

          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 text-sm">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-slate-300">
                Email
              </label>
              <input
                type="email"
                {...register("email")}
                placeholder="Enter your email"
                className={`w-full rounded-lg border px-4 py-3 text-sm ${
                  errors.email ? "border-red-500" : "border-gray-300 dark:border-slate-600"
                } dark:bg-slate-800 dark:text-slate-100`}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" />
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            <Link href="/login" className="text-sm text-red-600 hover:underline dark:text-red-400">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
