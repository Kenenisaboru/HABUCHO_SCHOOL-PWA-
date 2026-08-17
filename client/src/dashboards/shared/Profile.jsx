/**
 * Profile Page — Shared premium profile view for all roles
 * Displays complete student information, academic placement, parent contacts, and demographics.
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
      <div className="flex min-h-100 items-center justify-center">
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
    student_id: profile?.student_id || "N/A",
    gender: profile?.gender || "N/A",
    date_of_birth: profile?.date_of_birth ? profile.date_of_birth.split("T")[0] : "N/A",
    grade_level: profile?.grade_level || "N/A",
    section: profile?.section || "N/A",
    stream: profile?.stream || "General",
    phone: profile?.phone || "N/A",
    parent_name: profile?.parent_name || "N/A",
    parent_phone: profile?.parent_phone || "N/A",
    address: profile?.address || "N/A",
    academic_year: profile?.academic_year || "2024/2025",
    admission_date: profile?.admission_date ? profile.admission_date.split("T")[0] : "N/A",
    blood_group: profile?.blood_group || "N/A",
    previous_school: profile?.previous_school || "N/A",
    remarks: profile?.remarks || "",
  };

  return (
    <div className="mx-auto max-w-3xl py-6">
      {/* Page Header */}
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Your Profile & Records</h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Comprehensive student and account identity details</p>
      </div>

      <div className="card overflow-hidden p-0! rounded-3xl border border-slate-200/80 shadow-md dark:border-slate-800 dark:bg-slate-900">
        {/* Cover Photo Area */}
        <div className="relative h-32 w-full bg-slate-900 sm:h-44">
          <div className="absolute inset-0 bg-linear-to-r from-emerald-600 via-teal-600 to-indigo-700 opacity-90" />
          <div
            className="absolute inset-0 opacity-[0.15]"
            style={{ backgroundImage: "radial-gradient(rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "16px 16px" }}
          />
        </div>

        {/* Content Area */}
        <div className="relative px-6 pb-8 sm:px-10">
          {/* Avatar */}
          <div className="relative -mt-16 mb-4 flex justify-between items-end sm:-mt-20">
            <div className={`flex h-28 w-28 sm:h-36 sm:w-36 items-center justify-center rounded-3xl border-4 border-white bg-linear-to-br ${roleGradient} text-4xl sm:text-5xl font-extrabold text-white shadow-xl dark:border-slate-900`}>
              {displayData.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full bg-linear-to-r ${roleGradient.split(" shadow")[0]} px-3.5 py-1.5 text-xs font-bold capitalize tracking-wide text-white shadow-sm`}>
                <span className="h-1.5 w-1.5 rounded-full bg-white/70 animate-pulse" />
                {displayData.role}
              </span>
            </div>
          </div>

          {/* User Info Header */}
          <div>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {displayData.name}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">{displayData.email}</p>
          </div>

          <div className="mt-6 gradient-divider opacity-50" />

          {/* ACADEMIC PLACEMENT CARD (IF STUDENT) */}
          {displayData.role === "student" && (
            <div className="mt-6 p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 dark:bg-emerald-950/20">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                  Academic Placement & Enrollment
                </h4>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-emerald-600 text-white">
                  ID: {displayData.student_id}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Grade Level</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">Grade {displayData.grade_level}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Section</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">Section {displayData.section}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Stream</span>
                  <span className="font-bold text-teal-600 dark:text-teal-400 text-sm">{displayData.stream}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Academic Year</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{displayData.academic_year}</span>
                </div>
              </div>
            </div>
          )}

          {/* DETAILS GRID */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 text-xs sm:text-sm">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800/60 dark:bg-slate-800/40">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Gender & Date of Birth</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {displayData.gender} • {displayData.date_of_birth}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800/60 dark:bg-slate-800/40">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Student Contact Phone</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200">{displayData.phone}</p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800/60 dark:bg-slate-800/40">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Parent / Guardian Name</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200">{displayData.parent_name}</p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800/60 dark:bg-slate-800/40">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Parent Contact Phone</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200">{displayData.parent_phone}</p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800/60 dark:bg-slate-800/40 sm:col-span-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Residential Address</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200">{displayData.address}</p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800/60 dark:bg-slate-800/40">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Blood Group</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200">{displayData.blood_group}</p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800/60 dark:bg-slate-800/40">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Previous School</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200">{displayData.previous_school}</p>
            </div>
          </div>

          {displayData.remarks && (
            <div className="mt-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs dark:bg-amber-950/20">
              <span className="font-bold text-amber-700 dark:text-amber-300 block mb-1">Administrative Remarks:</span>
              <p className="text-slate-700 dark:text-slate-300">{displayData.remarks}</p>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-400">
            <span>Member since: {displayData.date}</span>
            <span>Account ID: #{displayData.id.toString().padStart(6, "0")}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
