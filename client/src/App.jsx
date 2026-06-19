/**
 * App.jsx — Root component with all routes and role-based protection
 */
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleGuard from "./components/RoleGuard";

// Public pages
import Home from "./pages/Home";
import About from "./pages/About";
import Announcements from "./pages/Announcements";
import Schedule from "./pages/Schedule";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Admin dashboards
import AdminDashboard from "./dashboards/admin/AdminDashboard";
import AdminUsers from "./dashboards/admin/AdminUsers";
import AdminSchedules from "./dashboards/admin/AdminSchedules";
import AdminAnnouncements from "./dashboards/admin/AdminAnnouncements";
import AdminMessages from "./dashboards/admin/AdminMessages";

// Teacher dashboards
import TeacherDashboard from "./dashboards/teacher/TeacherDashboard";
import TeacherSchedule from "./dashboards/teacher/TeacherSchedule";
import TeacherGrades from "./dashboards/teacher/TeacherGrades";
import TeacherAnnouncements from "./dashboards/teacher/TeacherAnnouncements";

// Student dashboards
import StudentDashboard from "./dashboards/student/StudentDashboard";
import StudentGrades from "./dashboards/student/StudentGrades";
import StudentSchedule from "./dashboards/student/StudentSchedule";
import StudentAnnouncements from "./dashboards/student/StudentAnnouncements";
import StudentContact from "./dashboards/student/StudentContact";

// Shared
import Profile from "./dashboards/shared/Profile";

const adminLinks = [
  { to: "/admin", label: "Dashboard", icon: "📊", end: true },
  { to: "/admin/users", label: "Users", icon: "👥" },
  { to: "/admin/schedules", label: "Schedules", icon: "📅" },
  { to: "/admin/announcements", label: "Announcements", icon: "📢" },
  { to: "/admin/messages", label: "Messages", icon: "✉️" },
  { to: "/admin/profile", label: "Profile", icon: "👤" },
];

const teacherLinks = [
  { to: "/teacher", label: "Dashboard", icon: "📊", end: true },
  { to: "/teacher/schedule", label: "My Schedule", icon: "📅" },
  { to: "/teacher/grades", label: "Grades", icon: "📝" },
  { to: "/teacher/announcements", label: "Announcements", icon: "📢" },
  { to: "/teacher/profile", label: "Profile", icon: "👤" },
];

const studentLinks = [
  { to: "/student", label: "Dashboard", icon: "📊", end: true },
  { to: "/student/grades", label: "My Grades", icon: "📝" },
  { to: "/student/schedule", label: "Schedule", icon: "📅" },
  { to: "/student/announcements", label: "Announcements", icon: "📢" },
  { to: "/student/contact", label: "Contact", icon: "✉️" },
  { to: "/student/profile", label: "Profile", icon: "👤" },
];

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/announcements" element={<Announcements />} />
      <Route path="/schedule" element={<Schedule />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute><RoleGuard allowedRoles={["admin"]}><AdminDashboard /></RoleGuard></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute><RoleGuard allowedRoles={["admin"]}><AdminUsers /></RoleGuard></ProtectedRoute>} />
      <Route path="/admin/schedules" element={<ProtectedRoute><RoleGuard allowedRoles={["admin"]}><AdminSchedules /></RoleGuard></ProtectedRoute>} />
      <Route path="/admin/announcements" element={<ProtectedRoute><RoleGuard allowedRoles={["admin"]}><AdminAnnouncements /></RoleGuard></ProtectedRoute>} />
      <Route path="/admin/messages" element={<ProtectedRoute><RoleGuard allowedRoles={["admin"]}><AdminMessages /></RoleGuard></ProtectedRoute>} />
      <Route path="/admin/profile" element={<ProtectedRoute><RoleGuard allowedRoles={["admin"]}><Profile links={adminLinks} title="My Profile" /></RoleGuard></ProtectedRoute>} />

      {/* Teacher Routes */}
      <Route path="/teacher" element={<ProtectedRoute><RoleGuard allowedRoles={["teacher"]}><TeacherDashboard /></RoleGuard></ProtectedRoute>} />
      <Route path="/teacher/schedule" element={<ProtectedRoute><RoleGuard allowedRoles={["teacher"]}><TeacherSchedule /></RoleGuard></ProtectedRoute>} />
      <Route path="/teacher/grades" element={<ProtectedRoute><RoleGuard allowedRoles={["teacher"]}><TeacherGrades /></RoleGuard></ProtectedRoute>} />
      <Route path="/teacher/announcements" element={<ProtectedRoute><RoleGuard allowedRoles={["teacher"]}><TeacherAnnouncements /></RoleGuard></ProtectedRoute>} />
      <Route path="/teacher/profile" element={<ProtectedRoute><RoleGuard allowedRoles={["teacher"]}><Profile links={teacherLinks} title="My Profile" /></RoleGuard></ProtectedRoute>} />

      {/* Student Routes */}
      <Route path="/student" element={<ProtectedRoute><RoleGuard allowedRoles={["student"]}><StudentDashboard /></RoleGuard></ProtectedRoute>} />
      <Route path="/student/grades" element={<ProtectedRoute><RoleGuard allowedRoles={["student"]}><StudentGrades /></RoleGuard></ProtectedRoute>} />
      <Route path="/student/schedule" element={<ProtectedRoute><RoleGuard allowedRoles={["student"]}><StudentSchedule /></RoleGuard></ProtectedRoute>} />
      <Route path="/student/announcements" element={<ProtectedRoute><RoleGuard allowedRoles={["student"]}><StudentAnnouncements /></RoleGuard></ProtectedRoute>} />
      <Route path="/student/contact" element={<ProtectedRoute><RoleGuard allowedRoles={["student"]}><StudentContact /></RoleGuard></ProtectedRoute>} />
      <Route path="/student/profile" element={<ProtectedRoute><RoleGuard allowedRoles={["student"]}><Profile links={studentLinks} title="My Profile" /></RoleGuard></ProtectedRoute>} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
