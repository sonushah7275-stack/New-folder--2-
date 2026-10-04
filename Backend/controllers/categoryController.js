import mongoose from "mongoose";
import Category from "../models/Category.js";
import { slugify } from "../utils/slugify.js";

/**
 * Get all categories
 * GET /api/categories
 * Public
 */
export const getCategories = async (req, res, next) => {
  try {
    const { all, status } = req.query;
    const query = {};

    if (status) {
      const upperStatus = status.toString().toUpperCase().trim();
      if (upperStatus === "ACTIVE") query.isActive = true;
      if (upperStatus === "INACTIVE") query.isActive = false;
    } else if (all !== "true") {
      query.isActive = true;
    }

    const categories = await Category.find(query).sort({ sortOrder: 1, name: 1 });

    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get category by ID or slug
 * GET /api/categories/:idOrSlug
 * Public
 */
export const getCategoryByIdOrSlug = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    let category;

    if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
      category = await Category.findById(idOrSlug);
    } else {
      category = await Category.findOne({ slug: idOrSlug.toLowerCase() });
    }

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new category
 * POST /api/categories
 * Protected: Admin Only
 */
export const createCategory = async (req, res, next) => {
  try {
    const { name, slug, description, image, status, isActive, sortOrder } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Category name is required.",
      });
    }

    const generatedSlug = slug ? slugify(slug) : slugify(name);

    if (!generatedSlug) {
      return res.status(400).json({
        success: false,
        message: "A valid slug is required.",
      });
    }

    const existingCategory = await Category.findOne({
      $or: [{ slug: generatedSlug }, { name: name.trim() }],
    });
    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "A category with this name or slug already exists.",
      });
    }

    const categoryActive =
      status !== undefined
        ? status.toString().toUpperCase() === "ACTIVE"
        : isActive !== undefined
        ? Boolean(isActive)
        : true;

    const category = await Category.create({
      name: name.trim(),
      slug: generatedSlug,
      description: description ? description.trim() : "",
      image: image || "",
      isActive: categoryActive,
      sortOrder: sortOrder !== undefined ? Number(sortOrder) : 0,
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully.",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update category
 * PATCH/PUT /api/categories/:id
 * Protected: Admin Only
 */
export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, slug, description, image, status, isActive, sortOrder } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Category ID format.",
      });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    if (name) category.name = name.trim();

    if (slug || name) {
      const newSlug = slug ? slugify(slug) : slugify(name || category.name);
      if (newSlug !== category.slug) {
        const existingSlug = await Category.findOne({
          slug: newSlug,
          _id: { $ne: id },
        });
        if (existingSlug) {
          return res.status(409).json({
            success: false,
            message: "Another category with this slug already exists.",
          });
        }
        category.slug = newSlug;
      }
    }

    if (description !== undefined) category.description = description.trim();
    if (image !== undefined) category.image = image;
    if (status !== undefined) {
      category.isActive = status.toString().toUpperCase() === "ACTIVE";
    } else if (isActive !== undefined) {
      category.isActive = Boolean(isActive);
    }
    if (sortOrder !== undefined) category.sortOrder = Number(sortOrder);

    await category.save();

    return res.status(200).json({
      success: true,
      message: "Category updated successfully.",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete category safely with usage check
 * DELETE /api/categories/:id
 * Protected: Admin Only
 */
export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Category ID format.",
      });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    // Safety Check: Verify if any Journal articles or Products reference this category
    const Journal = mongoose.model("Journal");
    const Product = mongoose.model("Product");

    const journalCount = await Journal.countDocuments({ category: id });
    const productCount = await Product.countDocuments({ category: id });
    const totalCount = journalCount + productCount;

    if (totalCount > 0) {
      return res.status(400).json({
        success: false,
        message: `This category is currently used by ${totalCount} items (${journalCount} articles, ${productCount} products). Please reassign or deactivate it before deleting.`,
      });
    }

    await Category.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};
