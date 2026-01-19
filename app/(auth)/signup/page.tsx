// page.tsx

import Image from "next/image";
import Link from "next/link";
import SignupForm from "../_components/SignupForm";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-0">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-0 overflow-hidden rounded-2xl shadow-2xl bg-white/5 backdrop-blur-sm border border-white/10">
       
        <div className="relative hidden md:block overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-10" />
          
   
          <Image
            src="/images/signup.jpg"
            alt="Fantasy Cricket Action"
            fill
            className="object-cover brightness-75"
            priority
          />

          {/* Overlay content */}
          <div className="relative z-20 h-full flex flex-col justify-end p-10 text-white">
            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
              Build Your Dream Team
            </h2>
            <p className="text-xl md:text-2xl font-semibold mb-6 text-red-400">
              Win with FanUp Today!
            </p>

            
            
          </div>
        </div>

        {/* RIGHT SIDE - Form */}
        <div className="p-8 md:p-12 bg-white/95 backdrop-blur-md">
         
          <div className="md:hidden text-center mb-8">
            <h1 className="text-3xl font-black text-red-600">FanUp</h1>
            <p className="text-lg font-semibold mt-2">Fantasy Cricket Thrills</p>
          </div>

          <SignupForm />

          <p className="text-center text-sm mt-8 text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-red-600 hover:text-red-700 font-semibold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}