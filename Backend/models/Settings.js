import mongoose from "mongoose";

/**
 * Settings Schema — TEJOVA System Configuration Model
 * Singleton model that stores global website settings, appearance preferences,
 * notification settings, social links, and business hours.
 */
const settingsSchema = new mongoose.Schema(
  {
    general: {
      siteName: { type: String, default: "TEJOVA" },
      tagline: { type: String, default: "Premium Pure Wellness & Sustainable Living" },
      supportEmail: { type: String, default: "support@tejova.com" },
      contactPhone: { type: String, default: "+91 98765 43210" },
      address: { type: String, default: "123 Wellness Way, Green Park, New Delhi, India" },
    },
    appearance: {
      theme: { type: String, default: "light" },
      primaryColor: { type: String, default: "#1B4D3E" },
      accentColor: { type: String, default: "#D4AF37" },
      fontFamily: { type: String, default: "Inter" },
    },
    notifications: {
      orderAlerts: { type: Boolean, default: true },
      newCustomerAlerts: { type: Boolean, default: true },
      lowStockAlerts: { type: Boolean, default: true },
      emailNotifications: { type: Boolean, default: true },
    },
    businessHours: {
      mondayToFriday: { type: String, default: "9:00 AM - 6:00 PM" },
      saturday: { type: String, default: "10:00 AM - 4:00 PM" },
      sunday: { type: String, default: "Closed" },
    },
    socialLinks: {
      facebook: { type: String, default: "https://facebook.com/tejova" },
      instagram: { type: String, default: "https://instagram.com/tejova" },
      twitter: { type: String, default: "https://twitter.com/tejova" },
      pinterest: { type: String, default: "https://pinterest.com/tejova" },
    },
    maintenanceMode: { type: Boolean, default: false },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.model("Settings", settingsSchema);

export default Settings;
