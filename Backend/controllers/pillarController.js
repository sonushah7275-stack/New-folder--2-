import mongoose from "mongoose";
import Pillar from "../models/Pillar.js";
import { slugify } from "../utils/slugify.js";

/**
 * Get all wellness pillars
 * GET /api/pillars
 * Public
 */
export const getPillars = async (req, res, next) => {
  try {
    const { all } = req.query;
    const query = {};

    if (all !== "true") {
      query.isActive = true;
    }

    const pillars = await Pillar.find(query).sort({ sortOrder: 1, name: 1 });

    return res.status(200).json({
      success: true,
      data: pillars,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single pillar by slug or ID
 * GET /api/pillars/:idOrSlug
 * Public
 */
export const getPillarByIdOrSlug = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    let pillar;

    if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
      pillar = await Pillar.findById(idOrSlug);
    } else {
      pillar = await Pillar.findOne({ slug: idOrSlug.toLowerCase() });
    }

    if (!pillar) {
      return res.status(404).json({
        success: false,
        message: "Pillar not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: pillar,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new pillar
 * POST /api/pillars
 * Protected: Admin Only
 */
export const createPillar = async (req, res, next) => {
  try {
    const { name, slug, title, description, image, content, sortOrder, isActive } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Pillar name is required.",
      });
    }

    const generatedSlug = slug ? slugify(slug) : slugify(name);

    const existingPillar = await Pillar.findOne({ slug: generatedSlug });
    if (existingPillar) {
      return res.status(409).json({
        success: false,
        message: "A pillar with this slug already exists.",
      });
    }

    const pillar = await Pillar.create({
      name: name.trim(),
      slug: generatedSlug,
      title: title ? title.trim() : "",
      description: description ? description.trim() : "",
      image: image || "",
      content: content || "",
      sortOrder: sortOrder !== undefined ? Number(sortOrder) : 0,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    return res.status(201).json({
      success: true,
      message: "Pillar created successfully.",
      data: pillar,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update pillar
 * PATCH /api/pillars/:id
 * Protected: Admin Only
 */
export const updatePillar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, slug, title, description, image, content, sortOrder, isActive } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Pillar ID format.",
      });
    }

    const pillar = await Pillar.findById(id);
    if (!pillar) {
      return res.status(404).json({
        success: false,
        message: "Pillar not found.",
      });
    }

    if (name) pillar.name = name.trim();

    if (slug || name) {
      const newSlug = slug ? slugify(slug) : slugify(name || pillar.name);
      if (newSlug !== pillar.slug) {
        const existingSlug = await Pillar.findOne({
          slug: newSlug,
          _id: { $ne: id },
        });
        if (existingSlug) {
          return res.status(409).json({
            success: false,
            message: "Another pillar with this slug already exists.",
          });
        }
        pillar.slug = newSlug;
      }
    }

    if (title !== undefined) pillar.title = title.trim();
    if (description !== undefined) pillar.description = description.trim();
    if (image !== undefined) pillar.image = image;
    if (content !== undefined) pillar.content = content;
    if (sortOrder !== undefined) pillar.sortOrder = Number(sortOrder);
    if (isActive !== undefined) pillar.isActive = Boolean(isActive);

    await pillar.save();

    return res.status(200).json({
      success: true,
      message: "Pillar updated successfully.",
      data: pillar,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete pillar
 * DELETE /api/pillars/:id
 * Protected: Admin Only
 */
export const deletePillar = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Pillar ID format.",
      });
    }

    const pillar = await Pillar.findByIdAndDelete(id);

    if (!pillar) {
      return res.status(404).json({
        success: false,
        message: "Pillar not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Pillar deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};
