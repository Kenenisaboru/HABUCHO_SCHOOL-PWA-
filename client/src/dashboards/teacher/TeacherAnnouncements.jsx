/**
 * Teacher Announcements — Create and view announcements
 */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import DashboardLayout from "../../layouts/DashboardLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import { getAnnouncements, createAnnouncement } from "../../services/authService";
import { formatDate } from "../../utils/helpers";

const teacherLinks = [
  { to: "/teacher", label: "Dashboard", icon: "📊", end: true },
  { to: "/teacher/schedule", label: "My Schedule", icon: "📅" },
  { to: "/teacher/grades", label: "Grades", icon: "📝" },
  { to: "/teacher/announcements", label: "Announcements", icon: "📢" },
  { to: "/teacher/profile", label: "Profile", icon: "👤" },
];

const TeacherAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAnnouncements({ limit: 20 });
      setAnnouncements(res.data.data.announcements);
    } catch {
      toast.error("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const onSubmit = async (data) => {
    try {
      await createAnnouncement(data);
      toast.success("Announcement posted!");
      reset();
      setShowForm(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post");
    }
  };

  return (
    <DashboardLayout links={teacherLinks} title="Announcements">
      <div className="mb-6 flex justify-end">
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? "Cancel" : "+ New Announcement"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="card mb-6 space-y-4">
          <input className="input-field" placeholder="Title" {...register("title", { required: true })} />
          <textarea rows={4} className="input-field" placeholder="Content" {...register("content", { required: true })} />
          <button type="submit" className="btn-emerald">Post Announcement</button>
        </form>
      )}

      {loading ? (
        <LoadingSpinner className="py-20" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {announcements.map((a) => (
            <div key={a.id} className="card">
              <h3 className="font-semibold">{a.title}</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{a.content}</p>
              <p className="mt-3 text-xs text-gray-500">{formatDate(a.created_at)} · {a.author_name}</p>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default TeacherAnnouncements;
