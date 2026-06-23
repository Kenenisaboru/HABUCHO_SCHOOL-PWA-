/**
 * Profile Page — Shared profile view for all roles
 */
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";
import useAuthStore from "../../context/authStore";
import { getProfile } from "../../services/authService";
import { formatDate, capitalize } from "../../utils/helpers";

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
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <LoadingSpinner className="py-20" />
    );
  }

  return (
    <>
      <div className="mx-auto max-w-lg">
        <div className="card text-center">
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-blue-600 to-emerald-500 text-3xl font-bold text-white">
            {profile?.full_name?.charAt(0) || user?.name?.charAt(0) || "U"}
          </div>
          <h2 className="text-xl font-bold">{profile?.full_name || user?.name}</h2>
          <span className="mt-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium capitalize text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
            {profile?.role || user?.role}
          </span>

          <div className="mt-6 space-y-3 text-left">
            <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
              <p className="text-xs text-gray-500">Email</p>
              <p className="font-medium">{profile?.email}</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
              <p className="text-xs text-gray-500">Member Since</p>
              <p className="font-medium">{formatDate(profile?.created_at)}</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
              <p className="text-xs text-gray-500">User ID</p>
              <p className="font-medium">#{profile?.id}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
