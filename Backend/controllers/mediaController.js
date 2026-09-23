import Media from "../models/Media.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinaryHelper.js";

/**
 * Upload an image to Cloudinary and record metadata in Media model
 * POST /api/media/upload
 * Protected: Admin Only
 */
export const uploadMedia = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided in request.",
      });
    }

    // Target folder under TEJOVA/
    const targetFolder = (req.body.folder || req.query.folder || "general").toLowerCase().trim();
    const validFolders = ["products", "journal", "journal/content", "pillars", "content", "general", "users"];
    const folder = validFolders.includes(targetFolder) ? targetFolder : "general";

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(
      req.file.buffer,
      folder,
      req.file.originalname
    );

    // Save metadata in database
    const mediaRecord = await Media.create({
      fileName: req.file.originalname,
      url: uploadResult.url,
      publicId: uploadResult.publicId,
      resourceType: "image",
      mimeType: req.file.mimetype,
      size: req.file.size,
      alt: req.body.alt ? req.body.alt.trim() : req.file.originalname,
      folder,
      uploadedBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Image uploaded successfully.",
      data: {
        id: mediaRecord._id,
        url: uploadResult.url,
        secureUrl: uploadResult.secureUrl,
        publicId: uploadResult.publicId,
        fileName: mediaRecord.fileName,
        folder: mediaRecord.folder,
        alt: mediaRecord.alt,
        createdAt: mediaRecord.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete image from Cloudinary and Media collection
 * DELETE /api/media
 * Protected: Admin Only
 */
export const deleteMedia = async (req, res, next) => {
  try {
    const publicId = req.body.publicId || req.query.publicId;

    if (!publicId || publicId.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Public ID is required to delete media.",
      });
    }

    const trimmedPublicId = publicId.trim();

    // Delete from Cloudinary
    await deleteFromCloudinary(trimmedPublicId);

    // Remove metadata record from DB
    await Media.findOneAndDelete({ publicId: trimmedPublicId });

    return res.status(200).json({
      success: true,
      message: "Image deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all media assets metadata
 * GET /api/media
 * Protected: Admin Only
 */
export const getMediaAssets = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const skip = (page - 1) * limit;

    const { folder, search } = req.query;
    const query = {};

    if (folder) {
      query.folder = folder.toLowerCase().trim();
    }

    if (search) {
      query.$or = [
        { fileName: { $regex: search, $options: "i" } },
        { alt: { $regex: search, $options: "i" } },
        { publicId: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Media.countDocuments(query);
    const mediaList = await Media.find(query)
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      data: mediaList,
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
