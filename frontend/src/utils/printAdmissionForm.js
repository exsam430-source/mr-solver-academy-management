import logo from "../assets/logo.png";

const fmtDate = (d) => {
  if (!d) return "";
  const date = new Date(d);
  if (isNaN(date)) return "";
  return date.toLocaleDateString("en-PK", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const cb = (checked) => (checked ? "☑" : "☐");
const u = (val) => `<span class="u">${val || ""}</span>`;

const buildHTML = (data) => {
  const {
    regNo, admissionNumber, stdId, formDate,
    name, fatherName, dateOfBirth, gender, cnic,
    phone, parentPhone, email, address, permanentAddress,
    qualification, schoolCollegeName, passingYear,
    enrolledCoursesData = [], batch, classTimings,
    courseDuration, startingDate, completionDate,
    emergencyContact, emergencyRelation,
    documents = {},
    admissionFee, monthlyFee, discount, totalFee,
    photoPreview,
  } = data;

  const ALL_COURSES = [
    "DIT", "CIT", "FIT",
    "Microsoft Office 365", "Graphics Designing", "Video Editing",
    "Basic Cyber Security", "Advance Cyber Security", "Extend Cyber Security",
    "AI Fundamental", "Advanced AI", "Extended AI",
    "Prompt Engineering", "Digital Marketing", "E-Commerce",
    "Python", "Java", "C++",
    "JavaScript", "Full Stack Development", "Web Development",
    "Freelancing", "Spoken English", "IELTS",
    "PTE", "OET", "TOEFL",
    "Basic Coaching Classes", "Class 5th to 8th", "Class 9th to 10th",
    "1st Year Coaching", "2nd Year Coaching", "BS Coaching Classes",
  ];

  const selectedNames = enrolledCoursesData.map((c) => c.courseName?.toLowerCase());
  const isCourseChecked = (name) => selectedNames.some((n) => n === name.toLowerCase());
  const courseHTML = ALL_COURSES
    .map((c) => `<div class="course-item">${cb(isCourseChecked(c))} ${c}</div>`)
    .join("");

  const qualOpts = ["matric", "intermediate", "bachelor", "master", "other"];
  const qualHTML = qualOpts
    .map((q) => `<span class="qual-opt">${cb(qualification === q)} ${q.charAt(0).toUpperCase() + q.slice(1)}</span>`)
    .join(" ");

  const selectedCourseName = enrolledCoursesData[0]?.courseName || "";

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Student Admission Form - MR SOLVER</title>
<style>
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Times New Roman', serif;
    color: #1a1a1a;
    background: #fff;
    font-size: 11.5px;
    line-height: 1.55;
  }

  .page {
    width: 210mm;
    height: 297mm;
    padding: 10mm 12mm;
    position: relative;
    page-break-after: always;
    background: #fff;
    display: flex;
    flex-direction: column;
  }
  .page:last-child { page-break-after: auto; }

  .border-frame {
    position: absolute;
    top: 5mm; left: 5mm; right: 5mm; bottom: 5mm;
    border: 2px solid #1956A9;
    pointer-events: none;
  }
  .border-frame::before {
    content: '';
    position: absolute;
    top: 2mm; left: 2mm; right: 2mm; bottom: 2mm;
    border: 1px solid #1956A9;
  }
  .corner {
    position: absolute;
    width: 7mm; height: 7mm;
    background: #F06E23;
    border-radius: 1mm;
  }
  .corner.tl { top: -3.5mm; left: -3.5mm; }
  .corner.tr { top: -3.5mm; right: -3.5mm; }
  .corner.bl { bottom: -3.5mm; left: -3.5mm; }
  .corner.br { bottom: -3.5mm; right: -3.5mm; }

  .watermark {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 130mm; height: 130mm;
    opacity: 0.07;
    background-image: url('${logo}');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    pointer-events: none;
    z-index: 0;
  }

  .content {
    position: relative;
    z-index: 1;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  /* === HEADER === */
  .header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-bottom: 6px;
    border-bottom: 1.5px solid #1956A9;
    margin-bottom: 6px;
    padding-right: 38mm; /* space for photo box */
  }
  .header img.logo {
    width: 55px; height: 55px;
    object-fit: contain;
    flex-shrink: 0;
  }
  .header-text { flex: 1; text-align: center; }
  .header-text h1 {
    color: #1956A9;
    font-size: 17px;
    font-weight: bold;
    letter-spacing: 0.3px;
    line-height: 1.2;
  }
  .header-text .subtitle {
    color: #1956A9;
    font-size: 10.5px;
    margin-top: 2px;
    font-weight: 600;
  }
  .header-text .slogan {
    color: #F06E23;
    font-size: 10.5px;
    font-weight: bold;
    margin-top: 2px;
    letter-spacing: 1px;
  }

  .branches {
    font-size: 10.5px;
    line-height: 1.5;
    margin-bottom: 6px;
    padding: 3px 0;
  }
  .branches b { color: #1956A9; }
  .branches i { color: #333; }

  h2.section {
    color: #1956A9;
    font-size: 13.5px;
    font-weight: bold;
    margin: 7px 0 4px;
    border-bottom: 1px solid #1956A9;
    padding-bottom: 2px;
  }
  h2.form-title {
    color: #1956A9;
    font-size: 15px;
    font-weight: bold;
    margin: 5px 0 6px;
    letter-spacing: 0.5px;
  }

  .row {
    display: flex;
    gap: 16px;
    margin: 5px 0;
    flex-wrap: wrap;
  }
  .field {
    flex: 1;
    min-width: 130px;
    font-size: 11px;
  }
  .field label {
    font-weight: 600;
    margin-right: 4px;
  }
  .u {
    display: inline-block;
    min-width: 90px;
    border-bottom: 1px solid #555;
    padding: 0 4px;
    font-weight: 600;
    color: #000;
  }
  .qual-opt {
    margin-right: 12px;
    font-size: 11.5px;
  }

  .course-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 5px 18px;
    margin-top: 5px;
  }
  .course-item {
    font-size: 11px;
    padding: 1px 0;
  }

  .rules { font-size: 11px; line-height: 1.75; }
  .rules p { margin: 3px 0; }
  .rules .num { font-weight: bold; color: #F06E23; }

  .declaration {
    font-size: 11px;
    line-height: 1.7;
    margin: 8px 0;
    text-align: justify;
  }

  .sig-row {
    display: flex;
    justify-content: space-between;
    margin: 18px 0;
    gap: 30px;
  }
  .sig-row .field { flex: 1; }

  .docs-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 5px 18px;
    margin: 5px 0 8px;
    font-size: 11.5px;
  }

  .office-use h2 { color: #F06E23; }

  /* Photo Box */
  .photo-box {
    position: absolute;
    top: 12mm;
    right: 16mm;
    width: 30mm;
    height: 36mm;
    border: 1.5px solid #1956A9;
    background: #fff;
    z-index: 2;
    overflow: hidden;
  }
  .photo-box img { width: 100%; height: 100%; object-fit: cover; }
  .photo-box .ph-label {
    font-size: 9px;
    color: #1956A9;
    text-align: center;
    padding: 14mm 2px 0;
  }

  .spacer { flex: 1; }

  .no-print {
    position: fixed;
    top: 15px;
    right: 15px;
    z-index: 1000;
  }
  .no-print button {
    padding: 10px 20px;
    background: linear-gradient(90deg, #F06E23, #D45A15);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    box-shadow: 0 4px 12px rgba(240,110,35,0.4);
    margin-left: 8px;
  }
  .no-print button.secondary {
    background: linear-gradient(90deg, #1956A9, #0F3C82);
    box-shadow: 0 4px 12px rgba(25,86,169,0.4);
  }

  @media print {
    .no-print { display: none; }
  }
</style>
</head>
<body>

<div class="no-print">
  <button onclick="window.print()">🖨️ Print</button>
  <button class="secondary" onclick="window.close()">✕ Close</button>
</div>

<!-- ============ PAGE 1 ============ -->
<div class="page">
  <div class="border-frame">
    <div class="corner tl"></div><div class="corner tr"></div>
    <div class="corner bl"></div><div class="corner br"></div>
  </div>
  <div class="watermark"></div>

  ${photoPreview ? `<div class="photo-box"><img src="${photoPreview}" alt="Photo" /></div>` : `<div class="photo-box"><div class="ph-label">Paste Photo</div></div>`}

  <div class="content">
    <div class="header">
      <img src="${logo}" class="logo" alt="Logo" />
      <div class="header-text">
        <h1>MR SOLVER TECH &amp; IT LEARNING HUB</h1>
        <div class="subtitle">Learn Skills • Build Your Future</div>
        <div class="slogan">LEARN → GROW → LEAD</div>
      </div>
    </div>

    <div class="branches">
      <b>Branch 1:</b> <i>Near Kabal Chowk, Back Side the Iqbal Market Froebel College</i><br/>
      <b>Branch 2:</b> <i>Opposite Pak Scholar Girls School, Tanchkia Prime College</i><br/>
      <b>Contact:</b> 0347-8932237 / 0348-0989356 &nbsp;&nbsp; <b>Email:</b> mrsolverlearninghub@gmail.com
    </div>

    <h2 class="form-title">STUDENT ADMISSION &amp; REGISTRATION FORM</h2>

    <div class="row">
      <div class="field"><label>Reg No:</label> ${u(regNo)}</div>
      <div class="field"><label>Date:</label> ${u(fmtDate(formDate))}</div>
      <div class="field"><label>Adm No:</label> ${u(admissionNumber)}</div>
      <div class="field"><label>STD-ID:</label> ${u(stdId)}</div>
    </div>

    <h2 class="section">1. Personal Information</h2>
    <div class="row">
      <div class="field"><label>Student Name:</label> ${u(name)}</div>
      <div class="field"><label>Father Name:</label> ${u(fatherName)}</div>
    </div>
    <div class="row">
      <div class="field"><label>Date of Birth:</label> ${u(fmtDate(dateOfBirth))}</div>
      <div class="field"><label>Gender:</label> ${cb(gender === "male")} Male &nbsp; ${cb(gender === "female")} Female</div>
    </div>
    <div class="row">
      <div class="field"><label>CNIC No:</label> ${u(cnic)}</div>
      <div class="field"><label>Student Contact No:</label> ${u(phone)}</div>
    </div>
    <div class="row">
      <div class="field"><label>Parent Contact No:</label> ${u(parentPhone)}</div>
      <div class="field"><label>Email Address:</label> ${u(email)}</div>
    </div>
    <div class="row">
      <div class="field" style="flex: 1 1 100%;"><label>Present Address:</label> ${u(address)}</div>
    </div>
    <div class="row">
      <div class="field" style="flex: 1 1 100%;"><label>Permanent Address:</label> ${u(permanentAddress)}</div>
    </div>

    <h2 class="section">2. Educational Information</h2>
    <div class="row">
      <div class="field" style="flex: 1 1 100%;">
        <label>Qualification:</label> ${qualHTML}
      </div>
    </div>
    <div class="row">
      <div class="field"><label>School/College/University Name:</label> ${u(schoolCollegeName)}</div>
      <div class="field"><label>Passing Year:</label> ${u(passingYear)}</div>
    </div>

    <h2 class="section">3. Course Information</h2>
    <div class="course-grid">
      ${courseHTML}
    </div>

    <div class="row" style="margin-top: 10px;">
      <div class="field"><label>Selected Course:</label> ${u(selectedCourseName)}</div>
      <div class="field">
        <label>Batch:</label>
        ${cb(batch === "morning")} Morning &nbsp;
        ${cb(batch === "evening")} Evening &nbsp;
        ${cb(batch === "weekend")} Weekend
      </div>
    </div>
    <div class="row">
      <div class="field"><label>Course Duration:</label> ${u(courseDuration)}</div>
      <div class="field"><label>Starting Date:</label> ${u(fmtDate(startingDate))}</div>
      <div class="field"><label>Completion Date:</label> ${u(fmtDate(completionDate))}</div>
    </div>

    <div class="spacer"></div>
  </div>
</div>

<!-- ============ PAGE 2 ============ -->
<div class="page">
  <div class="border-frame">
    <div class="corner tl"></div><div class="corner tr"></div>
    <div class="corner bl"></div><div class="corner br"></div>
  </div>
  <div class="watermark"></div>

  <div class="content">
    <h2 class="section">4. Emergency Contact Information</h2>
    <div class="row">
      <div class="field"><label>Emergency Contact:</label> ${u(emergencyContact)}</div>
      <div class="field"><label>Relationship with Student:</label> ${u(emergencyRelation)}</div>
    </div>

    <h2 class="section">5. Required Documents Checklist</h2>
    <div class="docs-grid">
      <div>${cb(documents.passportPhotos)} Passport Size Photographs (2)</div>
      <div>${cb(documents.cnicCopy)} Copy of CNIC/B-Form</div>
      <div>${cb(documents.educationalCertificates)} Educational Certificates</div>
      <div>${cb(documents.parentCnicCopy)} Parent/Guardian CNIC Copy</div>
      <div>${cb(documents.domicileCertificate)} Domicile Certificate</div>
      <div>${cb(documents.matricDmc)} Matric DMC</div>
    </div>

    <h2 class="section">Institute Rules &amp; Student Agreement</h2>
    <div class="rules">
      <p><span class="num">1.</span> Admission and registration fees are non-refundable and non-transferable.</p>
      <p><span class="num">2.</span> Students must maintain at least 80% attendance.</p>
      <p><span class="num">3.</span> Monthly fees must be paid before the due date.</p>
      <p><span class="num">4.</span> Students must maintain discipline and professional behavior.</p>
      <p><span class="num">5.</span> Misconduct, fighting, cheating, or harassment may result in suspension or expulsion.</p>
      <p><span class="num">6.</span> Certificates will be issued only after course completion and clearance of dues.</p>
      <p><span class="num">7.</span> The institute is not responsible for loss of personal belongings.</p>
      <p><span class="num">8.</span> Students must use institute resources for educational purposes only.</p>
      <p><span class="num">9.</span> The institute reserves the right to modify policies, schedules, and course timings when necessary.</p>
    </div>

    <h2 class="section">Declaration</h2>
    <p class="declaration">
      I hereby declare that all information provided in this form is true and correct.
      I have read and understood all the rules and regulations of MR SOLVER TECH &amp; IT
      LEARNING HUB and agree to abide by them.
    </p>

    <div class="sig-row">
      <div class="field"><label>Student Sign:</label> ${u("")}</div>
      <div class="field"><label>Parent/Guardian Sign:</label> ${u("")}</div>
    </div>
    <div class="sig-row">
      <div class="field"><label>Administrator Sign:</label> ${u("")}</div>
      <div class="field"><label>Institute Stamp:</label> ${u("")}</div>
    </div>

    <div class="office-use">
      <h2 class="section">For Office Use Only</h2>
      <div class="row">
        <div class="field"><label>Course:</label> ${u(selectedCourseName)}</div>
        <div class="field"><label>Admission Fee:</label> ${u(admissionFee ? "Rs. " + Number(admissionFee).toLocaleString() : "")}</div>
        <div class="field"><label>Monthly Fee:</label> ${u(monthlyFee ? "Rs. " + Number(monthlyFee).toLocaleString() : "")}</div>
      </div>
      <div class="row">
        <div class="field"><label>Discount/Scholarship:</label> ${u(discount ? "Rs. " + Number(discount).toLocaleString() : "")}</div>
        <div class="field"><label>Total Fee:</label> ${u(totalFee ? "Rs. " + Number(totalFee).toLocaleString() : "")}</div>
        <div class="field"><label>Class Timing:</label> ${u(classTimings)}</div>
      </div>
    </div>

    <div class="spacer"></div>

    <div style="text-align: center; padding: 8px 0; border-top: 1px dashed #1956A9; margin-top: 12px;">
      <p style="color: #F06E23; font-weight: bold; font-size: 11px; letter-spacing: 1.5px;">
        LEARN → GROW → LEAD
      </p>
      <p style="color: #1956A9; font-size: 10px; margin-top: 2px; font-weight: 600;">
        MR SOLVER TECH &amp; IT LEARNING HUB
      </p>
    </div>
  </div>
</div>

</body>
</html>
  `;
};

export const printAdmissionForm = (data) => {
  const html = buildHTML(data);
  const printWindow = window.open("", "_blank", "width=900,height=700");
  if (!printWindow) {
    alert("Please allow popups to print the form.");
    return;
  }
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
};

export const downloadAdmissionFormPDF = (data) => {
  printAdmissionForm(data);
};