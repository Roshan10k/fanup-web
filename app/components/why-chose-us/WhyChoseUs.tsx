import {
  Trophy,
  Users,
  ShieldCheck,
  Gift,
  DollarSign,
  Medal,
  Shield,
  Target,
} from "lucide-react";

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose Us?
          </h2>
          <p className="text-xl text-gray-600">
            Experience the best fantasy cricket platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:shadow-lg transition">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <Trophy className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Huge prizes
            </h3>
            <p className="text-gray-600">
              Win big with our extensive prize pools. Daily, weekly, and monthly
              contests with amazing rewards.
            </p>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:shadow-lg transition">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Compete With Friends
            </h3>
            <p className="text-gray-600">
              Challenge your friends, create private leagues, and see who's the
              ultimate cricket expert.
            </p>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:shadow-lg transition">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              100% Safe & Secure
            </h3>
            <p className="text-gray-600">
              Your data and transactions are protected with bank-level security
              and encrypted transfers.
            </p>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:shadow-lg transition">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Rewards & Rewards
            </h3>
            <p className="text-gray-600">
              Earn loyalty points, referral bonuses, and exclusive rewards as
              you play more.
            </p>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:shadow-lg transition">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Credit System
            </h3>
            <p className="text-gray-600">
              Flexible credit options to join contests. Use credits smartly and
              maximize your winnings.
            </p>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:shadow-lg transition">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <Gift className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Daily Bonus
            </h3>
            <p className="text-gray-600">
              Get daily bonuses and special offers. Login everyday to claim
              exciting rewards.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
