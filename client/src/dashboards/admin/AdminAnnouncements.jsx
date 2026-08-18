/**
 * Admin Announcements — CRUD for school announcements
 */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";
import Pagination from "../../components/Pagination";
import { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from "../../services/authService";
import { formatDate } from "../../utils/helpers";

const PAGE_SIZE = 9;

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { register, handleSubmit, reset } = useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAnnouncements({ page, limit: PAGE_SIZE });
      setAnnouncements(res.data.data.announcements);
      setTotalPages(res.data.data.pagination?.totalPages || 1);
    } catch {
      toast.error("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page]);

  useEffect(() => { setPage(1); }, [search]);

  const filtered = announcements.filter((a) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return a.title?.toLowerCase().includes(q) || a.content?.toLowerCase().includes(q);
  });

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
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search announcements..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>
        <button onClick={openCreate} className="btn-primary whitespace-nowrap">+ New Announcement</button>
      </div>

      {loading ? (
        <LoadingSpinner className="py-20" />
      ) : filtered.length === 0 ? (
        <p className="py-12 text-center text-slate-400">{search ? "No announcements match your search." : "No announcements yet."}</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((a) => (
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

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

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
    </>
  );
};

export default AdminAnnouncements;