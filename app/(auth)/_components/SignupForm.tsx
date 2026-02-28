"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupType } from "../schema";
import { Eye, EyeOff, Check, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { handleGoogleLogin, handleRegister } from "@/app/lib/action/auth_action";
import { useAuth } from "@/context/AuthContext";

const GOOGLE_SCRIPT_ID = "google-identity-services";

const loadGoogleIdentityScript = () =>
  new Promise<void>((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Window is not available"));
      return;
    }

    const existing = document.getElementById(
      GOOGLE_SCRIPT_ID,
    ) as HTMLScriptElement | null;

    if ((window as any).google?.accounts?.id) {
      resolve();
      return;
    }

    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Failed to load Google script")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.id = GOOGLE_SCRIPT_ID;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google script"));
    document.head.appendChild(script);
  });

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { checkAuth } = useAuth();

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

  const onGoogleContinue = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setErrorMessage("Google login is not configured.");
      return;
    }

    try {
      setIsGoogleSubmitting(true);
      await loadGoogleIdentityScript();

      const google = (window as any).google;
      if (!google?.accounts?.id) {
        throw new Error("Google sign-in is unavailable");
      }

      google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response: { credential?: string }) => {
          try {
            if (!response?.credential) {
              setErrorMessage("Failed to get Google credential.");
              return;
            }

            const result = await handleGoogleLogin(response.credential);
            if (!result.success) {
              setErrorMessage(result.message || "Google login failed.");
              return;
            }

            await checkAuth();
            if (result.data?.role === "admin") {
              router.replace("/admin");
            } else {
              router.replace("/dashboard");
            }
            router.refresh();
          } catch (error: any) {
            setErrorMessage(error.message || "Google login failed.");
          } finally {
            setIsGoogleSubmitting(false);
          }
        },
      });

      google.accounts.id.prompt();
      setTimeout(() => {
        setIsGoogleSubmitting(false);
      }, 15000);
    } catch (error: any) {
      setErrorMessage(error.message || "Google login failed.");
      setIsGoogleSubmitting(false);
    }
  };

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
        <label className="block text-sm font-medium text-gray-700 mb-1.5 dark:text-slate-300">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          {...register("fullName")}
          placeholder="Enter Your Full Name"
          className={`w-full rounded-lg border ${
            errors.fullName ? "border-red-500" : "border-gray-300 dark:border-slate-600"
          } px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 transition dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-400`}
        />
        {errors.fullName && (
          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
            <X className="w-3 h-3" /> {errors.fullName.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5 dark:text-slate-300">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          {...register("email")}
          placeholder="Enter Your Email"
          className={`w-full rounded-lg border ${
            errors.email ? "border-red-500" : "border-gray-300 dark:border-slate-600"
          } px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 transition dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-400`}
        />
        {errors.email && (
          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
            <X className="w-3 h-3" /> {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5 dark:text-slate-300">
          Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            {...register("password")}
            placeholder="Create a Password"
            className={`w-full rounded-lg border ${
              errors.password ? "border-red-500" : "border-gray-300 dark:border-slate-600"
            } px-4 py-3 pr-12 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 transition dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-400`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200"
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
                  req.met ? "text-green-600" : "text-gray-500 dark:text-slate-400"
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
        <label className="block text-sm font-medium text-gray-700 mb-1.5 dark:text-slate-300">
          Confirm Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            {...register("confirmPassword")}
            placeholder="Confirm your password"
            className={`w-full rounded-lg border ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300 dark:border-slate-600"
            } px-4 py-3 pr-12 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 transition dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-400`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200"
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
          className="mt-1 w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-400 dark:border-slate-600 dark:bg-slate-800"
        />
        <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer dark:text-slate-300">
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

      <p className="text-xs text-center text-gray-500 dark:text-slate-400">
        You'll receive a verification email after signing up
      </p>

      {/* Social Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-slate-700"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-6 bg-white text-gray-500 font-medium dark:bg-slate-900 dark:text-slate-400">
            Or continue with
          </span>
        </div>
      </div>

      {/* Social Buttons */}
      <div className="space-y-4">
        {/* Google */}
        <button
          type="button"
          onClick={onGoogleContinue}
          disabled={isGoogleSubmitting}
          className="w-full flex items-center justify-center gap-3 px-6 py-3.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition font-medium shadow-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
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
          <span>
            {isGoogleSubmitting ? "Connecting to Google..." : "Continue with Google"}
          </span>
        </button>
      </div>
    </div>
  );
}
