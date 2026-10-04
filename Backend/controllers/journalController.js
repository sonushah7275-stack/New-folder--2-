import mongoose from "mongoose";
import Journal from "../models/Journal.js";
import Category from "../models/Category.js";
import { slugify } from "../utils/slugify.js";
import { normalizeCloudinaryUrl, normalizeCloudinaryText, normalizeCloudinaryData } from "../utils/cloudinaryHelper.js";

const ALLOWED_PILLAR_CATEGORIES = ["Vitality", "Nourishment", "Lifestyle", "Longevity"];

/**
 * Helper to resolve a category string or ObjectId to a valid Category ObjectId
 */
const resolveCategoryId = async (categoryInput) => {
  if (!categoryInput) {
    const defaultCat = await Category.findOne({ slug: "vitality" });
    return defaultCat?._id || null;
  }

  // If already a valid ObjectId
  if (mongoose.Types.ObjectId.isValid(categoryInput)) {
    const existingCat = await Category.findById(categoryInput);
    if (existingCat) return existingCat._id;
  }

  const raw = categoryInput.toString().trim();
  const slug = slugify(raw);

  const matchedCat = await Category.findOne({
    $or: [{ name: { $regex: `^${raw}$`, $options: "i" } }, { slug: slug }],
  });

  if (matchedCat) return matchedCat._id;

  // Fallback to Vitality
  const fallbackCat = await Category.findOne({ slug: "vitality" });
  return fallbackCat?._id || null;
};

/**
 * Get journal articles with pagination, search, and category/tag filters
 * GET /api/journal
 * Public (Returns PUBLISHED articles by default)
 */
