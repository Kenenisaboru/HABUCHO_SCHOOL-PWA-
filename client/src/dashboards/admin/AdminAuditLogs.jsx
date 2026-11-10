/**
 * Admin Audit Logs
 * ----------------
 * Compliance and system activity log viewer.
 * Tracks grade modifications, admission updates, and administrative actions.
 */
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAuditLogs } from "../../services/authService";
import LoadingSpinner from "../../components/LoadingSpinner";
import PageHeader from "../../components/PageHeader";
import Pagination from "../../components/Pagination";

const ACTION_LABELS = {
  GRADE_BULK_UPSERT: { label: "Grade Update", badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300" },
  ADMISSION_STATUS_UPDATE: { label: "Admission Review", badge: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300" },
  USER_ROLE_CHANGE: { label: "Role Changed", badge: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300" },
};

const AdminAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const [selectedAction, setSelectedAction] = useState("");

  const fetchLogs = async (currentPage = 1, actionFilter = "") => {
    setLoading(true);
    try {
      const res = await getAuditLogs({
        page: currentPage,
        limit: 15,
        action: actionFilter || undefined,
      });
      const data = res.data?.data || {};
      setLogs(data.logs || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalLogs(data.pagination?.total || 0);
      setPage(currentPage);
    } catch {
      toast.error("Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "System Audit Logs — Habucho School Admin";
    fetchLogs(1, selectedAction);
  }, [selectedAction]);

  const handleActionChange = (e) => {
    setSelectedAction(e.target.value);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Security & System Audit Logs"
        subtitle={`Immutable record of grading, admission decisions, and administrative actions (${totalLogs} total)`}
      />

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Filter Action:</label>
          <select
            value={selectedAction}
            onChange={handleActionChange}
            className="input-field max-w-xs text-xs py-1.5"
          >
            <option value="">All Actions</option>
            <option value="GRADE_BULK_UPSERT">Grade Updates</option>
            <option value="ADMISSION_STATUS_UPDATE">Admission Updates</option>
          </select>
        </div>

        <button
          type="button"
          onClick={() => fetchLogs(page, selectedAction)}
          className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1.5 cursor-pointer"
        >
          <span>🔄</span> Refresh Logs
        </button>
      </div>

      {/* Logs Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden dark:border-slate-800 dark:bg-slate-900">
        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner />
          </div>
        ) : logs.length === 0 ? (
          <div className="py-16 text-center text-slate-500 dark:text-slate-400">
            <p className="text-3xl mb-2">🛡️</p>
            <p className="font-semibold">No audit events recorded yet.</p>
            <p className="text-xs mt-1">Actions such as teacher score updates and admission reviews will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-800 uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Target</th>
                  <th className="py-3 px-4">Event Details</th>
                  <th className="py-3 px-4">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {logs.map((log) => {
                  const meta = ACTION_LABELS[log.action] || {
                    label: log.action,
                    badge: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
                  };
                  return (
                    <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 whitespace-nowrap text-slate-500 dark:text-slate-400 font-mono">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-900 dark:text-white">
                          {log.user_email || `User #${log.user_id}`}
                        </div>
                        <div className="text-[10px] uppercase font-bold text-slate-400">{log.user_role || "system"}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full font-bold text-[11px] ${meta.badge}`}>
                          {meta.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300 capitalize">
                        {log.entity_type} {log.entity_id ? `#${log.entity_id}` : ""}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-600 dark:text-slate-400 max-w-xs truncate">
                        {typeof log.details === "object" ? JSON.stringify(log.details) : String(log.details || "-")}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">
                        {log.ip_address || "internal"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(p) => fetchLogs(p, selectedAction)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAuditLogs;

