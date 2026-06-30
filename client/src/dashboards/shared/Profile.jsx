/**
 * Profile Page — Shared premium profile view for all roles
 * with avatar gradients, stat cards, and decorative background
 */
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";
import useAuthStore from "../../context/authStore";
import { getProfile } from "../../services/authService";
import { formatDate } from "../../utils/helpers";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        setProfile(res.data.data);
      } catch {
        toast.error("Failed to load profile details");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const roleColors = {
    admin: "from-violet-500 to-purple-600 shadow-violet-500/30",
    teacher: "from-blue-500 to-cyan-600 shadow-blue-500/30",
    student: "from-emerald-500 to-teal-600 shadow-emerald-500/30",
  };
  const roleGradient = roleColors[profile?.role || user?.role] || roleColors.student;

  const displayData = {
    name: profile?.full_name || user?.name || "User",
    role: profile?.role || user?.role || "student",
    email: profile?.email || "No email provided",
    date: profile?.created_at ? formatDate(profile.created_at) : "Unknown",
    id: profile?.id || "---",
  };

  return (
    <div className="mx-auto max-w-2xl py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Your Profile</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">View your personal account details</p>
      </div>

      <div className="card overflow-hidden p-0!">
        {/* Cover Photo / Header Area */}
        <div className="relative h-32 w-full bg-slate-900 sm:h-40">
          <div className="absolute inset-0 bg-linear-to-r from-emerald-600 to-teal-700 opacity-90" />
          <div
            className="absolute inset-0 opacity-[0.15]"
            style={{ backgroundImage: "radial-gradient(rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "16px 16px" }}
          />
        </div>

        {/* Content Area */}
        <div className="relative px-6 pb-8 sm:px-10">
          {/* Avatar (overlapping cover) */}
          <div className="relative -mt-16 mb-4 flex justify-between items-end sm:-mt-20">
            <div className={`flex h-32 w-32 items-center justify-center rounded-2xl border-4 border-white bg-linear-to-br ${roleGradient} text-5xl font-extrabold text-white shadow-xl dark:border-slate-900`}>
              {displayData.name.charAt(0).toUpperCase()}
            </div>
            {/* Edit Button (Placeholder) */}
            <button className="btn-outline text-xs px-3 py-1.5 mb-2 gap-1.5">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit
            </button>
          </div>

          {/* User Info */}
          <div>
            <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
              {displayData.name}
            </h3>
            <span className={`mt-2 inline-flex items-center gap-1.5 rounded-full bg-linear-to-r ${roleGradient.split(" shadow")[0]} px-3 py-1 text-xs font-bold capitalize tracking-wide text-white shadow-sm`}>
              <span className="h-1.5 w-1.5 rounded-full bg-white/70 animate-pulse" />
              {displayData.role}
            </span>
          </div>

          <div className="mt-8 gradient-divider opacity-50" />

          {/* Details Grid */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition-colors hover:bg-slate-50 dark:border-slate-800/60 dark:bg-slate-900/40 dark:hover:bg-slate-900/60">
              <div className="mb-1 flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="text-xs font-semibold uppercase tracking-wider">Email Address</p>
              </div>
              <p className="font-medium text-slate-900 dark:text-slate-200">{displayData.email}</p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition-colors hover:bg-slate-50 dark:border-slate-800/60 dark:bg-slate-900/40 dark:hover:bg-slate-900/60">
              <div className="mb-1 flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-xs font-semibold uppercase tracking-wider">Member Since</p>
              </div>
              <p className="font-medium text-slate-900 dark:text-slate-200">{displayData.date}</p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition-colors hover:bg-slate-50 dark:border-slate-800/60 dark:bg-slate-900/40 dark:hover:bg-slate-900/60 sm:col-span-2">
              <div className="mb-1 flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <p className="text-xs font-semibold uppercase tracking-wider">System User ID</p>
              </div>
              <p className="font-mono text-sm font-medium text-slate-900 dark:text-slate-200">#{displayData.id.toString().padStart(6, '0')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
