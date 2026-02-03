// app/dashboard/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bell, Home, Trophy, Wallet, User, Settings, BarChart3 } from "lucide-react";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "myteams">("upcoming");

  const user = {
    name: "Roshan Khadka",
    initials: "RK",
    balance: 100.0,
  };

  const upcomingMatches = [
    { id: 1, league: "NPL", date: "4th nov, 26", time: "3:15 PM", team1: "IND", team2: "AUS", isLive: true },
    { id: 2, league: "NPL", date: "4th nov, 26", time: "3:15 PM", team1: "IND", team2: "AUS", isLive: true },
    { id: 3, league: "NPL", date: "4th nov, 26", time: "3:15 PM", team1: "IND", team2: "AUS", isLive: true },
    { id: 4, league: "NPL", date: "4th nov, 26", time: "3:15 PM", team1: "IND", team2: "AUS", isLive: true },
  ];

  const myTeams = [
    { id: 1, league: "NPL", date: "4th nov, 26", time: "3:15 PM", team1: "IND", team2: "AUS", teamName: "Team Warriors", points: 850 },
    { id: 2, league: "NPL", date: "4th nov, 26", time: "3:15 PM", team1: "IND", team2: "AUS", teamName: "Dream XI", points: 920 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex font-['Poppins']">
      {/* Sidebar Navigation - Light theme */}
      <aside className="w-72 bg-white border-r border-gray-200 min-h-screen p-6 flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          {/* Replace '/logo.png' with your actual logo path */}
          <Image 
            src="/images/logo.png"
            alt="FanUP Logo" 
            width={48} 
            height={48}
            className="rounded-lg"
          />
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Fan<span className="text-red-500">UP</span>
            </h1>
            <p className="text-xs text-gray-600">Build your dream team</p>
          </div>
        </div>

        {/* User Card */}
        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-5 mb-8 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center font-bold text-orange-600 text-lg">
              {user.initials}
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">{user.name}</p>
              <p className="text-sm text-gray-700 flex items-center gap-1">
                <span className="text-xs">Balance</span>
                <span className="font-bold">{user.balance.toFixed(1)}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 flex-1">
          {[
            { icon: Home, label: "Home", href: "/dashboard", active: true },
            { icon: BarChart3, label: "Leaderboard", href: "/leaderboard" },
            { icon: Wallet, label: "Wallet", href: "/wallet" },
            { icon: User, label: "Profile", href: "/profile" },
            { icon: Bell, label: "Notification", href: "/notifications", badge: true },
            { icon: Settings, label: "Settings", href: "/settings" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative ${
                item.active
                  ? "bg-red-500 text-white shadow-md"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              <item.icon size={22} />
              <span className="font-medium text-base">{item.label}</span>
              {item.badge && (
                <span className="absolute right-3 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-white">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
            <p className="text-sm text-gray-600 mt-2">Welcome back Roshan!</p>
          </div>
          <button className="relative p-3 hover:bg-gray-100 rounded-full transition">
            <Bell size={24} className="text-gray-600" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </header>

        <div className="p-8">
          {/* Credit Card */}
          <div className="bg-gradient-to-br from-yellow-400 via-orange-400 to-orange-500 rounded-2xl p-8 mb-8 shadow-xl max-w-2xl">
            <p className="text-sm text-gray-900 font-medium mb-2">Available credit</p>
            <p className="text-5xl font-bold text-gray-900 mb-6">{user.balance.toFixed(1)}</p>
            <button className="bg-white text-red-500 px-8 py-3.5 rounded-xl font-medium hover:bg-gray-50 transition shadow-md text-sm">
              Add Credit
            </button>
          </div>

          {/* Tab Section */}
          <div className="mb-6">
            <div className="flex items-center gap-6 border-b border-gray-200">
              <button
                onClick={() => setActiveTab("upcoming")}
                className={`pb-4 font-bold text-lg transition relative ${
                  activeTab === "upcoming"
                    ? "text-gray-900"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Upcoming Matches
                {activeTab === "upcoming" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"></span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("myteams")}
                className={`pb-4 font-bold text-lg transition relative ${
                  activeTab === "myteams"
                    ? "text-gray-900"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                My Teams
                {activeTab === "myteams" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"></span>
                )}
              </button>
            </div>
          </div>

          {/* Matches Grid */}
          {activeTab === "upcoming" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
              {upcomingMatches.map((match) => (
                <div
                  key={match.id}
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <div className="p-6">
                    {/* Match Info Header */}
                    <div className="flex items-center justify-between mb-5">
                      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                        {match.league}
                      </span>
                      <span className="text-sm text-gray-500">
                        {match.date}, {match.time}
                      </span>
                      {match.isLive && (
                        <div className="flex items-center gap-1.5 bg-red-50 text-red-500 px-3 py-1 rounded-full text-xs font-medium">
                          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                          Live
                        </div>
                      )}
                    </div>

                    {/* Teams */}
                    <div className="flex items-center justify-center gap-8 my-6">
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold text-gray-700 border-2 border-gray-200">
                          {match.team1}
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-gray-400">VS</span>
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold text-gray-700 border-2 border-gray-200">
                          {match.team2}
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white py-3.5 rounded-xl font-medium transition transform hover:scale-[1.02] shadow-sm">
                      Create Team
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* My Teams Grid */}
          {activeTab === "myteams" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
              {myTeams.length > 0 ? (
                myTeams.map((team) => (
                  <div
                    key={team.id}
                    className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
                  >
                    <div className="p-6">
                      {/* Team Info Header */}
                      <div className="flex items-center justify-between mb-5">
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                          {team.league}
                        </span>
                        <span className="text-sm text-gray-500">
                          {team.date}, {team.time}
                        </span>
                      </div>

                      {/* Team Name */}
                      <h3 className="text-lg font-bold text-gray-900 mb-4">{team.teamName}</h3>

                      {/* Teams */}
                      <div className="flex items-center justify-center gap-8 my-6">
                        <div className="text-center">
                          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold text-gray-700 border-2 border-gray-200">
                            {team.team1}
                          </div>
                        </div>
                        <span className="text-2xl font-bold text-gray-400">VS</span>
                        <div className="text-center">
                          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold text-gray-700 border-2 border-gray-200">
                            {team.team2}
                          </div>
                        </div>
                      </div>

                      {/* Points */}
                      <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4 text-center">
                        <p className="text-sm text-green-700 font-medium">Total Points</p>
                        <p className="text-2xl font-bold text-green-600">{team.points}</p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3.5 rounded-xl font-medium transition shadow-sm">
                          View Team
                        </button>
                        <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3.5 rounded-xl font-medium transition">
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-16">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy size={40} className="text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No Teams Yet</h3>
                  <p className="text-sm text-gray-600 mb-6">Create your first team to get started!</p>
                  <button
                    onClick={() => setActiveTab("upcoming")}
                    className="bg-red-500 hover:bg-red-600 text-white px-8 py-3.5 rounded-xl font-medium transition"
                  >
                    Browse Matches
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}