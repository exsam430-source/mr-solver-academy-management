import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../assets/logo.png"; // 🆕 Import logo from assets

// ===== BRANCH / ACADEMY INFORMATION =====
const ACADEMY_NAME = "MR SOLVER";
const ACADEMY_TAGLINE = "Tech & IT Learning Hub";
const ACADEMY_SLOGAN = "Learn • Grow • Lead";
const BRANCH_NAME = "NEXTEP Branch";
const BRANCH_CODE = "MAIN";
const ACADEMY_ADDRESS = "Kabal Bazar opposite Kabal Ground Swat, KPK, Pakistan";
const ACADEMY_CITY = "Kabal Swat";
const ACADEMY_PHONE = "0347-8932237";
const ACADEMY_EMAIL = "mrsolvertechitlearninghub@gmail.com";
const BRANCH_MANAGER = "Mr Solver";

// ===== THEME COLORS (Mr Solver Brand) =====
const COLORS = {
  primary: [25, 86, 169],
  primaryDark: [15, 60, 130],
  accent: [240, 110, 35],
  accentLight: [255, 145, 75],
  success: [34, 197, 94],
  danger: [239, 68, 68],
  light: [240, 245, 255],
  lightOrange: [255, 240, 230],
  gray: [100, 100, 100],
  dark: [30, 30, 30],
};

// ===== 🆕 LOGO HELPER — Convert imported logo to Base64 =====
let LOGO_BASE64 = null;

// Pre-load logo as base64 on module load
const loadLogoAsBase64 = () =>
  new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      try {
        LOGO_BASE64 = canvas.toDataURL("image/png");
      } catch (err) {
        console.warn("Logo conversion failed:", err);
        LOGO_BASE64 = null;
      }
      resolve(LOGO_BASE64);
    };
    img.onerror = () => {
      console.warn("Logo could not be loaded");
      resolve(null);
    };
    img.src = logo;
  });

// Load logo immediately when module is imported
loadLogoAsBase64();

// Optional: manual override
export const setLogo = (base64String) => {
  LOGO_BASE64 = base64String;
};

// Ensure logo is loaded before drawing (used by PDF functions)
const ensureLogoLoaded = async () => {
  if (!LOGO_BASE64) {
    await loadLogoAsBase64();
  }
};

// ===== HELPER: Draw Header with Logo & Branding =====
const drawHeader = (doc, subtitle = "") => {
  const pageWidth = doc.internal.pageSize.getWidth();

  // Top header bar (Blue)
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, pageWidth, 42, "F");

  // Orange accent stripe
  doc.setFillColor(...COLORS.accent);
  doc.rect(0, 42, pageWidth, 3, "F");

  // Logo
    // Logo (no white background — direct draw with transparency)
  if (LOGO_BASE64) {
    try {
      doc.addImage(LOGO_BASE64, "PNG", 10, 5, 32, 32);
    } catch (err) {
      console.warn("Logo could not be drawn:", err);
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("MS", 27, 24, { align: "center" });
    }
  } else {
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("MS", 27, 24, { align: "center" });
  }
  
  // Academy Name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(ACADEMY_NAME, pageWidth / 2, 14, { align: "center" });

  // Tagline
  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(255, 200, 150);
  doc.text(ACADEMY_TAGLINE, pageWidth / 2, 20, { align: "center" });

  // Contact info
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text(ACADEMY_ADDRESS, pageWidth / 2, 27, { align: "center" });
  doc.text(
    `Phone: ${ACADEMY_PHONE}  |  Email: ${ACADEMY_EMAIL}`,
    pageWidth / 2,
    32,
    { align: "center" }
  );
  doc.text(
    `${BRANCH_NAME} (${BRANCH_CODE})  |  Manager: ${BRANCH_MANAGER}`,
    pageWidth / 2,
    37,
    { align: "center" }
  );

  // 🆕 Watermark Logo (faded center background)
  if (LOGO_BASE64) {
    try {
      const pageHeight = doc.internal.pageSize.getHeight();
      const wmSize = 120;
      const wmX = (pageWidth - wmSize) / 2;
      const wmY = (pageHeight - wmSize) / 2;
      doc.saveGraphicsState();
      doc.setGState(new doc.GState({ opacity: 0.06 }));
      doc.addImage(LOGO_BASE64, "PNG", wmX, wmY, wmSize, wmSize);
      doc.restoreGraphicsState();
    } catch (err) {
      // ignore watermark errors
    }
  }

  // Subtitle
  if (subtitle) {
    doc.setTextColor(...COLORS.primaryDark);
    doc.setFontSize(15);
    doc.setFont("helvetica", "bold");
    doc.text(subtitle, pageWidth / 2, 55, { align: "center" });

    doc.setDrawColor(...COLORS.accent);
    doc.setLineWidth(0.8);
    const textWidth = doc.getTextWidth(subtitle);
    doc.line(
      pageWidth / 2 - textWidth / 2,
      57,
      pageWidth / 2 + textWidth / 2,
      57
    );
  }
};

