/**
 * App.jsx — Root component with all routes and role-based protection
 * Refactored to use lazy loading, nested routes, and unified layouts.
 */
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleGuard from "./components/RoleGuard";
import DashboardLayout from "./layouts/DashboardLayout";
import LoadingSpinner from "./components/LoadingSpinner";
import { adminLinks, teacherLinks, studentLinks } from "./config/navLinks";

// Public pages
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Admissions = lazy(() => import("./pages/Admissions"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Contact = lazy(() => import("./pages/Contact"));
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Admin dashboards
const AdminDashboard = lazy(() => import("./dashboards/admin/AdminDashboard"));
const AdminUsers = lazy(() => import("./dashboards/admin/AdminUsers"));
const AdminSchedules = lazy(() => import("./dashboards/admin/AdminSchedules"));
const AdminAnnouncements = lazy(() => import("./dashboards/admin/AdminAnnouncements"));
const AdminMessages = lazy(() => import("./dashboards/admin/AdminMessages"));
const AdminEvents = lazy(() => import("./dashboards/admin/AdminEvents"));
const AdminGallery = lazy(() => import("./dashboards/admin/AdminGallery"));
const AdminStaff = lazy(() => import("./dashboards/admin/AdminStaff"));
const AdminAdmissions = lazy(() => import("./dashboards/admin/AdminAdmissions"));

// Teacher dashboards
const TeacherDashboard = lazy(() => import("./dashboards/teacher/TeacherDashboard"));
const TeacherSchedule = lazy(() => import("./dashboards/teacher/TeacherSchedule"));
const TeacherScoreManagement = lazy(() => import("./dashboards/teacher/TeacherScoreManagement"));
const TeacherAnnouncements = lazy(() => import("./dashboards/teacher/TeacherAnnouncements"));

// Student dashboards
const StudentDashboard = lazy(() => import("./dashboards/student/StudentDashboard"));
const StudentGrades = lazy(() => import("./dashboards/student/StudentGrades"));
const StudentSchedule = lazy(() => import("./dashboards/student/StudentSchedule"));
const StudentAnnouncements = lazy(() => import("./dashboards/student/StudentAnnouncements"));
const StudentContact = lazy(() => import("./dashboards/student/StudentContact"));

// Shared
const Profile = lazy(() => import("./dashboards/shared/Profile"));

function App() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
          <LoadingSpinner className="py-20" />
        </div>
      }
    >
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/admissions" element={<Admissions />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Dashboard Routes */}
        <Route element={<ProtectedRoute />}>
          {/* Admin Portal */}
          <Route element={<RoleGuard allowedRoles={["admin"]} />}>
            <Route element={<DashboardLayout links={adminLinks} />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/schedules" element={<AdminSchedules />} />
              <Route path="/admin/announcements" element={<AdminAnnouncements />} />
              <Route path="/admin/messages" element={<AdminMessages />} />
              <Route path="/admin/admissions" element={<AdminAdmissions />} />
              <Route path="/admin/events" element={<AdminEvents />} />
              <Route path="/admin/gallery" element={<AdminGallery />} />
              <Route path="/admin/staff" element={<AdminStaff />} />
              <Route path="/admin/profile" element={<Profile />} />
            </Route>
          </Route>

          {/* Teacher Portal */}
          <Route element={<RoleGuard allowedRoles={["teacher"]} />}>
            <Route element={<DashboardLayout links={teacherLinks} />}>
              <Route path="/teacher" element={<TeacherDashboard />} />
              <Route path="/teacher/schedule" element={<TeacherSchedule />} />
              <Route path="/teacher/grades" element={<TeacherScoreManagement />} />
              <Route path="/teacher/announcements" element={<TeacherAnnouncements />} />
              <Route path="/teacher/profile" element={<Profile />} />
            </Route>
          </Route>

          {/* Student Portal */}
          <Route element={<RoleGuard allowedRoles={["student"]} />}>
            <Route element={<DashboardLayout links={studentLinks} />}>
              <Route path="/student" element={<StudentDashboard />} />
              <Route path="/student/grades" element={<StudentGrades />} />
              <Route path="/student/schedule" element={<StudentSchedule />} />
              <Route path="/student/announcements" element={<StudentAnnouncements />} />
              <Route path="/student/contact" element={<StudentContact />} />
              <Route path="/student/profile" element={<Profile />} />
            </Route>
          </Route>
        </Route>

        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
