import asyncHandler from "express-async-handler";
import Course from "../models/Course.js";
import Student from "../models/Student.js";

// @desc    Add New Course
// @route   POST /api/courses
// @access  Private/Admin
const addCourse = asyncHandler(async (req, res) => {
  const {
    courseName, description, duration, durationMonths,
    registrationFee, advanceFee, monthlyFee, packageFee, examFee,
  } = req.body;

  if (!courseName || !duration || !durationMonths || !monthlyFee) {
    res.status(400);
    throw new Error("Please fill all required fields ❌");
  }

  const branch = req.branchId;
  if (!branch) {
    res.status(400);
    throw new Error("Please select a branch first ❌");
  }

  const course = await Course.create({
    courseName,
    description,
    duration,
    durationMonths: Number(durationMonths),
    registrationFee: registrationFee || 0,
    advanceFee: advanceFee || 0,
    monthlyFee,
    packageFee: packageFee || 0,
    examFee: examFee || 0,
    branch,
  });

  res.status(201).json({
    success: true,
    message: "Course added successfully ✅",
    data: course,
  });
});

// @desc    Get All Courses (Branch-filtered)
// @route   GET /api/courses
// @access  Private/Admin
const getAllCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({ ...req.branchFilter }).sort({
    createdAt: -1,
  });

  const coursesWithCount = await Promise.all(
    courses.map(async (course) => {
      const studentCount = await Student.countDocuments({
        enrolledCourses: { $in: [course._id] },
        isActive: true,
        ...req.branchFilter,
      });
      return {
        ...course.toObject(),
        studentCount,
      };
    })
  );

  res.status(200).json({
    success: true,
    count: courses.length,
    data: coursesWithCount,
  });
});

// @desc    Get Single Course
// @route   GET /api/courses/:id
// @access  Private/Admin
const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error("Course not found ❌");
  }

  const studentCount = await Student.countDocuments({
    enrolledCourses: { $in: [course._id] },
    isActive: true,
  });

  res.status(200).json({
    success: true,
    data: {
      ...course.toObject(),
      studentCount,
    },
  });
});

// @desc    Update Course
// @route   PUT /api/courses/:id
// @access  Private/Admin
const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error("Course not found ❌");
  }

  const updatedCourse = await Course.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: "Course updated successfully ✅",
    data: updatedCourse,
  });
});

// @desc    Delete Course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error("Course not found ❌");
  }

  const studentCount = await Student.countDocuments({
    enrolledCourses: { $in: [req.params.id] },
  });

  if (studentCount > 0) {
    res.status(400);
    throw new Error(
      `Cannot delete course - ${studentCount} students are enrolled ❌`
    );
  }

  await course.deleteOne();

  res.status(200).json({
    success: true,
    message: "Course deleted successfully ✅",
  });
});

export {
  addCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};