/**
 * Teacher Dashboard — Advanced Pro-Level Analytics & Operations Portal
 */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";
import useAuthStore from "../../context/authStore";
import {
  getSchedules,
  getGrades,
  getAnnouncements,
  getStudents,
  createGrade,
  createAnnouncement,
} from "../../services/authService";
import { formatTime, getGradeLetter, formatDate } from "../../utils/helpers";

const TeacherDashboard = () => {
  const { user } = useAuthStore();
  const [schedules, setSchedules] = useState([]);
  const [grades, setGrades] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  
  // Real-time ticking date-time
  const [currentTime, setCurrentTime] = useState(new Date());

  const { register: registerGrade, handleSubmit: handleSubmitGrade, reset: resetGrade } = useForm();
  const { register: registerAnn, handleSubmit: handleSubmitAnn, reset: resetAnn } = useForm();

  // Fetch all required dashboard data
  const fetchData = async () => {
    try {
      const [schedRes, gradeRes, annRes, studRes] = await Promise.all([
        getSchedules({ limit: 50 }),
        getGrades({ limit: 100 }), // Get recent grades for calculations
        getAnnouncements({ limit: 10 }),
        getStudents({ limit: 100 }),
      ]);

      setSchedules(schedRes.data.data.schedules || []);
      setGrades(gradeRes.data.data.grades || []);
      setAnnouncements(annRes.data.data.announcements || []);
      setStudents(studRes.data.data.students || []);
    } catch (err) {
      toast.error("Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Setup ticking clock for real-time tracking (live classes)
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(timer);
  }, []);

  // Quick Action: Add Grade Form Submit
  const onGradeSubmit = async (data) => {
    try {
      await createGrade({
        student_id: parseInt(data.student_id),
        subject: data.subject,
        score: parseFloat(data.score),
        semester: data.semester,
      });
      toast.success("Grade added successfully!");
      setShowGradeModal(false);
      resetGrade();
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add grade");
    }
  };

  // Quick Action: Create Announcement Submit
  const onAnnouncementSubmit = async (data) => {
    try {
      await createAnnouncement(data);
      toast.success("Announcement posted successfully!");
      setShowAnnouncementModal(false);
      resetAnn();
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post announcement");
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
  const totalGrades = grades.length;
  const classAvg = totalGrades > 0 
    ? (grades.reduce((acc, curr) => acc + parseFloat(curr.score), 0) / totalGrades).toFixed(1) 
    : "0.0";
  const passCount = grades.filter((g) => parseFloat(g.score) >= 50).length;
  const passRate = totalGrades > 0 ? ((passCount / totalGrades) * 100).toFixed(0) : "0";
  const topPerformersCount = grades.filter((g) => parseFloat(g.score) >= 90).length;

  // Grade Bands
  const getGradeBandsCount = () => {
    const bands = { A: 0, B: 0, C: 0, D: 0, F: 0 };
    grades.forEach((g) => {
      const score = parseFloat(g.score);
      if (score >= 90) bands.A++;
      else if (score >= 80) bands.B++;
      else if (score >= 70) bands.C++;
      else if (score >= 50) bands.D++;
      else bands.F++;
    });
    return bands;
  };
  const gradeBands = getGradeBandsCount();

  // Greeting Message
  const getGreeting = () => {
    const hrs = currentTime.getHours();
    if (hrs < 12) return "Good Morning";
    if (hrs < 18) return "Good Afternoon";
    return "Good Evening";
  };

  // Top Performing Students
  const topStudents = [...grades]
    .sort((a, b) => parseFloat(b.score) - parseFloat(a.score))
    .slice(0, 3);

  // Students Needing Support (Score < 60)
  const studentsNeedingSupport = grades
    .filter((g) => parseFloat(g.score) < 60)
    .slice(0, 3);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Dynamic Greetings Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-emerald-600 via-teal-700 to-indigo-800 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-white/10 blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1 text-xs font-semibold tracking-wide text-white uppercase backdrop-blur-md">
              🏫 Teacher Workspace
            </span>
            <h1 className="mt-4 text-3xl font-extrabold md:text-4xl tracking-tight">
              {getGreeting()}, {user?.full_name || "Teacher"}
            </h1>
            <p className="mt-2 text-slate-100 text-sm md:text-base font-light max-w-md">
              Here is your school overview. Check out dynamic insights, manage student grades, and track your active schedules.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3.5 rounded-2xl bg-white/15 p-4 backdrop-blur-lg border border-white/10 shadow-inner">
            <span className="text-3xl">📅</span>
            <div>
              <p className="text-xs font-medium text-teal-100 uppercase tracking-wider">Current Time</p>
              <p className="text-lg font-bold">{currentTime.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</p>
              <p className="text-xs text-emerald-100/90">{currentTime.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced KPI Statistics */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Classes Card */}
        <div className="card group relative overflow-hidden">
          <div className="absolute -right-3 -top-3 h-16 w-16 rounded-full bg-blue-500/10 transition-all duration-300 group-hover:scale-150"></div>
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">📚</span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">My Classes</p>
              <p className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-1">{schedules.length}</p>
            </div>
          </div>
        </div>

        {/* Class Average Card */}
        <div className="card group relative overflow-hidden">
          <div className="absolute -right-3 -top-3 h-16 w-16 rounded-full bg-emerald-500/10 transition-all duration-300 group-hover:scale-150"></div>
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-2xl text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">📊</span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Class Average</p>
              <p className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-1">{classAvg}%</p>
            </div>
          </div>
        </div>

        {/* Pass Rate Card */}
        <div className="card group relative overflow-hidden">
          <div className="absolute -right-3 -top-3 h-16 w-16 rounded-full bg-purple-500/10 transition-all duration-300 group-hover:scale-150"></div>
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-2xl text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">📈</span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Pass Rate</p>
              <p className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-1">{passRate}%</p>
            </div>
          </div>
        </div>

        {/* Top Performers Card */}
        <div className="card group relative overflow-hidden">
          <div className="absolute -right-3 -top-3 h-16 w-16 rounded-full bg-amber-500/10 transition-all duration-300 group-hover:scale-150"></div>
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-2xl text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">👑</span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Top Performers</p>
              <p className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-1">{topPerformersCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Operations Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column (2/3 width on large screens) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Timeline & Weekly Timetable */}
          <div className="card">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Schedule & Timetable</h2>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/20">Assigned Classes</span>
            </div>

            {schedules.length === 0 ? (
              <div className="py-8 text-center text-slate-500">No classes assigned on your timetable.</div>
            ) : (
              <div className="mt-6 space-y-4">
                {schedules.slice(0, 5).map((s) => {
                  const active = isClassActive(s);
                  return (
                    <div
                      key={s.id}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl p-4 transition-all duration-200 border ${
                        active
                          ? "bg-linear-to-r from-emerald-500/5 to-teal-500/5 border-emerald-500 shadow-sm"
                          : "bg-slate-50 border-slate-100 dark:bg-slate-800/40 dark:border-slate-800/60"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg font-semibold ${
                          active ? "bg-emerald-500 text-white animate-pulse" : "bg-slate-200/60 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                        }`}>
                          {s.subject.charAt(0).toUpperCase()}
                        </span>
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                            {s.subject}
                            {active && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                                LIVE NOW
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-slate-500">Grade {s.grade_level} · {s.day}</p>
                        </div>
                      </div>
                      <div className="mt-3 sm:mt-0 flex items-center justify-between gap-4">
                        <span className={`text-sm font-semibold ${active ? "text-emerald-600 dark:text-emerald-400" : "text-slate-600 dark:text-slate-400"}`}>
                          {formatTime(s.start_time)} – {formatTime(s.end_time)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Actions & Modals */}
          <div className="card">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 pb-4 dark:border-slate-800">Quick Actions</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <button
                onClick={() => setShowGradeModal(true)}
                className="flex items-center gap-4 rounded-2xl bg-linear-to-br from-emerald-500 to-teal-600 p-4 text-left text-white shadow-sm hover:shadow-md transition-all hover:scale-[1.02]"
              >
                <span className="text-3xl bg-white/20 p-2 rounded-xl">📝</span>
                <div>
                  <h3 className="font-bold">Add Student Grade</h3>
                  <p className="text-xs text-teal-100">Upload new grades & scores</p>
                </div>
              </button>

              <button
                onClick={() => setShowAnnouncementModal(true)}
                className="flex items-center gap-4 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 p-4 text-left text-white shadow-sm hover:shadow-md transition-all hover:scale-[1.02]"
              >
                <span className="text-3xl bg-white/20 p-2 rounded-xl">📢</span>
                <div>
                  <h3 className="font-bold">Post Announcement</h3>
                  <p className="text-xs text-indigo-100">Notify your classes & students</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (1/3 width on large screens) */}
        <div className="space-y-8">
          {/* Dynamic Grade Distribution Chart */}
          <div className="card">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 pb-4 dark:border-slate-800">Grade Distribution</h2>
            <div className="mt-6 space-y-4">
              {Object.keys(gradeBands).map((grade) => {
                const count = gradeBands[grade];
                const percentage = totalGrades > 0 ? ((count / totalGrades) * 100).toFixed(0) : "0";
                
                // Color mapping for grades
                const colors = {
                  A: "bg-emerald-500",
                  B: "bg-blue-500",
                  C: "bg-indigo-500",
                  D: "bg-amber-500",
                  F: "bg-red-500",
                };

                return (
                  <div key={grade} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                      <span>Grade {grade}</span>
                      <span>{count} student(s) ({percentage}%)</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${colors[grade]}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Student Achievements & Alerts */}
          <div className="card space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 pb-3 dark:border-slate-800">Top Performers</h2>
              {topStudents.length === 0 ? (
                <p className="text-sm text-slate-500 mt-3">No grades entered yet.</p>
              ) : (
                <div className="mt-3 space-y-3">
                  {topStudents.map((s, idx) => (
                    <div key={s.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-3 dark:bg-slate-800/40">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}</span>
                        <div>
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{s.student_name}</p>
                          <p className="text-[10px] text-slate-500">{s.subject} · {s.semester}</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                        {s.score}%
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 pb-3 dark:border-slate-800 flex items-center gap-2">
                Needs Support ⚠️
              </h2>
              {studentsNeedingSupport.length === 0 ? (
                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium mt-3">All students passing! Good job! 🎉</p>
              ) : (
                <div className="mt-3 space-y-3">
                  {studentsNeedingSupport.map((s) => (
                    <div key={s.id} className="flex items-center justify-between rounded-xl bg-red-50/50 p-3 dark:bg-red-950/10 border border-red-100/50 dark:border-red-900/20">
                      <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{s.student_name}</p>
                        <p className="text-[10px] text-slate-500">{s.subject} · {s.semester}</p>
                      </div>
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700 dark:bg-red-950 dark:text-red-400">
                        {s.score}%
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: ADD GRADE */}
      {showGradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800 animate-slide-up border border-slate-100 dark:border-slate-700/60">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Add Grade Record</h2>
              <button onClick={() => setShowGradeModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl font-bold">×</button>
            </div>
            
            <form onSubmit={handleSubmitGrade(onGradeSubmit)} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Select Student</label>
                <select className="input-field" {...registerGrade("student_id", { required: true })}>
                  <option value="">Choose student...</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>{s.full_name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Subject</label>
                <input className="input-field" placeholder="e.g., Mathematics" {...registerGrade("subject", { required: true })} />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Score (0-100)</label>
                <input type="number" step="0.01" min="0" max="100" className="input-field" placeholder="e.g., 85" {...registerGrade("score", { required: true })} />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Semester</label>
                <select className="input-field" {...registerGrade("semester")}>
                  <option value="Semester 1">Semester 1</option>
                  <option value="Semester 2">Semester 2</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-emerald flex-1 shadow-sm">Save Grade</button>
                <button type="button" onClick={() => setShowGradeModal(false)} className="btn-outline flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: POST ANNOUNCEMENT */}
      {showAnnouncementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800 animate-slide-up border border-slate-100 dark:border-slate-700/60">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Post New Announcement</h2>
              <button onClick={() => setShowAnnouncementModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl font-bold">×</button>
            </div>
            
            <form onSubmit={handleSubmitAnn(onAnnouncementSubmit)} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Title</label>
                <input className="input-field" placeholder="e.g., Midterm Exam Schedule" {...registerAnn("title", { required: true })} />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Content</label>
                <textarea rows={5} className="input-field" placeholder="Write your announcement details here..." {...registerAnn("content", { required: true })} />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1 shadow-sm">Post Now</button>
                <button type="button" onClick={() => setShowAnnouncementModal(false)} className="btn-outline flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
