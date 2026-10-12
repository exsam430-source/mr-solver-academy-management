import asyncHandler from "express-async-handler";
import Student from "../models/Student.js";
import Fee from "../models/Fee.js";
import Attendance from "../models/Attendance.js";
import fs from "fs";





const addStudent = asyncHandler(async (req, res) => {
  const {
    regNo, admissionNumber, stdId, formDate,
    name, fatherName, fatherOccupation, domicile,
    dateOfBirth, gender, cnic,
    phone, parentPhone, email, address, permanentAddress,
    qualification, schoolCollegeName, passingYear,
    enrolledCourses, batch, classTimings,
    courseDuration, startingDate, completionDate,
    emergencyContact, emergencyRelation,
    documents,
    admissionFee, monthlyFee, discount, totalFee,
    registrationDate,
    previousFees, // 🆕 NEW
  } = req.body;

  if (!name || !fatherName || !phone) {
    res.status(400);
    throw new Error("Please fill all required fields ❌");
  }

  const branch = req.branchId;
  if (!branch) {
    res.status(400);
    throw new Error("Please select a branch first ❌");
  }

  let parsedCourses = [];
  if (enrolledCourses) {
    try {
      parsedCourses = typeof enrolledCourses === "string"
        ? JSON.parse(enrolledCourses)
        : enrolledCourses;
    } catch {
      res.status(400);
      throw new Error("Invalid courses format ❌");
    }
  }
  if (!Array.isArray(parsedCourses) || parsedCourses.length === 0) {
    res.status(400);
    throw new Error("Please select at least one course ❌");
  }

  let parsedDocuments = {};
  if (documents) {
    try {
      parsedDocuments = typeof documents === "string"
        ? JSON.parse(documents)
        : documents;
    } catch {
      parsedDocuments = {};
    }
  }

  // 🆕 Parse previous fees
  let parsedPreviousFees = [];
  if (previousFees) {
    try {
      parsedPreviousFees = typeof previousFees === "string"
        ? JSON.parse(previousFees)
        : previousFees;
    } catch {
      parsedPreviousFees = [];
    }
  }

  if (admissionNumber) {
    const existing = await Student.findOne({ admissionNumber, branch });
    if (existing) {
      res.status(400);
      throw new Error("Admission number already exists in this branch ❌");
    }
  }

  const student = await Student.create({
    branch,
    regNo: regNo || null,
    admissionNumber: admissionNumber || null,
    stdId: stdId || null,
    formDate: formDate || Date.now(),
    name,
    fatherName,
    fatherOccupation: fatherOccupation || null,
    domicile: domicile || null,
    dateOfBirth: dateOfBirth || null,
    gender: gender || null,
    cnic: cnic || null,
    phone,
    parentPhone: parentPhone || null,
    email: email || null,
    address: address || null,
    permanentAddress: permanentAddress || null,
    qualification: qualification || null,
    schoolCollegeName: schoolCollegeName || null,
    passingYear: passingYear || null,
    enrolledCourses: parsedCourses,
    batch: batch || null,
    classTimings: classTimings || null,
    courseDuration: courseDuration || null,
    startingDate: startingDate || null,
    completionDate: completionDate || null,
    emergencyContact: emergencyContact || null,
    emergencyRelation: emergencyRelation || null,
    documents: parsedDocuments,
    admissionFee: Number(admissionFee) || 0,
    monthlyFee: Number(monthlyFee) || 0,
    discount: Number(discount) || 0,
    totalFee: Number(totalFee) || 0,
    registrationDate: registrationDate || Date.now(),
    photo: req.file ? `/uploads/students/${req.file.filename}` : null,
  });

  // 🆕 Save previous fees (if any)
  if (Array.isArray(parsedPreviousFees) && parsedPreviousFees.length > 0) {
    const feeDocs = parsedPreviousFees
      .filter(
        (f) =>
          f.course &&
          f.feeType &&
          f.amount &&
          Number(f.amount) > 0
      )
      .map((f) => ({
        student: student._id,
        course: f.course,
        feeType: f.feeType,
        amount: Number(f.amount),
        month: f.month || null,
        year: f.year ? Number(f.year) : null,
        date: f.date ? new Date(f.date) : new Date(),
        notes: f.notes || "Previous fee (added during registration)",
        collectedBy: req.user._id,
        branch,
      }));

    if (feeDocs.length > 0) {
      // Insert one by one so pre('save') runs (invoiceNumber generation)
      for (const feeData of feeDocs) {
        try {
          await Fee.create(feeData);
        } catch (err) {
          console.warn("Skipped duplicate previous fee:", err.message);
        }
      }
    }
  }

  const populated = await Student.findById(student._id)
    .populate("enrolledCourses", "courseName monthlyFee")
    .populate("branch", "name code");

  res.status(201).json({
    success: true,
    message: "Student added successfully ✅",
    data: populated,
  });
});

