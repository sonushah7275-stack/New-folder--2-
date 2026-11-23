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
      'announcement',
      'brand_philosophy',
      'brand_story',
      'philosophy',
      'four_pillars',
      'vitality',
      'nourishment',
      'lifestyle',
      'longevity',
      'products',
      'journal',
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
  content: { type: mongoose.Schema.Types.Mixed, default: '' },
  badge: { type: String, default: '' },
  leftColumn: {
    label: { type: String, default: '' },
    heading: { type: String, default: '' },
    paragraphs: [{ type: String }],
    paragraph1: { type: String, default: '' },
    paragraph2: { type: String, default: '' }
  },
  rightColumn: {
    label: { type: String, default: '' },
    heading: { type: String, default: '' },
    highlightedTitle: { type: String, default: '' },
    description: { type: String, default: '' }
  },
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
      secondaryCtaText: { type: String, default: '' },
      secondaryCtaLink: { type: String, default: '' },
      badgeText: { type: String, default: '' },
      floatingBadgeTitle: { type: String, default: '' },
      floatingBadgeSubtitle: { type: String, default: '' },
      features: [{ type: String }],
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

pageSchema.pre('save', function (next) {
  if (Array.isArray(this.sections)) {
    this.sections.forEach((sec) => {
      if (
        sec.type === 'philosophy' ||
        sec.type === 'brand_philosophy' ||
        sec.sectionId === 'sec_about_philosophy'
      ) {
        if (sec.leftColumn) {
          if (sec.leftColumn.heading && !sec.title) sec.title = sec.leftColumn.heading;
          if (sec.leftColumn.label && !sec.subtitle) sec.subtitle = sec.leftColumn.label;
          if (Array.isArray(sec.leftColumn.paragraphs)) {
            if (sec.leftColumn.paragraphs[0] && !sec.leftColumn.paragraph1) {
              sec.leftColumn.paragraph1 = sec.leftColumn.paragraphs[0];
            }
            if (sec.leftColumn.paragraphs[1] && !sec.leftColumn.paragraph2) {
              sec.leftColumn.paragraph2 = sec.leftColumn.paragraphs[1];
            }
          } else if (sec.leftColumn.paragraph1 || sec.leftColumn.paragraph2) {
            sec.leftColumn.paragraphs = [
              sec.leftColumn.paragraph1 || '',
              sec.leftColumn.paragraph2 || ''
            ];
          }
        }
      }
    });
  }
  next();
});

const Page = mongoose.model('Page', pageSchema);

export default Page;
