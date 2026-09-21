import cloudinary from "../config/cloudinary.js";

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
      return resolve({
        url: `https://res.cloudinary.com/demo/image/upload/v12345678/${mockPublicId}.jpg`,
        secureUrl: `https://res.cloudinary.com/demo/image/upload/v12345678/${mockPublicId}.jpg`,
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
        resource_type: "image",
        quality: "auto",
        fetch_format: "auto",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve({
          url: result.url,
          secureUrl: result.secure_url,
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
