import mongoose from 'mongoose';

/**
 * ContactMessage Schema — TEJOVA Contact Inquiry Model
 * Handles contact form submissions and status tracking.
 */
const contactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      index: true
    },
    phone: {
      type: String,
      trim: true,
      default: ''
    },
    subject: {
      type: String,
      trim: true,
      default: ''
    },
    message: {
      type: String,
      required: [true, 'Message content is required'],
      trim: true
    },
    status: {
      type: String,
      enum: {
        values: ['NEW', 'READ', 'REPLIED', 'ARCHIVED'],
        message: '{VALUE} is not a valid contact message status'
      },
      default: 'NEW',
      index: true
    }
  },
  {
    timestamps: true
  }
);

const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);

export default ContactMessage;