// @desc    Get All Students (Branch-filtered)
const getAllStudents = asyncHandler(async (req, res) => {
  const { course, search, isActive } = req.query;

  let query = { ...req.branchFilter }; // 🔑 auto branch filter

  if (course) query.enrolledCourses = { $in: [course] };
  if (isActive !== undefined && isActive !== "") {
    query.isActive = isActive === "true";
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { fatherName: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
      { admissionNumber: { $regex: search, $options: "i" } },
    ];
  }

  const students = await Student.find(query)
    .populate("enrolledCourses", "courseName monthlyFee")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: students.length,
    data: students,
  });
});

// @desc    Get Single Student
// @route   GET /api/students/:id
// @access  Private/Admin
const getStudentById = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id).populate(
    "enrolledCourses",
    "courseName monthlyFee advanceFee registrationFee examFee"
  );

  if (!student) {
    res.status(404);
    throw new Error("Student not found ❌");
  }

  res.status(200).json({
    success: true,
    data: student,
  });
});


// @desc    Update Student
// @route   PUT /api/students/:id
// @access  Private/Admin
const updateStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) {
    res.status(404);
    throw new Error("Student not found ❌");
  }

  const body = req.body;

  // Parse courses
  let parsedCourses = student.enrolledCourses;
  if (body.enrolledCourses) {
    try {
      parsedCourses = typeof body.enrolledCourses === "string"
        ? JSON.parse(body.enrolledCourses)
        : body.enrolledCourses;
    } catch {
      res.status(400);
      throw new Error("Invalid courses format ❌");
    }
  }
  if (!Array.isArray(parsedCourses) || parsedCourses.length === 0) {
    res.status(400);
    throw new Error("Please select at least one course ❌");
  }

  // Parse documents
  let parsedDocuments = student.documents;
  if (body.documents) {
    try {
      parsedDocuments = typeof body.documents === "string"
        ? JSON.parse(body.documents)
        : body.documents;
    } catch {
      parsedDocuments = student.documents;
    }
  }

  // Duplicate admission no check
  if (body.admissionNumber && body.admissionNumber !== student.admissionNumber) {
    const existing = await Student.findOne({
      admissionNumber: body.admissionNumber,
      _id: { $ne: req.params.id },
    });
    if (existing) {
      res.status(400);
      throw new Error("Admission number already exists ❌");
    }
  }

  // Delete old photo if new uploaded
  if (req.file && student.photo) {
    const oldPath = `.${student.photo}`;
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
  }

  const fields = [
    "regNo","admissionNumber","stdId","formDate",
    "name","fatherName","fatherOccupation","domicile",
    "dateOfBirth","gender","cnic","phone","parentPhone",
    "email","address","permanentAddress",
    "qualification","schoolCollegeName","passingYear",
    "batch","classTimings","courseDuration","startingDate","completionDate",
    "emergencyContact","emergencyRelation",
    "registrationDate","isActive",
  ];

  const updatedData = {};
  fields.forEach((f) => {
    if (body[f] !== undefined) updatedData[f] = body[f];
  });

  // numeric fields
  ["admissionFee","monthlyFee","discount","totalFee"].forEach((f) => {
    if (body[f] !== undefined) updatedData[f] = Number(body[f]) || 0;
  });

  updatedData.enrolledCourses = parsedCourses;
  updatedData.documents = parsedDocuments;
  if (req.file) updatedData.photo = `/uploads/students/${req.file.filename}`;

  const updatedStudent = await Student.findByIdAndUpdate(
    req.params.id,
    updatedData,
    { new: true, runValidators: true }
  ).populate("enrolledCourses", "courseName monthlyFee");

  res.status(200).json({
    success: true,
    message: "Student updated successfully ✅",
    data: updatedStudent,
  });
});

