import mongoose from 'mongoose';

/**
 * Journal Schema — TEJOVA Journal / Article Model
 * Supports brand editorial, articles, and wellness stories.
 */
const journalSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Journal title is required'],
      trim: true
    },
    slug: {
      type: String,
      required: [true, 'Journal slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    excerpt: {
      type: String,
      trim: true,
      default: ''
    },
    content: {
      type: String,
      required: [true, 'Journal content is required']
    },
    coverImage: {
      type: String,
      default: ''
    },
    fontStyle: {
      type: String,
      enum: {
        values: [
          'serif-old-style',
          'technology-variable',
          'feeling-vintage',
          'feeling-sincere',
          'feeling-rugged',
          'dm-sans',
          'tejova-editorial',
          'modern-editorial',
          'classic-serif',
          'clean-sans'
        ],
        message: '{VALUE} is not a valid font style'
      },
      default: 'serif-old-style'
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true
    },
    category: {
      type: String,
      trim: true,
      default: ''
    },
    tags: [
      {
        type: String,
        trim: true
      }
    ],
    status: {
      type: String,
      enum: {
        values: ['DRAFT', 'PUBLISHED'],
        message: '{VALUE} is not a valid journal status'
      },
      default: 'DRAFT',
      index: true
    },
    publishedAt: {
      type: Date,
      default: null,
      index: true
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Compound index for published featured articles
journalSchema.index({ status: 1, publishedAt: -1 });

const Journal = mongoose.model('Journal', journalSchema);

export default Journal;
