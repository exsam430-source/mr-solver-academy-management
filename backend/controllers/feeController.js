import asyncHandler from "express-async-handler";
import Fee from "../models/Fee.js";
import Student from "../models/Student.js";
import Course from "../models/Course.js";

// @desc    Add Fee Record
// @route   POST /api/fees
// @access  Private/Admin
const addFee = asyncHandler(async (req, res) => {
  const { student, course, feeType, amount, month, year, date, notes } = req.body;

  if (!student || !course || !feeType || !amount) {
    res.status(400);
    throw new Error("Please fill all required fields ❌");
  }

  const branch = req.branchId;
  if (!branch) {
    res.status(400);
    throw new Error("Please select a branch first ❌");
  }

  const studentExists = await Student.findById(student);
  if (!studentExists) {
    res.status(404);
    throw new Error("Student not found ❌");
  }

  const courseExists = await Course.findById(course);
  if (!courseExists) {
    res.status(404);
    throw new Error("Course not found ❌");
  }

  // 🆕 Check if package already paid for this student+course → block all further fees
  const packagePaid = await Fee.findOne({
    student,
    course,
    feeType: "package",
  });

  if (packagePaid && feeType !== "registration" && feeType !== "penalty" && feeType !== "exam") {
    res.status(400);
    throw new Error(
      "Package fee already paid for this course. Course is fully cleared ✅"
    );
  }

  // 🆕 If trying to pay package, ensure no monthly already paid (optional warning, but allow)
  if (feeType === "package") {
    const existingPackage = await Fee.findOne({ student, course, feeType: "package" });
    if (existingPackage) {
      res.status(400);
      throw new Error("Package fee already paid for this course ❌");
    }
  }

  if (feeType === "monthly" && (!month || !year)) {
    res.status(400);
    throw new Error("Please provide month and year for monthly fee ❌");
  }

  if (feeType === "monthly") {
    const alreadyPaid = await Fee.findOne({
      student, course, feeType: "monthly", month, year,
    });
    if (alreadyPaid) {
      res.status(400);
      throw new Error(
        `Monthly fee for ${month} ${year} already paid for this course ❌`
      );
    }

    // 🆕 Check if all duration months already paid
    const paidCount = await Fee.countDocuments({
      student, course, feeType: "monthly",
    });
    if (paidCount >= courseExists.durationMonths) {
      res.status(400);
      throw new Error(
        `All ${courseExists.durationMonths} months already paid. Course is fully cleared ✅`
      );
    }
  }

  if (feeType === "registration") {
    const alreadyPaid = await Fee.findOne({
      student, course, feeType: "registration",
    });
    if (alreadyPaid) {
      res.status(400);
      throw new Error("Registration fee already paid for this course ❌");
    }
  }

  const fee = await Fee.create({
    student, course, feeType, amount,
    month: month || null,
    year: year || null,
    date: date || Date.now(),
    notes: notes || null,
    collectedBy: req.user._id,
    branch,
  });

  const populatedFee = await Fee.findById(fee._id)
    .populate("student", "name fatherName phone admissionNumber address")
    .populate("course", "courseName monthlyFee registrationFee packageFee durationMonths")
    .populate("collectedBy", "name");

  res.status(201).json({
    success: true,
    message: "Fee recorded successfully ✅",
    data: populatedFee,
  });
});

