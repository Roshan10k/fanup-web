"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ComponentType,
} from "react";
import {
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
import ThemeToggle from "../_components/ThemeToggle";
import { useThemeMode } from "../_components/useThemeMode";
import {
  claimDailyBonusAction,
  getWalletSummaryAction,
  getWalletTransactionsAction,
} from "@/app/lib/action/wallet_action";

type TransactionType = "credit" | "debit";

type WalletSource =
  | "welcome_bonus"
  | "daily_login"
  | "contest_join"
  | "contest_win"
  | "contest_refund"
  | "system_adjustment";

interface WalletTransaction {
  _id: string;
  title: string;
  amount: number;
  type: TransactionType;
  source: WalletSource;
  createdAt: string;
}

interface WalletSummary {
  balance: number;
  totalCredit: number;
  totalDebit: number;
  transactionCount: number;
  lastTransactionAt: string | null;
}

interface EarnTask {
  icon: ComponentType<{ className?: string; style?: CSSProperties }>;
  title: string;
  subtitle: string;
  credits: string;
  color: string;
  mode: "daily_bonus" | "coming_soon";
}

const earnTasks: EarnTask[] = [
  {
    icon: CalendarDays,
    title: "Daily Login Bonus",
    subtitle: "Claim once every day",
    credits: "+100",
    color: "#4CAF50",
    mode: "daily_bonus",
  },
  {
    icon: UserPlus,
    title: "Invite Friends",
    subtitle: "Referral rewards coming soon",
    credits: "+500",
    color: "#2196F3",
    mode: "coming_soon",
  },
  {
    icon: Trophy,
    title: "Contest Wins",
    subtitle: "Rewards will be credited from contests",
    credits: "Variable",
    color: "#F59E0B",
    mode: "coming_soon",
  },
];

const formatCredits = (value: number) =>
  new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value);

