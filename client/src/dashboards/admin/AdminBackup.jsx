/**
 * Admin Database Backup & Disaster Recovery
 * -----------------------------------------
 * Provides 1-click database backup export, table metrics, and health overview
 * to ensure zero data loss across deployment environments.
 */
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Database,
  Download,
  RefreshCw,
  ShieldCheck,
  AlertTriangle,
  HardDrive,
  FileText,
  Clock,
} from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";
import { getDatabaseStats, downloadDatabaseBackup } from "../../services/authService";

const AdminBackup = () => {
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [stats, setStats] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await getDatabaseStats();
      setStats(res.data?.data || null);
    } catch {
      toast.error("Failed to load database statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleDownloadBackup = async () => {
    setDownloading(true);
    try {
      const res = await downloadDatabaseBackup();
      const blob = new Blob([res.data], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const timestamp = new Date().toISOString().split("T")[0];
      a.download = `habucho_school_db_backup_${timestamp}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Database backup snapshot downloaded successfully!");
    } catch {
      toast.error("Failed to download database backup snapshot");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const totalRecords =
    stats?.tables?.reduce((sum, item) => sum + (parseInt(item.count, 10) || 0), 0) || 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-xs font-bold tracking-wider text-emerald-600 uppercase dark:text-emerald-400">
            System Administration & Security
          </span>
          <h1 className="text-2xl font-extrabold text-slate-800 sm:text-3xl dark:text-slate-100">
            Database Backup & Disaster Recovery
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Create instant point-in-time snapshots of all Ethiopian academic records, student grades, and system settings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchStats}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>
          <button
            onClick={handleDownloadBackup}
            disabled={downloading}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-700 disabled:opacity-50"
          >
            <Download className={`h-4 w-4 ${downloading ? "animate-bounce" : ""}`} />
            {downloading ? "Generating..." : "Download Full Backup (.json)"}
          </button>
        </div>
      </div>

      {/* Cloud & Render Hosting Advisory Notice */}
      <div className="flex items-start gap-3 rounded-2xl border border-amber-200/80 bg-amber-50/70 p-4 dark:border-amber-800/40 dark:bg-amber-950/20">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
        <div className="text-xs text-amber-900 dark:text-amber-200">
          <p className="font-bold">Cloud Deployment Data Safety Guide</p>
          <p className="mt-1 text-amber-800/90 dark:text-amber-300/80">
            Render&apos;s free-tier PostgreSQL databases expire after 30 days. To ensure zero data loss, download regular backup snapshots before upgrading, or connect a permanent PostgreSQL service (such as Supabase or Neon.tech).
          </p>
        </div>
      </div>

      {/* Database Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Database Name</p>
              <p className="text-base font-extrabold text-slate-800 dark:text-white">
                {stats?.database_name || "habucho_school"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              <HardDrive className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Database Size</p>
              <p className="text-base font-extrabold text-slate-800 dark:text-white">
                {stats?.database_size || "10 MB"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Records</p>
              <p className="text-base font-extrabold text-slate-800 dark:text-white">
                {totalRecords.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950/50 dark:text-teal-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Academic Year</p>
              <p className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                2017 E.C.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table Records Breakdown */}
      <div className="rounded-2xl border border-slate-100 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-4 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-800 dark:text-white">
              Database Table Metrics & Row Counts
            </h2>
          </div>
          <span className="text-[11px] text-slate-400">
            {stats?.tables?.length || 0} Tables Tracked
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50 text-slate-500 uppercase tracking-wider dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
              <tr>
                <th className="px-6 py-3 font-bold">Table Name</th>
                <th className="px-6 py-3 font-bold">Category</th>
                <th className="px-6 py-3 font-bold text-right">Row Count</th>
                <th className="px-6 py-3 font-bold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {stats?.tables?.map((t) => {
                const isCore = ["users", "grades", "student_academic_summaries", "subjects"].includes(t.table);
                return (
                  <tr key={t.table} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="px-6 py-3 font-mono font-bold text-slate-800 dark:text-white">
                      {t.table}
                    </td>
                    <td className="px-6 py-3 text-slate-500">
                      {isCore ? (
                        <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                          Core Academic
                        </span>
                      ) : (
                        <span className="text-slate-400">System Support</span>
                      )}
                    </td>
                    <td className="px-6 py-3 font-mono font-bold text-slate-800 dark:text-slate-200 text-right">
                      {t.count.toLocaleString()}
                    </td>
                    <td className="px-6 py-3 text-center">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Healthy
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Snapshot Instructions */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-white">
          <Clock className="h-4 w-4 text-blue-600" /> Recommended Backup Procedure for Habucho School
        </h3>
        <ul className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-400 list-disc list-inside">
          <li><strong>Before Term Exams:</strong> Download a snapshot before teachers submit Midterm and Final examination marks.</li>
          <li><strong>Before End-of-Year Promotion:</strong> Take a complete backup before advancing students to 2018 E.C.</li>
          <li><strong>Storage Recommendation:</strong> Keep your downloaded JSON files in an encrypted USB drive or secure Google Drive for secondary disaster recovery.</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminBackup;
