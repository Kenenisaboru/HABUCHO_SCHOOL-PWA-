/**
 * Announcements Page — Public view with filter tabs, priority badges,
 * rich card layout, and animated empty state
 */
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/PageHeader";
import SkeletonLoader from "../components/SkeletonLoader";
import Pagination from "../components/Pagination";
import { getAnnouncements } from "../services/authService";
import { formatDate } from "../utils/helpers";

const MOCK_ANNOUNCEMENTS = [
  {
    id: 1,
    title: "Welcome to New Academic Year 2025/2026",
    content: "We warmly welcome all students, parents, and staff to the 2025/2026 academic year. This year promises to be filled with growth, learning, and achievement.",
    author_name: "Principal Bekele",
    created_at: new Date().toISOString(),
    priority: "important",
  },
  {
    id: 2,
    title: "Parent-Teacher Meeting — July 15",
    content: "Parent-teacher meetings will be held on July 15, 2025 from 9:00 AM to 3:00 PM. All parents are encouraged to attend to discuss their child's academic progress.",
    author_name: "Administration",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    priority: "general",
  },
  {
    id: 3,
    title: "National Exam Preparation Workshop",
    content: "A special exam preparation workshop will be held for all Grade 12 students starting next Monday. Attendance is mandatory for all students.",
    author_name: "Academic Dept.",
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    priority: "urgent",
  },
];

const priorityConfig = {
  urgent: { label: "Urgent", cls: "badge-red", dot: "bg-red-400" },
  important: { label: "Important", cls: "badge-amber", dot: "bg-amber-400" },
  general: { label: "General", cls: "badge-emerald", dot: "bg-emerald-400" },
};

const filters = ["All", "General", "Important", "Urgent"];

const AnnouncementCard = ({ a, index }) => {
  const priority = priorityConfig[a.priority] || priorityConfig.general;
  const readTime = Math.max(1, Math.ceil(a.content.split(" ").length / 200));

  return (
    <article
      className="group card card-hover flex flex-col relative overflow-hidden"
      style={{
        opacity: 1,
        animation: `scale-in 0.4s cubic-bezier(0.34,1.56,0.64,1) ${index * 60}ms both`,
      }}
    >
      {/* Priority accent bar */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl ${
          a.priority === "urgent" ? "bg-linear-to-r from-red-500 to-red-400" :
          a.priority === "important" ? "bg-linear-to-r from-amber-500 to-amber-400" :
          "bg-linear-to-r from-emerald-500 to-emerald-400"
        }`}
      />

      <div className="mb-4 flex items-center justify-between pt-1">
        <span className={priority.cls}>
          <span className={`h-1.5 w-1.5 rounded-full ${priority.dot} animate-pulse`} />
          {priority.label}
        </span>
        <span className="text-xs text-slate-400">{readTime} min read</span>
      </div>

      <h2 className="mb-3 font-display text-lg font-bold text-slate-900 leading-snug group-hover:text-primary transition-colors dark:text-white dark:group-hover:text-emerald-400">
        {a.title}
      </h2>
      <p className="mb-5 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-3 dark:text-slate-400">
        {a.content}
      </p>

      <div className="flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
            style={{ background: "linear-gradient(135deg, #059669, #0891b2)" }}>
            {(a.author_name || "S").charAt(0)}
          </div>
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {a.author_name || "Staff"}
          </span>
        </div>
        <span className="flex items-center gap-1.5 text-xs text-slate-400">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {formatDate(a.created_at)}
        </span>
      </div>
    </article>
  );
};

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setAnnouncements(MOCK_ANNOUNCEMENTS);
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

  const filtered = activeFilter === "All"
    ? announcements
    : announcements.filter((a) => (a.priority || "general").toLowerCase() === activeFilter.toLowerCase());

  return (
    <MainLayout>
      <PageHeader
        badge="News & Updates"
        title="School Announcements"
        subtitle="Stay informed with the latest school news, events, and important notices"
      />

      <section className="mx-auto max-w-7xl px-4 py-20 md:py-24">
        {/* Filter tabs */}
        <div className="mb-10 flex flex-wrap items-center gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                activeFilter === f
                  ? "bg-primary text-white shadow-md shadow-emerald-500/20"
                  : "bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-slate-300 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700 dark:hover:ring-slate-600"
              }`}
            >
              {f}
              {f !== "All" && (
                <span className={`ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                  activeFilter === f ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                }`}>
                  {announcements.filter((a) => (a.priority || "general").toLowerCase() === f.toLowerCase()).length || "0"}
                </span>
              )}
            </button>
          ))}
          <span className="ml-auto text-sm text-slate-400">
            {filtered.length} announcement{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {loading ? (
          <SkeletonLoader count={3} />
        ) : filtered.length === 0 ? (
          <div className="card py-20 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-4xl dark:bg-slate-800">
              📢
            </div>
            <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">No announcements yet</h3>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              {activeFilter === "All" ? "Check back soon for updates." : `No ${activeFilter.toLowerCase()} announcements found.`}
            </p>
            {activeFilter !== "All" && (
              <button
                onClick={() => setActiveFilter("All")}
                className="btn-outline mt-6 mx-auto"
              >
                View All Announcements
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((a, i) => (
              <AnnouncementCard key={a.id} a={a} index={i} />
            ))}
          </div>
        )}

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </section>
    </MainLayout>
  );
};

export default Announcements;
