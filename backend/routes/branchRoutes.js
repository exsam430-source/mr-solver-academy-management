import express from "express";
import {
  createBranch,
  getAllBranches,
  getBranchById,
  updateBranch,
  deleteBranch,
} from "../controllers/branchController.js";
import protect from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, adminOnly, createBranch);
router.get("/", protect, adminOnly, getAllBranches);
router.get("/:id", protect, adminOnly, getBranchById);
router.put("/:id", protect, adminOnly, updateBranch);
router.delete("/:id", protect, adminOnly, deleteBranch);

export default router;