// ===== HELPER: Draw Footer =====
const drawFooter = (doc) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageCount = doc.internal.getNumberOfPages();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    doc.setDrawColor(...COLORS.accent);
    doc.setLineWidth(0.5);
    doc.line(15, pageHeight - 22, pageWidth - 15, pageHeight - 22);

    doc.setTextColor(...COLORS.primary);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(ACADEMY_SLOGAN, pageWidth / 2, pageHeight - 16, {
      align: "center",
    });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...COLORS.gray);
    doc.text(
      `Page ${i} of ${pageCount}  |  Generated: ${new Date().toLocaleString("en-PK")}  |  ${BRANCH_NAME}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );
    doc.text(
      "This is a computer-generated document and does not require a signature.",
      pageWidth / 2,
      pageHeight - 6,
      { align: "center" }
    );
  }
};

// ====================================================
// ===== FEE INVOICE / RECEIPT PDF =====
// ====================================================
export const generateFeeSlip = async (fee) => {
  await ensureLogoLoaded(); // 🆕 ensure logo loaded
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  drawHeader(doc, "FEE PAYMENT RECEIPT");

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.dark);
  doc.text(`Invoice No: ${fee.invoiceNumber || "N/A"}`, 15, 68);
  doc.text(
    `Date: ${new Date(fee.date).toLocaleDateString("en-PK", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}`,
    pageWidth - 15,
    68,
    { align: "right" }
  );

  doc.setFillColor(...COLORS.light);
  doc.rect(15, 74, pageWidth - 30, 38, "F");
  doc.setFillColor(...COLORS.accent);
  doc.rect(15, 74, 3, 38, "F");

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.primary);
  doc.text("STUDENT INFORMATION", 22, 82);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.dark);
  doc.setFontSize(9);

  doc.text("Name:", 22, 90);
  doc.setFont("helvetica", "bold");
  doc.text(fee.student?.name || "—", 52, 90);

  doc.setFont("helvetica", "normal");
  doc.text("Father Name:", 22, 96);
  doc.setFont("helvetica", "bold");
  doc.text(fee.student?.fatherName || "—", 52, 96);

  doc.setFont("helvetica", "normal");
  doc.text("Phone:", 22, 102);
  doc.setFont("helvetica", "bold");
  doc.text(fee.student?.phone || "—", 52, 102);

  doc.setFont("helvetica", "normal");
  doc.text("Admission No:", pageWidth / 2 + 5, 90);
  doc.setFont("helvetica", "bold");
  doc.text(fee.student?.admissionNumber || "—", pageWidth / 2 + 42, 90);

  doc.setFont("helvetica", "normal");
  doc.text("Course:", pageWidth / 2 + 5, 96);
  doc.setFont("helvetica", "bold");
  doc.text(fee.course?.courseName || "—", pageWidth / 2 + 42, 96);

  doc.setFont("helvetica", "normal");
  doc.text("Status:", pageWidth / 2 + 5, 102);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.success);
  doc.text("PAID", pageWidth / 2 + 42, 102);

  autoTable(doc, {
    startY: 120,
    head: [["Description", "Period", "Amount (PKR)"]],
    body: [
      [
        `${fee.feeType.charAt(0).toUpperCase() + fee.feeType.slice(1)} Fee`,
        fee.month && fee.year ? `${fee.month} ${fee.year}` : "—",
        `Rs. ${fee.amount?.toLocaleString()}`,
      ],
    ],
    styles: { fontSize: 11, cellPadding: 6, textColor: COLORS.dark },
    headStyles: { fillColor: COLORS.primary, textColor: 255, fontStyle: "bold" },
    columnStyles: { 2: { halign: "right", fontStyle: "bold" } },
    alternateRowStyles: { fillColor: COLORS.light },
  });

  const finalY = doc.lastAutoTable.finalY + 5;

  doc.setFillColor(...COLORS.accent);
  doc.rect(pageWidth - 95, finalY, 80, 16, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL PAID:", pageWidth - 90, finalY + 10);
  doc.text(`Rs. ${fee.amount?.toLocaleString()}`, pageWidth - 20, finalY + 10, {
    align: "right",
  });

  if (fee.notes) {
    doc.setTextColor(...COLORS.dark);
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.text(`Notes: ${fee.notes}`, 15, finalY + 26);
  }

  doc.setTextColor(...COLORS.gray);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Collected By: ${fee.collectedBy?.name || BRANCH_MANAGER}`,
    15,
    finalY + 36
  );

  doc.setTextColor(...COLORS.primary);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Thank you for your payment!", pageWidth / 2, finalY + 48, {
    align: "center",
  });

  drawFooter(doc);
  doc.save(`Fee_Receipt_${fee.invoiceNumber || Date.now()}.pdf`);
};

