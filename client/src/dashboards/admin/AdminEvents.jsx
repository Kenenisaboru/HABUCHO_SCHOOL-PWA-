import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  Calendar,
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  Upload,
  Eye,
  CheckCircle,
  FileText,
} from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";
import Pagination from "../../components/Pagination";
import StatCard from "../../components/StatCard";
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../../services/eventService";
import { getAssetUrl } from "../../services/api";

const PAGE_SIZE = 8;

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await getEvents(page, PAGE_SIZE);
      const data = res.data?.data || res.data;
      setEvents(data.events || []);
      setTotalCount(data.pagination?.total || (data.events || []).length);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch {
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [page]);

  const openCreate = () => {
    setEditing(null);
    reset({
      title: "",
      content: "",
      event_date: "",
      category: "Academic",
      status: "published",
    });
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    reset({
      title: item.title,
      content: item.content,
      event_date: item.event_date ? item.event_date.split("T")[0] : "",
      category: item.category || "Academic",
      status: item.status || "published",
    });
    setShowModal(true);
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", data.content || "");
      if (data.event_date) formData.append("event_date", data.event_date);
      formData.append("category", data.category || "Academic");
      formData.append("status", data.status || "published");

      if (data.image && data.image[0]) {
        formData.append("image", data.image[0]);
      }

      if (editing) {
        await updateEvent(editing.id, formData);
        toast.success("Event updated successfully");
      } else {
        await createEvent(formData);
        toast.success("Event published successfully");
      }

      setShowModal(false);
      fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save event");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await deleteEvent(id);
      toast.success("Event deleted");
      fetchEvents();
    } catch {
      toast.error("Failed to delete event");
    }
  };

  const filtered = events.filter((e) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      e.title?.toLowerCase().includes(q) ||
      e.category?.toLowerCase().includes(q) ||
      e.content?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            News & Events Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Publish school news, announcements, and important academic calendar events.
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary text-xs px-4 py-2 gap-1.5 shadow-sm">
          <Plus className="h-4 w-4" />
          <span>New Event</span>
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={<Calendar />}
          title="Total Events"
          value={totalCount}
          color="blue"
        />
        <StatCard
          icon={<CheckCircle />}
          title="Published"
          value={events.filter((e) => e.status === "published").length}
          color="emerald"
        />
        <StatCard
          icon={<FileText />}
          title="Drafts"
          value={events.filter((e) => e.status === "draft").length}
          color="orange"
        />
      </div>

      {/* Search Input */}
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-900">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search events by title or category..."
          className="w-full text-xs text-slate-900 focus:outline-none dark:text-white bg-transparent"
        />
      </div>

      {/* Events Table */}
      {loading ? (
        <LoadingSpinner className="py-16" />
      ) : filtered.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-xs text-slate-500">No events found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50 font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-300">
              <tr>
                <th className="px-4 py-3">Event Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Event Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {item.image_path ? (
                        <img
                          src={getAssetUrl(item.image_path)}
                          alt={item.title}
                          className="h-10 w-10 rounded-lg object-cover shrink-0"
                        />
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-primary dark:bg-blue-950 dark:text-blue-400">
                          <Calendar className="h-5 w-5" />
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">
                          {item.content || "No details provided"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {item.category || "General"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                    {item.event_date
                      ? new Date(item.event_date).toLocaleDateString("en-US", { dateStyle: "medium" })
                      : "TBA"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        item.status === "published"
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400"
                          : "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400"
                      }`}
                    >
                      {item.status || "published"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(item)}
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-primary dark:hover:bg-slate-800"
                        title="Edit event"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50"
                        title="Delete event"
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

      {totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="card max-w-lg w-full p-6 bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">
                {editing ? "Edit Event" : "Create New Event"}
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
                  Title *
                </label>
                <input
                  type="text"
                  {...register("title", { required: true })}
                  placeholder="e.g. Annual STEM Science Fair"
                  className="input-field text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Event Date
                  </label>
                  <input
                    type="date"
                    {...register("event_date")}
                    className="input-field text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select {...register("category")} className="input-field text-xs">
                    <option value="Academic">Academic</option>
                    <option value="Science & Tech">Science & Tech</option>
                    <option value="Sports">Sports</option>
                    <option value="Arts & Culture">Arts & Culture</option>
                    <option value="Commencement">Commencement</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Status
                </label>
                <select {...register("status")} className="input-field text-xs">
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Cover Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  {...register("image")}
                  className="input-field text-xs file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-[11px] file:bg-blue-50 file:text-primary dark:file:bg-blue-950 dark:file:text-blue-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Content & Details
                </label>
                <textarea
                  rows={4}
                  {...register("content")}
                  placeholder="Write the full event briefing..."
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
                  {submitting ? "Saving..." : editing ? "Update Event" : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEvents;
