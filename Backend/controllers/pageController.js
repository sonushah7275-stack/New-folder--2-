import Page from '../models/Page.js';
import { normalizeCloudinaryData } from '../utils/cloudinaryHelper.js';

/**
 * Get all pages
 * GET /api/pages
 * Public / Admin
 */
export const getAllPages = async (req, res, next) => {
  try {
    const isAdmin = req.user && (req.user.role === 'ADMIN' || req.user.role === 'admin');
    const filter = isAdmin ? {} : { isPublished: true };
    const pages = await Page.find(filter).select('slug title subtitle isPublished updatedAt').sort({ title: 1 });

    return res.status(200).json({
      success: true,
      data: normalizeCloudinaryData(pages)
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get page by slug
 * GET /api/pages/:slug
 * Public / Admin
 */
export const getPageBySlug = async (req, res, next) => {
  try {
    const slug = req.params.slug.toLowerCase().trim();
    let page = await Page.findOne({ slug });

    // Fallback alias support between 'journal' and 'blog'
    if (!page && slug === 'journal') {
      page = await Page.findOne({ slug: 'blog' });
    } else if (!page && slug === 'blog') {
      page = await Page.findOne({ slug: 'journal' });
    }

    if (!page) {
      return res.status(404).json({
        success: false,
        message: `Page with slug '${slug}' not found.`
      });
    }

    const isAdmin = req.user && (req.user.role === 'ADMIN' || req.user.role === 'admin');

    if (page.isPublished === false && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'This page is currently unpublished.'
      });
    }

    return res.status(200).json({
      success: true,
      data: normalizeCloudinaryData(page)
    });
  } catch (error) {
    next(error);
  }
};


/**
 * Create or update page
 * PUT /api/pages/:slug
 * Protected: Admin Only
 */
export const upsertPage = async (req, res, next) => {
  try {
    const slug = req.params.slug.toLowerCase().trim();
    const updateData = { ...req.body, slug };

    if (req.user) {
      updateData.updatedBy = req.user._id;
    }

    const page = await Page.findOneAndUpdate(
      { slug },
      updateData,
      { new: true, upsert: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: `Page '${slug}' saved successfully.`,
      data: page
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add section to page
 * POST /api/pages/:slug/sections
 * Protected: Admin Only
 */
export const addSection = async (req, res, next) => {
  try {
    const slug = req.params.slug.toLowerCase().trim();
    const page = await Page.findOne({ slug });

    if (!page) {
      return res.status(404).json({
        success: false,
        message: `Page '${slug}' not found.`
      });
    }

    const newSection = req.body;
    if (!newSection.sectionId) {
      newSection.sectionId = `sec_${Date.now()}`;
    }

    page.sections.push(newSection);
    if (req.user) page.updatedBy = req.user._id;

    await page.save();

    return res.status(201).json({
      success: true,
      message: 'Section added successfully.',
      data: page
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update section in page
 * PUT /api/pages/:slug/sections/:sectionId
 * Protected: Admin Only
 */
export const updateSection = async (req, res, next) => {
  try {
    const { slug, sectionId } = req.params;
    const page = await Page.findOne({ slug: slug.toLowerCase().trim() });

    if (!page) {
      return res.status(404).json({
        success: false,
        message: `Page '${slug}' not found.`
      });
    }

    const sectionIndex = page.sections.findIndex((s) => s.sectionId === sectionId);
    if (sectionIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `Section '${sectionId}' not found.`
      });
    }

    page.sections[sectionIndex] = {
      ...page.sections[sectionIndex].toObject(),
      ...req.body,
      sectionId
    };

    if (req.user) page.updatedBy = req.user._id;
    await page.save();

    return res.status(200).json({
      success: true,
      message: 'Section updated successfully.',
      data: page
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete section from page
 * DELETE /api/pages/:slug/sections/:sectionId
 * Protected: Admin Only
 */
export const deleteSection = async (req, res, next) => {
  try {
    const { slug, sectionId } = req.params;
    const page = await Page.findOne({ slug: slug.toLowerCase().trim() });

    if (!page) {
      return res.status(404).json({
        success: false,
        message: `Page '${slug}' not found.`
      });
    }

    page.sections = page.sections.filter((s) => s.sectionId !== sectionId);
    if (req.user) page.updatedBy = req.user._id;
    await page.save();

    return res.status(200).json({
      success: true,
      message: 'Section deleted successfully.',
      data: page
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reorder page sections
 * PUT /api/pages/:slug/sections-reorder
 * Protected: Admin Only
 */
export const reorderSections = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { sectionIds } = req.body; // Array of sectionId strings in desired order

    if (!Array.isArray(sectionIds)) {
      return res.status(400).json({
        success: false,
        message: 'sectionIds array is required.'
      });
    }

    const page = await Page.findOne({ slug: slug.toLowerCase().trim() });
    if (!page) {
      return res.status(404).json({
        success: false,
        message: `Page '${slug}' not found.`
      });
    }

    const sectionMap = new Map(page.sections.map((s) => [s.sectionId, s]));
    const reordered = [];

    sectionIds.forEach((id, index) => {
      if (sectionMap.has(id)) {
        const sec = sectionMap.get(id);
        sec.order = index;
        reordered.push(sec);
        sectionMap.delete(id);
      }
    });

    // Append any missing sections
    sectionMap.forEach((sec) => {
      sec.order = reordered.length;
      reordered.push(sec);
    });

    page.sections = reordered;
    if (req.user) page.updatedBy = req.user._id;
    await page.save();

    return res.status(200).json({
      success: true,
      message: 'Sections reordered successfully.',
      data: page
    });
  } catch (error) {
    next(error);
  }
};
