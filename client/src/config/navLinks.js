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
  Newspaper,
  Images,
  UsersRound,
  ShieldCheck,
  Trophy,
  BarChart3,
} from "lucide-react";

export const adminLinks = [
  // School Operations section
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true, section: "School Operations" },
  { to: "/admin/users", label: "Manage Users", icon: Users, section: "School Operations" },
  { to: "/admin/schedules", label: "Class Schedules", icon: CalendarDays, section: "School Operations" },
  { to: "/admin/announcements", label: "Announcements", icon: Megaphone, section: "School Operations" },
  { to: "/admin/messages", label: "Messages", icon: Mail, section: "School Operations" },
  { to: "/admin/audit-logs", label: "Audit Logs", icon: ShieldCheck, section: "School Operations" },
  { to: "/admin/profile", label: "Profile", icon: User, section: "School Operations" },
  // Academic & Ethiopian Curriculum Management section
  { to: "/admin/curriculum", label: "Curriculum & Subjects", icon: BookOpen, section: "Academic Management" },
  { to: "/admin/top-scorers", label: "Top Scorer Rankings", icon: Trophy, section: "Academic Management" },
  { to: "/admin/academic-analytics", label: "Academic Analytics", icon: BarChart3, section: "Academic Management" },
  // Website & Admissions Management section
  { to: "/admin/admissions", label: "Admissions", icon: GraduationCap, section: "Website Management" },
  { to: "/admin/events", label: "News & Events", icon: Newspaper, section: "Website Management" },
  { to: "/admin/gallery", label: "Gallery", icon: Images, section: "Website Management" },
  { to: "/admin/staff", label: "Staff Profiles", icon: UsersRound, section: "Website Management" },
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
