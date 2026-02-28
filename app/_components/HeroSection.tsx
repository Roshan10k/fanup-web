import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      id="about"
      className="section-shell relative flex min-h-[760px] items-center overflow-hidden bg-cover bg-center py-24"
      style={{ backgroundImage: "url('/images/cricket-bg.png')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/65 to-black/75" />
      <div className="absolute -left-16 top-20 h-56 w-56 rounded-full bg-yellow-400/25 blur-3xl" />
      <div className="absolute -right-20 bottom-14 h-64 w-64 rounded-full bg-red-500/30 blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center px-4 sm:px-6 lg:px-8">
        <div className="fade-up max-w-3xl text-center">
          <p className="mb-4 inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-white/90 uppercase">
            Fantasy Cricket Platform
          </p>
          <h1 className="text-balance text-4xl leading-tight font-bold text-white sm:text-5xl lg:text-6xl">
            Build Your Dream Team.
            <span className="block text-gradient">Compete. Win. Repeat.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-200">
            FanUp brings live contests, real rewards, and lightning-fast gameplay in one premium fantasy cricket experience.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/signup"
              className="rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 px-8 py-3 text-base font-semibold text-gray-900 shadow-lg shadow-yellow-500/35 transition hover:translate-y-[-1px]"
            >
              Start Playing Free
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-white/55 bg-white/10 px-8 py-3 text-base font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              Login
            </Link>
          </div>
        </div>

        <div className="fade-up-delay mt-12 w-full max-w-md">
          <div className="premium-card rounded-3xl p-6">
            <p className="text-xs font-semibold tracking-[0.2em] text-gray-500 uppercase dark:text-slate-400">Live Snapshot</p>
            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between rounded-2xl bg-red-50 px-4 py-3 dark:bg-red-500/10">
                <span className="text-sm font-medium text-gray-700 dark:text-slate-200">Active Players</span>
                <span className="text-lg font-bold text-red-600">1.2M+</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-amber-50 px-4 py-3 dark:bg-amber-500/10">
                <span className="text-sm font-medium text-gray-700 dark:text-slate-200">Daily Contests</span>
                <span className="text-lg font-bold text-amber-600">850+</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-emerald-50 px-4 py-3 dark:bg-emerald-500/10">
                <span className="text-sm font-medium text-gray-700 dark:text-slate-200">Prize Payouts</span>
                <span className="text-lg font-bold text-emerald-600">Instant</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
