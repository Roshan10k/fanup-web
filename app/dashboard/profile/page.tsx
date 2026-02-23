"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Mail,
  Pencil,
  Phone,
  Plus,
  Star,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/app/dashboard/_components/Sidebar";
import ThemeToggle from "@/app/dashboard/_components/ThemeToggle";
import { useThemeMode } from "@/app/dashboard/_components/useThemeMode";
import {
  handleGetProfileStats,
  handleUpdateProfile,
} from "@/app/lib/action/auth_action";
import { toast } from "react-toastify";

interface ProfileStats {
  contestsJoined: number;
  teamsCreated: number;
  winRate: number;
  profileCompletion: number;
  missingFields: string[];
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, isAuthenticated, checkAuth, setUser } = useAuth();
  const { isDark } = useThemeMode();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const editSectionRef = useRef<HTMLElement | null>(null);
  const [profileStats, setProfileStats] = useState<ProfileStats>({
    contestsJoined: 0,
    teamsCreated: 0,
    winRate: 0,
    profileCompletion: 0,
    missingFields: [],
  });

  const profilePictureUrl = useMemo(() => {
    const profilePicture = user?.profilePicture;
    if (!profilePicture) return null;
    if (profilePicture.startsWith("http")) return profilePicture;
    if (profilePicture.startsWith("/")) return profilePicture;

    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    return `${BACKEND_URL}/uploads/profile-pictures/${profilePicture}`;
  }, [user?.profilePicture]);

  const initials = useMemo(() => {
    const source = (user?.fullName || user?.email || "User").trim();
    return source
      .split(" ")
      .filter(Boolean)
      .map((value: string) => value[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [user?.email, user?.fullName]);

  const completionPercent = Math.max(0, Math.min(100, profileStats.profileCompletion));
  const isProfileComplete = completionPercent >= 100;

  const openEditProfile = () => {
    setIsEditing(true);
    setTimeout(() => {
      editSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  };

  useEffect(() => {
    if (!user) return;
    setFullName(user.fullName || "");
    setPhone(user.phone || "");
  }, [user]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (!isAuthenticated) {
      setProfileStats({
        contestsJoined: 0,
        teamsCreated: 0,
        winRate: 0,
        profileCompletion: 0,
        missingFields: [],
      });
      return;
    }

    let mounted = true;
    const loadProfileStats = async () => {
      const result = await handleGetProfileStats();
      if (!mounted || !result.success || !result.data) {
        return;
      }

      setProfileStats(result.data as ProfileStats);
    };

    void loadProfileStats();
    return () => {
      mounted = false;
    };
  }, [isAuthenticated]);

  const handleSaveProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!fullName.trim()) {
      toast.error("Full name is required");
      return;
    }

    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("fullName", fullName.trim());
      formData.append("phone", phone.trim());

      if (profilePictureFile) {
        formData.append("photo", profilePictureFile);
      }

      const result = await handleUpdateProfile(formData);

      if (!result.success) {
        toast.error(result.message || "Failed to update profile");
        return;
      }

      const nextUser = {
        ...user,
        fullName: fullName.trim(),
        phone: phone.trim(),
        ...(result.data || {}),
      };
      setUser(nextUser);
      const statsResult = await handleGetProfileStats();
      if (statsResult.success && statsResult.data) {
        setProfileStats(statsResult.data as ProfileStats);
      }
      setProfilePictureFile(null);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Profile update failed");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-lg">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-center px-4">
        <p className="text-gray-700">Unable to load profile data.</p>
        <button
          type="button"
          onClick={checkAuth}
          className="rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2.5 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex font-['Poppins'] ${isDark ? "bg-slate-950 text-slate-100" : "bg-gray-50"}`}>
      <Sidebar />

      <main className={`flex-1 ${isDark ? "bg-slate-900" : "bg-white"}`}>
        <header className={`px-8 py-6 flex items-center justify-between ${isDark ? "border-b border-slate-700" : "border-b border-gray-200"}`}>
          <div>
            <h2 className={`text-3xl font-bold ${isDark ? "text-slate-100" : "text-gray-900"}`}>Profile</h2>
            <p className={`text-sm mt-2 ${isDark ? "text-slate-300" : "text-gray-700"}`}>Manage your account</p>
          </div>
          <ThemeToggle />
        </header>

        <div className="p-8">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 max-w-6xl">
            <section className={`xl:col-span-2 rounded-3xl border p-8 ${isDark ? "border-slate-700 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700" : "border-orange-200 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50"}`}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="relative">
                    {profilePictureUrl ? (
                      <img
                        src={profilePictureUrl}
                        alt={user.fullName || "Profile"}
                        className={`w-24 h-24 rounded-full object-cover border-4 shadow-sm ${isDark ? "border-slate-700" : "border-white"}`}
                      />
                    ) : (
                      <div className={`w-24 h-24 rounded-full text-white text-3xl font-bold flex items-center justify-center border-4 shadow-sm ${isDark ? "bg-orange-500 border-slate-700" : "bg-orange-400 border-white"}`}>
                        {initials}
                      </div>
                    )}
                    {!profilePictureUrl ? (
                      <button
                        type="button"
                        onClick={openEditProfile}
                        className={`absolute -right-1 -bottom-1 rounded-full border p-1.5 transition ${isDark ? "bg-slate-900 border-slate-600 text-slate-100 hover:bg-slate-800" : "bg-white border-gray-200 text-gray-800 hover:bg-gray-50"}`}
                        aria-label="Add profile picture"
                        title="Add profile picture"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    ) : null}
                  </div>

                  <div>
                    <h3 className={`text-3xl font-bold ${isDark ? "text-slate-100" : "text-gray-900"}`}>{user.fullName || "User"}</h3>
                    <p className={`mt-1 ${isDark ? "text-slate-300" : "text-gray-700"}`}>{user.email || "user@example.com"}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${isDark ? "bg-slate-900 text-orange-300 border-orange-400/40" : "bg-white text-orange-700 border-orange-200"}`}>
                        {(user.role || "user").toUpperCase()}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${isDark ? "bg-slate-900 text-slate-200 border-slate-600" : "bg-white text-gray-700 border-gray-200"}`}>
                        <Star className="w-3.5 h-3.5 text-orange-500" />
                        Verified FanUP Account
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 min-w-[220px]">
                  <MetricCard label="Contests Joined" value={String(profileStats.contestsJoined)} />
                  <MetricCard label="Teams Created" value={String(profileStats.teamsCreated)} />
                  <MetricCard label="Win Rate" value={`${profileStats.winRate}%`} />
                  <MetricCard label="Credits" value={String(user.balance ?? 0)} />
                </div>
              </div>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditing((value) => !value)}
                  className="inline-flex items-center gap-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2.5 transition"
                >
                  <Pencil className="w-4 h-4" />
                  {isEditing ? "Close" : "Edit"}
                </button>
              </div>
            </section>

            <section className={`rounded-3xl border p-6 shadow-sm ${isDark ? "border-slate-700 bg-slate-900" : "border-gray-200 bg-white"}`}>
              <div className="flex items-center justify-between gap-2">
                <h4 className={`text-lg font-bold ${isDark ? "text-slate-100" : "text-gray-900"}`}>Profile Completion</h4>
                {isProfileComplete ? (
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${isDark ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-300" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    Completed
                  </span>
                ) : null}
              </div>
              <p className={`text-sm mt-1 ${isDark ? "text-slate-300" : "text-gray-600"}`}>Complete your details for better recommendations.</p>
              {profileStats.missingFields.length > 0 ? (
                <div className={`mt-3 rounded-xl border p-3 ${isDark ? "border-slate-700 bg-slate-950/60" : "border-gray-200 bg-gray-50"}`}>
                  <p className={`text-xs font-semibold ${isDark ? "text-slate-300" : "text-gray-700"}`}>Missing to complete profile:</p>
                  <ul className={`mt-2 space-y-2 text-sm ${isDark ? "text-slate-300" : "text-gray-700"}`}>
                    {profileStats.missingFields.map((field) => (
                      <li key={field} className={`flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 ${isDark ? "bg-slate-900/70" : "bg-white"}`}>
                        <span>{field}</span>
                        <button
                          type="button"
                          onClick={openEditProfile}
                          className={`rounded-md px-2 py-1 text-xs font-semibold transition ${isDark ? "bg-slate-800 text-slate-100 hover:bg-slate-700" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
                        >
                          Add
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <div className="mt-5">
                <div className={`w-full h-2.5 rounded-full overflow-hidden ${isDark ? "bg-slate-800" : "bg-gray-100"}`}>
                  <div
                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                    style={{ width: `${completionPercent}%` }}
                  />
                </div>
                <p className={`text-sm mt-2 ${isDark ? "text-slate-300" : "text-gray-700"}`}>{completionPercent}% complete</p>
              </div>
              <button
                type="button"
                disabled={isProfileComplete}
                onClick={openEditProfile}
                className={`mt-5 w-full rounded-xl py-2.5 font-semibold transition ${isProfileComplete ? (isDark ? "bg-emerald-600/80 text-white cursor-default" : "bg-emerald-600 text-white cursor-default") : "bg-red-500 hover:bg-red-600 text-white"}`}
              >
                {isProfileComplete ? "Completed" : "Complete Profile"}
              </button>
            </section>

            <section className={`xl:col-span-2 rounded-2xl border shadow-sm p-6 ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200"}`}>
              <h4 className={`text-lg font-bold ${isDark ? "text-slate-100" : "text-gray-900"}`}>Contact Information</h4>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                <InfoRow icon={<Mail className={`w-5 h-5 ${isDark ? "text-slate-400" : "text-gray-500"}`} />} label="Email" text={user.email || "user@example.com"} />
                <InfoRow
                  icon={<Phone className={`w-5 h-5 ${isDark ? "text-slate-400" : "text-gray-500"}`} />}
                  label="Phone"
                  text={user.phone || "Not added yet"}
                  actionLabel={user.phone ? undefined : "Add"}
                  onAction={user.phone ? undefined : openEditProfile}
                />
              </div>
            </section>

            {isEditing ? (
              <section ref={editSectionRef} className={`rounded-2xl border shadow-sm p-6 ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200"}`}>
                <h4 className={`text-lg font-bold ${isDark ? "text-slate-100" : "text-gray-900"}`}>Edit Profile</h4>
                <p className={`text-sm mt-1 ${isDark ? "text-slate-300" : "text-gray-600"}`}>Update your personal details here.</p>

                <form className="mt-5 space-y-4" onSubmit={handleSaveProfile}>
                  <div>
                    <label htmlFor="fullName" className={`block text-sm font-medium ${isDark ? "text-slate-300" : "text-gray-700"}`}>
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      className={`mt-1 w-full rounded-xl border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-300 ${isDark ? "border-slate-600 bg-slate-800 text-slate-100" : "border-gray-300 text-gray-900"}`}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className={`block text-sm font-medium ${isDark ? "text-slate-300" : "text-gray-700"}`}>
                      Phone
                    </label>
                    <input
                      id="phone"
                      type="text"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      className={`mt-1 w-full rounded-xl border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-300 ${isDark ? "border-slate-600 bg-slate-800 text-slate-100" : "border-gray-300 text-gray-900"}`}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label htmlFor="profilePicture" className={`block text-sm font-medium ${isDark ? "text-slate-300" : "text-gray-700"}`}>
                      Profile Picture
                    </label>
                    <input
                      id="profilePicture"
                      type="file"
                      accept="image/*"
                      onChange={(event) => setProfilePictureFile(event.target.files?.[0] || null)}
                      className={`mt-1 w-full rounded-xl border px-4 py-2.5 file:mr-3 file:rounded-lg file:border-0 file:px-3 file:py-2 file:text-sm file:font-medium ${isDark ? "border-slate-600 bg-slate-800 text-slate-100 file:bg-slate-700 file:text-slate-200" : "border-gray-300 text-gray-900 file:bg-gray-100 file:text-gray-700"}`}
                    />
                    {profilePictureFile ? <p className={`mt-1 text-xs ${isDark ? "text-slate-400" : "text-gray-500"}`}>Selected: {profilePictureFile.name}</p> : null}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="rounded-xl bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-semibold px-5 py-2.5 transition"
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() => {
                        setFullName(user.fullName || "");
                        setPhone(user.phone || "");
                        setProfilePictureFile(null);
                        setIsEditing(false);
                      }}
                      className={`rounded-xl border px-5 py-2.5 font-semibold transition ${isDark ? "border-slate-600 text-slate-200 hover:bg-slate-800" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </section>
            ) : (
              <section ref={editSectionRef} className={`rounded-2xl border shadow-sm p-6 ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200"}`}>
                <h4 className={`text-lg font-bold ${isDark ? "text-slate-100" : "text-gray-900"}`}>Edit Profile</h4>
                <p className={`text-sm mt-1 ${isDark ? "text-slate-300" : "text-gray-600"}`}>Use the edit icon above to update your details.</p>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  const { isDark } = useThemeMode();
  return (
    <div className={`rounded-xl border p-3 ${isDark ? "bg-slate-900 border-slate-600" : "bg-white/80 border-white"}`}>
      <p className={`text-xs ${isDark ? "text-slate-400" : "text-gray-600"}`}>{label}</p>
      <p className={`text-lg font-bold mt-1 ${isDark ? "text-slate-100" : "text-gray-900"}`}>{value}</p>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  text,
  actionLabel,
  onAction,
}: {
  icon: React.ReactNode;
  label: string;
  text: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const { isDark } = useThemeMode();
  return (
    <div className={`flex items-center justify-between gap-3 rounded-xl border p-3 ${isDark ? "border-slate-700" : "border-gray-200"}`}>
      <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? "bg-slate-800" : "bg-gray-100"}`}>{icon}</div>
      <div>
        <p className={`text-xs ${isDark ? "text-slate-400" : "text-gray-500"}`}>{label}</p>
        <p className={`font-medium ${isDark ? "text-slate-200" : "text-gray-800"}`}>{text}</p>
      </div>
      </div>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${isDark ? "bg-slate-800 text-slate-100 hover:bg-slate-700" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
