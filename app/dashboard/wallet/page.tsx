"use client";

import { useMemo, useState } from "react";
import {
  Bell,
  ArrowDown,
  ArrowUp,
  Clock3,
  Gift,
  CalendarDays,
  UserPlus,
  Trophy,
  Wallet,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "../_components/Sidebar";

type TransactionType = "credit" | "debit";

interface Transaction {
  title: string;
  amount: number;
  type: TransactionType;
  date: Date;
}

interface EarnTask {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  title: string;
  subtitle: string;
  credits: string;
  color: string;
  actionMessage: string;
}

const transactions: Transaction[] = [
  {
    title: "Contest Prize - IND vs AUS",
    amount: 2500,
    type: "credit",
    date: new Date(2025, 10, 19, 14, 30),
  },
  {
    title: "Daily Login Bonus",
    amount: 1000,
    type: "credit",
    date: new Date(2025, 10, 18, 10, 15),
  },
  {
    title: "Joined Mega Contest",
    amount: 49,
    type: "debit",
    date: new Date(2025, 10, 17, 16, 45),
  },
  {
    title: "Contest Prize - PAK vs SA",
    amount: 1500,
    type: "credit",
    date: new Date(2025, 10, 16, 18, 20),
  },
];

const earnTasks: EarnTask[] = [
  {
    icon: CalendarDays,
    title: "Daily Login Bonus",
    subtitle: "Login every day to earn credits",
    credits: "+100",
    color: "#4CAF50",
    actionMessage: "You have claimed Daily Login Bonus (+100)",
  },
  {
    icon: UserPlus,
    title: "Invite Friends",
    subtitle: "Earn credits for each friend who joins",
    credits: "+500",
    color: "#2196F3",
    actionMessage: "Referral code copied: FANUP2025",
  },
  {
    icon: Trophy,
    title: "Complete Achievements",
    subtitle: "Unlock achievements to earn credits",
    credits: "+200",
    color: "#F59E0B",
    actionMessage: "Achievement progress opened",
  },
];

const formatCredits = (value: number) =>
  new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value);

export default function WalletPage() {
  const { user, loading } = useAuth();
  const [taskMessage, setTaskMessage] = useState<string | null>(null);

  const fullName = user?.fullName || "User";
  const balance = user?.balance ?? 10450;

  const transactionsTotal = useMemo(
    () =>
      transactions.reduce(
        (acc, item) => {
          if (item.type === "credit") {
            acc.credit += item.amount;
          } else {
            acc.debit += item.amount;
          }
          return acc;
        },
        { credit: 0, debit: 0 },
      ),
    [],
  );

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-lg">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex font-['Poppins'] bg-gray-50">
      <Sidebar />

      <main className="flex-1 bg-white">
        <header className="border-b border-gray-200 px-8 py-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">My Wallet</h2>
            <p className="text-sm text-gray-700 mt-2">Manage your credits, {fullName.split(" ")[0]}</p>
          </div>
          <button className="relative p-3 hover:bg-gray-100 rounded-full" aria-label="Notifications">
            <Bell size={24} className="text-gray-600" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </header>

        <div className="p-8 max-w-7xl">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <section className="xl:col-span-2 bg-gradient-to-br from-yellow-100 via-orange-100 to-red-100 rounded-3xl p-8 border border-orange-200">
              <div className="flex items-center gap-2 text-gray-900">
                <Wallet className="w-5 h-5 text-orange-600" />
                <p className="text-base font-semibold">Total Credits</p>
              </div>

              <p className="text-5xl md:text-6xl font-bold text-gray-900 mt-3">{formatCredits(balance)}</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8">
                <BalanceStat label="Contest Wins" value={formatCredits(transactionsTotal.credit)} />
                <BalanceStat label="Contest Spend" value={formatCredits(transactionsTotal.debit)} />
                <BalanceStat label="Bonus Credits" value="850" />
              </div>

              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 border border-white text-sm text-gray-700">
                <Sparkles className="w-4 h-4 text-orange-500" />
                Last updated from server balance snapshot
              </div>
            </section>

            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900">Earn More Credits</h3>
              <p className="text-sm text-gray-600 mt-1">Complete tasks to boost your wallet.</p>

              <div className="mt-5 space-y-3">
                {earnTasks.map((task) => (
                  <EarnTaskCard
                    key={task.title}
                    task={task}
                    onSelect={() => setTaskMessage(task.actionMessage)}
                  />
                ))}
              </div>
            </section>

            <section className="xl:col-span-3 rounded-3xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Recent Transactions</h3>
                <button className="text-sm font-semibold text-red-500 hover:text-red-600 transition">View All</button>
              </div>

              {taskMessage && (
                <div className="mx-6 mt-5 px-4 py-3 rounded-xl bg-orange-50 border border-orange-200 text-sm text-orange-700">
                  {taskMessage}
                </div>
              )}

              <div className="p-6 space-y-3">
                {transactions.map((item) => (
                  <TransactionRow key={`${item.title}-${item.date.toISOString()}`} item={item} />
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function BalanceStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/80 border border-white p-4">
      <p className="text-sm text-gray-700">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
}

function TransactionRow({ item }: { item: Transaction }) {
  const isCredit = item.type === "credit";

  return (
    <div className="p-4 bg-white rounded-2xl border border-gray-100 flex items-center gap-4 hover:border-gray-200 transition">
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center ${
          isCredit ? "bg-green-50" : "bg-red-50"
        }`}
      >
        {item.title.includes("Bonus") ? (
          <Gift className="w-5 h-5 text-blue-500" />
        ) : isCredit ? (
          <ArrowDown className="w-5 h-5 text-green-500" />
        ) : (
          <ArrowUp className="w-5 h-5 text-red-500" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 truncate">{item.title}</p>
        <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
          <Clock3 className="w-3.5 h-3.5" />
          {new Intl.DateTimeFormat("en-CA", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })
            .format(item.date)
            .replace(",", " ")}
        </p>
      </div>

      <p className={`font-bold ${isCredit ? "text-green-500" : "text-red-500"}`}>
        {isCredit ? "+" : "-"}
        {formatCredits(item.amount)}
      </p>
    </div>
  );
}

function EarnTaskCard({ task, onSelect }: { task: EarnTask; onSelect: () => void }) {
  const Icon = task.icon;

  return (
    <button
      onClick={onSelect}
      className="w-full text-left p-4 rounded-xl border transition hover:shadow-sm"
      style={{
        backgroundColor: `${task.color}0D`,
        borderColor: `${task.color}33`,
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${task.color}1F` }}
        >
          <Icon className="w-5 h-5" style={{ color: task.color }} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900">{task.title}</p>
          <p className="text-sm text-gray-600 truncate">{task.subtitle}</p>
        </div>

        <span className="px-2.5 py-1 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: task.color }}>
          {task.credits}
        </span>
      </div>
    </button>
  );
}
