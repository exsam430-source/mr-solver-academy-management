import express from "express";
import {
  addFee,
  getAllFees,
  getFeeSummary,
  getPendingFees,
  getStudentFeeDetails,
  getMonthlyReport,
  deleteFee,
  getFeeById,
} from "../controllers/feeController.js";
import protect from "../middleware/authMiddleware.js";
import { adminOnly, adminAndSubAdmin } from "../middleware/roleMiddleware.js";
import branchFilter from "../middleware/branchFilter.js";

const router = express.Router();

// Sub-admin: can add fee, view fees, view pending
// Sub-admin: cannot see summary, monthly-report
router.post("/", protect, adminAndSubAdmin, branchFilter, addFee);
router.get("/", protect, adminAndSubAdmin, branchFilter, getAllFees);
router.get("/summary", protect, adminOnly, branchFilter, getFeeSummary);
router.get("/pending", protect, adminAndSubAdmin, branchFilter, getPendingFees);
router.get("/monthly-report", protect, adminOnly, branchFilter, getMonthlyReport);
router.get("/student/:studentId", protect, adminAndSubAdmin, getStudentFeeDetails);
router.get("/:id", protect, adminAndSubAdmin, getFeeById);
router.delete("/:id", protect, adminOnly, deleteFee);

export default router;