// ====================================================
// ===== MONTHLY COLLECTION REPORT PDF =====
// ====================================================
export const generateMonthlyReport = async (reportData) => {
  await ensureLogoLoaded(); // 🆕
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  drawHeader(
    doc,
    `Monthly Collection Report - ${reportData.month} ${reportData.year}`
  );

  doc.setTextColor(...COLORS.primary);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("COLLECTION SUMMARY", 15, 68);

  const cardWidth = (pageWidth - 40) / 2;

  doc.setFillColor(...COLORS.success);
  doc.rect(15, 72, cardWidth, 22, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("TOTAL COLLECTION", 20, 80);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(`Rs. ${reportData.totalCollection?.toLocaleString()}`, 20, 89);

  doc.setFillColor(...COLORS.accent);
  doc.rect(25 + cardWidth, 72, cardWidth, 22, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("TOTAL RECORDS", 30 + cardWidth, 80);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(`${reportData.totalRecords}`, 30 + cardWidth, 89);

  const typeData = Object.entries(reportData.byType || {}).map(
    ([type, info]) => [
      type.charAt(0).toUpperCase() + type.slice(1),
      info.count.toString(),
      `Rs. ${info.total.toLocaleString()}`,
    ]
  );

  doc.setTextColor(...COLORS.primary);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("FEE TYPE BREAKDOWN", 15, 104);

  autoTable(doc, {
    startY: 107,
    head: [["Fee Type", "Records", "Amount"]],
    body: typeData,
    styles: { fontSize: 10, cellPadding: 4 },
    headStyles: { fillColor: COLORS.primary, textColor: 255 },
    columnStyles: { 2: { halign: "right", fontStyle: "bold" } },
    alternateRowStyles: { fillColor: COLORS.light },
  });

  let nextY = doc.lastAutoTable.finalY + 8;
  doc.setTextColor(...COLORS.primary);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("COURSE-WISE BREAKDOWN", 15, nextY);

  const courseData = Object.entries(reportData.byCourse || {}).map(
    ([course, info]) => [
      course,
      info.count.toString(),
      `Rs. ${info.total.toLocaleString()}`,
    ]
  );

  autoTable(doc, {
    startY: nextY + 3,
    head: [["Course", "Records", "Amount"]],
    body: courseData,
    styles: { fontSize: 10, cellPadding: 4 },
    headStyles: { fillColor: COLORS.accent, textColor: 255 },
    columnStyles: { 2: { halign: "right", fontStyle: "bold" } },
    alternateRowStyles: { fillColor: COLORS.lightOrange },
  });

  nextY = doc.lastAutoTable.finalY + 8;
  doc.setTextColor(...COLORS.primary);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("ALL TRANSACTIONS", 15, nextY);

  const txData = (reportData.fees || []).map((f) => [
    f.invoiceNumber || "—",
    new Date(f.date).toLocaleDateString(),
    f.student?.name || "—",
    f.course?.courseName || "—",
    f.feeType,
    `Rs. ${f.amount.toLocaleString()}`,
  ]);

  autoTable(doc, {
    startY: nextY + 3,
    head: [["Invoice", "Date", "Student", "Course", "Type", "Amount"]],
    body: txData,
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: COLORS.primary, textColor: 255 },
    columnStyles: { 5: { halign: "right", fontStyle: "bold" } },
    alternateRowStyles: { fillColor: COLORS.light },
  });

  drawFooter(doc);
  doc.save(`Monthly_Report_${reportData.month}_${reportData.year}.pdf`);
};

// ====================================================
// ===== STUDENT FEE STATEMENT PDF =====
// ====================================================
export const generateStudentStatement = async (data) => {
  await ensureLogoLoaded(); // 🆕
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  drawHeader(doc, "STUDENT FEE STATEMENT");

  doc.setFillColor(...COLORS.light);
  doc.rect(15, 65, pageWidth - 30, 28, "F");
  doc.setFillColor(...COLORS.accent);
  doc.rect(15, 65, 3, 28, "F");

  doc.setTextColor(...COLORS.primary);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("STUDENT DETAILS", 22, 72);

  doc.setTextColor(...COLORS.dark);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Student Name:", 22, 80);
  doc.setFont("helvetica", "bold");
  doc.text(data.student?.name || "—", 55, 80);

  doc.setFont("helvetica", "normal");
  doc.text("Father Name:", 22, 86);
  doc.setFont("helvetica", "bold");
  doc.text(data.student?.fatherName || "—", 55, 86);

  doc.setFont("helvetica", "normal");
  doc.text("Phone:", 22, 92);
  doc.setFont("helvetica", "bold");
  doc.text(data.student?.phone || "—", 55, 92);

  doc.setFont("helvetica", "normal");
  doc.text("Admission No:", pageWidth / 2 + 5, 80);
  doc.setFont("helvetica", "bold");
  doc.text(data.student?.admissionNumber || "—", pageWidth / 2 + 40, 80);

  doc.setFont("helvetica", "normal");
  doc.text("Generated:", pageWidth / 2 + 5, 86);
  doc.setFont("helvetica", "bold");
  doc.text(new Date().toLocaleDateString("en-PK"), pageWidth / 2 + 40, 86);

  let currentY = 102;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...COLORS.primary);
  doc.text("COURSE-WISE FEE BREAKDOWN", 15, currentY);
  currentY += 5;

  data.courseBreakdown?.forEach((cb) => {
    autoTable(doc, {
      startY: currentY,
      head: [[cb.course.courseName, "Status", "Amount"]],
      body: [
        [
          "Registration Fee",
          cb.registrationPaid ? "PAID" : "PENDING",
          `Rs. ${(cb.registrationAmount || cb.course.registrationFee || 0).toLocaleString()}`,
        ],
        [
          "Monthly Fees Paid",
          `${cb.paidMonthsCount} months`,
          `Rs. ${cb.totalPaid.toLocaleString()}`,
        ],
        [
          "Pending Amount",
          cb.totalPending > 0 ? "DUE" : "CLEAR",
          `Rs. ${cb.totalPending.toLocaleString()}`,
        ],
      ],
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: COLORS.primary, textColor: 255 },
      columnStyles: { 2: { halign: "right" } },
      alternateRowStyles: { fillColor: COLORS.light },
    });
    currentY = doc.lastAutoTable.finalY + 5;
  });

  const halfWidth = (pageWidth - 30) / 2 - 2;

  doc.setFillColor(...COLORS.success);
  doc.rect(15, currentY, halfWidth, 20, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL PAID", 20, currentY + 8);
  doc.setFontSize(14);
  doc.text(`Rs. ${data.grandTotalPaid?.toLocaleString()}`, 20, currentY + 16);

  doc.setFillColor(...COLORS.danger);
  doc.rect(pageWidth / 2 + 2, currentY, halfWidth, 20, "F");
  doc.setFontSize(10);
  doc.text("TOTAL PENDING", pageWidth / 2 + 7, currentY + 8);
  doc.setFontSize(14);
  doc.text(
    `Rs. ${data.grandTotalPending?.toLocaleString()}`,
    pageWidth / 2 + 7,
    currentY + 16
  );

  drawFooter(doc);
  doc.save(
    `Statement_${data.student?.name?.replace(/\s/g, "_") || "Student"}.pdf`
  );
};