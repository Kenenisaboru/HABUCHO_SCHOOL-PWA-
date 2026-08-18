/**
 * Profile Page — Shared premium profile view for all roles
 * Displays complete student information, academic placement, parent contacts, and demographics.
 * Admins can edit their name, phone, and avatar.
 */
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";
import useAuthStore from "../../context/authStore";
import { getProfile, updateProfile, uploadAvatar, changePassword } from "../../services/authService";
import { formatDate } from "../../utils/helpers";
import { getRoleGradient } from "../../utils/roleColors";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editForm, setEditForm] = useState({ full_name: "", phone: "" });
  const [passwordForm, setPasswordForm] = useState({ current_password: "", new_password: "", confirm_password: "" });
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
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Your Profile & Records</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Comprehensive student and account identity details</p>
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

      <div className="card overflow-hidden p-0! rounded-3xl border border-slate-200/80 shadow-md dark:border-slate-800 dark:bg-slate-900">
        <div className="relative h-32 w-full bg-slate-900 sm:h-44">
          <div className="absolute inset-0 bg-linear-to-r from-emerald-600 via-teal-600 to-indigo-700 opacity-90" />
          <div
            className="absolute inset-0 opacity-[0.15]"
            style={{ backgroundImage: "radial-gradient(rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "16px 16px" }}
          />
        </div>

        <div className="relative px-6 pb-8 sm:px-10">
          <div className="relative -mt-16 mb-4 flex justify-between items-end sm:-mt-20">
            <div className="relative group">
              <div className={`flex h-28 w-28 sm:h-36 sm:w-36 items-center justify-center rounded-3xl border-4 border-white bg-linear-to-br ${roleGradient} text-4xl sm:text-5xl font-extrabold text-white shadow-xl dark:border-slate-900`}>
                {displayData.name.charAt(0).toUpperCase()}
              </div>
              <label className="absolute inset-0 flex items-center justify-center rounded-3xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <span className="text-xs font-bold text-white">Change</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </label>
            </div>
            <div className="flex gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full bg-linear-to-r ${roleGradient.split(" shadow")[0]} px-3.5 py-1.5 text-xs font-bold capitalize tracking-wide text-white shadow-sm`}>
                <span className="h-1.5 w-1.5 rounded-full bg-white/70 animate-pulse" />
                {displayData.role}
              </span>
            </div>
          </div>

          <div>
            {editing ? (
              <div className="space-y-3 mb-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-500">Full Name</label>
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
                  <button onClick={handleSaveProfile} disabled={saving} className="btn-primary text-xs">
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                  <button onClick={() => setEditing(false)} className="btn-outline text-xs">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  {displayData.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">{displayData.email}</p>
              </>
            )}
          </div>

          <div className="mt-6 gradient-divider opacity-50" />

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

      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-bold">Change Password</h2>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500">Current Password</label>
                <input
                  type="password"
                  value={passwordForm.current_password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500">New Password</label>
                <input
                  type="password"
                  value={passwordForm.new_password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordForm.confirm_password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                  className="input-field"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={handleChangePassword} disabled={changingPassword} className="btn-primary flex-1">
                  {changingPassword ? "Changing..." : "Change Password"}
                </button>
                <button onClick={() => setShowPasswordModal(false)} className="btn-outline flex-1">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;