// @desc    Get All Fee Records (Branch-filtered)
// @route   GET /api/fees
// @access  Private/Admin
const getAllFees = asyncHandler(async (req, res) => {
  const { student, course, feeType, month, year, startDate, endDate } =
    req.query;

  let query = { ...req.branchFilter };

  if (student) query.student = student;
  if (course) query.course = course;
  if (feeType) query.feeType = feeType;
  if (month) query.month = month;
  if (year) query.year = parseInt(year);

  if (startDate && endDate) {
    query.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  const fees = await Fee.find(query)
    .populate("student", "name fatherName phone admissionNumber")
    .populate("course", "courseName")
    .populate("collectedBy", "name")
    .sort({ createdAt: -1 });

  const totalAmount = fees.reduce((sum, fee) => sum + fee.amount, 0);

  res.status(200).json({
    success: true,
    count: fees.length,
    totalAmount,
    data: fees,
  });
});

// @desc    Get Fee Summary (Branch-filtered)
// @route   GET /api/fees/summary
// @access  Private/Admin
const getFeeSummary = asyncHandler(async (req, res) => {
  const branchMatch = req.branchFilter?.branch
    ? { branch: req.branchFilter.branch }
    : {};

  const summaryByType = await Fee.aggregate([
    { $match: branchMatch },
    {
      $group: {
        _id: "$feeType",
        totalAmount: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
  ]);

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyCollection = await Fee.aggregate([
    { $match: { ...branchMatch, date: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" },
        },
        totalAmount: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  const totalCollection = await Fee.aggregate([
    { $match: branchMatch },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  res.status(200).json({
    success: true,
    data: {
      summaryByType,
      monthlyCollection,
      totalCollection: totalCollection[0]?.total || 0,
    },
  });
});

// @desc    Get Pending Fees (Branch-filtered)
// @route   GET /api/fees/pending
// @access  Private/Admin
const getPendingFees = asyncHandler(async (req, res) => {
  const { month, year } = req.query;

  const currentDate = new Date();
  const targetMonth = month || currentDate.toLocaleString("default", { month: "long" });
  const targetYear = parseInt(year) || currentDate.getFullYear();
  const monthIndex = new Date(`${targetMonth} 1, ${targetYear}`).getMonth();
  const targetDate = new Date(targetYear, monthIndex, 1);
  const currentMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

  if (targetDate > currentMonthStart) {
    return res.status(200).json({
      success: true,
      count: 0,
      month: targetMonth,
      year: targetYear,
      totalDue: 0,
      message: `No fees available for ${targetMonth} ${targetYear} yet (future month)`,
      data: [],
    });
  }

  const allStudents = await Student.find({
    isActive: true,
    ...req.branchFilter,
  }).populate(
    "enrolledCourses",
    "courseName monthlyFee registrationFee packageFee durationMonths"
  );

  const pendingData = [];

  for (const student of allStudents) {
    if (!student.enrolledCourses || student.enrolledCourses.length === 0) continue;

    // 🆕 Use startingDate first; fallback to registrationDate
    const baseDate = student.startingDate
      ? new Date(student.startingDate)
      : new Date(student.registrationDate);
    const baseMonthStart = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);

    if (targetDate < baseMonthStart) continue;

    for (const course of student.enrolledCourses) {
      // 🆕 Skip if package paid for this course
      const packagePaid = await Fee.findOne({
        student: student._id,
        course: course._id,
        feeType: "package",
      });
      if (packagePaid) continue;

      // 🆕 Skip if all duration months already paid
      const paidMonthsCount = await Fee.countDocuments({
        student: student._id,
        course: course._id,
        feeType: "monthly",
      });
      if (course.durationMonths && paidMonthsCount >= course.durationMonths) continue;

      // 🆕 Compute months between baseDate and targetDate (1-based index)
      const monthsDiff =
        (targetDate.getFullYear() - baseMonthStart.getFullYear()) * 12 +
        (targetDate.getMonth() - baseMonthStart.getMonth()) +
        1;

      // 🆕 Skip if target month is beyond course duration
      if (course.durationMonths && monthsDiff > course.durationMonths) continue;

      const pendingItems = [];

      // Registration fee (only on first month)
      const isRegistrationMonth =
        baseDate.getMonth() === monthIndex && baseDate.getFullYear() === targetYear;

      if (isRegistrationMonth) {
        const registrationPaid = await Fee.findOne({
          student: student._id,
          course: course._id,
          feeType: "registration",
        });
        if (!registrationPaid && course.registrationFee > 0) {
          pendingItems.push({
            feeType: "registration",
            amount: course.registrationFee,
            label: "Registration Fee",
          });
        }
      }

      // Monthly fee for target month
      const monthlyPaid = await Fee.findOne({
        student: student._id,
        course: course._id,
        feeType: "monthly",
        month: targetMonth,
        year: targetYear,
      });

      if (!monthlyPaid && course.monthlyFee > 0) {
        pendingItems.push({
          feeType: "monthly",
          amount: course.monthlyFee,
          label: `Monthly Fee (${targetMonth} ${targetYear})`,
          month: targetMonth,
          year: targetYear,
        });
      }

      if (pendingItems.length > 0) {
        const totalPending = pendingItems.reduce((sum, i) => sum + i.amount, 0);
        pendingData.push({
          _id: `${student._id}-${course._id}`,
          studentId: student._id,
          courseId: course._id,
          name: student.name,
          fatherName: student.fatherName,
          phone: student.phone,
          admissionNumber: student.admissionNumber,
          courseName: course.courseName,
          registrationDate: student.registrationDate,
          startingDate: student.startingDate,
          durationMonths: course.durationMonths,
          paidMonthsCount,
          pendingItems,
          totalPending,
          month: targetMonth,
          year: targetYear,
        });
      }
    }
  }

  res.status(200).json({
    success: true,
    count: pendingData.length,
    month: targetMonth,
    year: targetYear,
    totalDue: pendingData.reduce((sum, s) => sum + s.totalPending, 0),
    data: pendingData,
  });
});

// @desc    Get Student Fee Details
// @route   GET /api/fees/student/:studentId
// @access  Private/Admin
const getStudentFeeDetails = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.studentId).populate(
    "enrolledCourses",
    "courseName monthlyFee registrationFee advanceFee examFee"
  );

  if (!student) {
    res.status(404);
    throw new Error("Student not found ❌");
  }

  const allFees = await Fee.find({ student: req.params.studentId })
    .populate("course", "courseName monthlyFee")
    .populate("collectedBy", "name")
    .sort({ createdAt: -1 });

  const courseBreakdown = [];

  for (const course of student.enrolledCourses) {
  const courseFees = allFees.filter(
    (f) => f.course?._id.toString() === course._id.toString()
  );

  const paidMonths = courseFees
    .filter((f) => f.feeType === "monthly")
    .map((f) => ({
      month: f.month,
      year: f.year,
      amount: f.amount,
      date: f.date,
      invoiceNumber: f.invoiceNumber,
    }));

  const registrationPaid = courseFees.find((f) => f.feeType === "registration");
  const advancePaid = courseFees.find((f) => f.feeType === "advance");
  const packagePaid = courseFees.find((f) => f.feeType === "package"); // 🆕

  const totalPaidForCourse = courseFees.reduce((sum, f) => sum + f.amount, 0);

  // 🆕 Use durationMonths if available
  const durationMonths = course.durationMonths || 0;
  const totalCourseFee = durationMonths * (course.monthlyFee || 0);

  let pendingMonthlyAmount = 0;
  let isFullyPaid = false;
  let paymentMode = "monthly"; // monthly | package

  if (packagePaid) {
    isFullyPaid = true;
    paymentMode = "package";
    pendingMonthlyAmount = 0;
  } else {
    const remainingMonths = Math.max(durationMonths - paidMonths.length, 0);
    pendingMonthlyAmount = remainingMonths * (course.monthlyFee || 0);
    if (remainingMonths === 0 && durationMonths > 0) isFullyPaid = true;
  }

  courseBreakdown.push({
    course: {
      _id: course._id,
      courseName: course.courseName,
      monthlyFee: course.monthlyFee,
      registrationFee: course.registrationFee,
      packageFee: course.packageFee,
      durationMonths: course.durationMonths,
    },
    registrationPaid: !!registrationPaid,
    registrationAmount: registrationPaid?.amount || 0,
    advancePaid: !!advancePaid,
    advanceAmount: advancePaid?.amount || 0,
    packagePaid: !!packagePaid, // 🆕
    packageAmount: packagePaid?.amount || 0, // 🆕
    paymentMode, // 🆕
    isFullyPaid, // 🆕
    paidMonthsCount: paidMonths.length,
    paidMonths,
    totalPaid: totalPaidForCourse,
    totalCourseFee,
    pendingMonthlyAmount,
    pendingRegistration:
      !registrationPaid && course.registrationFee > 0 ? course.registrationFee : 0,
    totalPending:
      pendingMonthlyAmount +
      (!registrationPaid && course.registrationFee > 0 ? course.registrationFee : 0),
  });
}
  const grandTotalPaid = allFees.reduce((sum, f) => sum + f.amount, 0);
  const grandTotalPending = courseBreakdown.reduce(
    (sum, c) => sum + c.totalPending,
    0
  );

  res.status(200).json({
    success: true,
    data: {
      student,
      courseBreakdown,
      allFees,
      grandTotalPaid,
      grandTotalPending,
    },
  });
});

// @desc    Get Monthly Collection Report (Branch-filtered)
// @route   GET /api/fees/monthly-report
// @access  Private/Admin
const getMonthlyReport = asyncHandler(async (req, res) => {
  const { month, year } = req.query;

  const currentDate = new Date();
  const targetMonth =
    month || currentDate.toLocaleString("default", { month: "long" });
  const targetYear = parseInt(year) || currentDate.getFullYear();

  const monthIndex = new Date(`${targetMonth} 1, ${targetYear}`).getMonth();
  const startDate = new Date(targetYear, monthIndex, 1);
  const endDate = new Date(targetYear, monthIndex + 1, 0, 23, 59, 59);

  const fees = await Fee.find({
    ...req.branchFilter,
    date: { $gte: startDate, $lte: endDate },
  })
    .populate("student", "name fatherName phone admissionNumber")
    .populate("course", "courseName")
    .populate("collectedBy", "name")
    .sort({ date: -1 });

  const byType = {};
  fees.forEach((fee) => {
    if (!byType[fee.feeType]) {
      byType[fee.feeType] = { count: 0, total: 0 };
    }
    byType[fee.feeType].count++;
    byType[fee.feeType].total += fee.amount;
  });

  const byCourse = {};
  fees.forEach((fee) => {
    const courseName = fee.course?.courseName || "Unknown";
    if (!byCourse[courseName]) {
      byCourse[courseName] = { count: 0, total: 0 };
    }
    byCourse[courseName].count++;
    byCourse[courseName].total += fee.amount;
  });

  const dailyCollection = {};
  fees.forEach((fee) => {
    const day = new Date(fee.date).getDate();
    if (!dailyCollection[day]) dailyCollection[day] = 0;
    dailyCollection[day] += fee.amount;
  });

  const totalCollection = fees.reduce((sum, f) => sum + f.amount, 0);

  res.status(200).json({
    success: true,
    data: {
      month: targetMonth,
      year: targetYear,
      totalCollection,
      totalRecords: fees.length,
      byType,
      byCourse,
      dailyCollection,
      fees,
    },
  });
});

// @desc    Delete Fee Record
// @route   DELETE /api/fees/:id
// @access  Private/Admin
const deleteFee = asyncHandler(async (req, res) => {
  const fee = await Fee.findById(req.params.id);

  if (!fee) {
    res.status(404);
    throw new Error("Fee record not found ❌");
  }

  await fee.deleteOne();

  res.status(200).json({
    success: true,
    message: "Fee record deleted successfully ✅",
  });
});

// @desc    Get Single Fee Record
// @route   GET /api/fees/:id
// @access  Private/Admin
const getFeeById = asyncHandler(async (req, res) => {
  const fee = await Fee.findById(req.params.id)
    .populate("student", "name fatherName phone admissionNumber address cnic")
    .populate("course", "courseName monthlyFee")
    .populate("collectedBy", "name");

  if (!fee) {
    res.status(404);
    throw new Error("Fee record not found ❌");
  }

  res.status(200).json({
    success: true,
    data: fee,
  });
});

export {
  addFee,
  getAllFees,
  getFeeSummary,
  getPendingFees,
  getStudentFeeDetails,
  getMonthlyReport,
  deleteFee,
  getFeeById,
};