// app/dashboard/page.tsx
import Image from "next/image";
import Link from "next/link";
import { Bell, Home, Trophy, Wallet, User, Settings, BellDot } from "lucide-react";

export default function DashboardPage() {
  const user = {
    name: "Roshan Khadka",
    initials: "RK",
    balance: 100.0,
  };

  const upcomingMatches = [
    { id: 1, league: "NPL", date: "4th Nov", time: "3:15 PM", team1: "IND", team2: "AUS", isLive: true },
    { id: 2, league: "NPL", date: "4th Nov", time: "3:15 PM", team1: "IND", team2: "AUS", isLive: true },
    { id: 3, league: "NPL", date: "4th Nov", time: "3:15 PM", team1: "IND", team2: "AUS", isLive: true },
    { id: 4, league: "NPL", date: "4th Nov", time: "3:15 PM", team1: "IND", team2: "AUS", isLive: true },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-950 to-black text-white">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar Navigation - Dark with red active state */}
        <aside className="w-full md:w-64 bg-black/60 backdrop-blur-md border-r border-red-900/40 md:min-h-screen p-4 md:p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center font-black text-white text-xl">
              {user.initials}
            </div>
            <h1 className="text-2xl font-black text-white">FanUP</h1>
          </div>

          <nav className="space-y-1.5">
            {[
              { icon: Home, label: "Home", href: "/dashboard", active: true },
              { icon: Trophy, label: "Leaderboard", href: "/leaderboard" },
              { icon: Wallet, label: "Wallet", href: "/wallet" },
              { icon: User, label: "Profile", href: "/profile" },
              { icon: Bell, label: "Notification", href: "/notifications", badge: true },
              { icon: Settings, label: "Settings", href: "/settings" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  item.active
                    ? "bg-red-600 text-white shadow-lg shadow-red-900/30"
                    : "hover:bg-red-900/40 text-gray-300"
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
                {item.badge && <BellDot className="text-red-400 ml-auto" size={18} />}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8">
          {/* Welcome + Balance - exact gradient colors from your design */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl p-6 md:p-8 shadow-xl">
                <h2 className="text-3xl md:text-4xl font-black mb-2">
                  Welcome back, {user.name.split(" ")[0]}!
                </h2>
                <p className="text-red-100 text-lg opacity-90">Build your dream team • Join the action</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <p className="text-sm text-amber-100 mb-1 font-medium">Available Credit</p>
                <p className="text-4xl md:text-5xl font-black text-white">₹{user.balance.toFixed(1)}</p>
              </div>
              <button className="mt-4 bg-black/40 hover:bg-black/60 text-white px-6 py-3 rounded-xl font-medium transition backdrop-blur-sm border border-white/10">
                Add Credit
              </button>
            </div>
          </div>

          {/* Upcoming Matches Section */}
          <section>
            <h3 className="text-2xl font-bold mb-6 text-white">Upcoming Matches</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {upcomingMatches.map((match) => (
                <div
                  key={match.id}
                  className="bg-gray-900/70 backdrop-blur-md border border-red-900/40 rounded-2xl overflow-hidden hover:border-orange-500/60 transition-all duration-300"
                >
                  <div className="p-5 text-center">
                    <p className="text-xs text-gray-400 mb-3">
                      {match.league} • {match.date}, {match.time}
                    </p>

                    <div className="flex items-center justify-center gap-8 my-5">
                      <div className="text-center">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-800/80 flex items-center justify-center text-2xl md:text-3xl font-bold border border-gray-600">
                          {match.team1}
                        </div>
                      </div>
                      <span className="text-xl md:text-2xl font-bold text-gray-500">VS</span>
                      <div className="text-center">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-800/80 flex items-center justify-center text-2xl md:text-3xl font-bold border border-gray-600">
                          {match.team2}
                        </div>
                      </div>
                    </div>

                    {match.isLive && (
                      <div className="inline-flex items-center gap-2 bg-red-600/30 text-red-400 px-4 py-1.5 rounded-full text-sm mb-5 font-medium">
                        <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
                        LIVE
                      </div>
                    )}

                    <button className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white py-3.5 rounded-xl font-medium transition transform hover:scale-[1.02]">
                      Create Team
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}