"use client";

import { DollarSign, Gift, Shield, Target, Trophy, Users } from "lucide-react";
import { useEffect, useRef } from "react";

const features = [
  {
    icon: Trophy,
    title: "Huge Prizes",
    text: "Compete in daily and mega contests with transparent, high-value prize pools.",
    tone: "text-amber-600 bg-amber-100",
  },
  {
    icon: Users,
    title: "Compete With Friends",
    text: "Create private battles, challenge your circle, and track rivalry rankings live.",
    tone: "text-blue-600 bg-blue-100",
  },
  {
    icon: Shield,
    title: "Safe & Secure",
    text: "Protected transactions and trusted security standards keep your account secure.",
    tone: "text-red-600 bg-red-100",
  },
  {
    icon: DollarSign,
    title: "Smart Rewards",
    text: "Earn referral bonuses, loyalty perks, and campaign rewards as you keep playing.",
    tone: "text-emerald-600 bg-emerald-100",
  },
  {
    icon: Target,
    title: "Flexible Credit System",
    text: "Join contests at your pace and optimize credits with strategic team management.",
    tone: "text-violet-600 bg-violet-100",
  },
  {
    icon: Gift,
    title: "Daily Bonus",
    text: "Collect daily check-in bonuses and unlock boosts during featured matchdays.",
    tone: "text-orange-600 bg-orange-100",
  },
];

export default function WhyChooseUs() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const cards = sectionRef.current?.querySelectorAll<HTMLElement>("[data-feature-card]");
    if (!cards?.length) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("feature-card-visible");
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -40px 0px" },
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="why-choose-us" ref={sectionRef} className="section-shell relative py-22">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-red-500 uppercase">Why FanUp</p>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Built for Competitive Cricket Fans</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-600 sm:text-lg">
            From secure gameplay to rewarding contests, every detail is designed to feel fast, fair, and premium.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                data-feature-card
                style={{ transitionDelay: `${index * 80}ms` }}
                className="feature-card-enter premium-card group rounded-3xl p-7 transition duration-500 hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className={`mb-5 inline-flex rounded-2xl p-3 ${feature.tone}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{feature.text}</p>
                <div className="mt-6 h-[2px] w-14 rounded-full bg-gradient-to-r from-red-500/70 to-yellow-400/70 transition-all duration-300 group-hover:w-24" />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