export default function WalletPage() {
  const { user, loading, setUser } = useAuth();
  const { isDark } = useThemeMode();
  const [taskMessage, setTaskMessage] = useState<string | null>(null);
  const [walletLoading, setWalletLoading] = useState(true);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [claimingBonus, setClaimingBonus] = useState(false);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [summary, setSummary] = useState<WalletSummary | null>(null);

  const loadWallet = useCallback(async () => {
    setWalletLoading(true);
    setWalletError(null);

    const [summaryResult, transactionsResult] = await Promise.all([
      getWalletSummaryAction(),
      getWalletTransactionsAction(1, 20),
    ]);

    if (!summaryResult.success) {
      setWalletError(summaryResult.message || "Failed to load wallet summary");
      setWalletLoading(false);
      return;
    }

    if (!transactionsResult.success) {
      setWalletError(transactionsResult.message || "Failed to load wallet transactions");
      setWalletLoading(false);
      return;
    }

    const nextSummary = summaryResult.data as WalletSummary;
    setSummary(nextSummary);
    setTransactions((transactionsResult.data || []) as WalletTransaction[]);

    if (user && user.balance !== nextSummary.balance) {
      setUser({
        ...user,
        balance: nextSummary.balance,
      });
    }

    setWalletLoading(false);
  }, [setUser, user]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadWallet();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadWallet]);

  const fullName = user?.fullName || "User";
  const balance = summary?.balance ?? user?.balance ?? 0;

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
    [transactions],
  );

  const handleTaskClick = async (task: EarnTask) => {
    if (task.mode === "coming_soon") {
      setTaskMessage(`${task.title} will be available soon.`);
      return;
    }

    if (claimingBonus) {
      return;
    }

    setClaimingBonus(true);
    const result = await claimDailyBonusAction();
    setClaimingBonus(false);

    if (!result.success) {
      setTaskMessage(result.message || "Failed to claim daily bonus");
      return;
    }

    setTaskMessage(result.message || "Daily bonus processed");
    await loadWallet();
  };

  return (
    <div className={`flex min-h-screen font-['Poppins'] ${isDark ? "bg-slate-950 text-slate-100" : "bg-gray-50"}`}>
      <Sidebar />

      <main
        className={`flex-1 ${
          isDark
            ? "bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.08),transparent_38%),#0f172a]"
            : "bg-[radial-gradient(circle_at_top_right,rgba(251,113,133,0.10),transparent_36%),#f8fafc]"
        }`}
      >
        <header
          className={`sticky top-0 z-20 flex items-center justify-between border-b px-8 py-5 backdrop-blur ${
            isDark ? "border-slate-700/70 bg-slate-900/80" : "border-gray-200/80 bg-white/80"
          }`}
        >
          <div>
            <h2 className={`text-3xl font-black tracking-tight ${isDark ? "text-slate-100" : "text-gray-900"}`}>My Wallet</h2>
            <p className={`mt-1 text-sm ${isDark ? "text-slate-300" : "text-gray-600"}`}>
              Manage your credits, {fullName.split(" ")[0]}
            </p>
          </div>
          <ThemeToggle />
        </header>

        <div className="w-full p-8">
          {walletError ? (
            <div
              className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${
                isDark ? "border-red-400/30 bg-red-500/10 text-red-200" : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {walletError}
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <section
              className={`relative overflow-hidden rounded-3xl border p-8 xl:col-span-2 ${
                isDark
                  ? "border-slate-700 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-800"
                  : "border-orange-200 bg-gradient-to-br from-yellow-100 via-orange-100 to-red-100"
              }`}
            >
              <div className="absolute -right-14 -top-14 h-44 w-44 rounded-full bg-red-500/10 blur-3xl" />
              <div className="absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-amber-400/10 blur-3xl" />

              <div className={`flex items-center gap-2 ${isDark ? "text-slate-100" : "text-gray-900"}`}>
                <Wallet className="h-5 w-5 text-orange-500" />
                <p className={`text-sm font-semibold uppercase tracking-[0.18em] ${isDark ? "text-slate-400" : "text-gray-500"}`}>
                  Total Credits
                </p>
              </div>

              <p className={`mt-3 text-5xl font-black tracking-tight md:text-6xl ${isDark ? "text-slate-100" : "text-gray-900"}`}>
                {formatCredits(balance)}
              </p>

              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {loading || walletLoading ? (
                  <>
                    <BalanceStatSkeleton />
                    <BalanceStatSkeleton />
                    <BalanceStatSkeleton />
                  </>
                ) : (
                  <>
                    <BalanceStat label="Total Credits In" value={formatCredits(summary?.totalCredit || transactionsTotal.credit)} />
                    <BalanceStat label="Total Credits Out" value={formatCredits(summary?.totalDebit || transactionsTotal.debit)} />
                    <BalanceStat label="Transactions" value={String(summary?.transactionCount || transactions.length)} />
                  </>
                )}
              </div>

              <div
                className={`mt-6 inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm ${
                  isDark ? "border-slate-600 bg-slate-900 text-slate-300" : "border-gray-200 bg-white text-gray-700"
                }`}
              >
                <Sparkles className="h-4 w-4 text-orange-500" />
                Last updated from server wallet data
              </div>
            </section>

            <section
              className={`rounded-3xl border p-6 shadow-sm ${
                isDark ? "border-slate-700 bg-slate-900/95" : "border-gray-200 bg-white"
              }`}
            >
              <h3 className={`text-xl font-bold tracking-tight ${isDark ? "text-slate-100" : "text-gray-900"}`}>Earn More Credits</h3>
              <p className={`mt-1 text-sm ${isDark ? "text-slate-300" : "text-gray-600"}`}>Claim daily bonus and win contests.</p>

              <div className="mt-5 space-y-3">
                {earnTasks.map((task) => (
                  <EarnTaskCard
                    key={task.title}
                    task={task}
                    loading={claimingBonus && task.mode === "daily_bonus"}
                    onSelect={() => void handleTaskClick(task)}
                  />
                ))}
              </div>
            </section>

            <section
              className={`overflow-hidden rounded-3xl border shadow-sm xl:col-span-3 ${
                isDark ? "border-slate-700 bg-slate-900/95" : "border-gray-200 bg-white"
              }`}
            >
              <div className={`flex items-center justify-between px-6 py-5 ${isDark ? "border-b border-slate-700" : "border-b border-gray-200"}`}>
                <h3 className={`text-xl font-bold tracking-tight ${isDark ? "text-slate-100" : "text-gray-900"}`}>Recent Transactions</h3>
                <button
                  onClick={() => void loadWallet()}
                  className="text-sm font-semibold text-red-500 transition hover:text-red-600"
                >
                  Refresh
                </button>
              </div>

              {taskMessage ? (
                <div
                  className={`mx-6 mt-5 rounded-xl border px-4 py-3 text-sm ${
                    isDark ? "border-orange-400/35 bg-orange-500/10 text-orange-200" : "border-orange-200 bg-orange-50 text-orange-700"
                  }`}
                >
                  {taskMessage}
                </div>
              ) : null}

              <div className="space-y-3 p-6">
                {loading || walletLoading ? (
                  <>
                    <TransactionRowSkeleton />
                    <TransactionRowSkeleton />
                    <TransactionRowSkeleton />
                    <TransactionRowSkeleton />
                  </>
                ) : transactions.length > 0 ? (
                  transactions.map((item) => <TransactionRow key={item._id} item={item} />)
                ) : (
                  <div
                    className={`rounded-xl border px-4 py-6 text-center text-sm ${
                      isDark ? "border-slate-700 text-slate-300" : "border-gray-200 text-gray-600"
                    }`}
                  >
                    No transactions yet.
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function BalanceStat({ label, value }: { label: string; value: string }) {
  const { isDark } = useThemeMode();
  return (
    <div className={`rounded-2xl border p-4 ${isDark ? "border-slate-600 bg-slate-900" : "border-gray-200 bg-white"}`}>
      <p className={`text-sm ${isDark ? "text-slate-300" : "text-gray-700"}`}>{label}</p>
      <p className={`mt-1 text-2xl font-black ${isDark ? "text-slate-100" : "text-gray-900"}`}>{value}</p>
    </div>
  );
}

function BalanceStatSkeleton() {
  const { isDark } = useThemeMode();
  return (
    <div className={`h-24 animate-pulse rounded-2xl border ${isDark ? "border-slate-700 bg-slate-800" : "border-gray-200 bg-gray-100"}`} />
  );
}

function TransactionRow({ item }: { item: WalletTransaction }) {
  const { isDark } = useThemeMode();
  const isCredit = item.type === "credit";

  return (
    <div
      className={`flex items-center gap-4 rounded-2xl border p-4 transition ${
        isDark
          ? "border-slate-700 bg-slate-900 hover:border-slate-600"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${isCredit ? "bg-green-50" : "bg-red-50"}`}>
        {item.source.includes("bonus") ? (
          <Gift className="h-5 w-5 text-blue-500" />
        ) : isCredit ? (
          <ArrowDown className="h-5 w-5 text-green-500" />
        ) : (
          <ArrowUp className="h-5 w-5 text-red-500" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className={`truncate font-semibold ${isDark ? "text-slate-100" : "text-gray-900"}`}>{item.title}</p>
        <p className={`mt-1 flex items-center gap-1 text-sm ${isDark ? "text-slate-400" : "text-gray-500"}`}>
          <Clock3 className="h-3.5 w-3.5" />
          {new Intl.DateTimeFormat("en-CA", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })
            .format(new Date(item.createdAt))
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

function EarnTaskCard({
  task,
  onSelect,
  loading,
}: {
  task: EarnTask;
  onSelect: () => void;
  loading?: boolean;
}) {
  const { isDark } = useThemeMode();
  const Icon = task.icon;

  return (
    <button
      onClick={onSelect}
      disabled={loading}
      className={`w-full rounded-xl border p-4 text-left transition hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-70 ${
        isDark ? "bg-slate-900" : "bg-white"
      }`}
      style={{ borderColor: `${task.color}40`, backgroundColor: isDark ? `${task.color}15` : `${task.color}10` }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: `${task.color}20` }}>
            <Icon className="h-5 w-5" style={{ color: task.color }} />
          </div>
          <div>
            <p className={`text-sm font-semibold ${isDark ? "text-slate-100" : "text-gray-900"}`}>{task.title}</p>
            <p className={`mt-0.5 text-xs ${isDark ? "text-slate-300" : "text-gray-600"}`}>{task.subtitle}</p>
          </div>
        </div>
        <p className="text-sm font-bold" style={{ color: task.color }}>
          {loading ? "..." : task.credits}
        </p>
      </div>
    </button>
  );
}

function TransactionRowSkeleton() {
  const { isDark } = useThemeMode();
  return (
    <div className={`flex items-center gap-4 rounded-2xl border p-4 ${isDark ? "border-slate-700 bg-slate-900" : "border-gray-200 bg-white"}`}>
      <div className={`h-11 w-11 animate-pulse rounded-xl ${isDark ? "bg-slate-700" : "bg-gray-100"}`} />
      <div className="min-w-0 flex-1 space-y-2">
        <div className={`h-4 w-2/3 animate-pulse rounded ${isDark ? "bg-slate-700" : "bg-gray-200"}`} />
        <div className={`h-3 w-1/3 animate-pulse rounded ${isDark ? "bg-slate-700" : "bg-gray-200"}`} />
      </div>
      <div className={`h-4 w-16 animate-pulse rounded ${isDark ? "bg-slate-700" : "bg-gray-200"}`} />
    </div>
  );
}
