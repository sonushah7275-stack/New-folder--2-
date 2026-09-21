import express from "express";
import {
  getPillars,
  getPillarByIdOrSlug,
  createPillar,
  updatePillar,
  deletePillar,
} from "../controllers/pillarController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public Routes
router.get("/", getPillars);
router.get("/:idOrSlug", getPillarByIdOrSlug);

// Admin Protected Routes
router.post("/", protect, adminOnly, createPillar);
router.patch("/:id", protect, adminOnly, updatePillar);
router.delete("/:id", protect, adminOnly, deletePillar);

export default router;
