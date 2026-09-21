import express from "express";
import {
  getContentBlocks,
  getContentByKey,
  createContentBlock,
  updateContentBlock,
  deleteContentBlock,
} from "../controllers/contentController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public Routes
router.get("/", getContentBlocks);
router.get("/:key", getContentByKey);

// Admin Protected Routes
router.post("/", protect, adminOnly, createContentBlock);
router.patch("/:id", protect, adminOnly, updateContentBlock);
router.delete("/:id", protect, adminOnly, deleteContentBlock);

export default router;
