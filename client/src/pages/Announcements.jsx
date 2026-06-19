/**
 * Announcements Page — Public view of school announcements
 */
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import MainLayout from "../layouts/MainLayout";
import SkeletonLoader from "../components/SkeletonLoader";
import Pagination from "../components/Pagination";
import { getAnnouncements } from "../services/authService";
import { formatDate } from "../utils/helpers";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setAnnouncements([
            { id: 1, title: "Welcome to New Academic Year", content: "We warmly welcome all students and staff to the 2025/2026 academic year.", author_name: "Admin", created_at: new Date().toISOString() },
            { id: 2, title: "Parent-Teacher Meeting", content: "Parent-teacher meetings will be held on July 15, 2025.", author_name: "Sarah Johnson", created_at: new Date().toISOString() },
          ]);
          setLoading(false);
          return;
        }
        const res = await getAnnouncements({ page, limit: 6 });
        setAnnouncements(res.data.data.announcements);
        setTotalPages(res.data.data.pagination.totalPages);
      } catch {
        toast.error("Failed to load announcements");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page]);

  return (
    <MainLayout>
      <section className="bg-gradient-to-r from-blue-600 to-emerald-500 px-4 py-12 text-white">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="text-3xl font-bold">Announcements</h1>
          <p className="mt-2 text-blue-100">Stay updated with the latest school news</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        {loading ? (
          <SkeletonLoader count={3} />
        ) : announcements.length === 0 ? (
          <p className="text-center text-gray-500">No announcements yet.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {announcements.map((a) => (
              <article key={a.id} className="card">
                <h2 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">{a.title}</h2>
                <p className="mb-4 text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{a.content}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>By {a.author_name || "Staff"}</span>
                  <span>{formatDate(a.created_at)}</span>
                </div>
              </article>
            ))}
          </div>
        )}
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </section>
    </MainLayout>
  );
};

export default Announcements;
