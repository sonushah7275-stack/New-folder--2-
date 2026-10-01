import mongoose from 'mongoose';

/**
 * Page Item Sub-Schema — Used for lists/cards within sections (e.g., Daily Protocols, Pillars)
 */
const pageItemSchema = new mongoose.Schema({
  id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  kicker: { type: String, default: '' },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  description: { type: String, default: '' },
  content: { type: String, default: '' },
  icon: { type: String, default: '' },
  image: { type: String, default: '' },
  video: { type: String, default: '' },
  link: { type: String, default: '' },
  tag: { type: String, default: '' },
  order: { type: Number, default: 0 },
  isVisible: { type: Boolean, default: true }
}, { _id: false });

/**
 * Page Section Sub-Schema — Configurable content sections within a CMS page
 */
const pageSectionSchema = new mongoose.Schema({
  sectionId: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: [
      'hero',
      'brand_philosophy',
      'brand_story',
      'philosophy',
      'four_pillars',
      'protocol_cards',
      'cta',
      'highlight_box',
      'gallery',
      'video',
      'rich_content',
      'text_image',
      'entry_sequence',
      'blog_entry_photos',
      'cards',
      'quote',
      'custom'
    ],
    default: 'rich_content'
  },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  kicker: { type: String, default: '' },
  content: { type: String, default: '' },
  badge: { type: String, default: '' },
  media: {
    url: { type: String, default: '' },
    resourceType: { type: String, enum: ['image', 'video'], default: 'image' },
    alt: { type: String, default: '' },
    poster: { type: String, default: '' }
  },
  cta: {
    text: { type: String, default: '' },
    url: { type: String, default: '' },
    variant: { type: String, default: 'primary' }
  },
  items: [pageItemSchema],
  settings: {
    backgroundColor: { type: String, default: '' },
    textColor: { type: String, default: '' },
    borderColor: { type: String, default: '' },
    layout: { type: String, default: 'standard' },
    alignment: { type: String, default: 'left' }
  },
  order: { type: Number, default: 0 },
  isVisible: { type: Boolean, default: true }
}, { _id: false });

/**
 * Page Schema — TEJOVA Dynamic Page CMS Schema
 */
const pageSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: [true, 'Page slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    title: {
      type: String,
      required: [true, 'Page title is required'],
      trim: true
    },
    subtitle: {
      type: String,
      trim: true,
      default: ''
    },
    hero: {
      title: { type: String, default: '' },
      subtitle: { type: String, default: '' },
      description: { type: String, default: '' },
      mediaUrl: { type: String, default: '' },
      resourceType: { type: String, enum: ['image', 'video'], default: 'image' },
      alt: { type: String, default: '' },
      ctaText: { type: String, default: '' },
      ctaLink: { type: String, default: '' },
      backgroundMediaUrl: { type: String, default: '' }
    },
    sections: [pageSectionSchema],
    seo: {
      metaTitle: { type: String, default: '' },
      metaDescription: { type: String, default: '' },
      keywords: [{ type: String }]
    },
    isPublished: {
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

const Page = mongoose.model('Page', pageSchema);

export default Page;
