/**
 * Announcements Page — Public view of school announcements
 */
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/PageHeader";
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
      <PageHeader
        badge="News & Updates"
        title="Announcements"
        subtitle="Stay updated with the latest school news and events"
      />

      <section className="mx-auto max-w-7xl px-4 py-16 md:py-20">
        {loading ? (
          <SkeletonLoader count={3} />
        ) : announcements.length === 0 ? (
          <div className="card py-16 text-center">
            <p className="text-4xl">📢</p>
            <p className="mt-4 font-medium text-slate-600 dark:text-slate-400">No announcements yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {announcements.map((a) => (
              <article key={a.id} className="card card-hover flex flex-col">
                <div className="mb-3 inline-flex w-fit rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
                  Announcement
                </div>
                <h2 className="mb-2 font-display text-lg font-semibold text-slate-900 dark:text-white">{a.title}</h2>
                <p className="mb-4 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-3 dark:text-slate-400">{a.content}</p>
                <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500 dark:border-slate-800">
                  <span className="font-medium">By {a.author_name || "Staff"}</span>
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
