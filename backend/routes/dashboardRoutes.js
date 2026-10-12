import express from "express";
import {
  getDashboardStats,
  getFeeReport,
  getAttendanceReport,
} from "../controllers/dashboardController.js";
import protect from "../middleware/authMiddleware.js";
import { adminOnly, adminAndSubAdmin } from "../middleware/roleMiddleware.js";
import branchFilter from "../middleware/branchFilter.js";

const router = express.Router();

// Sub-admin can see dashboard stats (filtered by their branch)
// But frontend will hide fee total cards
router.get("/stats", protect, adminAndSubAdmin, branchFilter, getDashboardStats);

// Reports: admin only
router.get("/reports/fees", protect, adminOnly, branchFilter, getFeeReport);
router.get("/reports/attendance", protect, adminOnly, branchFilter, getAttendanceReport);

export default router;