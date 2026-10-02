import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";

/**
 * Normalize Cloudinary URL to HTTPS protocol
 * @param {string} url - Input image or media URL
 * @returns {string} - HTTPS normalized Cloudinary URL
 */
export const normalizeCloudinaryUrl = (url) => {
  if (!url || typeof url !== "string") return url;
  return url.replace(/^http:\/\/res\.cloudinary\.com\//i, "https://res.cloudinary.com/");
};

/**
 * Normalize any HTML or text containing Cloudinary image URLs to HTTPS
 * @param {string} text - HTML content or text string
 * @returns {string} - Text with HTTPS normalized Cloudinary URLs
 */
export const normalizeCloudinaryText = (text) => {
  if (!text || typeof text !== "string") return text;
  return text.replace(/http:\/\/res\.cloudinary\.com\//gi, "https://res.cloudinary.com/");
};

/**
 * Safely normalize Cloudinary URLs across object data structures without corrupting Mongoose ObjectIds
 * @param {any} data - Data structure (object, array, string)
 * @returns {any} - Data structure with normalized HTTPS Cloudinary URLs
 */
export const normalizeCloudinaryData = (data) => {
  if (!data) return data;
  if (typeof data === "string") {
    return normalizeCloudinaryText(data);
  }
  if (typeof data !== "object") {
    return data;
  }
  if (data._bsontype === "ObjectID" || data instanceof mongoose.Types.ObjectId) {
    return data;
  }
  if (data instanceof Date || Buffer.isBuffer(data)) {
    return data;
  }

  try {
    const jsonString = JSON.stringify(data);
    if (!jsonString || !jsonString.includes("http://res.cloudinary.com/")) {
      return JSON.parse(jsonString);
    }
    const normalizedJsonString = jsonString.replace(/http:\/\/res\.cloudinary\.com\//gi, "https://res.cloudinary.com/");
    return JSON.parse(normalizedJsonString);
  } catch (err) {
    return data;
  }
};

/**
 * Upload image buffer to Cloudinary with automatic optimization
 * @param {Buffer} buffer - File buffer from multer memory storage
 * @param {string} folderName - Subfolder name under TEJOVA (products, journal, pillars, content, general)
 * @param {string} [originalName] - Original file name
 * @returns {Promise<Object>} - Cloudinary upload result
 */
export const uploadToCloudinary = (buffer, folderName = "general", originalName = "") => {
  return new Promise((resolve, reject) => {
    // Validate credentials presence for real API call
    const isConfigured =
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_CLOUD_NAME !== "demo_cloud" &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET;

    if (!isConfigured) {
      // Return structured mock result in local development if credentials are demo placeholders
      const mockPublicId = `TEJOVA/${folderName}/mock_${Date.now()}`;
      const mockUrl = `https://res.cloudinary.com/demo/image/upload/v12345678/${mockPublicId}.jpg`;
      return resolve({
        url: mockUrl,
        secureUrl: mockUrl,
        publicId: mockPublicId,
        format: "jpg",
        bytes: buffer ? buffer.length : 1024,
        width: 800,
        height: 600,
      });
    }

    const folderPath = `TEJOVA/${folderName.toLowerCase().trim()}`;
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folderPath,
        resource_type: "auto",
        quality: "auto",
        fetch_format: "auto",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        const secureUrl = normalizeCloudinaryUrl(result.secure_url || result.url);
        resolve({
          url: secureUrl,
          secureUrl: secureUrl,
          publicId: result.public_id,
          format: result.format,
          bytes: result.bytes,
          width: result.width,
          height: result.height,
        });
      }
    );

    uploadStream.end(buffer);
  });
};

/**
 * Delete image from Cloudinary using publicId
 * @param {string} publicId - Cloudinary asset public ID
 * @returns {Promise<Object>} - Deletion result
 */
export const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return { result: "not_found" };

  const isConfigured =
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_CLOUD_NAME !== "demo_cloud" &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET;

  if (!isConfigured) {
    return { result: "ok" };
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error(`[Cloudinary Delete Error] ${publicId}:`, error.message);
    throw error;
  }
};
