import mongoose from 'mongoose';

/**
 * Media Schema — TEJOVA Media & Upload Asset Model
 * Tracks uploaded media metadata (Cloudinary/S3 assets).
 */
const mediaSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: [true, 'File name is required'],
      trim: true
    },
    url: {
      type: String,
      required: [true, 'Media URL is required']
    },
    publicId: {
      type: String,
      required: [true, 'Public ID is required'],
      index: true
    },
    resourceType: {
      type: String,
      default: 'image'
    },
    mimeType: {
      type: String,
      default: ''
    },
    size: {
      type: Number,
      default: 0
    },
    alt: {
      type: String,
      default: ''
    },
    folder: {
      type: String,
      default: 'general',
      index: true
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true
    }
  },
  {
    timestamps: true
  }
);

const Media = mongoose.model('Media', mediaSchema);

export default Media;
