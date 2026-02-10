"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupType } from "../schema";
import { Eye, EyeOff, Check, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { handleRegister } from "@/app/lib/action/auth_action";

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupType>({
    resolver: zodResolver(signupSchema),
  });

  const password = watch("password", "");
  const confirmPassword = watch("confirmPassword", "");

  const onSubmit = async (data: SignupType) => {
    // Check terms agreement
    if (!agreeToTerms) {
      setErrorMessage("Please accept the Terms of Service and Privacy Policy");
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);

    startTransition(async () => {
      try {
        const result = await handleRegister(data);

        if (result.success) {
          setSuccessMessage(result.message || "Account created successfully!");

          // Redirect to login after 2 seconds
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        } else {
          setErrorMessage(
            result.message || "Registration failed. Please try again.",
          );
        }
      } catch (error: any) {
        setErrorMessage(error.message || "An unexpected error occurred");
        console.error("Signup error:", error);
      }
    });
  };

  const passwordRequirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    {
      label: "Uppercase & lowercase letters",
      met: /(?=.*[a-z])(?=.*[A-Z])/.test(password),
    },
    { label: "At least one number", met: /\d/.test(password) },
    {
      label: "Special character (recommended)",
      met: /[^a-zA-Z0-9]/.test(password),
    },
  ];

  // Combine both loading states
  const isLoading = isSubmitting || isPending;

  return (
    <div className="space-y-6">
      {/* Success Alert */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          {successMessage}
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {errorMessage}
        </div>
      )}

      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          {...register("fullName")}
          placeholder="Enter Your Full Name"
          className={`w-full rounded-lg border ${
            errors.fullName ? "border-red-500" : "border-gray-300"
          } px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 transition`}
        />
        {errors.fullName && (
          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
            <X className="w-3 h-3" /> {errors.fullName.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          {...register("email")}
          placeholder="Enter Your Email"
          className={`w-full rounded-lg border ${
            errors.email ? "border-red-500" : "border-gray-300"
          } px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 transition`}
        />
        {errors.email && (
          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
            <X className="w-3 h-3" /> {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            {...register("password")}
            placeholder="Create a Password"
            className={`w-full rounded-lg border ${
              errors.password ? "border-red-500" : "border-gray-300"
            } px-4 py-3 pr-12 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 transition`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Password strength hints */}
        {password && (
          <div className="mt-3 space-y-1.5">
            {passwordRequirements.map((req, i) => (
              <p
                key={i}
                className={`text-xs flex items-center gap-1.5 ${
                  req.met ? "text-green-600" : "text-gray-500"
                }`}
              >
                {req.met ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <X className="w-3.5 h-3.5" />
                )}
                {req.label}
              </p>
            ))}
          </div>
        )}

        {errors.password && (
          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
            <X className="w-3 h-3" /> {errors.password.message}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Confirm Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            {...register("confirmPassword")}
            placeholder="Confirm your password"
            className={`w-full rounded-lg border ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300"
            } px-4 py-3 pr-12 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 transition`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {!errors.confirmPassword &&
          confirmPassword &&
          password === confirmPassword && (
            <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Passwords match!
            </p>
          )}

        {errors.confirmPassword && (
          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
            <X className="w-3 h-3" /> {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Terms */}
      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          id="terms"
          checked={agreeToTerms}
          onChange={(e) => setAgreeToTerms(e.target.checked)}
          className="mt-1 w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-400"
        />
        <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
          I agree to the{" "}
          <a href="#" className="text-red-600 hover:text-red-700 font-medium">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-red-600 hover:text-red-700 font-medium">
            Privacy Policy
          </a>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="button"
        onClick={handleSubmit(onSubmit)}
        disabled={isLoading}
        className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-medium transition flex items-center justify-center gap-2 shadow-md"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Creating Account...
          </>
        ) : (
          "Sign Up"
        )}
      </button>

      <p className="text-xs text-center text-gray-500">
        You'll receive a verification email after signing up
      </p>

      {/* Social Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-6 bg-white text-gray-500 font-medium">
            Or continue with
          </span>
        </div>
      </div>

      {/* Social Buttons */}
      <div className="space-y-4">
        {/* Google */}
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
    </div>
  );
}
