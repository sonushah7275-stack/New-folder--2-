import Page from '../models/Page.js';
import { normalizeCloudinaryData } from '../utils/cloudinaryHelper.js';

/**
 * Normalizes and guarantees the structure of the Philosophy Section (Two Columns)
 */
export const ensurePhilosophySectionStructure = (sec) => {
  if (!sec) return sec;
  if (
    sec.sectionId === 'sec_about_philosophy' ||
    sec.type === 'philosophy' ||
    sec.type === 'brand_philosophy'
  ) {
    if (!sec.leftColumn) sec.leftColumn = {};
    if (!sec.rightColumn) sec.rightColumn = {};

    // Support payload where content holds leftColumn / rightColumn
    if (sec.content && typeof sec.content === 'object') {
      if (sec.content.leftColumn && Object.keys(sec.content.leftColumn).length > 0) {
        sec.leftColumn = { ...sec.content.leftColumn, ...sec.leftColumn };
      }
      if (sec.content.rightColumn && Object.keys(sec.content.rightColumn).length > 0) {
        sec.rightColumn = { ...sec.content.rightColumn, ...sec.rightColumn };
      }
    }

    if (!sec.leftColumn.label) sec.leftColumn.label = sec.subtitle || 'THE PHILOSOPHY';
    if (!sec.leftColumn.heading) sec.leftColumn.heading = sec.title || 'Expand Your Light';

    if (!sec.leftColumn.paragraph1 && Array.isArray(sec.leftColumn.paragraphs) && sec.leftColumn.paragraphs[0]) {
      sec.leftColumn.paragraph1 = sec.leftColumn.paragraphs[0];
    }
    if (!sec.leftColumn.paragraph2 && Array.isArray(sec.leftColumn.paragraphs) && sec.leftColumn.paragraphs[1]) {
      sec.leftColumn.paragraph2 = sec.leftColumn.paragraphs[1];
    }

    if (!sec.leftColumn.paragraph1) {
      sec.leftColumn.paragraph1 =
        '"Tej" in ancient Sanskrit represents inner radiance, biological brilliance, and vital heat. "Ova" signifies origin and continuous growth. Together, <strong>TEJOVA</strong> embodies the expansion of your innate physical and mental radiance.';
    }
    if (!sec.leftColumn.paragraph2) {
      sec.leftColumn.paragraph2 =
        'Every formulation we create, every article we write, and every ritual we share is designed to nurture your light — helping you show up fully for yourself, your loved ones, and the world around you.';
    }
    if (!Array.isArray(sec.leftColumn.paragraphs) || sec.leftColumn.paragraphs.length === 0) {
      sec.leftColumn.paragraphs = [sec.leftColumn.paragraph1, sec.leftColumn.paragraph2];
    }

    if (!sec.rightColumn.label) sec.rightColumn.label = 'STANDARDS OF PURITY';
    if (!sec.rightColumn.heading) sec.rightColumn.heading = 'About Tejova';
    if (!sec.rightColumn.highlightedTitle) {
      sec.rightColumn.highlightedTitle = 'The Architecture of Biological Sovereignty';
    }
    if (!sec.rightColumn.description) {
      sec.rightColumn.description =
        'For the Driven Professionals, energy is the ultimate currency. You architect organizations, drive market growth, and lead with relentless precision—but the true mark of elite leadership is absolute command over your own biology.';
    }

    // Keep top-level title and subtitle synced for standard CMS listings
    if (sec.leftColumn.heading) sec.title = sec.leftColumn.heading;
    if (sec.leftColumn.label) sec.subtitle = sec.leftColumn.label;

    // Synchronize content object as well
    sec.content = {
      leftColumn: sec.leftColumn,
      rightColumn: sec.rightColumn
    };
  }
  return sec;
};

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
    const isPreview = req.query.preview === 'true';

    if (page.isPublished === false && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'This page is currently unpublished.'
      });
    }

    let pageObj = page.toObject();

    // Ensure philosophy section structure is normalized
    if (Array.isArray(pageObj.sections)) {
      pageObj.sections = pageObj.sections.map(ensurePhilosophySectionStructure);
    }

    // For public requests (non-admin or when preview is not requested),
    // only return active (isVisible !== false) sections and items, sorted by order
    if (!isAdmin || (!isPreview && req.query.adminView !== 'true')) {
      if (Array.isArray(pageObj.sections)) {
        pageObj.sections = pageObj.sections
          .filter((s) => s.isVisible !== false)
          .map((s) => {
            if (Array.isArray(s.items)) {
              s.items = s.items.filter((item) => item.isVisible !== false);
            }
            return s;
          })
          .sort((a, b) => (a.order || 0) - (b.order || 0));
      }
    } else {
      if (Array.isArray(pageObj.sections)) {
        pageObj.sections = pageObj.sections.sort((a, b) => (a.order || 0) - (b.order || 0));
      }
    }

    return res.status(200).json({
      success: true,
      data: normalizeCloudinaryData(pageObj)
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

    if (Array.isArray(updateData.sections)) {
      updateData.sections = updateData.sections.map(ensurePhilosophySectionStructure);
    }

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

    const updatedSectionData = ensurePhilosophySectionStructure({
      ...page.sections[sectionIndex].toObject(),
      ...req.body,
      sectionId
    });

    page.sections[sectionIndex] = updatedSectionData;

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
