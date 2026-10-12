import express from "express";
import {
  addStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStudentFees,
  getStudentAttendance,
  addPreviousFees,
} from "../controllers/studentController.js";
import protect from "../middleware/authMiddleware.js";
import { adminOnly, adminAndSubAdmin } from "../middleware/roleMiddleware.js";
import branchFilter from "../middleware/branchFilter.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  adminAndSubAdmin,
  branchFilter,
  upload.single("photo"),
  addStudent
);
router.get("/", protect, adminAndSubAdmin, branchFilter, getAllStudents);
router.get("/:id", protect, adminAndSubAdmin, getStudentById);
router.put(
  "/:id",
  protect,
  adminAndSubAdmin,
  upload.single("photo"),
  updateStudent
);
router.delete("/:id", protect, adminOnly, deleteStudent);
router.get("/:id/fees", protect, adminAndSubAdmin, getStudentFees);
router.get("/:id/attendance", protect, adminAndSubAdmin, getStudentAttendance);
router.post("/:id/previous-fees", protect, adminAndSubAdmin, branchFilter, addPreviousFees);

export default router;