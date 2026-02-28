// app/login/page.tsx
import LoginForm from "../_components/LoginForm"; // Create this similar to SignupForm
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/_components/navbar";

export default function LoginPage() {
  return (
    <>
      <Navbar variant="auth" authMode="login" />
      <div className="min-h-[calc(100vh-73px)] flex items-center justify-center p-4 md:p-6 dark:bg-slate-950">
        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-0 overflow-hidden rounded-2xl shadow-2xl bg-white/5 backdrop-blur-sm border border-white/10 dark:border-slate-700/70 dark:bg-slate-900/40">
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
                Let&apos;s Win Big Again
              </p>
            </div>
          </div>

          {/* RIGHT SIDE - Login Form */}
          <div className="p-8 md:p-12 bg-white/95 backdrop-blur-md dark:bg-slate-900/95">
            {/* Mobile-only hero teaser */}
            <div className="md:hidden text-center mb-8">
              <h1 className="text-4xl font-black text-red-600">FanUp</h1>
              <p className="text-lg font-semibold mt-2 text-gray-800 dark:text-slate-200">
                Welcome Back
              </p>
            </div>

            <LoginForm />

            <p className="text-center text-sm mt-8 text-gray-600 dark:text-slate-300">
              Don&apos;t have an account?{" "}
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
    </>
  );
}
