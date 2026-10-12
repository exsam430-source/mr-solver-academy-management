import express from "express";
import {
  markAttendance,
  getAttendanceByCourse,
  getAllAttendance,
  getAttendanceByStudent,
  getTodayAttendance,
  updateAttendance,
} from "../controllers/attendanceController.js";
import protect from "../middleware/authMiddleware.js";
import { adminOnly, adminAndSubAdmin } from "../middleware/roleMiddleware.js";
import branchFilter from "../middleware/branchFilter.js";

const router = express.Router();

router.post("/", protect, adminAndSubAdmin, branchFilter, markAttendance);
router.get("/", protect, adminAndSubAdmin, branchFilter, getAllAttendance);
router.get("/course/:id", protect, adminAndSubAdmin, branchFilter, getAttendanceByCourse);
router.get("/student/:id", protect, adminAndSubAdmin, getAttendanceByStudent);
router.get("/today/:courseId", protect, adminAndSubAdmin, branchFilter, getTodayAttendance);
router.put("/:id", protect, adminAndSubAdmin, updateAttendance);

export default router;