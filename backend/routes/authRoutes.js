import express from "express";
import {
  loginUser,
  getMe,
  registerUser,
  getAllTeachers,
  getAllSubAdmins,
  updateUserStatus,
  deleteUser,
} from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.post("/register", protect, adminOnly, registerUser);
router.get("/teachers", protect, adminOnly, getAllTeachers);
router.get("/sub-admins", protect, adminOnly, getAllSubAdmins);
router.put("/users/:id/status", protect, adminOnly, updateUserStatus);
router.delete("/users/:id", protect, adminOnly, deleteUser);

export default router;