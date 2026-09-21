import mongoose from 'mongoose';

/**
 * Product Schema — TEJOVA Product Model
 * Supports product showcase, wellness benefits/ingredients/story, and future e-commerce.
 */
const productImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: [true, 'Image URL is required']
    },
    publicId: {
      type: String,
      default: ''
    },
    alt: {
      type: String,
      default: ''
    }
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true
    },
    slug: {
      type: String,
      required: [true, 'Product slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    shortDescription: {
      type: String,
      trim: true,
      default: ''
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative']
    },
    compareAtPrice: {
      type: Number,
      min: [0, 'Compare price cannot be negative'],
      default: null
    },
    sku: {
      type: String,
      trim: true,
      sparse: true
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    images: [productImageSchema],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      index: true,
      default: null
    },
    benefits: [
      {
        type: String,
        trim: true
      }
    ],
    ingredients: [
      {
        type: String,
        trim: true
      }
    ],
    howToUse: {
      type: String,
      trim: true,
      default: ''
    },
    story: {
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
    isFeatured: {
      type: Boolean,
      default: false,
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

// Compound index for active & featured products lookup
productSchema.index({ isActive: 1, isFeatured: 1 });
productSchema.index({ category: 1, isActive: 1 });

const Product = mongoose.model('Product', productSchema);

export default Product;
