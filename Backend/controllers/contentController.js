import mongoose from "mongoose";
import Content from "../models/Content.js";

/**
 * Get CMS content blocks
 * GET /api/content
 * Public
 */
export const getContentBlocks = async (req, res, next) => {
  try {
    const { section, all } = req.query;
    const query = {};

    if (all !== "true") {
      query.isActive = true;
    }

    if (section) {
      query.section = section.toLowerCase().trim();
    }

    const contents = await Content.find(query).sort({ key: 1 });

    return res.status(200).json({
      success: true,
      data: contents,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get content block by key
 * GET /api/content/:key
 * Public
 */
export const getContentByKey = async (req, res, next) => {
  try {
    const { key } = req.params;

    const content = await Content.findOne({ key: key.toUpperCase().trim() });

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Content block not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: content,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create or update content block
 * POST /api/content
 * Protected: Admin Only
 */
export const createContentBlock = async (req, res, next) => {
  try {
    const { key, title, content, image, section, isActive } = req.body;

    if (!key || key.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Content key is required.",
      });
    }

    const normalizedKey = key.toUpperCase().trim();
    const existingContent = await Content.findOne({ key: normalizedKey });

    if (existingContent) {
      return res.status(409).json({
        success: false,
        message: "A content block with this key already exists.",
      });
    }

    const contentBlock = await Content.create({
      key: normalizedKey,
      title: title ? title.trim() : "",
      content: content || "",
      image: image || "",
      section: section ? section.toLowerCase().trim() : "general",
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      updatedBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Content block created successfully.",
      data: contentBlock,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update content block
 * PATCH /api/content/:id
 * Protected: Admin Only
 */
export const updateContentBlock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, image, section, isActive } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Content ID format.",
      });
    }

    const contentBlock = await Content.findById(id);

    if (!contentBlock) {
      return res.status(404).json({
        success: false,
        message: "Content block not found.",
      });
    }

    if (title !== undefined) contentBlock.title = title.trim();
    if (content !== undefined) contentBlock.content = content;
    if (image !== undefined) contentBlock.image = image;
    if (section !== undefined) contentBlock.section = section.toLowerCase().trim();
    if (isActive !== undefined) contentBlock.isActive = Boolean(isActive);
    contentBlock.updatedBy = req.user._id;

    await contentBlock.save();

    return res.status(200).json({
      success: true,
      message: "Content block updated successfully.",
      data: contentBlock,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete content block
 * DELETE /api/content/:id
 * Protected: Admin Only
 */
export const deleteContentBlock = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Content ID format.",
      });
    }

    const contentBlock = await Content.findByIdAndDelete(id);

    if (!contentBlock) {
      return res.status(404).json({
        success: false,
        message: "Content block not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Content block deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};
