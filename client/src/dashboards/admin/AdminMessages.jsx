/**
 * Admin Messages — View contact form submissions
 */
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../../layouts/DashboardLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import Pagination from "../../components/Pagination";
import { getContactMessages, deleteContactMessage } from "../../services/authService";
import { formatDate } from "../../utils/helpers";

const adminLinks = [
  { to: "/admin", label: "Dashboard", icon: "📊", end: true },
  { to: "/admin/users", label: "Users", icon: "👥" },
  { to: "/admin/schedules", label: "Schedules", icon: "📅" },
  { to: "/admin/announcements", label: "Announcements", icon: "📢" },
  { to: "/admin/messages", label: "Messages", icon: "✉️" },
  { to: "/admin/profile", label: "Profile", icon: "👤" },
];

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
    <DashboardLayout links={adminLinks} title="Contact Messages">
      {loading ? (
        <LoadingSpinner className="py-20" />
      ) : messages.length === 0 ? (
        <p className="text-center text-gray-500">No messages yet.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((m) => (
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
    </DashboardLayout>
  );
};

export default AdminMessages;
