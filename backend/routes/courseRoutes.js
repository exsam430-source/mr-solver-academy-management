import express from "express";
import {
  addCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} from "../controllers/courseController.js";
import protect from "../middleware/authMiddleware.js";
import { adminOnly, adminAndSubAdmin } from "../middleware/roleMiddleware.js";
import branchFilter from "../middleware/branchFilter.js";

const router = express.Router();

// Sub-admin can add & view courses but cannot delete
router.post("/", protect, adminAndSubAdmin, branchFilter, addCourse);
router.get("/", protect, adminAndSubAdmin, branchFilter, getAllCourses);
router.get("/:id", protect, adminAndSubAdmin, getCourseById);
router.put("/:id", protect, adminAndSubAdmin, updateCourse);
router.delete("/:id", protect, adminOnly, deleteCourse);

export default router;