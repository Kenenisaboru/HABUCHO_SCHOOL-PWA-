import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  GraduationCap,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Search,
  Eye,
  Calendar,
  User,
  Phone,
  Mail,
  Home,
  School,
  X,
  ExternalLink,
} from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";
import Pagination from "../../components/Pagination";
import StatCard from "../../components/StatCard";
import { getAdmissions, updateAdmissionStatus } from "../../services/admissionService";

const PAGE_SIZE = 10;
const API_BASE_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");

const AdminAdmissions = () => {
  const [applications, setApplications] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedApp, setSelectedApp] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await getAdmissions(page, PAGE_SIZE);
      const data = res.data?.data || res.data;
      setApplications(data.applications || []);
      setTotalCount(data.pagination?.total || (data.applications || []).length);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch {
      toast.error("Failed to load admission applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [page]);

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await updateAdmissionStatus(id, newStatus);
      toast.success(`Application marked as ${newStatus}`);
      if (selectedApp && selectedApp.id === id) {
        setSelectedApp({ ...selectedApp, status: newStatus });
      }
      fetchApplications();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = applications.filter((app) => {
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    if (!matchesStatus) return false;

    if (!search) return true;
    const q = search.toLowerCase();
    return (
      app.applicant_name?.toLowerCase().includes(q) ||
      app.reference_number?.toLowerCase().includes(q) ||
      app.email?.toLowerCase().includes(q) ||
      app.previous_school?.toLowerCase().includes(q)
    );
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
            <CheckCircle2 className="h-3 w-3" /> Approved
          </span>
        );
      case "under_review":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
            <Clock className="h-3 w-3" /> Under Review
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-[11px] font-bold text-red-600 dark:bg-red-950/50 dark:text-red-400">
            <XCircle className="h-3 w-3" /> Rejected
          </span>
        );
      default:
        return (
          <span className="text-primary inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold dark:bg-blue-950/50 dark:text-blue-400">
            <Clock className="h-3 w-3" /> Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            Admission Applications Review
          </h1>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Evaluate prospective student submissions, inspect attached certificates, and update
            admission status.
          </p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          icon={<GraduationCap />}
          title="Total Applications"
          value={totalCount}
          color="blue"
        />
        <StatCard
          icon={<Clock />}
          title="Pending Review"
          value={applications.filter((a) => a.status === "pending").length}
          color="orange"
        />
        <StatCard
          icon={<CheckCircle2 />}
          title="Approved"
          value={applications.filter((a) => a.status === "approved").length}
          color="emerald"
        />
        <StatCard
          icon={<XCircle />}
          title="Rejected"
          value={applications.filter((a) => a.status === "rejected").length}
          color="orange"
        />
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
        <div className="flex w-full flex-wrap gap-1.5 sm:w-auto">
          {["all", "pending", "under_review", "approved", "rejected"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold capitalize transition-all ${
                statusFilter === st
                  ? "bg-primary text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              {st.replace("_", " ")}
            </button>
          ))}
        </div>

        <div className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 sm:w-64 dark:border-slate-800 dark:bg-slate-900">
          <Search className="h-4 w-4 shrink-0 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search applicant or ref #..."
            className="w-full bg-transparent text-xs text-slate-900 focus:outline-none dark:text-white"
          />
        </div>
      </div>

      {/* Applications Table */}
      {loading ? (
        <LoadingSpinner className="py-16" />
      ) : filtered.length === 0 ? (
        <div className="card py-14 text-center">
          <GraduationCap className="mx-auto mb-2 h-10 w-10 text-slate-400" />
          <p className="text-xs text-slate-500">
            No admission applications found matching this criteria.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50 font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-300">
              <tr>
                <th className="px-4 py-3">Reference ID</th>
                <th className="px-4 py-3">Applicant Name</th>
                <th className="px-4 py-3">Grade Level</th>
                <th className="px-4 py-3">Submitted</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Review Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="px-4 py-3">
                    <span className="text-primary font-mono font-bold dark:text-blue-400">
                      {app.reference_number}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {app.applicant_name}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {app.email} • {app.phone}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                    {app.grade_level || "Grade 11"}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {app.created_at ? new Date(app.created_at).toLocaleDateString("en-US", {
                      dateStyle: "medium",
                    }) : "N/A"}
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(app.status)}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="btn-outline gap-1 px-2.5 py-1 text-xs"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />}

      {/* Inspect / Decision Modal */}
      {selectedApp && (
        <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="card max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div>
                <span className="text-primary font-mono text-xs font-bold dark:text-blue-400">
                  {selectedApp.reference_number}
                </span>
                <h2 className="font-display mt-0.5 text-lg font-bold text-slate-900 dark:text-white">
                  {selectedApp.applicant_name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              {/* Status Header */}
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                <span className="font-medium text-slate-500">Current Evaluation Status:</span>
                <div>{getStatusBadge(selectedApp.status)}</div>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="mb-0.5 block text-slate-400">Grade Applying For</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {selectedApp.grade_level}
                  </span>
                </div>
                <div>
                  <span className="mb-0.5 block text-slate-400">Date of Birth & Gender</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {selectedApp.date_of_birth
                      ? new Date(selectedApp.date_of_birth).toLocaleDateString()
                      : "N/A"}{" "}
                    ({selectedApp.gender})
                  </span>
                </div>
                <div>
                  <span className="mb-0.5 block text-slate-400">Parent / Guardian</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {selectedApp.parent_name} ({selectedApp.parent_phone})
                  </span>
                </div>
                <div>
                  <span className="mb-0.5 block text-slate-400">Previous School</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {selectedApp.previous_school || "N/A"}
                  </span>
                </div>
              </div>

              {selectedApp.address && (
                <div>
                  <span className="mb-0.5 block text-slate-400">Residential Address</span>
                  <p className="text-slate-700 dark:text-slate-300">{selectedApp.address}</p>
                </div>
              )}

              {selectedApp.message && (
                <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3 dark:border-blue-900/40 dark:bg-blue-950/20">
                  <span className="text-primary mb-1 block font-bold dark:text-blue-400">
                    Student Statement of Intent:
                  </span>
                  <p className="leading-relaxed text-slate-700 italic dark:text-slate-300">
                    &quot;{selectedApp.message}&quot;
                  </p>
                </div>
              )}

              {/* Uploaded Documents */}
              {selectedApp.document_paths && selectedApp.document_paths.length > 0 && (
                <div>
                  <span className="mb-2 block font-semibold text-slate-400">
                    Uploaded Certificates & Transcripts
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedApp.document_paths.map((docPath, i) => {
                      const filename = docPath.split(/[\\/]/).pop();
                      return (
                        <a
                          key={i}
                          href={`${API_BASE_URL}/admissions/${selectedApp.id}/documents/${encodeURIComponent(filename)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-blue-400"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          <span>Document #{i + 1}</span>
                          <ExternalLink className="h-3 w-3 opacity-60" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Committee Decision Actions */}
              <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
                <span className="mb-2 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Update Application Status:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    disabled={updatingId === selectedApp.id}
                    onClick={() => handleStatusChange(selectedApp.id, "approved")}
                    className="btn-primary gap-1.5 bg-emerald-600 px-4 py-2 text-xs hover:bg-emerald-700"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Approve Admission</span>
                  </button>
                  <button
                    disabled={updatingId === selectedApp.id}
                    onClick={() => handleStatusChange(selectedApp.id, "under_review")}
                    className="btn-outline gap-1.5 border-amber-300 px-4 py-2 text-xs text-amber-600 hover:bg-amber-50"
                  >
                    <Clock className="h-4 w-4" />
                    <span>Mark Under Review</span>
                  </button>
                  <button
                    disabled={updatingId === selectedApp.id}
                    onClick={() => handleStatusChange(selectedApp.id, "rejected")}
                    className="btn-outline gap-1.5 border-red-300 px-4 py-2 text-xs text-red-600 hover:bg-red-50"
                  >
                    <XCircle className="h-4 w-4" />
                    <span>Reject Application</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAdmissions;
