/**
 * Profile Page — Shared premium profile view for all roles
 * Displays complete student information, academic placement, parent contacts, and demographics.
 * Admins can edit their name, phone, and avatar.
 */
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";
import useAuthStore from "../../context/authStore";
import {
  getProfile,
  updateProfile,
  uploadAvatar,
  changePassword,
} from "../../services/authService";
import { getAssetUrl } from "../../services/api";
import { formatDate } from "../../utils/helpers";
import { getRoleGradient } from "../../utils/roleColors";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editForm, setEditForm] = useState({ full_name: "", phone: "" });
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const user = useAuthStore((s) => s.user);
  const fetchUser = useAuthStore((s) => s.fetchUser);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        setProfile(res.data.data);
        setEditForm({
          full_name: res.data.data.full_name || "",
          phone: res.data.data.phone || "",
        });
      } catch {
        toast.error("Failed to load profile details");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    if (!editForm.full_name.trim()) {
      toast.error("Name is required");
      return;
    }
    setSaving(true);
    try {
      await updateProfile({ full_name: editForm.full_name, phone: editForm.phone });
      toast.success("Profile updated");
      setEditing(false);
      const res = await getProfile();
      setProfile(res.data.data);
      if (fetchUser) await fetchUser();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      await uploadAvatar(formData);
      toast.success("Avatar updated");
      const res = await getProfile();
      setProfile(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Avatar upload failed");
    }
  };

  const handleChangePassword = async () => {
    if (!passwordForm.current_password || !passwordForm.new_password) {
      toast.error("All fields are required");
      return;
    }
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast.error("New passwords do not match");
      return;
    }
    if (passwordForm.new_password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setChangingPassword(true);
    try {
      await changePassword({
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
      });
      toast.success("Password changed successfully");
      setShowPasswordModal(false);
      setPasswordForm({ current_password: "", new_password: "", confirm_password: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Password change failed");
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const roleGradient = getRoleGradient(profile?.role || user?.role);

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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            Your Profile & Records
          </h2>
          <p className="text-xs text-slate-500 sm:text-sm dark:text-slate-400">
            Comprehensive student and account identity details
          </p>
        </div>
        <div className="flex gap-2">
          {!editing && (
            <button onClick={() => setEditing(true)} className="btn-primary text-xs">
              Edit Profile
            </button>
          )}
          <button onClick={() => setShowPasswordModal(true)} className="btn-outline text-xs">
            Change Password
          </button>
        </div>
      </div>

      <div className="card overflow-hidden rounded-3xl border border-slate-200/80 p-0! shadow-md dark:border-slate-800 dark:bg-slate-900">
        <div className="relative h-32 w-full bg-slate-900 sm:h-44">
          <div className="absolute inset-0 bg-linear-to-r from-emerald-600 via-teal-600 to-indigo-700 opacity-90" />
          <div
            className="absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage: "radial-gradient(rgba(255,255,255,1) 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }}
          />
        </div>

        <div className="relative px-6 pb-8 sm:px-10">
          <div className="relative -mt-16 mb-4 flex items-end justify-between sm:-mt-20">
            <div className="group relative">
              <div
                className={`flex h-28 w-28 items-center justify-center rounded-3xl border-4 border-white bg-linear-to-br sm:h-36 sm:w-36 ${roleGradient} overflow-hidden text-4xl font-extrabold text-white shadow-xl sm:text-5xl dark:border-slate-900`}
              >
                {profile?.avatar_url ? (
                  <img
                    src={getAssetUrl(profile.avatar_url)}
                    alt={displayData.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  displayData.name.charAt(0).toUpperCase()
                )}
              </div>
              <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-3xl bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="text-xs font-bold text-white">Change</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
            <div className="flex gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full bg-linear-to-r ${roleGradient.split(" shadow")[0]} px-3.5 py-1.5 text-xs font-bold tracking-wide text-white capitalize shadow-sm`}
              >
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/70" />
                {displayData.role}
              </span>
            </div>
          </div>

          <div>
            {editing ? (
              <div className="mb-4 space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-500">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editForm.full_name}
                    onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-500">Phone</label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="input-field"
                    placeholder="Phone number"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="btn-primary text-xs"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                  <button onClick={() => setEditing(false)} className="btn-outline text-xs">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
                  {displayData.name}
                </h3>
                <p className="mt-1 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
                  {displayData.email}
                </p>
              </>
            )}
          </div>

          <div className="gradient-divider mt-6 opacity-50" />

          {displayData.role === "student" && (
            <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5 dark:bg-emerald-950/20">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-xs font-extrabold tracking-wider text-emerald-700 uppercase dark:text-emerald-300">
                  Academic Placement & Enrollment
                </h4>
                <span className="rounded-md bg-emerald-600 px-2.5 py-0.5 font-mono text-xs font-bold text-white">
                  ID: {displayData.student_id}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs sm:grid-cols-4">
                <div>
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                    Grade Level
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    Grade {displayData.grade_level}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                    Section
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    Section {displayData.section}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                    Stream
                  </span>
                  <span className="text-sm font-bold text-teal-600 dark:text-teal-400">
                    {displayData.stream}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                    Academic Year
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {displayData.academic_year}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 grid gap-4 text-xs sm:grid-cols-2 sm:text-sm">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800/60 dark:bg-slate-800/40">
              <p className="mb-1 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                Gender & Date of Birth
              </p>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {displayData.gender} • {displayData.date_of_birth}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800/60 dark:bg-slate-800/40">
              <p className="mb-1 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                Student Contact Phone
              </p>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {displayData.phone}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800/60 dark:bg-slate-800/40">
              <p className="mb-1 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                Parent / Guardian Name
              </p>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {displayData.parent_name}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800/60 dark:bg-slate-800/40">
              <p className="mb-1 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                Parent Contact Phone
              </p>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {displayData.parent_phone}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 sm:col-span-2 dark:border-slate-800/60 dark:bg-slate-800/40">
              <p className="mb-1 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                Residential Address
              </p>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {displayData.address}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800/60 dark:bg-slate-800/40">
              <p className="mb-1 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                Blood Group
              </p>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {displayData.blood_group}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800/60 dark:bg-slate-800/40">
              <p className="mb-1 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                Previous School
              </p>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {displayData.previous_school}
              </p>
            </div>
          </div>

          {displayData.remarks && (
            <div className="mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-xs dark:bg-amber-950/20">
              <span className="mb-1 block font-bold text-amber-700 dark:text-amber-300">
                Administrative Remarks:
              </span>
              <p className="text-slate-700 dark:text-slate-300">{displayData.remarks}</p>
            </div>
          )}

          <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-400 dark:border-slate-800">
            <span>Member since: {displayData.date}</span>
            <span>Account ID: #{displayData.id.toString().padStart(6, "0")}</span>
          </div>
        </div>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-bold">Change Password</h2>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordForm.current_password}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, current_password: e.target.value })
                  }
                  className="input-field"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.new_password}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, new_password: e.target.value })
                  }
                  className="input-field"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.confirm_password}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, confirm_password: e.target.value })
                  }
                  className="input-field"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleChangePassword}
                  disabled={changingPassword}
                  className="btn-primary flex-1"
                >
                  {changingPassword ? "Changing..." : "Change Password"}
                </button>
                <button onClick={() => setShowPasswordModal(false)} className="btn-outline flex-1">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
