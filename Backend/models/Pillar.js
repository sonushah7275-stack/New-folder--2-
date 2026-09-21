import mongoose from 'mongoose';

/**
 * Pillar Schema — TEJOVA Wellness & Lifestyle Pillar Model
 * Supports core brand pillars (e.g., Vitality, Nourishment, Lifestyle, Longevity).
 */
const pillarSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Pillar name is required'],
      trim: true
    },
    slug: {
      type: String,
      required: [true, 'Pillar slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    title: {
      type: String,
      trim: true,
      default: ''
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    image: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    },
    sortOrder: {
      type: Number,
      default: 0,
      index: true
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

const Pillar = mongoose.model('Pillar', pillarSchema);

export default Pillar;
