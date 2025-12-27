export default function HeroSection() {
  return (
   <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-32 min-h-[600px] flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
          Build Your Dream
          <br />
          <span className="text-red-500">Cricket Team</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Join millions of fans in the ultimate fantasy cricket experience.
          Create teams, compete in contests, and win real prizes!
        </p>
        <div className="flex justify-center space-x-4">
          <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-8 py-3 rounded-full font-semibold text-lg transition">
            Start Playing Free
          </button>
          <button className="bg-white hover:bg-gray-50 text-gray-900 px-8 py-3 rounded-full font-semibold text-lg border-2 border-gray-300 transition">
            Login
          </button>
        </div>
      </div>
    </section>
  );
}
