import LoginForm from "../_components/LoginForm";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow">

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <Image src="/images/logo.png" alt="logo" width={100} height={100}/>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-center text-[#111827]">
          Welcome Back
        </h1>

        <p className="text-sm text-center text-[#6b7280] mt-1 mb-6">
          Login to continue your fanup journey
        </p>

        <LoginForm />

        {/* Signup */}
        <p className="text-center text-sm mt-5 text-[#6b7280]">
          Don&apos;t have an account?{" "}
          <span className="text-[#2563eb] font-medium cursor-pointer">
            Sign Up
          </span>
        </p>

      </div>
    </div>
  );
}
