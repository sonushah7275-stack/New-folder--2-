import express from "express";
import {
  subscribe,
  unsubscribe,
  getSubscribers,
  deleteSubscriber,
} from "../controllers/newsletterController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public Routes
router.post("/subscribe", subscribe);
router.post("/unsubscribe", unsubscribe);

// Admin Protected Routes
router.get("/", protect, adminOnly, getSubscribers);
router.delete("/:id", protect, adminOnly, deleteSubscriber);

export default router;
