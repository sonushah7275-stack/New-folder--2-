import mongoose from "mongoose";
import ContactMessage from "../models/ContactMessage.js";

/**
 * Submit a contact message
 * POST /api/contact
 * Public
 */
export const submitContactMessage = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Name is required.",
      });
    }

    if (!email || email.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    if (!message || message.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Message content is required.",
      });
    }

    const contactMessage = await ContactMessage.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone ? phone.trim() : "",
      subject: subject ? subject.trim() : "",
      message: message.trim(),
      status: "NEW",
    });

    return res.status(201).json({
      success: true,
      message: "Thank you for reaching out. We have received your message and will respond shortly.",
      data: {
        id: contactMessage._id,
        createdAt: contactMessage.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all contact messages
 * GET /api/contact
 * Protected: Admin Only
 */
export const getContactMessages = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const { status, search } = req.query;
    const query = {};

    if (status && ["NEW", "READ", "REPLIED", "ARCHIVED"].includes(status.toUpperCase())) {
      query.status = status.toUpperCase();
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
      ];
    }

    const total = await ContactMessage.countDocuments(query);
    const messages = await ContactMessage.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      data: messages,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get contact message by ID
 * GET /api/contact/:id
 * Protected: Admin Only
 */
export const getContactMessageById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Contact Message ID format.",
      });
    }

    const message = await ContactMessage.findById(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found.",
      });
    }

    // Auto mark as READ if status is NEW
    if (message.status === "NEW") {
      message.status = "READ";
      await message.save();
    }

    return res.status(200).json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update contact message status
 * PATCH /api/contact/:id
 * Protected: Admin Only
 */
export const updateContactMessageStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Contact Message ID format.",
      });
    }

    if (!status || !["NEW", "READ", "REPLIED", "ARCHIVED"].includes(status.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: "Status must be NEW, READ, REPLIED, or ARCHIVED.",
      });
    }

    const message = await ContactMessage.findById(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found.",
      });
    }

    message.status = status.toUpperCase();
    await message.save();

    return res.status(200).json({
      success: true,
      message: "Contact message status updated.",
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete contact message
 * DELETE /api/contact/:id
 * Protected: Admin Only
 */
export const deleteContactMessage = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Contact Message ID format.",
      });
    }

    const message = await ContactMessage.findByIdAndDelete(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Contact message deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};