// @desc    Delete Student
// @route   DELETE /api/students/:id
// @access  Private/Admin
const deleteStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    res.status(404);
    throw new Error("Student not found ❌");
  }

  if (student.photo) {
    const photoPath = `.${student.photo}`;
    if (fs.existsSync(photoPath)) {
      fs.unlinkSync(photoPath);
    }
  }

  await student.deleteOne();

  res.status(200).json({
    success: true,
    message: "Student deleted successfully ✅",
  });
});

// @desc    Get Student Fee History
// @route   GET /api/students/:id/fees
// @access  Private/Admin
const getStudentFees = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    res.status(404);
    throw new Error("Student not found ❌");
  }

  const fees = await Fee.find({ student: req.params.id })
    .populate("course", "courseName")
    .populate("collectedBy", "name")
    .sort({ createdAt: -1 });

  const totalPaid = fees.reduce((sum, fee) => sum + fee.amount, 0);

  res.status(200).json({
    success: true,
    count: fees.length,
    totalPaid,
    data: fees,
  });
});

// @desc    Get Student Attendance
// @route   GET /api/students/:id/attendance
// @access  Private/Admin
const getStudentAttendance = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    res.status(404);
    throw new Error("Student not found ❌");
  }

  const attendance = await Attendance.find({ student: req.params.id })
    .populate("course", "courseName")
    .populate("markedBy", "name")
    .sort({ date: -1 });

  const totalPresent = attendance.filter((a) => a.status === "present").length;
  const totalAbsent = attendance.filter((a) => a.status === "absent").length;

  res.status(200).json({
    success: true,
    count: attendance.length,
    totalPresent,
    totalAbsent,
    attendancePercentage:
      attendance.length > 0
        ? ((totalPresent / attendance.length) * 100).toFixed(2)
        : 0,
    data: attendance,
  });
});

const addPreviousFees = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) {
    res.status(404);
    throw new Error("Student not found ❌");
  }

  const branch = req.branchId || student.branch;
  const { previousFees } = req.body;

  let parsed = [];
  try {
    parsed = typeof previousFees === "string"
      ? JSON.parse(previousFees)
      : previousFees;
  } catch {
    res.status(400);
    throw new Error("Invalid previousFees format ❌");
  }

  if (!Array.isArray(parsed) || parsed.length === 0) {
    res.status(400);
    throw new Error("No previous fees provided ❌");
  }

  const created = [];
  const skipped = [];

  for (const f of parsed) {
    if (!f.course || !f.feeType || !f.amount || Number(f.amount) <= 0) {
      skipped.push({ ...f, reason: "Missing required fields" });
      continue;
    }

    // Check duplicate for monthly
    if (f.feeType === "monthly" && f.month && f.year) {
      const exists = await Fee.findOne({
        student: student._id,
        course: f.course,
        feeType: "monthly",
        month: f.month,
        year: Number(f.year),
      });
      if (exists) {
        skipped.push({ ...f, reason: `Already exists for ${f.month} ${f.year}` });
        continue;
      }
    }

    try {
      const fee = await Fee.create({
        student: student._id,
        course: f.course,
        feeType: f.feeType,
        amount: Number(f.amount),
        month: f.month || null,
        year: f.year ? Number(f.year) : null,
        date: f.date ? new Date(f.date) : new Date(),
        notes: f.notes || "Previous fee (manually added)",
        collectedBy: req.user._id,
        branch,
      });
      created.push(fee);
    } catch (err) {
      skipped.push({ ...f, reason: err.message });
    }
  }

  res.status(201).json({
    success: true,
    message: `${created.length} previous fee(s) added ✅ ${skipped.length ? `(${skipped.length} skipped)` : ""}`,
    createdCount: created.length,
    skippedCount: skipped.length,
    skipped,
  });
});

export {
  addStudent,
  getAllStudents,
  getStudentById,
  addPreviousFees,
  updateStudent,
  deleteStudent,
  getStudentFees,
  getStudentAttendance,
};