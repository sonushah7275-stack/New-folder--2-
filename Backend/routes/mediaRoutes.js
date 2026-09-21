import express from "express";
import { uploadMedia, deleteMedia, getMediaAssets } from "../controllers/mediaController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { uploadSingleImage } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// All media endpoints require Admin authentication & authorization
router.use(protect, adminOnly);

router.post("/upload", uploadSingleImage("file"), uploadMedia);
router.delete("/delete", deleteMedia);
router.delete("/", deleteMedia);
router.get("/", getMediaAssets);

export default router;
