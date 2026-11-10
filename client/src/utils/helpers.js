/**
 * Utility Functions
 * -----------------
 * Shared helpers used across the application.
 */

export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatTime = (timeString) => {
  if (!timeString) return "N/A";
  const [hours, minutes] = timeString.split(":");
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${minutes} ${ampm}`;
};

export const getDashboardPath = (role) => {
  const paths = { admin: "/admin", teacher: "/teacher", student: "/student" };
  return paths[role] || "/";
};

export const capitalize = (str) => str?.charAt(0).toUpperCase() + str?.slice(1);

export const getPassStatus = (score, passMark = 50) => {
  const num = parseFloat(score);
  if (isNaN(num)) return "-";
  return num >= passMark ? "Pass" : "Fail";
};

export const formatScorePercentage = (score, totalMarks = 100) => {
  const s = parseFloat(score);
  const t = parseFloat(totalMarks) || 100;
  if (isNaN(s)) return "-";
  return `${((s / t) * 100).toFixed(1)}%`;
};

export const exportGradesToPDF = async (grades, studentName) => {
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("Habucho Preparatory School", 14, 22);
  doc.setFontSize(12);
  doc.text(`Academic Performance Report — ${studentName || "Student"}`, 14, 32);
  doc.text(`Generated: ${formatDate(new Date())}`, 14, 40);

  autoTable(doc, {
    startY: 48,
    head: [["Subject", "Marks", "Max Marks", "Percentage", "Semester", "Status"]],
    body: grades.map((g) => [
      g.subject,
      g.score,
      g.total_marks || 100,
      formatScorePercentage(g.score, g.total_marks || 100),
      g.semester,
      getPassStatus(g.score),
    ]),
  });

  doc.save(`academic-report-${studentName || "student"}.pdf`);
};
