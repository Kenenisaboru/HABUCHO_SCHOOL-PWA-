/**
 * Admin Announcements — CRUD for school announcements
 */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import DashboardLayout from "../../layouts/DashboardLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from "../../services/authService";
import { formatDate } from "../../utils/helpers";

const adminLinks = [
  { to: "/admin", label: "Dashboard", icon: "📊", end: true },
  { to: "/admin/users", label: "Users", icon: "👥" },
  { to: "/admin/schedules", label: "Schedules", icon: "📅" },
  { to: "/admin/announcements", label: "Announcements", icon: "📢" },
  { to: "/admin/messages", label: "Messages", icon: "✉️" },
  { to: "/admin/profile", label: "Profile", icon: "👤" },
];

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const { register, handleSubmit, reset } = useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAnnouncements({ limit: 50 });
      setAnnouncements(res.data.data.announcements);
    } catch {
      toast.error("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setEditing(null);
    reset({ title: "", content: "" });
    setShowModal(true);
  };

  const openEdit = (a) => {
    setEditing(a);
    reset({ title: a.title, content: a.content });
    setShowModal(true);
  };

  const onSubmit = async (data) => {
    try {
      if (editing) {
        await updateAnnouncement(editing.id, data);
        toast.success("Announcement updated");
      } else {
        await createAnnouncement(data);
        toast.success("Announcement created");
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this announcement?")) return;
    try {
      await deleteAnnouncement(id);
      toast.success("Deleted");
      fetchData();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <DashboardLayout links={adminLinks} title="Announcement Management">
      <div className="mb-6 flex justify-end">
        <button onClick={openCreate} className="btn-primary">+ New Announcement</button>
      </div>

      {loading ? (
        <LoadingSpinner className="py-20" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {announcements.map((a) => (
            <div key={a.id} className="card">
              <h3 className="font-semibold">{a.title}</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{a.content}</p>
              <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                <span>{formatDate(a.created_at)}</span>
                <div>
                  <button onClick={() => openEdit(a)} className="mr-2 text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(a.id)} className="text-red-500 hover:underline">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-bold">{editing ? "Edit" : "Create"} Announcement</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <input className="input-field" placeholder="Title" {...register("title", { required: true })} />
              <textarea rows={5} className="input-field" placeholder="Content" {...register("content", { required: true })} />
              <div className="flex gap-2">
                <button type="submit" className="btn-primary flex-1">Save</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminAnnouncements;
