import Link from "next/link";

export default function HeroSection() {
  return (
    <section id="about"
      className="relative flex items-center bg-cover bg-center min-h-[700px] py-28" 
      style={{
        backgroundImage: "url('/images/cricket-bg.png')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
          Build Your Dream
          <br />
          <span className="text-red-500">Cricket Team</span>
        </h1>

        <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
          Join millions of fans in the ultimate fantasy cricket experience.
          Create teams, compete in contests, and win real prizes!
        </p>

        <div className="flex justify-center space-x-4">
          <Link href="/signup">
            <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-8 py-3 rounded-full font-semibold text-lg transition">
              Start Playing Free
            </button>
          </Link>

          <Link href="/login">
            <button className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-3 rounded-full font-semibold text-lg border-2 border-white transition">
              Login
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
