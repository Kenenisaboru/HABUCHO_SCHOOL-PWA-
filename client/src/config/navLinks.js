/**
 * navLinks.js — Unified configuration for role-based dashboard links.
 * Uses Lucide React icon components for consistent, accessible icons.
 */
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Megaphone,
  Mail,
  User,
  BookOpen,
  GraduationCap,
  MessageSquare,
} from "lucide-react";

export const adminLinks = [
  { to: "/admin", label: "Admin Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/users", label: "Manage Users", icon: Users },
  { to: "/admin/schedules", label: "Class Schedules", icon: CalendarDays },
  { to: "/admin/announcements", label: "Announcements", icon: Megaphone },
  { to: "/admin/messages", label: "Messages", icon: Mail },
  { to: "/admin/profile", label: "Profile", icon: User },
];

export const teacherLinks = [
  { to: "/teacher", label: "Teacher Dashboard", icon: LayoutDashboard, end: true },
  { to: "/teacher/schedule", label: "My Schedule", icon: CalendarDays },
  { to: "/teacher/grades", label: "Score Management", icon: BookOpen },
  { to: "/teacher/announcements", label: "Announcements", icon: Megaphone },
  { to: "/teacher/profile", label: "Profile", icon: User },
];

export const studentLinks = [
  { to: "/student", label: "Student Dashboard", icon: LayoutDashboard, end: true },
  { to: "/student/grades", label: "My Grades", icon: GraduationCap },
  { to: "/student/schedule", label: "Class Schedule", icon: CalendarDays },
  { to: "/student/announcements", label: "Announcements", icon: Megaphone },
  { to: "/student/contact", label: "Contact School", icon: MessageSquare },
  { to: "/student/profile", label: "Profile", icon: User },
];