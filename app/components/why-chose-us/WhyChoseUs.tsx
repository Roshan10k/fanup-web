import FeatureCard from "./FeatureCard";
import {
  Trophy,
  Users,
  ShieldCheck,
  Gift,
  DollarSign,
  Medal,
} from "lucide-react";

export default function WhyChooseUs() {
  return (
    <section className="bg-[#F5F5F5] py-20">
      <div className="max-w-6xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-2xl font-semibold text-gray-900">
            Why Choose Us?
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Experience the best fantasy cricket platform
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<Trophy size={20} />}
            title="Huge prizes"
            description="Win big with our massive prize pools. Daily contests with guaranteed prizes for winners."
            iconBg="#FEF3C7"
            iconColor="#F59E0B"
          />

          <FeatureCard
            icon={<Users size={20} />}
            title="Compete With Friends"
            description="Create private leagues, challenge friends, and prove you're the ultimate cricket strategist."
            iconBg="#DBEAFE"
            iconColor="#3B82F6"
          />

          <FeatureCard
            icon={<ShieldCheck size={20} />}
            title="100% Safe & Secure"
            description="Your data and transactions are protected with bank-grade security encryption."
            iconBg="#FEE2E2"
            iconColor="#EF4444"
          />

          <FeatureCard
            icon={<Gift size={20} />}
            title="Bonuses & Rewards"
            description="Get sign-up bonuses, referral rewards, and exclusive offers for loyal players."
            iconBg="#FEF3C7"
            iconColor="#F59E0B"
          />

          <FeatureCard
            icon={<DollarSign size={20} />}
            title="Credit System"
            description="Build your team wisely with a fair and transparent credit system."
            iconBg="#DCFCE7"
            iconColor="#22C55E"
          />

          <FeatureCard
            icon={<Medal size={20} />}
            title="Rank"
            description="Friends are ranked according to the points scored and declared winner."
            iconBg="#FEF3C7"
            iconColor="#F59E0B"
          />
        </div>
      </div>
    </section>
  );
}
