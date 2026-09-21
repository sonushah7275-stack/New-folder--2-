import mongoose from 'mongoose';

/**
 * NewsletterSubscriber Schema — TEJOVA Newsletter Subscription Model
 * Stores email newsletter subscriptions and subscriber status.
 */
const newsletterSubscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    name: {
      type: String,
      trim: true,
      default: ''
    },
    isSubscribed: {
      type: Boolean,
      default: true,
      index: true
    },
    subscribedAt: {
      type: Date,
      default: Date.now
    },
    unsubscribedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

const NewsletterSubscriber = mongoose.model('NewsletterSubscriber', newsletterSubscriberSchema);

export default NewsletterSubscriber;
