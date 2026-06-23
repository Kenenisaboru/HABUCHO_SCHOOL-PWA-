/**
 * Student Dashboard — Advanced Pro-Level Student Portal
 */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import StatCard from "../../components/StatCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import useAuthStore from "../../context/authStore";
import {
  getGrades,
  getAnnouncements,
  getSchedules,
  submitContact,
} from "../../services/authService";
import { getGradeLetter, formatTime, exportGradesToPDF } from "../../utils/helpers";

const StudentDashboard = () => {
  const { user } = useAuthStore();
  const [grades, setGrades] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // Live ticking date-time
  const [currentTime, setCurrentTime] = useState(new Date());

  const { register: registerFeedback, handleSubmit: handleSubmitFeedback, reset: resetFeedback } = useForm();

  const fetchData = async () => {
    try {
      const [gradeRes, annRes, schedRes] = await Promise.all([
        getGrades({ limit: 50 }),
        getAnnouncements({ limit: 5 }),
        getSchedules({ limit: 50 }),
      ]);
      setGrades(gradeRes.data.data.grades || []);
      setAnnouncements(annRes.data.data.announcements || []);
      setSchedules(schedRes.data.data.schedules || []);
    } catch (err) {
      toast.error("Failed to load dashboard records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Clock ticker
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000);

    return () => clearInterval(timer);
  }, []);

  // Quick Action: Send feedback
  const onFeedbackSubmit = async (data) => {
    try {
      await submitContact({
        name: user.full_name || "Student",
        email: user.email,
        message: data.message,
      });
      toast.success("Feedback submitted successfully!");
      setShowFeedbackModal(false);
      resetFeedback();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit feedback");
    }
  };

  // Check if a class is active right now
  const isClassActive = (sched) => {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const currentDayName = daysOfWeek[currentTime.getDay()];

    if (sched.day.toLowerCase() !== currentDayName.toLowerCase()) {
      return false;
    }

    // Current hours & minutes
    const currentHours = currentTime.getHours();
    const currentMinutes = currentTime.getMinutes();
    const currentTotalMinutes = currentHours * 60 + currentMinutes;

    // Class times
    const [startH, startM] = sched.start_time.split(":");
    const [endH, endM] = sched.end_time.split(":");

    const startTotalMinutes = parseInt(startH, 10) * 60 + parseInt(startM, 10);
    const endTotalMinutes = parseInt(endH, 10) * 60 + parseInt(endM, 10);

    return currentTotalMinutes >= startTotalMinutes && currentTotalMinutes <= endTotalMinutes;
  };

  if (loading) return <LoadingSpinner className="py-20" />;

  // Calculate dynamic stats
  const totalSubjects = grades.length;
  const avgScore = totalSubjects > 0
    ? (grades.reduce((sum, g) => sum + parseFloat(g.score), 0) / totalSubjects).toFixed(1)
    : null;

  // Standings Badge
  const getAcademicStanding = (avg) => {
    if (avg === null) return { text: "No Grades Yet", color: "bg-slate-100 text-slate-700 border-slate-200" };
    const num = parseFloat(avg);
    if (num >= 90) return { text: "Dean's List 🌟", color: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-900" };
    if (num >= 75) return { text: "Good Standing 👍", color: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-900" };
    if (num >= 50) return { text: "Satisfactory 📖", color: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-900" };
    return { text: "Academic Support Needed ⚠️", color: "bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-900" };
  };
  const standing = getAcademicStanding(avgScore);

  // Subject Strengths and Weaknesses
  const sortedGrades = [...grades].sort((a, b) => parseFloat(b.score) - parseFloat(a.score));
  const strengthSubject = sortedGrades[0] || null;
  const focusSubject = sortedGrades.length > 1 ? sortedGrades[sortedGrades.length - 1] : null;

  // Greeting Message
  const getGreeting = () => {
    const hrs = currentTime.getHours();
    if (hrs < 12) return "Good Morning";
    if (hrs < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const handleDownloadReport = () => {
    if (grades.length === 0) {
      toast.error("No grade records to export.");
      return;
    }
    exportGradesToPDF(grades, user.full_name);
    toast.success("Downloading PDF Report...");
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Greetings Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-900 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-white/10 blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1 text-xs font-semibold tracking-wide text-white uppercase backdrop-blur-md">
              🎓 Student Workspace
            </span>
            <h1 className="mt-4 text-3xl font-extrabold md:text-4xl tracking-tight">
              {getGreeting()}, {user?.full_name || "Student"}
            </h1>
            <p className="mt-2 text-slate-100 text-sm md:text-base font-light max-w-md">
              Welcome to your personal dashboard. Track your academic standing, view active classes, and access your grade reports.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3.5 rounded-2xl bg-white/15 p-4 backdrop-blur-lg border border-white/10 shadow-inner">
            <span className="text-3xl">⏰</span>
            <div>
              <p className="text-xs font-medium text-blue-100 uppercase tracking-wider">Local Time</p>
              <p className="text-lg font-bold">{currentTime.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</p>
              <p className="text-xs text-blue-200">{currentTime.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-3">
        <div className="card group relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">📊</span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Average Score</p>
              <p className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-1">{avgScore ? `${avgScore}%` : "N/A"}</p>
            </div>
          </div>
          {avgScore && (
            <div className={`mt-4 inline-flex self-start rounded-full border px-2.5 py-0.5 text-xs font-bold ${standing.color}`}>
              {standing.text}
            </div>
          )}
        </div>

        <div className="card group relative overflow-hidden">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-2xl text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">📚</span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Subjects Enrolled</p>
              <p className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-1">{totalSubjects}</p>
            </div>
          </div>
        </div>

        <div className="card group relative overflow-hidden">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-2xl text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">📢</span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Announcements</p>
              <p className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-1">{announcements.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Operations Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column (2/3 width on large screens) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Today's Schedules */}
          <div className="card">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Class Timetable</h2>
              <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-600 dark:bg-blue-500/20">Class Schedule</span>
            </div>

            {schedules.length === 0 ? (
              <div className="py-8 text-center text-slate-500">No classes timetabled.</div>
            ) : (
              <div className="mt-6 space-y-4">
                {schedules.slice(0, 5).map((s) => {
                  const active = isClassActive(s);
                  return (
                    <div
                      key={s.id}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl p-4 transition-all duration-200 border ${
                        active
                          ? "bg-gradient-to-r from-blue-500/5 to-indigo-500/5 border-blue-500 shadow-sm"
                          : "bg-slate-50 border-slate-100 dark:bg-slate-800/40 dark:border-slate-800/60"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg font-semibold ${
                          active ? "bg-blue-500 text-white animate-pulse" : "bg-slate-200/60 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                        }`}>
                          {s.subject.charAt(0).toUpperCase()}
                        </span>
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                            {s.subject}
                            {active && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-ping"></span>
                                LIVE NOW
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-slate-500">{s.teacher_name} · {s.day}</p>
                        </div>
                      </div>
                      <div className="mt-3 sm:mt-0 flex items-center justify-between gap-4">
                        <span className={`text-sm font-semibold ${active ? "text-blue-600 dark:text-blue-400" : "text-slate-600 dark:text-slate-400"}`}>
                          {formatTime(s.start_time)} – {formatTime(s.end_time)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Grades Breakdown */}
          <div className="card">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Subject Grade Breakdown</h2>
              <Link to="/student/grades" className="text-sm font-semibold text-blue-600 hover:underline">View All</Link>
            </div>
            {grades.length === 0 ? (
              <div className="py-8 text-center text-slate-500">No grades recorded yet.</div>
            ) : (
              <div className="mt-6 space-y-4">
                {grades.slice(0, 5).map((g) => (
                  <div key={g.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                      <span>{g.subject}</span>
                      <span className="flex items-center gap-2">
                        <span>Score: {g.score}%</span>
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-400">
                          {getGradeLetter(parseFloat(g.score))}
                        </span>
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"
                        style={{ width: `${g.score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1/3 width on large screens) */}
        <div className="space-y-8">
          {/* Subject Strengths & Focus Areas */}
          {grades.length > 0 && (
            <div className="card space-y-6">
              {strengthSubject && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Academic Strength 🥇</h3>
                  <div className="mt-2 flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-100 p-3 dark:bg-emerald-950/10 dark:border-emerald-900/20">
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{strengthSubject.subject}</p>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400">Great job! Keep maintaining this score.</p>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-extrabold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                      {strengthSubject.score}%
                    </span>
                  </div>
                </div>
              )}

              {focusSubject && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Focus Subject 🎯</h3>
                  <div className="mt-2 flex items-center justify-between rounded-xl bg-amber-50 border border-amber-100 p-3 dark:bg-amber-950/10 dark:border-amber-900/20">
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{focusSubject.subject}</p>
                      <p className="text-[10px] text-amber-600 dark:text-amber-400">Spend 15 mins reviewing daily formulas!</p>
                    </div>
                    <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-extrabold text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                      {focusSubject.score}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Support Actions */}
          <div className="card">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 pb-3 dark:border-slate-800">Resources & Help</h2>
            <div className="mt-4 space-y-3">
              <button
                onClick={handleDownloadReport}
                className="w-full flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-150 p-3 hover:border-blue-500 hover:scale-[1.02] hover:shadow-xs transition-all duration-150 text-left dark:bg-slate-800/40 dark:border-slate-850"
              >
                <span className="text-2xl">📄</span>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Download Grade Report</p>
                  <p className="text-[10px] text-slate-500">Export grades to PDF document</p>
                </div>
              </button>

              <button
                onClick={() => setShowFeedbackModal(true)}
                className="w-full flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-150 p-3 hover:border-emerald-500 hover:scale-[1.02] hover:shadow-xs transition-all duration-150 text-left dark:bg-slate-800/40 dark:border-slate-850"
              >
                <span className="text-2xl">✉️</span>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Contact School Office</p>
                  <p className="text-[10px] text-slate-500">Submit suggestions or requests</p>
                </div>
              </button>
            </div>
          </div>

          {/* Announcements Feed */}
          <div className="card">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 pb-3 dark:border-slate-800">School Bulletins</h2>
            {announcements.length === 0 ? (
              <p className="text-xs text-slate-500 mt-4 text-center">No bulletins posted.</p>
            ) : (
              <div className="mt-4 space-y-4">
                {announcements.slice(0, 3).map((a) => (
                  <div key={a.id} className="space-y-1">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{a.title}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{a.content}</p>
                    <p className="text-[9px] text-slate-400">{formatDate(a.created_at)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SUPPORT MODAL: SEND FEEDBACK */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800 animate-slide-up border border-slate-100 dark:border-slate-700/60">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Send Office Message</h2>
              <button onClick={() => setShowFeedbackModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl font-bold">×</button>
            </div>

            <form onSubmit={handleSubmitFeedback(onFeedbackSubmit)} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Your Name</label>
                <input className="input-field bg-slate-50 dark:bg-slate-900 cursor-not-allowed" value={user?.full_name || ""} disabled />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Your Email</label>
                <input className="input-field bg-slate-50 dark:bg-slate-900 cursor-not-allowed" value={user?.email || ""} disabled />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Your Message</label>
                <textarea rows={5} className="input-field" placeholder="Type your request or message..." {...registerFeedback("message", { required: true })} />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-emerald flex-1 shadow-sm">Submit Message</button>
                <button type="button" onClick={() => setShowFeedbackModal(false)} className="btn-outline flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
