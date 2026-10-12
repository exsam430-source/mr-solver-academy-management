import asyncHandler from "express-async-handler";
import Attendance from "../models/Attendance.js";
import Student from "../models/Student.js";
import Course from "../models/Course.js";

// @desc    Mark Attendance
// @route   POST /api/attendance
// @access  Private/Admin
const markAttendance = asyncHandler(async (req, res) => {
  const { course, date, attendanceData } = req.body;

  if (!course || !attendanceData || !Array.isArray(attendanceData)) {
    res.status(400);
    throw new Error("Please provide course and attendance data ❌");
  }

  // 🔑 Branch from middleware
  const branch = req.branchId;
  if (!branch) {
    res.status(400);
    throw new Error("Please select a branch first ❌");
  }

  const courseExists = await Course.findById(course);
  if (!courseExists) {
    res.status(404);
    throw new Error("Course not found ❌");
  }

  const attendanceDate = date ? new Date(date) : new Date();
  attendanceDate.setHours(0, 0, 0, 0);
  const nextDay = new Date(attendanceDate);
  nextDay.setDate(nextDay.getDate() + 1);

  // Check if attendance already marked for this date and course
  const existingAttendance = await Attendance.findOne({
    course,
    branch,
    date: { $gte: attendanceDate, $lt: nextDay },
  });

  if (existingAttendance) {
    await Attendance.deleteMany({
      course,
      branch,
      date: { $gte: attendanceDate, $lt: nextDay },
    });
  }

  const attendanceRecords = attendanceData.map((record) => ({
    course,
    student: record.student,
    date: attendanceDate,
    status: record.status,
    markedBy: req.user._id,
    branch,
  }));

  const savedAttendance = await Attendance.insertMany(attendanceRecords);

  res.status(201).json({
    success: true,
    message: "Attendance marked successfully ✅",
    count: savedAttendance.length,
    data: savedAttendance,
  });
});

// @desc    Get Attendance by Course
// @route   GET /api/attendance/course/:id
// @access  Private/Admin
const getAttendanceByCourse = asyncHandler(async (req, res) => {
  const { date, startDate, endDate } = req.query;

  let query = { course: req.params.id, ...req.branchFilter };

  if (date) {
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    query.date = { $gte: selectedDate, $lt: nextDay };
  }

  if (startDate && endDate) {
    query.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  const attendance = await Attendance.find(query)
    .populate("student", "name fatherName")
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
    data: attendance,
  });
});

// @desc    Get All Attendance Records
// @route   GET /api/attendance
// @access  Private/Admin
const getAllAttendance = asyncHandler(async (req, res) => {
  const { course, student, date, startDate, endDate } = req.query;

  let query = { ...req.branchFilter };

  if (course) query.course = course;
  if (student) query.student = student;

  if (date) {
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    query.date = { $gte: selectedDate, $lt: nextDay };
  }

  if (startDate && endDate) {
    query.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  const attendance = await Attendance.find(query)
    .populate("student", "name fatherName")
    .populate("course", "courseName")
    .populate("markedBy", "name")
    .sort({ date: -1 });

  res.status(200).json({
    success: true,
    count: attendance.length,
    data: attendance,
  });
});

// @desc    Get Attendance by Student
// @route   GET /api/attendance/student/:id
// @access  Private/Admin
const getAttendanceByStudent = asyncHandler(async (req, res) => {
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

// @desc    Get Today Attendance Status for Course
// @route   GET /api/attendance/today/:courseId
// @access  Private/Admin
const getTodayAttendance = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // 🔑 Filter students by branch + course
  const students = await Student.find({
    enrolledCourses: { $in: [req.params.courseId] },
    isActive: true,
    ...req.branchFilter,
  });

  const attendance = await Attendance.find({
    course: req.params.courseId,
    date: { $gte: today, $lt: tomorrow },
    ...req.branchFilter,
  }).populate("student", "name fatherName");

  const isMarked = attendance.length > 0;

  res.status(200).json({
    success: true,
    isMarked,
    totalStudents: students.length,
    data: isMarked ? attendance : students,
  });
});

// @desc    Update Single Attendance Record
// @route   PUT /api/attendance/:id
// @access  Private/Admin
const updateAttendance = asyncHandler(async (req, res) => {
  const attendance = await Attendance.findById(req.params.id);

  if (!attendance) {
    res.status(404);
    throw new Error("Attendance record not found ❌");
  }

  attendance.status = req.body.status || attendance.status;
  attendance.markedBy = req.user._id;

  await attendance.save();

  res.status(200).json({
    success: true,
    message: "Attendance updated successfully ✅",
    data: attendance,
  });
});

export {
  markAttendance,
  getAttendanceByCourse,
  getAllAttendance,
  getAttendanceByStudent,
  getTodayAttendance,
  updateAttendance,
};