import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  UsersRound,
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  UserCheck,
  Building,
} from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";
import StatCard from "../../components/StatCard";
import {
  getStaffProfiles,
  createStaffProfile,
  updateStaffProfile,
  deleteStaffProfile,
} from "../../services/staffService";
import { getAssetUrl } from "../../services/api";

const AdminStaff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await getStaffProfiles();
      setStaff(res.data?.data || res.data || []);
    } catch {
      toast.error("Failed to load staff profiles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const openCreate = () => {
    setEditing(null);
    reset({
      name: "",
      title: "",
      department: "Mathematics & Science",
      bio: "",
      display_order: 0,
      is_active: true,
    });
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    reset({
      name: item.name,
      title: item.title,
      department: item.department || "",
      bio: item.bio || "",
      display_order: item.display_order || 0,
      is_active: item.is_active ?? true,
    });
    setShowModal(true);
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("title", data.title);
      formData.append("department", data.department || "");
      formData.append("bio", data.bio || "");
      formData.append("display_order", data.display_order || 0);
      formData.append("is_active", data.is_active ? "true" : "false");

      if (data.photo && data.photo[0]) {
        formData.append("photo", data.photo[0]);
      }

      if (editing) {
        await updateStaffProfile(editing.id, formData);
        toast.success("Staff profile updated");
      } else {
        await createStaffProfile(formData);
        toast.success("Staff profile created");
      }

      setShowModal(false);
      fetchStaff();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save profile");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this staff profile?")) return;
    try {
      await deleteStaffProfile(id);
      toast.success("Profile deleted");
      fetchStaff();
    } catch {
      toast.error("Failed to delete staff profile");
    }
  };

  const filtered = staff.filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      s.name?.toLowerCase().includes(q) ||
      s.title?.toLowerCase().includes(q) ||
      s.department?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            Staff & Leadership Profiles
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage teacher directories, department heads, and academic leadership profiles.
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary text-xs px-4 py-2 gap-1.5 shadow-sm">
          <Plus className="h-4 w-4" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Summary Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={<UsersRound />}
          title="Total Faculty & Staff"
          value={staff.length}
          color="blue"
        />
        <StatCard
          icon={<UserCheck />}
          title="Active Profiles"
          value={staff.filter((s) => s.is_active !== false).length}
          color="emerald"
        />
      </div>

      {/* Search Input */}
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-900">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, title, or department..."
          className="w-full text-xs text-slate-900 focus:outline-none dark:text-white bg-transparent"
        />
      </div>

      {/* Staff Table */}
      {loading ? (
        <LoadingSpinner className="py-16" />
      ) : filtered.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-xs text-slate-500">No staff profiles found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50 font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-300">
              <tr>
                <th className="px-4 py-3">Faculty Name</th>
                <th className="px-4 py-3">Designation / Title</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {item.photo_path ? (
                        <img
                          src={getAssetUrl(item.photo_path)}
                          alt={item.name}
                          className="h-10 w-10 rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-primary font-bold dark:bg-blue-950 dark:text-blue-400">
                          {item.name?.charAt(0) || "T"}
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {item.name}
                        </div>
                        {item.bio && (
                          <div className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">
                            {item.bio}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">
                    {item.title}
                  </td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                    {item.department || "General"}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    #{item.display_order ?? 0}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(item)}
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-primary dark:hover:bg-slate-800"
                        title="Edit profile"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50"
                        title="Delete profile"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="card max-w-lg w-full p-6 bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">
                {editing ? "Edit Staff Profile" : "Add Staff Member"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  {...register("name", { required: true })}
                  placeholder="e.g. Dr. Abebe Tessema"
                  className="input-field text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Designation / Title *
                  </label>
                  <input
                    type="text"
                    {...register("title", { required: true })}
                    placeholder="e.g. Head of Mathematics"
                    className="input-field text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    {...register("department")}
                    placeholder="e.g. Sciences, Administration"
                    className="input-field text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    defaultValue={0}
                    {...register("display_order")}
                    className="input-field text-xs"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked={true}
                      {...register("is_active")}
                      className="rounded text-primary focus:ring-primary"
                    />
                    <span>Active on Public Website</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Profile Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  {...register("photo")}
                  className="input-field text-xs file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-[11px] file:bg-blue-50 file:text-primary dark:file:bg-blue-950 dark:file:text-blue-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Biography & Qualifications
                </label>
                <textarea
                  rows={3}
                  {...register("bio")}
                  placeholder="Academic credentials, university alma mater, years of experience..."
                  className="input-field text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-outline px-4 py-2 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary px-5 py-2 text-xs"
                >
                  {submitting ? "Saving..." : editing ? "Update Profile" : "Save Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStaff;
