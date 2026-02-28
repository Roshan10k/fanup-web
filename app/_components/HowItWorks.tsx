"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

const steps = [
  {
    id: "01",
    title: "Create Your Team",
    text: "Pick your best XI from upcoming matches within your budget and role constraints.",
  },
  {
    id: "02",
    title: "Join Contests",
    text: "Enter practice, mini, or mega contests based on your risk and reward preference.",
  },
  {
    id: "03",
    title: "Track & Win",
    text: "Watch live points update in real time and collect winnings instantly when you rank high.",
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const cards = sectionRef.current?.querySelectorAll<HTMLElement>("[data-step-card]");
    if (!cards?.length) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("step-card-visible");
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -40px 0px" },
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="how-it-works" ref={sectionRef} className="relative overflow-hidden py-22">
      <div className="absolute inset-0 bg-gradient-to-b from-[#fff8ea] via-[#fff7f7] to-[#f9faff] dark:from-slate-900 dark:via-slate-900 dark:to-slate-950" />
      <div className="absolute -left-16 top-1/3 h-56 w-56 rounded-full bg-red-200/45 blur-3xl dark:bg-red-400/15" />
      <div className="absolute right-0 top-16 h-64 w-64 rounded-full bg-amber-200/45 blur-3xl dark:bg-amber-300/15" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-red-500 uppercase">How It Works</p>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl dark:text-slate-100">Start in Three Simple Steps</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-600 sm:text-lg dark:text-slate-300">
            A streamlined flow designed for quick onboarding and competitive matchday decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <article
              key={step.id}
              data-step-card
              style={{ transitionDelay: `${index * 90}ms` }}
              className="step-card-enter premium-card rounded-3xl p-7 transition duration-500"
            >
              <p className="mb-4 text-sm font-semibold tracking-[0.16em] text-red-500 uppercase">Step {step.id}</p>
              <h3 className="mb-3 text-2xl font-semibold text-gray-900 dark:text-slate-100">{step.title}</h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-slate-300">{step.text}</p>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/signup"
            className="inline-flex rounded-full bg-gradient-to-r from-red-500 to-rose-600 px-10 py-3 text-base font-semibold text-white shadow-lg shadow-red-500/30 transition hover:from-red-600 hover:to-rose-700"
          >
            Start Your Journey
          </Link>
        </div>
      </div>
    </section>
  );
}