export const getArticles = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const { search, category, tag, featured, all } = req.query;
    const query = {};

    // Public API returns PUBLISHED articles only unless all=true is passed by admin
    if (all !== "true") {
      query.status = "PUBLISHED";
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    const categoryFilter = category || tag;
    if (categoryFilter && categoryFilter !== "All") {
      if (mongoose.Types.ObjectId.isValid(categoryFilter)) {
        query.category = categoryFilter;
      } else {
        const catDocs = await Category.find({
          $or: [
            { name: { $regex: categoryFilter, $options: "i" } },
            { slug: { $regex: categoryFilter, $options: "i" } },
          ],
        }).select("_id");
        const catIds = catDocs.map((c) => c._id);
        query.category = { $in: catIds };
      }
    }

    if (tag && tag !== categoryFilter) {
      query.tags = tag;
    }

    if (featured !== undefined) {
      query.isFeatured = featured === "true";
    }

    const total = await Journal.countDocuments(query);
    const articles = await Journal.find(query)
      .populate("author", "name email avatar")
      .populate("category", "name slug description status isActive")
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      data: normalizeCloudinaryData(articles),
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
 * Get single article by slug
 * GET /api/journal/:slug
 * Public
 */
export const getArticleBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const article = await Journal.findOne({ slug: slug.toLowerCase() })
      .populate("author", "name email avatar")
      .populate("category", "name slug description status isActive");

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: normalizeCloudinaryData(article),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new journal article
 * POST /api/journal
 * Protected: Admin Only
 */
export const createArticle = async (req, res, next) => {
  try {
    const {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      fontStyle,
      category,
      tags,
      status,
      isFeatured,
    } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Article title is required.",
      });
    }

    if (!content || content.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Article content is required.",
      });
    }

    const generatedSlug = slug ? slugify(slug) : slugify(title);

    const existingArticle = await Journal.findOne({ slug: generatedSlug });
    if (existingArticle) {
      return res.status(409).json({
        success: false,
        message: "An article with this slug already exists.",
      });
    }

    const categoryId = await resolveCategoryId(category);
    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Invalid article category. Allowed categories: Vitality, Nourishment, Lifestyle, Longevity.",
      });
    }

    const articleStatus = status === "PUBLISHED" ? "PUBLISHED" : "DRAFT";
    const validFontStyles = [
      "serif-old-style",
      "technology-variable",
      "feeling-vintage",
      "feeling-sincere",
      "feeling-rugged",
      "dm-sans",
      "tejova-editorial",
      "modern-editorial",
      "classic-serif",
      "clean-sans",
    ];
    const selectedFontStyle = validFontStyles.includes(fontStyle) ? fontStyle : "serif-old-style";

    const article = await Journal.create({
      title: title.trim(),
      slug: generatedSlug,
      excerpt: excerpt ? excerpt.trim() : "",
      content: normalizeCloudinaryText(content.trim()),
      coverImage: normalizeCloudinaryUrl(coverImage || ""),
      fontStyle: selectedFontStyle,
      author: req.user._id,
      category: categoryId,
      tags: Array.isArray(tags) ? tags : [],
      status: articleStatus,
      publishedAt: articleStatus === "PUBLISHED" ? new Date() : null,
      isFeatured: Boolean(isFeatured),
    });

    await article.populate("category", "name slug description status isActive");
    await article.populate("author", "name email avatar");

    return res.status(201).json({
      success: true,
      message: "Article created successfully.",
      data: normalizeCloudinaryData(article),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update journal article
 * PATCH /api/journal/:id
 * Protected: Admin Only
 */
export const updateArticle = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Article ID format.",
      });
    }

    const article = await Journal.findById(id);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found.",
      });
    }

    const updates = req.body;

    if (updates.title) article.title = updates.title.trim();

    if (updates.slug || updates.title) {
      const newSlug = updates.slug
        ? slugify(updates.slug)
        : slugify(updates.title || article.title);
      if (newSlug !== article.slug) {
        const existingSlug = await Journal.findOne({
          slug: newSlug,
          _id: { $ne: id },
        });
        if (existingSlug) {
          return res.status(409).json({
            success: false,
            message: "Another article with this slug already exists.",
          });
        }
        article.slug = newSlug;
      }
    }

    if (updates.excerpt !== undefined) article.excerpt = updates.excerpt.trim();
    if (updates.content !== undefined) article.content = normalizeCloudinaryText(updates.content.trim());
    if (updates.coverImage !== undefined) article.coverImage = normalizeCloudinaryUrl(updates.coverImage);
    if (updates.fontStyle !== undefined) {
      const validFontStyles = [
        "serif-old-style",
        "technology-variable",
        "feeling-vintage",
        "feeling-sincere",
        "feeling-rugged",
        "dm-sans",
        "tejova-editorial",
        "modern-editorial",
        "classic-serif",
        "clean-sans",
      ];
      if (validFontStyles.includes(updates.fontStyle)) {
        article.fontStyle = updates.fontStyle;
      }
    }
    if (updates.category !== undefined) {
      const catId = await resolveCategoryId(updates.category);
      if (catId) article.category = catId;
    }
    if (Array.isArray(updates.tags)) article.tags = updates.tags;
    if (updates.isFeatured !== undefined) article.isFeatured = Boolean(updates.isFeatured);

    if (updates.status && ["DRAFT", "PUBLISHED"].includes(updates.status)) {
      if (article.status !== "PUBLISHED" && updates.status === "PUBLISHED") {
        article.publishedAt = new Date();
      }
      article.status = updates.status;
    }

    await article.save();

    await article.populate("category", "name slug description status isActive");
    await article.populate("author", "name email avatar");

    return res.status(200).json({
      success: true,
      message: "Article updated successfully.",
      data: normalizeCloudinaryData(article),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete journal article
 * DELETE /api/journal/:id
 * Protected: Admin Only
 */
export const deleteArticle = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Article ID format.",
      });
    }

    const article = await Journal.findByIdAndDelete(id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Article deleted successfully.",
      data: { id },
    });
  } catch (error) {
    next(error);
  }
};
