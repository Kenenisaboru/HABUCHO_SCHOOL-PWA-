/**
 * navLinks.js — Unified configuration for role-based dashboard links.
 */

export const adminLinks = [
  { to: "/admin", label: "Admin Dashboard", icon: "📊", end: true },
  { to: "/admin/users", label: "Manage Users", icon: "👥" },
  { to: "/admin/schedules", label: "Class Schedules", icon: "📅" },
  { to: "/admin/announcements", label: "Announcements", icon: "📢" },
  { to: "/admin/messages", label: "Messages", icon: "✉️" },
  { to: "/admin/profile", label: "Profile", icon: "👤" },
];

export const teacherLinks = [
  { to: "/teacher", label: "Teacher Dashboard", icon: "📊", end: true },
  { to: "/teacher/schedule", label: "My Schedule", icon: "📅" },
  { to: "/teacher/grades", label: "Score Management", icon: "📝" },
  { to: "/teacher/announcements", label: "Announcements", icon: "📢" },
  { to: "/teacher/profile", label: "Profile", icon: "👤" },
];

export const studentLinks = [
  { to: "/student", label: "Student Dashboard", icon: "📊", end: true },
  { to: "/student/grades", label: "My Grades", icon: "📝" },
  { to: "/student/schedule", label: "Class Schedule", icon: "📅" },
  { to: "/student/announcements", label: "Announcements", icon: "📢" },
  { to: "/student/contact", label: "Contact School", icon: "✉️" },
  { to: "/student/profile", label: "Profile", icon: "👤" },
];
