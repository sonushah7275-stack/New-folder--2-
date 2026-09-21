import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { getDashboardStats } from "../controllers/adminController.js";

const router = express.Router();

/**
 * Phase 3A Admin Dashboard Statistics Endpoint
 * GET /api/admin/stats
 * Protected: Admin Only
 */
router.get("/stats", protect, adminOnly, getDashboardStats);

/**
 * Phase 3 Authorization Test Endpoint
 * GET /api/admin/dashboard
 */
router.get("/dashboard", protect, adminOnly, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Admin dashboard access granted.",
    admin: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
});

export default router;
