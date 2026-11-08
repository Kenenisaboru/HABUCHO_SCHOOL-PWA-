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
import {
  getAdmissions,
  updateAdmissionStatus,
} from "../../services/admissionService";

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
    const matchesStatus =
      statusFilter === "all" || app.status === statusFilter;
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
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-primary dark:bg-blue-950/50 dark:text-blue-400">
            <Clock className="h-3 w-3" /> Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            Admission Applications Review
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Evaluate prospective student submissions, inspect attached certificates, and update admission status.
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
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

        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 dark:border-slate-800 dark:bg-slate-900 w-full sm:w-64">
          <Search className="h-4 w-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search applicant or ref #..."
            className="w-full text-xs text-slate-900 focus:outline-none dark:text-white bg-transparent"
          />
        </div>
      </div>

      {/* Applications Table */}
      {loading ? (
        <LoadingSpinner className="py-16" />
      ) : filtered.length === 0 ? (
        <div className="card text-center py-14">
          <GraduationCap className="mx-auto h-10 w-10 text-slate-400 mb-2" />
          <p className="text-xs text-slate-500">No admission applications found matching this criteria.</p>
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
                    <span className="font-mono font-bold text-primary dark:text-blue-400">
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
                    {new Date(app.created_at || Date.now()).toLocaleDateString("en-US", { dateStyle: "medium" })}
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(app.status)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="btn-outline px-2.5 py-1 text-xs gap-1"
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

      {totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      )}

      {/* Inspect / Decision Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="card max-w-2xl w-full p-6 bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div>
                <span className="font-mono text-xs font-bold text-primary dark:text-blue-400">
                  {selectedApp.reference_number}
                </span>
                <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white mt-0.5">
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
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <span className="text-slate-500 font-medium">Current Evaluation Status:</span>
                <div>{getStatusBadge(selectedApp.status)}</div>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 block mb-0.5">Grade Applying For</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{selectedApp.grade_level}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Date of Birth & Gender</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {selectedApp.date_of_birth ? new Date(selectedApp.date_of_birth).toLocaleDateString() : "N/A"} ({selectedApp.gender})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Parent / Guardian</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {selectedApp.parent_name} ({selectedApp.parent_phone})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Previous School</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{selectedApp.previous_school || "N/A"}</span>
                </div>
              </div>

              {selectedApp.address && (
                <div>
                  <span className="text-slate-400 block mb-0.5">Residential Address</span>
                  <p className="text-slate-700 dark:text-slate-300">{selectedApp.address}</p>
                </div>
              )}

              {selectedApp.message && (
                <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/40">
                  <span className="text-primary dark:text-blue-400 font-bold block mb-1">
                    Student Statement of Intent:
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed italic">
                    &quot;{selectedApp.message}&quot;
                  </p>
                </div>
              )}

              {/* Uploaded Documents */}
              {selectedApp.document_paths && selectedApp.document_paths.length > 0 && (
                <div>
                  <span className="text-slate-400 font-semibold block mb-2">Uploaded Certificates & Transcripts</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedApp.document_paths.map((docPath, i) => {
                      const filename = docPath.split(/[\\/]/).pop();
                      return <a
                        key={i}
                        href={`${API_BASE_URL}/admissions/${selectedApp.id}/documents/${encodeURIComponent(filename)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-primary hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-blue-400"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        <span>Document #{i + 1}</span>
                        <ExternalLink className="h-3 w-3 opacity-60" />
                      </a>
                    })}
                  </div>
                </div>
              )}

              {/* Committee Decision Actions */}
              <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                  Update Application Status:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    disabled={updatingId === selectedApp.id}
                    onClick={() => handleStatusChange(selectedApp.id, "approved")}
                    className="btn-primary bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs gap-1.5"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Approve Admission</span>
                  </button>
                  <button
                    disabled={updatingId === selectedApp.id}
                    onClick={() => handleStatusChange(selectedApp.id, "under_review")}
                    className="btn-outline px-4 py-2 text-xs gap-1.5 text-amber-600 border-amber-300 hover:bg-amber-50"
                  >
                    <Clock className="h-4 w-4" />
                    <span>Mark Under Review</span>
                  </button>
                  <button
                    disabled={updatingId === selectedApp.id}
                    onClick={() => handleStatusChange(selectedApp.id, "rejected")}
                    className="btn-outline px-4 py-2 text-xs gap-1.5 text-red-600 border-red-300 hover:bg-red-50"
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
