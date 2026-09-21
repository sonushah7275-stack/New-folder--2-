import express from "express";
import {
  getSettings,
  updateSettings,
  getPublicSettings,
} from "../controllers/settingsController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route for frontend consumption
router.get("/public", getPublicSettings);

// Protected Admin routes
router.get("/", protect, adminOnly, getSettings);
router.patch("/", protect, adminOnly, updateSettings);

export default router;
