import multer from "multer";

// Configure multer memory storage for buffer handling before uploading to Cloudinary
const storage = multer.memoryStorage();

// File filter to allow only jpg, jpeg, png, webp, and gif images
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error("Invalid file type. Only JPG, JPEG, PNG, WEBP, and GIF images are allowed.");
    error.statusCode = 400;
    cb(error, false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size limit
  },
});

/**
 * Middleware wrapper for single file upload with field name "file" or "image"
 */
export const uploadSingleImage = (fieldName = "file") => {
  const multerUpload = upload.single(fieldName);

  return (req, res, next) => {
    multerUpload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            success: false,
            message: "File size exceeds the 5MB limit.",
          });
        }
        return res.status(400).json({
          success: false,
          message: `Upload error: ${err.message}`,
        });
      } else if (err) {
        return res.status(err.statusCode || 400).json({
          success: false,
          message: err.message || "File upload failed.",
        });
      }

      next();
    });
  };
};

export default upload;
