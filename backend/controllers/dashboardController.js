import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Student from "../models/Student.js";
import Course from "../models/Course.js";
import Fee from "../models/Fee.js";
import Attendance from "../models/Attendance.js";

// Helper: Convert branch filter to ObjectId for aggregation
const getAggregationMatch = (req) => {
  if (!req.branchFilter?.branch) return {};
  const branchId = req.branchFilter.branch;
  // Ensure it's an ObjectId for aggregation
  return {
    branch:
      typeof branchId === "string"
        ? new mongoose.Types.ObjectId(branchId)
        : branchId,
  };
};

// @desc    Get Dashboard Stats (Branch-filtered)
// @route   GET /api/dashboard/stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  const branchMatch = getAggregationMatch(req); // 🆕 Properly typed

  // Total Students
  const totalStudents = await Student.countDocuments({
    isActive: true,
    ...req.branchFilter,
  });

  // Total Courses
  const totalCourses = await Course.countDocuments({
    isActive: true,
    ...req.branchFilter,
  });

  // Total Fee Collected
  const feeCollection = await Fee.aggregate([
    { $match: branchMatch },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  const totalFeeCollected = feeCollection[0]?.total || 0;

  // This Month Fee Collection
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const thisMonthFee = await Fee.aggregate([
    {
      $match: {
        ...branchMatch,
        date: { $gte: startOfMonth, $lte: endOfMonth },
      },
    },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  const thisMonthCollection = thisMonthFee[0]?.total || 0;

  // 🆕 Pending Fee Count — proper per-course logic
  const currentMonthName = now.toLocaleString("default", { month: "long" });
  const currentYear = now.getFullYear();
  const currentMonthIndex = now.getMonth();
  const currentDate = new Date(currentYear, currentMonthIndex, 1);

  const allActiveStudents = await Student.find({
    isActive: true,
    ...req.branchFilter,
  }).populate(
    "enrolledCourses",
    "courseName monthlyFee registrationFee packageFee durationMonths"
  );

  let pendingFeeCount = 0;

  for (const student of allActiveStudents) {
    if (!student.enrolledCourses || student.enrolledCourses.length === 0) continue;

    // Base date — startingDate or fallback to registrationDate
    const baseDate = student.startingDate
      ? new Date(student.startingDate)
      : new Date(student.registrationDate);
    const baseMonthStart = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);

    // Skip if student hasn't started yet
    if (currentDate < baseMonthStart) continue;

    let hasPending = false;

    for (const course of student.enrolledCourses) {
      // Skip if package already paid for this course
      const packagePaid = await Fee.findOne({
        student: student._id,
        course: course._id,
        feeType: "package",
      });
      if (packagePaid) continue;

      // Skip if all duration months already paid
      const paidMonthsCount = await Fee.countDocuments({
        student: student._id,
        course: course._id,
        feeType: "monthly",
      });
      if (course.durationMonths && paidMonthsCount >= course.durationMonths) continue;

      // Compute months between baseDate and current
      const monthsDiff =
        (currentDate.getFullYear() - baseMonthStart.getFullYear()) * 12 +
        (currentDate.getMonth() - baseMonthStart.getMonth()) +
        1;

      // Skip if beyond course duration
      if (course.durationMonths && monthsDiff > course.durationMonths) continue;

      // Check if current month fee is paid for this course
      const monthlyPaid = await Fee.findOne({
        student: student._id,
        course: course._id,
        feeType: "monthly",
        month: currentMonthName,
        year: currentYear,
      });

      if (!monthlyPaid && course.monthlyFee > 0) {
        hasPending = true;
        break; // count student once even if multiple courses pending
      }
    }

    if (hasPending) pendingFeeCount++;
  }

  // Students Per Course
  const studentsPerCourse = await Student.aggregate([
    { $match: { isActive: true, ...branchMatch } },
    { $unwind: "$enrolledCourses" },
    { $group: { _id: "$enrolledCourses", count: { $sum: 1 } } },
    {
      $lookup: {
        from: "courses",
        localField: "_id",
        foreignField: "_id",
        as: "course",
      },
    },
    { $unwind: "$course" },
    { $project: { courseName: "$course.courseName", count: 1 } },
  ]);

  // Last 6 Months Fee
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const last6MonthsFee = await Fee.aggregate([
    { $match: { ...branchMatch, date: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" },
        },
        total: { $sum: "$amount" },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  // Recent Transactions
  const recentTransactions = await Fee.find({ ...req.branchFilter })
    .populate("student", "name")
    .populate("course", "courseName")
    .sort({ createdAt: -1 })
    .limit(5);

  // Today Attendance
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayPresent = await Attendance.countDocuments({
    ...req.branchFilter,
    date: { $gte: today, $lt: tomorrow },
    status: "present",
  });

  const todayAbsent = await Attendance.countDocuments({
    ...req.branchFilter,
    date: { $gte: today, $lt: tomorrow },
    status: "absent",
  });

  res.status(200).json({
    success: true,
    data: {
      totalStudents,
      totalCourses,
      totalFeeCollected,
      thisMonthCollection,
      pendingFeeCount,
      studentsPerCourse,
      last6MonthsFee,
      recentTransactions,
      todayAttendance: {
        present: todayPresent,
        absent: todayAbsent,
        total: todayPresent + todayAbsent,
      },
    },
  });
});

// @desc    Get Fee Report (Branch-filtered)
const getFeeReport = asyncHandler(async (req, res) => {
  const { startDate, endDate, course } = req.query;
  const branchMatch = getAggregationMatch(req);

  let matchQuery = { ...branchMatch };

  if (startDate && endDate) {
    matchQuery.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  if (course) {
    matchQuery.course =
      typeof course === "string" ? new mongoose.Types.ObjectId(course) : course;
  }

  const report = await Fee.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: "$feeType",
        totalAmount: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
  ]);

  const totalAmount = report.reduce((sum, r) => sum + r.totalAmount, 0);

  res.status(200).json({
    success: true,
    data: { report, totalAmount },
  });
});

// @desc    Get Attendance Report (Branch-filtered)
const getAttendanceReport = asyncHandler(async (req, res) => {
  const { course, startDate, endDate } = req.query;
  const branchMatch = getAggregationMatch(req);

  let matchQuery = { ...branchMatch };

  if (course) {
    matchQuery.course =
      typeof course === "string" ? new mongoose.Types.ObjectId(course) : course;
  }

  if (startDate && endDate) {
    matchQuery.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  const report = await Attendance.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: "$student",
        totalPresent: {
          $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] },
        },
        totalAbsent: {
          $sum: { $cond: [{ $eq: ["$status", "absent"] }, 1, 0] },
        },
        total: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "students",
        localField: "_id",
        foreignField: "_id",
        as: "student",
      },
    },
    { $unwind: "$student" },
    {
      $project: {
        studentName: "$student.name",
        fatherName: "$student.fatherName",
        totalPresent: 1,
        totalAbsent: 1,
        total: 1,
        percentage: {
          $multiply: [{ $divide: ["$totalPresent", "$total"] }, 100],
        },
      },
    },
    { $sort: { percentage: 1 } },
  ]);

  res.status(200).json({
    success: true,
    count: report.length,
    data: report,
  });
});

export { getDashboardStats, getFeeReport, getAttendanceReport };