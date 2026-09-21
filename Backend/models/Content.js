import mongoose from 'mongoose';

/**
 * Content Schema — TEJOVA Generic CMS Content Model
 * Stores site-wide editable content blocks (banners, hero sections, static brand copy).
 */
const contentSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: [true, 'Content key is required'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true
    },
    title: {
      type: String,
      trim: true,
      default: ''
    },
    content: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      default: ''
    },
    section: {
      type: String,
      trim: true,
      default: 'general',
      index: true
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  {
    timestamps: true
  }
);

const Content = mongoose.model('Content', contentSchema);

export default Content;
