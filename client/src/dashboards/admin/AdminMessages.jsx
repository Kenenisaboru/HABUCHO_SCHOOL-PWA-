/**
 * Admin Messages — View contact form submissions
 */
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";
import Pagination from "../../components/Pagination";
import { getContactMessages, deleteContactMessage } from "../../services/authService";
import { formatDate } from "../../utils/helpers";


const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getContactMessages({ page, limit: 10 });
      setMessages(res.data.data.messages);
      setTotalPages(res.data.data.pagination.totalPages);
    } catch {
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page]);
  useEffect(() => { setPage(1); }, [search]);

  const filtered = messages.filter((m) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      m.name?.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q) ||
      m.message?.toLowerCase().includes(q)
    );
  });

  const handleDelete = async (id) => {
    if (!confirm("Delete this message?")) return;
    try {
      await deleteContactMessage(id);
      toast.success("Message deleted");
      fetchData();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <>
      <div className="mb-4">
        <div className="relative max-w-sm">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, email, or message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner className="py-20" />
      ) : filtered.length === 0 ? (
        <p className="py-12 text-center text-slate-400">{search ? "No messages match your search." : "No messages yet."}</p>
      ) : (
        <div className="space-y-4">
          {filtered.map((m) => (
            <div key={m.id} className="card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">{m.name}</p>
                  <p className="text-sm text-blue-600">{m.email}</p>
                </div>
                <span className="text-xs text-gray-500">{formatDate(m.created_at)}</span>
              </div>
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">{m.message}</p>
              <button onClick={() => handleDelete(m.id)} className="mt-3 text-sm text-red-500 hover:underline">
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </>
  );
};

export default AdminMessages;