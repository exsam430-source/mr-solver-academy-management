import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Branch from "../models/Branch.js";

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Login User (Admin, Sub-Admin or Teacher)
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password ❌");
  }

  // Populate assignedBranch for sub-admin
  const user = await User.findOne({ email }).populate(
    "assignedBranch",
    "name code city address phone"
  );

  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password ❌");
  }

  if (!user.isActive) {
    res.status(401);
    throw new Error("Your account has been deactivated ❌");
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password ❌");
  }

  res.status(200).json({
    success: true,
    message: "Login Successful ✅",
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      assignedBranch: user.assignedBranch || null,
      token: generateToken(user._id),
    },
  });
});

// @desc    Get Current User Info
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select("-password")
    .populate("assignedBranch", "name code city address phone");

  if (!user) {
    res.status(404);
    throw new Error("User not found ❌");
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Create Admin, Sub-Admin or Teacher (Admin Only)
// @route   POST /api/auth/register
// @access  Private/Admin
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, assignedBranch } = req.body;

  if (!name || !email || !password || !role) {
    res.status(400);
    throw new Error("Please fill all fields ❌");
  }

  // Validate role
  if (!["admin", "sub-admin", "teacher"].includes(role)) {
    res.status(400);
    throw new Error("Invalid role ❌");
  }

  // Sub-admin must have assigned branch
  if (role === "sub-admin") {
    if (!assignedBranch) {
      res.status(400);
      throw new Error("Please assign a branch for sub-admin ❌");
    }
    // Verify branch exists
    const branchExists = await Branch.findById(assignedBranch);
    if (!branchExists) {
      res.status(404);
      throw new Error("Assigned branch not found ❌");
    }
  }

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists with this email ❌");
  }

  // Create User
  const user = await User.create({
    name,
    email,
    password,
    role,
    assignedBranch: role === "sub-admin" ? assignedBranch : null,
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid user data ❌");
  }

  // Populate branch for response
  const populated = await User.findById(user._id)
    .select("-password")
    .populate("assignedBranch", "name code");

  const roleLabel =
    role === "admin" ? "Admin" :
    role === "sub-admin" ? "Sub-Admin" : "Teacher";

  res.status(201).json({
    success: true,
    message: `${roleLabel} created successfully ✅`,
    data: populated,
  });
});

// @desc    Get All Teachers (Admin Only)
// @route   GET /api/auth/teachers
// @access  Private/Admin
const getAllTeachers = asyncHandler(async (req, res) => {
  const teachers = await User.find({ role: "teacher" })
    .select("-password")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: teachers.length,
    data: teachers,
  });
});

// @desc    Get All Sub-Admins (Admin Only)
// @route   GET /api/auth/sub-admins
// @access  Private/Admin
const getAllSubAdmins = asyncHandler(async (req, res) => {
  const subAdmins = await User.find({ role: "sub-admin" })
    .select("-password")
    .populate("assignedBranch", "name code city")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: subAdmins.length,
    data: subAdmins,
  });
});

// @desc    Update User Active Status (Admin Only)
// @route   PUT /api/auth/users/:id/status
// @access  Private/Admin
const updateUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found ❌");
  }

  user.isActive = !user.isActive;
  await user.save();

  res.status(200).json({
    success: true,
    message: `User ${user.isActive ? "activated" : "deactivated"} successfully ✅`,
    data: {
      _id: user._id,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
    },
  });
});

// @desc    Delete User (Admin Only)
// @route   DELETE /api/auth/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found ❌");
  }

  // Prevent deleting yourself
  if (user._id.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error("You cannot delete your own account ❌");
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "User deleted successfully ✅",
  });
});

export {
  loginUser,
  getMe,
  registerUser,
  getAllTeachers,
  getAllSubAdmins,
  updateUserStatus,
  deleteUser,
};