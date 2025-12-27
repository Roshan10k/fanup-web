export default function HowItWorks() {
  return  <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works?</h2>
            <p className="text-xl text-gray-600">
              Get started in 3 simple steps.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Create Your Team</h3>
              <p className="text-gray-600">
                Select 11 players from upcoming matches within your allocated budget to create the ultimate team.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Join Contests</h3>
              <p className="text-gray-600">
                Choose from various contests - practice, mega, or mini. Pick the level of your prize pool.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Win Big</h3>
              <p className="text-gray-600">
                Watch your team perform live and win exciting prizes. Instant prize payout on rankings.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <button className="bg-red-500 hover:bg-red-600 text-white px-10 py-4 rounded-full font-semibold text-lg transition">
              Start Your Journey
            </button>
          </div>
        </div>
      </section>

;
}
