/**
 * Admin Approval Notifications
 * ----------------------------
 * Real-time notification bell for administrators.
 * Alerts when teachers submit grade batches for approval, with 1-click batch approval.
 */
import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { Bell, CheckCircle2, XCircle, Clock, Check, AlertCircle } from "lucide-react";
import {
  getPendingApprovalsCount,
  approveGradesBatch,
  rejectGradesBatch,
} from "../services/authService";

const AdminApprovalNotifications = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [pendingList, setPendingList] = useState([]);
  const dropdownRef = useRef(null);

  const fetchPending = async () => {
    try {
      const res = await getPendingApprovalsCount();
      setPendingList(res.data?.data || []);
    } catch {
      // Ignore background poll errors
    }
  };

  useEffect(() => {
    fetchPending();
    const interval = setInterval(fetchPending, 25000); // 25s polling for real-time responsiveness

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      clearInterval(interval);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleApprove = async (batch) => {
    setActionLoading(true);
    try {
      await approveGradesBatch({
        academic_year: batch.academic_year,
        semester: batch.semester,
        subject: batch.subject,
        grade_level: batch.grade_level,
        section: batch.section,
      });
      toast.success(
        `Approved ${batch.subject} (Grade ${batch.grade_level}${batch.section})! Rankings recalculated.`
      );
      await fetchPending();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to approve batch");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (batch) => {
    const reason = window.prompt("Reason for rejection / feedback for teacher:", "Please review score entries.");
    if (!reason) return;

    setActionLoading(true);
    try {
      await rejectGradesBatch({
        academic_year: batch.academic_year,
        semester: batch.semester,
        subject: batch.subject,
        grade_level: batch.grade_level,
        section: batch.section,
        reason,
      });
      toast.success(`Batch returned to teacher with feedback.`);
      await fetchPending();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reject batch");
    } finally {
      setActionLoading(false);
    }
  };

  const pendingCount = pendingList.length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => {
          setOpen(!open);
          if (!open) fetchPending();
        }}
        className="relative flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/60"
        aria-label="Pending grade approval notifications"
      >
        <Bell className="h-4 w-4" />
        {pendingCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-black text-white shadow-xs animate-pulse">
            {pendingCount > 9 ? "9+" : pendingCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-84 sm:w-96 rounded-2xl border border-slate-200/80 bg-white shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900 z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-ping" />
              <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                Pending Grade Approvals
              </h3>
            </div>
            <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-black text-rose-700 dark:bg-rose-950/60 dark:text-rose-400">
              {pendingCount} Pending
            </span>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {pendingCount === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-emerald-500/80" />
                <p className="font-semibold text-slate-600 dark:text-slate-300">All submissions up to date</p>
                <p className="mt-0.5 text-[11px]">No batches currently waiting for administrative sign-off.</p>
              </div>
            ) : (
              pendingList.map((batch, idx) => (
                <div key={idx} className="p-3.5 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        Grade {batch.grade_level}{batch.section} • {batch.subject}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Submitted by: <strong className="text-slate-700 dark:text-slate-200">{batch.teacher_name || "Teacher"}</strong>
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {batch.academic_year} {batch.semester}
                        </span>
                        <span>•</span>
                        <span>{batch.student_count || batch.total_scores} students</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-3 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleReject(batch)}
                      disabled={actionLoading}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 dark:border-slate-700 dark:text-rose-400 dark:hover:bg-rose-950/40 disabled:opacity-50"
                    >
                      <XCircle className="h-3.5 w-3.5" /> Reject
                    </button>
                    <button
                      onClick={() => handleApprove(batch)}
                      disabled={actionLoading}
                      className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1 text-[11px] font-bold text-white shadow-xs hover:bg-emerald-700 disabled:opacity-50"
                    >
                      <Check className="h-3.5 w-3.5" /> Approve & Rank
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApprovalNotifications;
