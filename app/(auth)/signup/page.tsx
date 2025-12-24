import SignupForm from "../_components/SignupForm";
import Image from "next/image";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow">

        {/* Logo */}
        <div className="flex justify-center mb-4">
            <Image src="/images/logo.png" alt="logo" width={100} height={100}/>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-semibold text-center text-[#111827]">
          Create Your Account
        </h1>

        <p className="text-sm text-center text-[#6b7280] mt-1 mb-6">
          Join the ultimate fantasy cricket experience
        </p>

        <SignupForm />

        {/* Footer */}
        <p className="text-center text-sm mt-5 text-[#6b7280]">
          Already have an account?{" "}
          <a href="/login" className="text-[#2563eb] font-medium">
            Login
          </a>
        </p>

      </div>
    </div>
  );
}
