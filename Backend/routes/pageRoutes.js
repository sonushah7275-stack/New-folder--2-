import express from 'express';
import {
  getAllPages,
  getPageBySlug,
  upsertPage,
  addSection,
  updateSection,
  deleteSection,
  reorderSections
} from '../controllers/pageController.js';
import { protect, adminOnly, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public / Optional Auth Routes
router.get('/', optionalAuth, getAllPages);
router.get('/:slug', optionalAuth, getPageBySlug);

// Admin Protected Routes
router.put('/:slug', protect, adminOnly, upsertPage);
router.post('/:slug/sections', protect, adminOnly, addSection);
router.put('/:slug/sections/reorder', protect, adminOnly, reorderSections);
router.put('/:slug/sections/:sectionId', protect, adminOnly, updateSection);
router.delete('/:slug/sections/:sectionId', protect, adminOnly, deleteSection);

export default router;
