import asyncHandler from "express-async-handler";
import Branch from "../models/Branch.js";
import Student from "../models/Student.js";

// @desc    Create Branch
// @route   POST /api/branches
const createBranch = asyncHandler(async (req, res) => {
  const { name, code, address, phone, email, city, manager } = req.body;

  if (!name || !code) {
    res.status(400);
    throw new Error("Branch name and code are required ❌");
  }

  const exists = await Branch.findOne({
    $or: [{ name }, { code: code.toUpperCase() }],
  });
  if (exists) {
    res.status(400);
    throw new Error("Branch with this name or code already exists ❌");
  }

  const branch = await Branch.create({
    name,
    code: code.toUpperCase(),
    address,
    phone,
    email,
    city,
    manager,
  });

  res.status(201).json({
    success: true,
    message: "Branch created successfully ✅",
    data: branch,
  });
});

// @desc    Get All Branches
// @route   GET /api/branches
const getAllBranches = asyncHandler(async (req, res) => {
  const branches = await Branch.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    count: branches.length,
    data: branches,
  });
});

// @desc    Get Single Branch
// @route   GET /api/branches/:id
const getBranchById = asyncHandler(async (req, res) => {
  const branch = await Branch.findById(req.params.id);
  if (!branch) {
    res.status(404);
    throw new Error("Branch not found ❌");
  }

  const totalStudents = await Student.countDocuments({ branch: branch._id });

  res.status(200).json({
    success: true,
    data: { ...branch.toObject(), totalStudents },
  });
});

// @desc    Update Branch
// @route   PUT /api/branches/:id
const updateBranch = asyncHandler(async (req, res) => {
  const branch = await Branch.findById(req.params.id);
  if (!branch) {
    res.status(404);
    throw new Error("Branch not found ❌");
  }

  const updated = await Branch.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
      code: req.body.code ? req.body.code.toUpperCase() : branch.code,
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: "Branch updated successfully ✅",
    data: updated,
  });
});

// @desc    Delete Branch
// @route   DELETE /api/branches/:id
const deleteBranch = asyncHandler(async (req, res) => {
  const branch = await Branch.findById(req.params.id);
  if (!branch) {
    res.status(404);
    throw new Error("Branch not found ❌");
  }

  const studentCount = await Student.countDocuments({ branch: branch._id });
  if (studentCount > 0) {
    res.status(400);
    throw new Error(
      `Cannot delete branch with ${studentCount} students. Move them first ❌`
    );
  }

  await branch.deleteOne();

  res.status(200).json({
    success: true,
    message: "Branch deleted successfully ✅",
  });
});

export {
  createBranch,
  getAllBranches,
  getBranchById,
  updateBranch,
  deleteBranch,
};