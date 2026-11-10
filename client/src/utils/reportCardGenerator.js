/**
 * Ethiopian Secondary School Official Academic Report Card Generator
 * -----------------------------------------------------------------
 * Generates official PDF report cards adhering strictly to the Ethiopian
 * Ministry of Education secondary curriculum standards.
 * 
 * STRICT MANDATE: Numerical scores, percentages, and numerical rankings ONLY.
 * NO letter grades (A/B/C/D/F), NO GPA, NO grade points.
 */

export const generateEthiopianReportCard = async ({
  student,
  academicSummary,
  subjectGrades = [],
  academicYear = "2024/2025",
  semester = "Semester 1",
}) => {
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Primary Theme Colors (Ethiopian Green & Gold accents)
  const primaryColor = [16, 120, 80]; // Forest Green
  const headerBg = [240, 248, 244];
  const darkText = [30, 41, 59];
  const mutedText = [100, 116, 139];

  // 1. Decorative Outer Border
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.8);
  doc.rect(8, 8, pageWidth - 16, pageHeight - 16);
  doc.setLineWidth(0.2);
  doc.rect(9.5, 9.5, pageWidth - 19, pageHeight - 19);

  // 2. School Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...primaryColor);
  doc.text("HABUCHO SECONDARY & PREPARATORY SCHOOL", pageWidth / 2, 20, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...mutedText);
  doc.text("Federal Democratic Republic of Ethiopia — Ministry of Education Curriculum", pageWidth / 2, 26, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...darkText);
  doc.text(`OFFICIAL STUDENT ACADEMIC PERFORMANCE REPORT CARD`, pageWidth / 2, 33, { align: "center" });

  // Divider line
  doc.setDrawColor(200, 210, 220);
  doc.setLineWidth(0.5);
  doc.line(14, 37, pageWidth - 14, 37);

  // 3. Student Identification Info Box
  doc.setFillColor(...headerBg);
  doc.roundedRect(14, 40, pageWidth - 28, 26, 2, 2, "F");

  doc.setFontSize(9.5);
  doc.setTextColor(...darkText);

  // Column 1
  doc.setFont("helvetica", "bold");
  doc.text("Student Full Name:", 18, 46);
  doc.setFont("helvetica", "normal");
  doc.text(student.full_name || student.name || "N/A", 54, 46);

  doc.setFont("helvetica", "bold");
  doc.text("Student ID No:", 18, 53);
  doc.setFont("helvetica", "normal");
  doc.text(student.student_id || student.student_code || String(student.id || "N/A"), 54, 53);

  doc.setFont("helvetica", "bold");
  doc.text("Gender:", 18, 60);
  doc.setFont("helvetica", "normal");
  doc.text(student.gender || "N/A", 54, 60);

  // Column 2
  const col2X = 115;
  doc.setFont("helvetica", "bold");
  doc.text("Grade & Section:", col2X, 46);
  doc.setFont("helvetica", "normal");
  doc.text(`Grade ${student.grade_level || "10"} — Section ${student.section || "A"}`, col2X + 32, 46);

  doc.setFont("helvetica", "bold");
  doc.text("Stream / Pathway:", col2X, 53);
  doc.setFont("helvetica", "normal");
  doc.text(student.stream || (parseInt(student.grade_level) >= 11 ? "Natural Science" : "General Secondary"), col2X + 32, 53);

  doc.setFont("helvetica", "bold");
  doc.text("Academic Year:", col2X, 60);
  doc.setFont("helvetica", "normal");
  doc.text(`${academicYear} (${semester})`, col2X + 32, 60);

  // 4. Numerical Subject Results Table
  const tableData = subjectGrades.map((g, idx) => {
    const scoreNum = parseFloat(g.score) || 0;
    const maxNum = parseFloat(g.total_marks) || 100;
    const pct = ((scoreNum / maxNum) * 100).toFixed(1);
    const passStatus = scoreNum >= (g.pass_mark || 50) ? "Pass" : "Fail";

    return [
      String(idx + 1),
      g.subject,
      g.assessment_type || "Final Examination",
      scoreNum.toFixed(1),
      maxNum.toFixed(0),
      `${pct}%`,
      passStatus,
    ];
  });

  autoTable(doc, {
    startY: 70,
    head: [["#", "Curriculum Subject", "Assessment Type", "Marks Obtained", "Maximum Marks", "Percentage", "Status"]],
    body: tableData.length > 0 ? tableData : [["-", "No examination marks published", "-", "-", "-", "-", "-"]],
    theme: "striped",
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontSize: 9,
      fontStyle: "bold",
      halign: "center",
    },
    styles: {
      fontSize: 8.5,
      cellPadding: 2.2,
      textColor: darkText,
    },
    columnStyles: {
      0: { halign: "center", cellWidth: 10 },
      1: { halign: "left", cellWidth: 50, fontStyle: "bold" },
      2: { halign: "left", cellWidth: 40 },
      3: { halign: "center", cellWidth: 26 },
      4: { halign: "center", cellWidth: 24 },
      5: { halign: "center", cellWidth: 22, fontStyle: "bold" },
      6: { halign: "center", cellWidth: 18 },
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { left: 14, right: 14 },
    didParseCell: (data) => {
      if (data.section === "body" && data.column.index === 6) {
        if (data.cell.raw === "Pass") {
          data.cell.styles.textColor = [16, 120, 80];
          data.cell.styles.fontStyle = "bold";
        } else if (data.cell.raw === "Fail") {
          data.cell.styles.textColor = [220, 38, 38];
          data.cell.styles.fontStyle = "bold";
        }
      }
    },
  });

  const finalY = doc.lastAutoTable.finalY + 6;

  // 5. Official Academic Performance Summary Card
  const summaryBoxY = Math.min(finalY, pageHeight - 88);
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(210, 220, 230);
  doc.roundedRect(14, summaryBoxY, pageWidth - 28, 32, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...primaryColor);
  doc.text("OFFICIAL NUMERICAL ACADEMIC SUMMARY", 18, summaryBoxY + 6);

  // Metrics grid
  const totalObtained = academicSummary?.total_marks_obtained ?? subjectGrades.reduce((sum, g) => sum + (parseFloat(g.score) || 0), 0);
  const totalPossible = academicSummary?.total_possible_marks ?? subjectGrades.reduce((sum, g) => sum + (parseFloat(g.total_marks) || 100), 0);
  const avgPercentage = academicSummary?.average_percentage ?? (totalPossible > 0 ? ((totalObtained / totalPossible) * 100).toFixed(1) : 0);
  const classRank = academicSummary?.class_rank ? `${academicSummary.class_rank}` : "Pending";
  const gradeRank = academicSummary?.grade_rank ? `${academicSummary.grade_rank}` : "Pending";
  const passedCount = academicSummary?.subjects_passed ?? subjectGrades.filter((g) => (parseFloat(g.score) || 0) >= (g.pass_mark || 50)).length;
  const failedCount = academicSummary?.subjects_failed ?? (subjectGrades.length - passedCount);

  doc.setFontSize(8.5);
  doc.setTextColor(...darkText);

  // Row 1
  doc.setFont("helvetica", "bold");
  doc.text("Total Marks Obtained:", 18, summaryBoxY + 14);
  doc.setFont("helvetica", "normal");
  doc.text(`${parseFloat(totalObtained).toFixed(1)} / ${parseFloat(totalPossible).toFixed(0)}`, 58, summaryBoxY + 14);

  doc.setFont("helvetica", "bold");
  doc.text("Average Percentage:", 90, summaryBoxY + 14);
  doc.setFont("helvetica", "normal");
  doc.text(`${parseFloat(avgPercentage).toFixed(1)}%`, 130, summaryBoxY + 14);

  doc.setFont("helvetica", "bold");
  doc.text("Class Rank:", 152, summaryBoxY + 14);
  doc.setFont("helvetica", "normal");
  doc.text(`${classRank}`, 174, summaryBoxY + 14);

  // Row 2
  doc.setFont("helvetica", "bold");
  doc.text("Subjects Passed:", 18, summaryBoxY + 22);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(16, 120, 80);
  doc.text(`${passedCount} Subjects`, 58, summaryBoxY + 22);

  doc.setTextColor(...darkText);
  doc.setFont("helvetica", "bold");
  doc.text("Subjects Failed:", 90, summaryBoxY + 22);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(failedCount > 0 ? 220 : 100, failedCount > 0 ? 38 : 116, failedCount > 0 ? 38 : 139);
  doc.text(`${failedCount} Subjects`, 130, summaryBoxY + 22);

  doc.setTextColor(...darkText);
  doc.setFont("helvetica", "bold");
  doc.text("Grade Rank:", 152, summaryBoxY + 22);
  doc.setFont("helvetica", "normal");
  doc.text(`${gradeRank}`, 174, summaryBoxY + 22);

  // Row 3 - Promotion status
  doc.setFont("helvetica", "bold");
  doc.text("Academic Status:", 18, summaryBoxY + 28);
  doc.setFont("helvetica", "normal");
  const isPromoted = parseFloat(avgPercentage) >= 50 && failedCount <= 2;
  doc.setTextColor(isPromoted ? 16 : 220, isPromoted ? 120 : 38, isPromoted ? 80 : 38);
  doc.text(isPromoted ? "Satisfactory Academic Progress" : "Academic Review / Remedial Required", 58, summaryBoxY + 28);

  // 6. Signatures and Official Stamp Section
  const sigY = pageHeight - 34;
  doc.setDrawColor(180, 190, 200);
  doc.setLineWidth(0.4);

  // Signature 1: Homeroom Teacher
  doc.line(20, sigY, 70, sigY);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...mutedText);
  doc.text("Homeroom Teacher Signature", 45, sigY + 4, { align: "center" });

  // Stamp Box: Middle
  doc.setDrawColor(200, 210, 220);
  doc.roundedRect(88, sigY - 14, 34, 20, 2, 2);
  doc.setFontSize(7);
  doc.text("School Official Stamp", 105, sigY - 4, { align: "center" });

  // Signature 2: Principal / Director
  doc.line(140, sigY, 190, sigY);
  doc.setFontSize(8);
  doc.text("School Principal / Director", 165, sigY + 4, { align: "center" });

  // 7. Footer Security Notice
  doc.setFontSize(7);
  doc.setTextColor(140, 150, 160);
  doc.text(
    `Official document of Habucho Secondary School. Generated on ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}. Numerical grading system compliant with Ethiopian MoE.`,
    pageWidth / 2,
    pageHeight - 11,
    { align: "center" }
  );

  const safeName = (student.full_name || student.name || "student").toLowerCase().replace(/[^a-z0-9]/g, "_");
  doc.save(`report_card_${safeName}_${academicYear.replace(/\//g, "-")}_${semester.replace(/\s+/g, "_")}.pdf`);
};

