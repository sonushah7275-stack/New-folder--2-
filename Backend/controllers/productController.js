import mongoose from "mongoose";
import Product from "../models/Product.js";
import { slugify } from "../utils/slugify.js";

/**
 * Get all products with pagination, search, category, and featured filters
 * GET /api/products
 * Public
 */
export const getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const { search, category, featured, sort, all } = req.query;
    const query = {};

    // Public users see active products only unless admin asks for all
    if (all !== "true") {
      query.isActive = true;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { shortDescription: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      if (mongoose.Types.ObjectId.isValid(category)) {
        query.category = category;
      }
    }

    if (featured !== undefined) {
      query.isFeatured = featured === "true";
    }

    // Sort order
    let sortOption = { createdAt: -1 };
    if (sort === "price-asc") sortOption = { price: 1 };
    if (sort === "price-desc") sortOption = { price: -1 };
    if (sort === "name-asc") sortOption = { name: 1 };
    if (sort === "name-desc") sortOption = { name: -1 };

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate("category", "name slug")
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single product by slug
 * GET /api/products/slug/:slug
 * Public
 */
export const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const product = await Product.findOne({ slug: slug.toLowerCase() }).populate(
      "category",
      "name slug"
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single product by ID
 * GET /api/products/:id
 * Public
 */
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Product ID format.",
      });
    }

    const product = await Product.findById(id).populate("category", "name slug");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new product
 * POST /api/products
 * Protected: Admin Only
 */
export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      slug,
      shortDescription,
      description,
      price,
      compareAtPrice,
      sku,
      stock,
      images,
      category,
      benefits,
      ingredients,
      howToUse,
      story,
      tags,
      isFeatured,
      isActive,
    } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Product name is required.",
      });
    }

    if (price === undefined || price === null || Number(price) < 0) {
      return res.status(400).json({
        success: false,
        message: "A valid positive product price is required.",
      });
    }

    const generatedSlug = slug ? slugify(slug) : slugify(name);

    const existingProduct = await Product.findOne({ slug: generatedSlug });
    if (existingProduct) {
      return res.status(409).json({
        success: false,
        message: "A product with this slug already exists.",
      });
    }

    const product = await Product.create({
      name: name.trim(),
      slug: generatedSlug,
      shortDescription: shortDescription ? shortDescription.trim() : "",
      description: description ? description.trim() : "",
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
      sku: sku ? sku.trim() : undefined,
      stock: stock !== undefined ? Number(stock) : 0,
      images: Array.isArray(images) ? images : [],
      category: category && mongoose.Types.ObjectId.isValid(category) ? category : null,
      benefits: Array.isArray(benefits) ? benefits : [],
      ingredients: Array.isArray(ingredients) ? ingredients : [],
      howToUse: howToUse ? howToUse.trim() : "",
      story: story ? story.trim() : "",
      tags: Array.isArray(tags) ? tags : [],
      isFeatured: Boolean(isFeatured),
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully.",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update product
 * PATCH /api/products/:id
 * Protected: Admin Only
 */
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Product ID format.",
      });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const updates = req.body;

    if (updates.name) product.name = updates.name.trim();

    if (updates.slug || updates.name) {
      const newSlug = updates.slug ? slugify(updates.slug) : slugify(updates.name || product.name);
      if (newSlug !== product.slug) {
        const existingSlug = await Product.findOne({
          slug: newSlug,
          _id: { $ne: id },
        });
        if (existingSlug) {
          return res.status(409).json({
            success: false,
            message: "Another product with this slug already exists.",
          });
        }
        product.slug = newSlug;
      }
    }

    if (updates.shortDescription !== undefined) product.shortDescription = updates.shortDescription.trim();
    if (updates.description !== undefined) product.description = updates.description.trim();
    if (updates.price !== undefined) product.price = Number(updates.price);
    if (updates.compareAtPrice !== undefined) product.compareAtPrice = updates.compareAtPrice ? Number(updates.compareAtPrice) : null;
    if (updates.sku !== undefined) product.sku = updates.sku ? updates.sku.trim() : undefined;
    if (updates.stock !== undefined) product.stock = Number(updates.stock);
    if (Array.isArray(updates.images)) product.images = updates.images;
    if (updates.category !== undefined) {
      product.category = updates.category && mongoose.Types.ObjectId.isValid(updates.category) ? updates.category : null;
    }
    if (Array.isArray(updates.benefits)) product.benefits = updates.benefits;
    if (Array.isArray(updates.ingredients)) product.ingredients = updates.ingredients;
    if (updates.howToUse !== undefined) product.howToUse = updates.howToUse.trim();
    if (updates.story !== undefined) product.story = updates.story.trim();
    if (Array.isArray(updates.tags)) product.tags = updates.tags;
    if (updates.isFeatured !== undefined) product.isFeatured = Boolean(updates.isFeatured);
    if (updates.isActive !== undefined) product.isActive = Boolean(updates.isActive);

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete product
 * DELETE /api/products/:id
 * Protected: Admin Only
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Product ID format.",
      });
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};
