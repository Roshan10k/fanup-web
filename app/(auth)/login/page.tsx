// app/login/page.tsx
import LoginForm from "../_components/LoginForm"; // Create this similar to SignupForm
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-0">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-0 overflow-hidden rounded-2xl shadow-2xl bg-white/5 backdrop-blur-sm border border-white/10">
        {/* LEFT SIDE - Hero / Visual (hidden on mobile) */}
        <div className="relative hidden md:block overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-10" />

          {/* Powerful cricket action hero image */}
          <Image
            src="/images/login.jpg"
            alt="Fantasy Cricket Winning Moment"
            fill
            className="object-cover brightness-[0.75] contrast-[1.1]"
            priority
          />

          {/* Overlay content */}
          <div className="relative z-20 h-full flex flex-col justify-end p-10 text-white">
            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
              Welcome Back
            </h2>
            <p className="text-2xl font-semibold mb-6 text-red-400">
              Let's Win Big Again
            </p>
          </div>
        </div>

        {/* RIGHT SIDE - Login Form */}
        <div className="p-8 md:p-12 bg-white/95 backdrop-blur-md">
          {/* Mobile-only hero teaser */}
          <div className="md:hidden text-center mb-8">
            <h1 className="text-4xl font-black text-red-600">FanUp</h1>
            <p className="text-lg font-semibold mt-2 text-gray-800">
              Welcome Back
            </p>
          </div>

          <LoginForm />

          <p className="text-center text-sm mt-8 text-gray-600">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-red-600 hover:text-red-700 font-semibold"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
